from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["QuanLyWebBanBanh"]
db_users = db["users"]

class RegisterAPIView(APIView):
    def post(self, request):
        data = request.data
        name = data.get("name")
        phone = data.get("phone")
        email = data.get("email")
        password = data.get("password")

        # ✅ Kiểm tra trùng số điện thoại
        if db_users.find_one({"phone": phone}):
            return Response({"error": "Số điện thoại đã được sử dụng"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Kiểm tra trùng email (tùy chọn)
        if db_users.find_one({"email": email}):
            return Response({"error": "Email đã được sử dụng"}, status=status.HTTP_400_BAD_REQUEST)

        user = {
            "name": name,
            "phone": phone,
            "email": email,
            "password": password,
            "is_staff": False
        }
        db_users.insert_one(user)
        return Response({"message": "Đăng ký thành công"}, status=status.HTTP_201_CREATED)
