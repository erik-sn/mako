from rest_framework.routers import DefaultRouter

from api import views as api_views
from images import views as images_views


v1_router = DefaultRouter()
v1_router.register(r'classifiers', api_views.ClassifierViewSet, base_name='classifiers')
v1_router.register(r'trainingruns', api_views.TrainingRunViewset, base_name='trainingruns')
v1_router.register('google_searches', images_views.SearchViewset, base_name='google_searches')
v1_router.register('upload_events', images_views.UploadEventViewSet, base_name='upload_events')
v1_router.register('image_groups', images_views.ImageGroupViewSet, base_name='image_groups')
v1_router.register('images', images_views.ImageViewSet, base_name='images')

v1_router.register(r'software', api_views.SoftwareViewSet, base_name='software')
v1_router.register(r'files', api_views.FileViewSet, base_name='files')


v1_router.register(r'upload_event', api_views.UploadEventViewSet, base_name='upload_event')
v1_router.register(r'dummy_software', api_views.DummySoftwareViewSet, base_name='dummy_software')
v1_router.register(r'dummy_result', api_views.DummyResultViewSet, base_name='dummy_result')
v1_router.register(r'dummy_file', api_views.DummyFileViewSet, base_name='dummy_file')
v1_router.register(r'dummy', api_views.DummyViewSet, base_name='dummy')


urlpatterns = v1_router.urls
