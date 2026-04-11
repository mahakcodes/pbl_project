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

# 🔥 Teacher create (FIXED: Role changed from 'admin' to 'teacher')
@api_view(['GET'])
def create_teacher(request):
    try:
        User.objects.filter(username="teacher@college.edu").delete()
        user = User.objects.create(
            username="teacher@college.edu",
            email="teacher@college.edu",
            role="teacher", # ✅ Fixed: Frontend 'teacher' check pass karega
            is_staff=True,   # Django admin access ke liye
            is_superuser=True,
            first_name="Demo",
            last_name="Teacher"
        )
        user.set_password("123456")
        user.save()
        return Response({"msg": "Teacher reset done with TEACHER role"})
    except Exception as e:
        return Response({"error": str(e)})

# 🔥 Student create (Role is already correct)
@api_view(['GET'])
def create_student(request):
    try:
        User.objects.filter(username="student@college.edu").delete()
        user = User.objects.create(
            username="student@college.edu",
            email="student@college.edu",
            role="student",
            first_name="Demo",
            last_name="Student",
            roll_number="STU001"
        )
        user.set_password("123456")
        user.save()
        return Response({"msg": "Student reset done with Student role"})
    except Exception as e:
        return Response({"error": str(e)})