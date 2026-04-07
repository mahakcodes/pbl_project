from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = (('student', 'Student'), ('teacher', 'Teacher'))
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    roll_number = models.CharField(max_length=20, blank=True, null=True, unique=True)
    employee_id = models.CharField(max_length=20, blank=True, null=True, unique=True)
    department = models.CharField(max_length=100, blank=True)
    
    # 👇 ADD THIS LINE: Override email to make it unique
    email = models.EmailField(unique=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'role']
    
    def __str__(self):
        return f"{self.username} ({self.role})"