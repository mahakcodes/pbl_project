from rest_framework import serializers
from .models import Test
class TestListSerializer(serializers.ModelSerializer):
    class Meta: model = Test
    fields = ['id', 'title', 'subject', 'total_marks', 'duration_minutes', 'num_questions', 'scheduled_date', 'start_time', 'end_time', 'status']