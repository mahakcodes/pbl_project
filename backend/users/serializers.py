from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    email = serializers.CharField(required=False)
    password = serializers.CharField()

    def validate(self, data):
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        user = None

        if username:
            user = User.objects.filter(username=username).first()
        elif email:
            user = User.objects.filter(email=email).first()

        if user and user.check_password(password):
            return {"user": user}

        raise serializers.ValidationError("Invalid credentials")