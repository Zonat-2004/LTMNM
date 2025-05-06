# myproject/urls.py

from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static

from rest_framework_simplejwt import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('cakeAPI.urls')),
    path('', include('cakeAPI.urls')),
    # API đăng nhập để lấy token
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # API để làm mới access token
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)