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


urlpatterns = v1_router.urls
