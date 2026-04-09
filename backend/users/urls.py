from django.urls import path
from .views import LoginView, create_teacher, create_student

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('create-teacher/', create_teacher),
    path('create-student/', create_student),  # 👈 ye add kiya
]