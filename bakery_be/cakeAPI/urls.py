from django.urls import path
from .views.views_update import update_user_staff_status  # đã import sẵn trong __init__.py
from .views.views_auth import LoginAPIView  # đã import sẵn trong __init__.py
from .views.cake_views import CakeListView, CakeDetailView  # đã import sẵn trong __init__.py
from .views.cart_views import AddToCartAPIView, AllCartsAPIView  # đã import sẵn trong __init__.py
from .views.cart_views import CartAPIView  # đã import sẵn trong __init__.py
from .views import (  # đã import sẵn trong __init__.py
    CakeListView, CakeDetailView, 
    CategoryListView, CategoryDetailView,
    UserListView, UserDetailView,LoginView,
    home
)
from .views.order_views import OrderListView, OrderCreateView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # API paths
    path('api/cakes/', CakeListView.as_view(), name='cake-list'),
    path('api/cakes/<str:pk>/', CakeDetailView.as_view(), name='cake-detail'),
    # path('api/cakes/add/', CakeCreateView.as_view(), name='cake-add'),
    path('api/categories/', CategoryListView.as_view(), name='category-list'),
    path('api/categories/<str:pk>/', CategoryDetailView.as_view(), name='category-detail'),
    path('api/users/', UserListView.as_view(), name='user-list'),
    path('api/users/<str:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('api/login/', LoginView.as_view()),  # <- Đường dẫn đăng nhập mới
    # path('api/payments/', PaymentListView.as_view(), name='payment-list'),
    # path('api/payments/<str:pk>/', PaymentDetailView.as_view(), name='payment-detail'),
    path('api/orders/', OrderListView.as_view(), name='get_orders'),  # API để lấy danh sách đơn hàng
    path('api/order/create/', OrderCreateView.as_view(), name='create_order'),  # API tạo đơn hàng mới
    path('cart/', CartAPIView.as_view(), name='cart-list'),
    path('cart/add/', AddToCartAPIView.as_view(), name='add-to-cart'),
    path('api/token/', LoginAPIView.as_view(), name='login'),
    path('carts/', AllCartsAPIView.as_view(), name='all-carts'),
    path('users/<str:pk>/set-staff/', update_user_staff_status),
    # Home path
    path('', home, name='home'),
]

# Static file settings for development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
