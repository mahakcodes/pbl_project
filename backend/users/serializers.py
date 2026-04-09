from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers

User = get_user_model()


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        # user find by email
        user_obj = User.objects.filter(email=email).first()

        if user_obj:
            user = authenticate(
                username=user_obj.username,
                password=password
            )
        else:
            user = None

        if user is None:
            raise serializers.ValidationError("Invalid credentials")

        return {"user": user}