from rest_framework.routers import DefaultRouter

from images import views


router = DefaultRouter()
router.register('images/google_searches', views.SearchViewset.as_view(), base_name='google_searches')
router.register('images/upload_events', views.UploadEventViewSet.as_view(), base_name='upload_events')
router.register('images/image_groups', views.ImageGroupViewSet.as_view(), base_name='image_groups')
router.register('images', views.ImageViewSet.as_view(), base_name='images')

