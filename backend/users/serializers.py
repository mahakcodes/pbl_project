from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")

        # 🔥 IMPORTANT: password check
        if not user.check_password(password):
            raise serializers.ValidationError("Wrong password")

        return {"user": user}