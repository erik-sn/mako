import time
import pickle
import os
from urllib.parse import urlparse, parse_qs
import hashlib
import asyncio
from concurrent.futures._base import TimeoutError, CancelledError
from mimetypes import guess_all_extensions
import uuid
from collections import namedtuple
from datetime import datetime
from django.db import models as models
from django.contrib.postgres.fields import ArrayField
from django.conf import settings
from django.contrib.auth.models import User

import magic
import async_timeout
from aiohttp import ClientSession, client_exceptions
from selenium import webdriver, common
from selenium.webdriver.common.keys import Keys
from bs4 import BeautifulSoup
from fake_useragent import FakeUserAgent

from api import types
from api.models import Base
from images.models import Image

ua = FakeUserAgent()

SavedImage = namedtuple('SavedImage', 'file_name file_path source_url img_buffer')

UNWANTED_FILE_EXTENSIONS = ['shtml', 'html', 'jpe']

INIT_LOG ="""
Starting google image search with the following params:

URL: {0}

Search Term: {1}

Pickle Path: {2}

Log:

"""

CLOSE_LOG = """
----------------------------------------------
Summary:
Successful image downloads: {0}
Failed image saves: {1}
----------------------------------------------
"""


class Search(Base):
    url = models.TextField()
    description = models.TextField(blank=True, default='')
    failures = ArrayField(models.TextField(), null=True)
    images = models.ManyToManyField('Image', null=True)
    log = models.TextField(default='', blank=True)
    use_pickle = models.BooleanField(default=True)
    pickle_path = models.TextField(blank=True)
    search_term = models.TextField(blank=True)
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    public = models.BooleanField(default=False)

    # websocket connection passed when processing begins
    connection = None

    async def generate_page_source(self):
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')
        options.add_argument('--disable-gpu')
        options.add_argument('--no-sandbox')

        driver = webdriver.Chrome(executable_path='/usr/local/bin/chromedriver', chrome_options=options)

        driver.get(self.url)

        element = driver.find_element_by_tag_name("body")

        for i in range(30):
            element.send_keys(Keys.PAGE_DOWN)
            time.sleep(0.2)

        try:
            driver.find_element_by_id("smb").click()

            for i in range(50):
                element.send_keys(Keys.PAGE_DOWN)
                time.sleep(0.2)
        except common.exceptions.WebDriverException:
            await self.update_log('"More images" button not found, no more images to find')

        source = driver.page_source
        driver.close()

        return source

    def pickle_source(self, source):
        with open(self.pickle_path, 'wb') as output_file:
            pickle.dump(source, output_file)

    def load_source_from_pickle(self):
        if os.path.exists(self.pickle_path):
            with open(self.pickle_path, 'rb') as input_file:
                return pickle.load(input_file)
        return None

    async def load_or_create_source(self):
        # load
        if self.use_pickle:
            existing_source = self.load_source_from_pickle()
            if existing_source:
                await self.update_log(f'Loading source from existing pickle: {self.pickle_path}')
                return existing_source

        # create
        source = await self.generate_page_source()
        if self.use_pickle:
            await self.update_log(f'Created new source, saved in pickle: {self.pickle_path}')
            self.pickle_source(source)
        return source

    async def parse_img_url_from_href(self, img_href):
        parsed = urlparse(img_href)
        try:
            return parse_qs(parsed.query)['imgurl'][0]
        except KeyError as e:
            await self.update_log(f'Could not find img url for href: {img_href}')
            return None

    async def download_image(self, source_url, session):
        headers = {'User-Agent': ua.random}
        try:
            async with async_timeout.timeout(10):
                async with session.get(source_url, headers=headers) as response:
                    return await response.read(), source_url
        except client_exceptions.InvalidURL:
            await self.update_log(f'Failed to download image - Invalid URL: {source_url}')
        except client_exceptions.ServerDisconnectedError:
            await self.update_log(f'Failed to download image - server disconnect: {source_url}')
        except (client_exceptions.ClientConnectorSSLError, client_exceptions.ClientConnectorCertificateError):
            await self.update_log(f'Failed to download image - SSL error: {source_url}')
        except TimeoutError:
            await self.update_log(f'Failed to download image - Timeout: {source_url}')
        except CancelledError:
            await self.update_log(f'Failed to download image - Cancelled: {source_url}')
        except Exception as e:
            await self.update_log(f'Failed to download image - Unknown error: {str(e)}')
        return None, source_url

    async def download_images(self, img_urls):
        tasks = []
        loop = asyncio.get_event_loop()
        async with ClientSession() as session:
            for source_url in img_urls:
                task = asyncio.ensure_future(self.download_image(source_url, session))
                tasks.append(task)
            responses = await asyncio.gather(*tasks, loop=loop)
            return responses

    async def consolidate_image_sources(self, sources):
        img_urls = []
        for img_src, href in sources:
            img_url = await self.parse_img_url_from_href(href)
            if img_url:
                img_urls.append(img_url)
        return img_urls

    @staticmethod
    def parse_extension_from_mime_type(img_url, mime_type):
        try:
            return guess_all_extensions(mime_type)[-1].replace('.', '')
        except IndexError:
            path = urlparse(img_url).path
            last_param = path.split('/')[-1]
            if '.' in last_param:
                return last_param.split('.')[-1]
            else:
                return

    async def save_downloaded_image(self, img_content, img_url):
        mime_type = magic.from_buffer(img_content, mime=True)
        if not mime_type:
            await self.update_log(f'Exluding file - Could not determine mime-type: {img_url}')
            return None, None

        file_extension = self.parse_extension_from_mime_type(img_url, mime_type)
        if not file_extension:
            await self.update_log(f'Excluding file - could not determine'
                            f'extension from mime-type: {img_url}  mime-type: {mime_type}')
            return None, None

        if file_extension in UNWANTED_FILE_EXTENSIONS:
            await self.update_log(f'Exluding file - unwanted extension: {img_url}  Extension: {file_extension}')
            return None, None

        file_name = f'{uuid.uuid4()}.{file_extension}'
        image_file_path = os.path.join(settings.SAVED_IMAGES, file_name)

        with open(image_file_path, 'wb') as file_handler:
            file_handler.write(img_content)
        return file_name, image_file_path

    def parse_pickle_path(self):
        parsed = urlparse(self.url)
        self.search_term = parse_qs(parsed.query)['q'][0].replace(' ', '_')
        file_name = f'{self.search_term}-source.pickle'
        self.pickle_path = os.path.join(settings.PICKLE_DIR, file_name)

    async def download_google_images(self):
        try:
            self.parse_pickle_path()
            await self.init_log()

            source = await self.load_or_create_source()
            soup = BeautifulSoup(str(source), 'html.parser')

            a_tags = soup.find_all('a', class_="rg_l")
            sources = [(tag.find('img').get('src'), tag.get('href')) for tag in a_tags]

            img_urls = await self.consolidate_image_sources(sources)
            responses = await self.download_images(img_urls)

            successful_image_saves = []
            failed_image_saves = []
            for img_buffer, source_url in responses:
                if not img_buffer:
                    failed_image_saves.append(source_url)
                    continue

                file_name, file_path = await self.save_downloaded_image(img_buffer, source_url)
                if file_path:
                    try:
                        saved_image = SavedImage(file_name, file_path, source_url, img_buffer)
                        successful_image_saves.append(saved_image)
                    except Exception as e:
                        failed_image_saves.append(source_url)
                        await self.update_log(f'Image download failed - Unknown error: {source_url}')
                else:
                    failed_image_saves.append(source_url)

            processed_images = []
            for saved_image in successful_image_saves:
                md5_hash = hashlib.md5(saved_image.img_buffer).hexdigest()
                image = Image.objects.create(
                    name=saved_image.file_name,
                    file_path=saved_image.file_path,
                    hash=md5_hash,
                    source_url=saved_image.source_url
                )
                processed_images.append(image)

            await self.close_log(successful_image_saves, failed_image_saves)

            return processed_images, failed_image_saves
        except Exception as e:
            await self.update_log('\nError while processing search:\n\n', line=False)
            await self.update_log(str(e), line=False)
            return [], []

    async def close_log(self, successful_image_saves, failed_image_saves):
        successes = len(successful_image_saves)
        failures = len(failed_image_saves)
        await self.update_log(CLOSE_LOG.format(successes, failures), line=False)

    async def init_log(self):
        await self.update_log(INIT_LOG.format(self.url, self.search_term, self.pickle_path), line=False)

    async def update_log(self, text, line=True):
        self.log += text if not line else f'{datetime.now().isoformat()} >>> {text}\n'
        self.save()
        await self.send(types.UPDATE_GOOGLE_SEARCH_LOG, {'id': self.id, 'log': self.log})
