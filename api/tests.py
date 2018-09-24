from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from api.models import Software, FileUploadEvent, File

class TestRun(TestCase):

    def setUp(self):
        user = User.objects.create(username='testuser')
        user.set_password('testpw')
        user.save()
        self.client = Client()
        self.client.login(username='testuser', password='testpw')
        
    def testSoftware(self):
        #post software
        response_post = self.client.post('/api/v1/software/', {"name":"test software", "run_command":"python test.py"})
        self.assertEqual(response_post.status_code, 201)
        #get software
        response_get = self.client.get('/api/v1/software/')
        self.assertEqual(response_get.status_code, 200)
        #check creation of software
        self.assertEqual(Software.objects.all().count(), 1)


    def testUpload(self):
        #post software
        software_post = self.client.post('/api/v1/software/', {"name":"test software", "run_command":"python test.py"})
        self.assertEqual(software_post.status_code, 201)
        #get software
        software_get = self.client.get('/api/v1/software/')
        self.assertEqual(software_get.status_code, 200)
        #check creation of software
        self.assertEqual(Software.objects.all().count(), 1)
        software_id = software_get.data[0]['id']
        python_file = SimpleUploadedFile('test.py', b'file_content')
        #post upload event
        upload_post = self.client.post('/api/v1/file_upload_event/', {"file":python_file, "relative_dir":"./",\
                                                                      "file_type":"static", "software":software_id})
        self.assertEqual(upload_post.status_code, 201)
        #get upload event
        upload_get = self.client.get('/api/v1/file_upload_event/')
        self.assertEqual(upload_get.status_code, 200)
        #check creation of upload event
        self.assertEqual(FileUploadEvent.objects.all().count(), 1)
        #get file
        file_get = self.client.get('/api/v1/files/')
        self.assertEqual(file_get.status_code, 200)
        #check creation of file
        self.assertEqual(File.objects.all().count(), 1)
