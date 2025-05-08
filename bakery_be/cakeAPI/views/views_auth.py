import jwt
from datetime import datetime, timedelta
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.conf import settings

from pymongo import MongoClient

# Kết nối MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['QuanLyWebBanBanh']
db_users = db['users']

SECRET_KEY = settings.SECRET_KEY  # Lấy secret key từ settings

class LoginAPIView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = db_users.find_one({"email": email})
        if not user or user["password"] != password:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Tạo payload cho JWT
        payload = {
            "user_id": str(user["_id"]),
            "email": user["email"],
            "is_staff": user.get("is_staff", False),
            "exp": datetime.utcnow() + timedelta(hours=1),
            "iat": datetime.utcnow(),
        }

        # Mã hóa JWT
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

        return Response({
            "access": token,
            "user": {
                "email": user["email"],
                "name": user["name"],
                "is_staff": user.get("is_staff", False),
                "_id": str(user["_id"])
            }
        })
