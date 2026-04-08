from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import Test, Question, TestAttempt, StudentAnswer
from .serializers import (TestListSerializer, QuestionSerializer, QuestionStudentSerializer,
                           StudentAnswerSerializer, TestAttemptSerializer, TestCreateSerializer)
from users.models import CustomUser

# ─── STUDENT VIEWS ───────────────────────────────────────────

class StudentDashboardView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        user_id = request.query_params.get('user_id')
        if user_id:
            student = get_object_or_404(CustomUser, id=user_id)
            assigned = student.assigned_tests.all()
            now = timezone.now()
            active = assigned.filter(status='active', is_published=True).count()
            upcoming = assigned.filter(status='scheduled', is_published=True).count()
            completed = TestAttempt.objects.filter(student=student, is_submitted=True).count()
            return Response({'active_tests': active, 'upcoming_tests': upcoming,
                             'completed_tests': completed, 'total_tests': assigned.count()})
        return Response({'active_tests': 0, 'upcoming_tests': 0, 'completed_tests': 0, 'total_tests': 0})

class StudentTestsView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        user_id = request.query_params.get('user_id')
        if user_id:
            student = get_object_or_404(CustomUser, id=user_id)
            tests = student.assigned_tests.filter(is_published=True).order_by('scheduled_date')
        else:
            tests = Test.objects.filter(is_published=True).order_by('scheduled_date')
        return Response(TestListSerializer(tests, many=True).data)

class StudentTestDetailView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request, test_id):
        test = get_object_or_404(Test, id=test_id)
        return Response(TestListSerializer(test).data)

class StudentTestQuestionsView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request, test_id):
        user_id = request.query_params.get('user_id')
        test = get_object_or_404(Test, id=test_id)
        if user_id:
            attempt = TestAttempt.objects.filter(test=test, student_id=user_id, is_submitted=False).first()
            if not attempt:
                return Response({'error': 'No active attempt found'}, status=400)
        questions = test.questions.order_by('order')
        return Response(QuestionStudentSerializer(questions, many=True).data)

class StartTestView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request, test_id):
        test = get_object_or_404(Test, id=test_id)
        user_id = request.data.get('user_id')
        student = get_object_or_404(CustomUser, id=user_id)
        # Prevent reattempt
        if TestAttempt.objects.filter(test=test, student=student, is_submitted=True).exists():
            return Response({'error': 'Already submitted'}, status=400)
        attempt, created = TestAttempt.objects.get_or_create(test=test, student=student)
        return Response(TestAttemptSerializer(attempt).data)

class SaveAnswerView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request, test_id):
        user_id = request.data.get('user_id')
        question_id = request.data.get('question_id')
        selected = request.data.get('selected_option', '')
        attempt = get_object_or_404(TestAttempt, test_id=test_id, student_id=user_id, is_submitted=False)
        question = get_object_or_404(Question, id=question_id)
        answer, _ = StudentAnswer.objects.get_or_create(attempt=attempt, question=question)
        answer.selected_option = selected
        answer.save()
        return Response({'saved': True})

class SubmitTestView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request, test_id):
        user_id = request.data.get('user_id')
        auto = request.data.get('auto_submitted', False)
        attempt = get_object_or_404(TestAttempt, test_id=test_id, student_id=user_id, is_submitted=False)
        questions = Question.objects.filter(test_id=test_id)
        correct = wrong = unanswered = 0
        marks = 0
        for q in questions:
            ans = StudentAnswer.objects.filter(attempt=attempt, question=q).first()
            if not ans or not ans.selected_option:
                unanswered += 1
                if ans: ans.is_correct = False; ans.marks_awarded = 0; ans.save()
            elif ans.selected_option == q.correct_option:
                correct += 1
                marks += q.marks
                ans.is_correct = True; ans.marks_awarded = q.marks; ans.save()
            else:
                wrong += 1
                ans.is_correct = False; ans.marks_awarded = 0; ans.save()
        attempt.is_submitted = True
        attempt.auto_submitted = auto
        attempt.submitted_at = timezone.now()
        attempt.correct_answers = correct
        attempt.wrong_answers = wrong
        attempt.unanswered = unanswered
        attempt.marks_obtained = marks
        attempt.percentage = round((marks / attempt.test.total_marks) * 100, 2) if attempt.test.total_marks else 0
        attempt.save()
        return Response(TestAttemptSerializer(attempt).data)

class StudentResultView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request, test_id):
        user_id = request.query_params.get('user_id')
        attempt = get_object_or_404(TestAttempt, test_id=test_id, student_id=user_id, is_submitted=True)
        test = attempt.test
        all_attempts = TestAttempt.objects.filter(test=test, is_submitted=True)
        marks_list = list(all_attempts.values_list('marks_obtained', flat=True))
        return Response({
            **TestAttemptSerializer(attempt).data,
            'test_title': test.title, 'subject': test.subject,
            'total_marks': test.total_marks, 'total_questions': test.num_questions,
            'duration_minutes': test.duration_minutes,
            'class_average': round(sum(marks_list) / len(marks_list), 2) if marks_list else 0,
            'highest_marks': max(marks_list) if marks_list else 0,
            'lowest_marks': min(marks_list) if marks_list else 0,
        })

