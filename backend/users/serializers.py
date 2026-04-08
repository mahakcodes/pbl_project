from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()   # frontend se email aa raha hai
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        identifier = data.get('username')
        password = data.get('password')

        if not identifier or not password:
            raise serializers.ValidationError("Email and password required")

        # 👇 email ko username field me pass kar rahe (kyunki USERNAME_FIELD = 'email')
        user = authenticate(username=identifier, password=password)

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        if not user.is_active:
            raise serializers.ValidationError("User inactive")

        return {'user': user}