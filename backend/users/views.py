from rest_framework import generics, permissions
from rest_framework.response import Response
from .serializers import LoginSerializer

from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view

User = get_user_model()


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        u = serializer.validated_data['user']
        return Response({
            'id': u.id,
            'username': u.username,
            'email': u.email,
            'role': u.role,
            'roll_number': u.roll_number,
            'employee_id': u.employee_id,
            'department': u.department,
            'first_name': u.first_name,
            'last_name': u.last_name
        })


# 🔥 Teacher create
@api_view(['GET'])
def create_teacher(request):
    try:
        User.objects.filter(username="teacher@college.edu").delete()

        User.objects.create_user(
            username="teacher@college.edu",
            email="teacher@college.edu",
            password="123456"
        )
        return Response({"msg": "Teacher reset done"})
    except Exception as e:
        return Response({"error": str(e)})


# 🔥 Student create
@api_view(['GET'])
def create_student(request):
    try:
        User.objects.filter(username="student@college.edu").delete()

        User.objects.create_user(
            username="student@college.edu",
            email="student@college.edu",
            password="123456"
        )
        return Response({"msg": "Student reset done"})
    except Exception as e:
        return Response({"error": str(e)})