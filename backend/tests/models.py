from django.db import models
from users.models import CustomUser

class Test(models.Model):
    STATUS_CHOICES = (('draft', 'Draft'), ('scheduled', 'Scheduled'), ('active', 'Active'), ('completed', 'Completed'))
    title = models.CharField(max_length=200)
    subject = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='tests_created')
    total_marks = models.IntegerField()
    duration_minutes = models.IntegerField()
    num_questions = models.IntegerField(default=0)
    scheduled_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    is_published = models.BooleanField(default=False)
    assigned_students = models.ManyToManyField(CustomUser, related_name='assigned_tests', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self): return self.title

class Question(models.Model):
    OPTION_CHOICES = (('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D'))
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    option_a = models.CharField(max_length=500)
    option_b = models.CharField(max_length=500)
    option_c = models.CharField(max_length=500)
    option_d = models.CharField(max_length=500)
    correct_option = models.CharField(max_length=1, choices=OPTION_CHOICES)
    marks = models.IntegerField(default=1)
    order = models.IntegerField(default=0)
    explanation = models.TextField(blank=True)
    def __str__(self): return f"Q{self.order}: {self.question_text[:50]}"

class TestAttempt(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='attempts')
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='attempts')
    started_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    is_submitted = models.BooleanField(default=False)
    auto_submitted = models.BooleanField(default=False)
    marks_obtained = models.FloatField(default=0)
    percentage = models.FloatField(default=0)
    correct_answers = models.IntegerField(default=0)
    wrong_answers = models.IntegerField(default=0)
    unanswered = models.IntegerField(default=0)
    class Meta:
        unique_together = ('test', 'student')
    def __str__(self): return f"{self.student.username} - {self.test.title}"

class StudentAnswer(models.Model):
    attempt = models.ForeignKey(TestAttempt, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_option = models.CharField(max_length=1, blank=True)
    is_correct = models.BooleanField(default=False)
    marks_awarded = models.FloatField(default=0)
    class Meta:
        unique_together = ('attempt', 'question')