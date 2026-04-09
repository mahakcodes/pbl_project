from django.urls import path
from .views import LoginView, create_teacher

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('create-teacher/', create_teacher),  # 👈 ye add kiya
]