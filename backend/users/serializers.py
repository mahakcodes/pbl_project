from rest_framework import serializers
from django.db.models import Q
from .models import CustomUser
class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    password = serializers.CharField(write_only=True)
    def validate(self, data):
        user = CustomUser.objects.filter(Q(email=data['identifier']) | Q(roll_number=data['identifier']) | Q(employee_id=data['identifier'])).first()
        if not user or not user.check_password(data['password']):
            raise serializers.ValidationError("Invalid credentials")
        return {'user': user}