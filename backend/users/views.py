from rest_framework import generics, permissions
from rest_framework.response import Response
from .serializers import LoginSerializer
class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        u = serializer.validated_data['user']
        return Response({'id': u.id, 'username': u.username, 'email': u.email, 'role': u.role, 'roll_number': u.roll_number, 'employee_id': u.employee_id, 'department': u.department, 'first_name': u.first_name, 'last_name': u.last_name})