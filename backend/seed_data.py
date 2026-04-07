from users.models import CustomUser
from tests.models import Test
from datetime import date, time
s, _ = CustomUser.objects.get_or_create(email='student@college.edu', defaults={'username':'student1','first_name':'Student','last_name':'1','role':'student','roll_number':'CS2022001','department':'Computer Science'})
if _: s.set_password('student123'); s.save()
t, _ = CustomUser.objects.get_or_create(email='teacher@college.edu', defaults={'username':'teacher1','first_name':'Teacher','last_name':'1','role':'teacher','employee_id':'EMP001','department':'Computer Science'})
if _: t.set_password('teacher123'); t.save()
if Test.objects.count() == 0:
    tests = [
        {'title':'DSA - Mid Term','subject':'DSA','teacher':t,'total_marks':50,'duration_minutes':120,'num_questions':25,'scheduled_date':date(2026,4,12),'start_time':time(10,0),'end_time':time(12,0),'status':'scheduled'},
        {'title':'DBMS - Practical','subject':'DBMS','teacher':t,'total_marks':30,'duration_minutes':90,'num_questions':15,'scheduled_date':date(2026,4,8),'start_time':time(14,0),'end_time':time(15,30),'status':'scheduled'},
        {'title':'Python - Lab Test','subject':'Python','teacher':t,'total_marks':40,'duration_minutes':120,'num_questions':20,'scheduled_date':date(2026,4,18),'start_time':time(9,0),'end_time':time(11,0),'status':'draft'},
    ]
    for d in tests: test = Test.objects.create(**d); test.assigned_students.add(s)
print("✅ Seeding done. Student: student@college.edu/student123 | Teacher: teacher@college.edu/teacher123")