from django.urls import path
from .views import StudentDashboardView, StudentTestsView, TeacherDashboardView, TeacherTestsView
urlpatterns = [
    path('student/dashboard/', StudentDashboardView.as_view()),
    path('student/tests/', StudentTestsView.as_view()),
    path('teacher/dashboard/', TeacherDashboardView.as_view()),
    path('teacher/tests/', TeacherTestsView.as_view()),
]