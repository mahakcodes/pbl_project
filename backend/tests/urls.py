from django.urls import path
from .views import (
    StudentDashboardView, StudentTestsView, StudentTestDetailView,
    StudentTestQuestionsView, StartTestView, SaveAnswerView,
    SubmitTestView, StudentResultView, StudentReviewView,
    TeacherDashboardView, TeacherTestsView, TeacherCreateTestView,
    TeacherEditTestView, TeacherDeleteTestView, TeacherAddQuestionView,
    TeacherQuestionsView, TeacherEditQuestionView, PublishTestView,
    TeacherSubmissionsView, TeacherAnalyticsView,
)

urlpatterns = [
    # Student
    path('student/dashboard/', StudentDashboardView.as_view()),
    path('student/tests/', StudentTestsView.as_view()),
    path('student/tests/<int:test_id>/', StudentTestDetailView.as_view()),
    path('student/tests/<int:test_id>/questions/', StudentTestQuestionsView.as_view()),
    path('student/tests/<int:test_id>/start/', StartTestView.as_view()),
    path('student/tests/<int:test_id>/save-answer/', SaveAnswerView.as_view()),
    path('student/tests/<int:test_id>/submit/', SubmitTestView.as_view()),
    path('student/tests/<int:test_id>/result/', StudentResultView.as_view()),
    path('student/tests/<int:test_id>/review/', StudentReviewView.as_view()),
    # Teacher
    path('teacher/dashboard/', TeacherDashboardView.as_view()),
    path('teacher/tests/', TeacherTestsView.as_view()),
    path('teacher/tests/create/', TeacherCreateTestView.as_view()),
    path('teacher/tests/<int:test_id>/edit/', TeacherEditTestView.as_view()),
    path('teacher/tests/<int:test_id>/delete/', TeacherDeleteTestView.as_view()),
    path('teacher/tests/<int:test_id>/add-question/', TeacherAddQuestionView.as_view()),
    path('teacher/tests/<int:test_id>/questions/', TeacherQuestionsView.as_view()),
    path('teacher/questions/<int:question_id>/edit/', TeacherEditQuestionView.as_view()),
    path('teacher/tests/<int:test_id>/publish/', PublishTestView.as_view()),
    path('teacher/tests/<int:test_id>/submissions/', TeacherSubmissionsView.as_view()),
    path('teacher/tests/<int:test_id>/analytics/', TeacherAnalyticsView.as_view()),
]