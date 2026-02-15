from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None:
        return Response({
            'message': 'Login successful',
            'role': user.role,
            'username': user.username
        })
    else:
        return Response({'error': 'Invalid credentials'}, status=400)
