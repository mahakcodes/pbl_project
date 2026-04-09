from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers

User = get_user_model()

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        user_obj = User.objects.filter(email=email).first()

        if user_obj:
            user = authenticate(username=user_obj.username, password=password)
        else:
            user = None

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        return {"user": user}