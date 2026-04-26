from django.contrib import admin
from django.urls import path
from prodrev_app import views
from rest_framework.authtoken import views as authview
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static

router=DefaultRouter()
router.register('register',views.UserRegisterView,basename='reg_view')
router.register('products',views.ProductView,basename='product_view')

urlpatterns = [
     path('token',authview.obtain_auth_token),
    path('login/', views.UserLoginView.as_view(), name='login_view'),
    path('profile/', views.UserProfileView.as_view(), name="user-profile"),
    path('category/', views.ListCategoriesView.as_view(), name='category_view'),
    path('category/<int:id>/products/', views.CategoryProductsView.as_view(), name='category-products'),

]+router.urls + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)