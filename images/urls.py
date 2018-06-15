from rest_framework.routers import DefaultRouter

from images import views


router = DefaultRouter()
router.register('images/google_searches', views.SearchViewset, base_name='google_searches')
router.register('images/image_groups', views.ImageGroupViewSet, base_name='image_groups')
router.register('images', views.ImageViewSet, base_name='images')

