from rest_framework import serializers
from .models import Test, Question, TestAttempt, StudentAnswer

class TestListSerializer(serializers.ModelSerializer):
    questions_added = serializers.SerializerMethodField()
    class Meta:
        model = Test
        fields = ['id', 'title', 'subject', 'description', 'total_marks', 'duration_minutes',
                  'num_questions', 'scheduled_date', 'start_time', 'end_time', 'status',
                  'is_published', 'created_at', 'questions_added']
    def get_questions_added(self, obj):
        return obj.questions.count()

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d',
                  'correct_option', 'marks', 'order', 'explanation']

class QuestionStudentSerializer(serializers.ModelSerializer):
    # Hides correct_option and explanation from students
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'marks', 'order']

class StudentAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAnswer
        fields = ['question', 'selected_option']

class TestAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestAttempt
        fields = ['id', 'started_at', 'submitted_at', 'is_submitted', 'marks_obtained',
                  'percentage', 'correct_answers', 'wrong_answers', 'unanswered']

class TestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ['id', 'title', 'subject', 'description', 'total_marks', 'duration_minutes',
                  'num_questions', 'scheduled_date', 'start_time', 'end_time', 'status']