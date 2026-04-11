import os
import django

# Aapke project ki settings ka path
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dtportal.settings')
django.setup()

from users.models import CustomUser

def create_users():
    # --- 1. Teacher/Admin Account Banana ---
    t_user = "teacher_demo"
    t_pass = "teacher123"
    t_email = "teacher@test.com"

    if not CustomUser.objects.filter(username=t_user).exists():
        CustomUser.objects.create_superuser(
            username=t_user,
            email=t_email,
            password=t_pass,
            role='admin'  # Aapke views mein admin role zaroori hai
        )
        print(f"✅ Teacher (Admin) created: {t_user}")
    else:
        print(f"ℹ️ Teacher '{t_user}' already exists.")

    # --- 2. Student Account Banana ---
    s_user = "student_demo"
    s_pass = "student123"
    s_email = "student@test.com"

    if not CustomUser.objects.filter(username=s_user).exists():
        # Student ke liye hum normal user banayenge superuser nahi
        student = CustomUser.objects.create_user(
            username=s_user,
            email=s_email,
            password=s_pass,
            role='student' # Role 'student' set karna zaroori hai
        )
        print(f"✅ Student created: {s_user}")
    else:
        print(f"ℹ️ Student '{s_user}' already exists.")

if __name__ == "__main__":
    create_users()