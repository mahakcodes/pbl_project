from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Test
from .serializers import TestListSerializer
class StudentDashboardView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request): return Response({'active_tests': 1, 'upcoming_tests': 3, 'completed_tests': 0, 'total_tests': 4})
class StudentTestsView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request): return Response(TestListSerializer(Test.objects.all().order_by('scheduled_date'), many=True).data)
class TeacherDashboardView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        t = Test.objects.all()
        return Response({'total_tests': t.count(), 'scheduled_tests': t.filter(status='scheduled').count(), 'draft_tests': t.filter(status='draft').count(), 'total_students_assigned': 1})
class TeacherTestsView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request): return Response(TestListSerializer(Test.objects.all().order_by('-created_at'), many=True).data)