class StudentReviewView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request, test_id):
        user_id = request.query_params.get('user_id')
        attempt = get_object_or_404(TestAttempt, test_id=test_id, student_id=user_id, is_submitted=True)
        questions = Question.objects.filter(test_id=test_id).order_by('order')
        data = []
        for q in questions:
            ans = StudentAnswer.objects.filter(attempt=attempt, question=q).first()
            data.append({
                'id': q.id, 'question_text': q.question_text,
                'option_a': q.option_a, 'option_b': q.option_b,
                'option_c': q.option_c, 'option_d': q.option_d,
                'correct_option': q.correct_option, 'marks': q.marks,
                'explanation': q.explanation,
                'selected_option': ans.selected_option if ans else '',
                'is_correct': ans.is_correct if ans else False,
                'status': 'correct' if (ans and ans.is_correct) else ('wrong' if (ans and ans.selected_option) else 'unanswered')
            })
        return Response(data)

# ─── TEACHER VIEWS ───────────────────────────────────────────

class TeacherDashboardView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        user_id = request.query_params.get('user_id')
        if user_id:
            t = Test.objects.filter(teacher_id=user_id)
        else:
            t = Test.objects.all()
        return Response({
            'total_tests': t.count(),
            'scheduled_tests': t.filter(status='scheduled').count(),
            'draft_tests': t.filter(status='draft').count(),
            'total_students_assigned': CustomUser.objects.filter(role='student').count()
        })

class TeacherTestsView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        user_id = request.query_params.get('user_id')
        if user_id:
            tests = Test.objects.filter(teacher_id=user_id).order_by('-created_at')
        else:
            tests = Test.objects.all().order_by('-created_at')
        return Response(TestListSerializer(tests, many=True).data)

class TeacherCreateTestView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        serializer = TestCreateSerializer(data=request.data)
        if serializer.is_valid():
            teacher_id = request.data.get('teacher_id')
            teacher = get_object_or_404(CustomUser, id=teacher_id)
            # Auto-assign all students
            test = serializer.save(teacher=teacher)
            students = CustomUser.objects.filter(role='student')
            test.assigned_students.set(students)
            return Response(TestListSerializer(test).data, status=201)
        return Response(serializer.errors, status=400)

class TeacherEditTestView(APIView):
    permission_classes = [permissions.AllowAny]
    def put(self, request, test_id):
        test = get_object_or_404(Test, id=test_id)
        serializer = TestCreateSerializer(test, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(TestListSerializer(test).data)
        return Response(serializer.errors, status=400)

class TeacherDeleteTestView(APIView):
    permission_classes = [permissions.AllowAny]
    def delete(self, request, test_id):
        test = get_object_or_404(Test, id=test_id)
        test.delete()
        return Response({'deleted': True})

class TeacherAddQuestionView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request, test_id):
        test = get_object_or_404(Test, id=test_id)
        serializer = QuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(test=test)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class TeacherQuestionsView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request, test_id):
        questions = Question.objects.filter(test_id=test_id).order_by('order')
        return Response(QuestionSerializer(questions, many=True).data)

class TeacherEditQuestionView(APIView):
    permission_classes = [permissions.AllowAny]
    def put(self, request, question_id):
        question = get_object_or_404(Question, id=question_id)
        serializer = QuestionSerializer(question, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    def delete(self, request, question_id):
        question = get_object_or_404(Question, id=question_id)
        question.delete()
        return Response({'deleted': True})

class PublishTestView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request, test_id):
        test = get_object_or_404(Test, id=test_id)
        if test.questions.count() == 0:
            return Response({'error': 'Add at least one question before publishing'}, status=400)
        test.is_published = True
        test.status = 'scheduled'
        test.save()
        return Response({'published': True})

class TeacherSubmissionsView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request, test_id):
        test = get_object_or_404(Test, id=test_id)
        students = test.assigned_students.all()
        data = []
        for s in students:
            attempt = TestAttempt.objects.filter(test=test, student=s).first()
            data.append({
                'student_name': f"{s.first_name} {s.last_name}",
                'roll_number': s.roll_number,
                'email': s.email,
                'status': 'submitted' if (attempt and attempt.is_submitted) else ('started' if attempt else 'not_attempted'),
                'submitted_at': attempt.submitted_at if attempt else None,
                'marks_obtained': attempt.marks_obtained if attempt else None,
                'percentage': attempt.percentage if attempt else None,
            })
        return Response(data)

class TeacherAnalyticsView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request, test_id):
        test = get_object_or_404(Test, id=test_id)
        attempts = TestAttempt.objects.filter(test=test, is_submitted=True)
        marks_list = list(attempts.values_list('marks_obtained', flat=True))
        questions = Question.objects.filter(test=test).order_by('order')
        q_analysis = []
        for q in questions:
            correct_count = StudentAnswer.objects.filter(question=q, is_correct=True).count()
            total = attempts.count()
            q_analysis.append({
                'question_text': q.question_text[:80],
                'correct_count': correct_count,
                'total_attempted': total,
                'correctness_pct': round((correct_count / total) * 100, 1) if total else 0
            })
        return Response({
            'total_assigned': test.assigned_students.count(),
            'total_attempted': attempts.count(),
            'not_attempted': test.assigned_students.count() - attempts.count(),
            'average_marks': round(sum(marks_list) / len(marks_list), 2) if marks_list else 0,
            'highest_marks': max(marks_list) if marks_list else 0,
            'lowest_marks': min(marks_list) if marks_list else 0,
            'pass_count': sum(1 for m in marks_list if m >= test.total_marks * 0.4),
            'pass_percentage': round(sum(1 for m in marks_list if m >= test.total_marks * 0.4) / len(marks_list) * 100, 1) if marks_list else 0,
            'question_analysis': q_analysis,
        })