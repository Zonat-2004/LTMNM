from django.urls import path

from .views.order_views import OrderListCreateView
from .views.cart_views import AddToCartAPIView  # đã import sẵn trong __init__.py
from .views.cart_views import CartAPIView  # đã import sẵn trong __init__.py
from .views import (  # đã import sẵn trong __init__.py
    CakeListView, CakeDetailView, 
    CategoryListView, CategoryDetailView,
    UserListView, UserDetailView,
    home
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
    # path('api/payments/', PaymentListView.as_view(), name='payment-list'),
    # path('api/payments/<str:pk>/', PaymentDetailView.as_view(), name='payment-detail'),
    path('api/orders/', OrderListCreateView.as_view(), name='order-list-create'),
    path('cart/', CartAPIView.as_view(), name='cart-list'),
    path('cart/add/', AddToCartAPIView.as_view(), name='add-to-cart'),
    # Home path
    path('', home, name='home'),
]

# Static file settings for development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
