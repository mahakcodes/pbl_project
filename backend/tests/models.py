from django.db import models
from users.models import CustomUser
class Test(models.Model):
    STATUS_CHOICES = (('draft', 'Draft'), ('scheduled', 'Scheduled'), ('active', 'Active'), ('completed', 'Completed'))
    title = models.CharField(max_length=200)
    subject = models.CharField(max_length=100)
    teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='tests_created')
    total_marks = models.IntegerField()
    duration_minutes = models.IntegerField()
    num_questions = models.IntegerField(default=0)
    scheduled_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    assigned_students = models.ManyToManyField(CustomUser, related_name='assigned_tests', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self): return self.title