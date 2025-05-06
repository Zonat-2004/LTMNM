# myproject/urls.py

from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static

# from rest_framework_simplejwt import (
#     TokenObtainPairView,
#     TokenRefreshView,
# )

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('cakeAPI.urls')),
    path('', include('cakeAPI.urls')),

]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)