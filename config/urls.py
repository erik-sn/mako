from django.conf import settings
from django.conf.urls import url, include
from django.contrib import admin

from api.auth import MyTokenObtainPairView, MyTokenRefreshView

urlpatterns = [
    url(r'^api/admin/', admin.site.urls),
    url(r'^api/v1/watchman/', include('watchman.urls')),
    url(r'^api/v1/', include('api.urls')),
    url(r'^api/token/$', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    url(r'^api/token/refresh/$', MyTokenRefreshView.as_view(), name='token_refresh'),
]

# troubleshooting tool
if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns

