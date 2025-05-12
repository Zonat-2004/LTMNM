from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pymongo import MongoClient
from .otp_store import otp_storage  # Đảm bảo bạn có otp_storage để lưu trữ OTP tạm thời

# Kết nối với MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["QuanLyWebBanBanh"]
db_users = db["users"]

class RegisterAPIView(APIView):
    def post(self, request):
        data = request.data
        name = data.get('name')
        phone = data.get('phone')
        email = data.get('email')
        password = data.get('password')
        otp = data.get('otp')

        # Kiểm tra thông tin bắt buộc
        if not name or not phone or not email or not password or not otp:
            return Response({'error': 'Thiếu thông tin.'}, status=status.HTTP_400_BAD_REQUEST)

        # Kiểm tra OTP
        stored_otp = otp_storage.get(email)
        if not stored_otp:
            return Response({'error': 'OTP không được tìm thấy. Vui lòng gửi lại OTP.'}, status=status.HTTP_400_BAD_REQUEST)

        if stored_otp != otp:
            return Response({'error': 'OTP không đúng hoặc đã hết hạn.'}, status=status.HTTP_400_BAD_REQUEST)

        # Kiểm tra nếu email đã tồn tại trong hệ thống
        if db_users.find_one({'email': email}):
            return Response({'error': 'Email đã tồn tại trong hệ thống.'}, status=status.HTTP_400_BAD_REQUEST)

        # Lưu người dùng mới vào database (không mã hóa mật khẩu)
        db_users.insert_one({
            'name': name,
            'phone': phone,
            'email': email,
            'password': password, # Không mã hóa mật khẩu
            "is_staff": False
        })

        # Xóa OTP sau khi đăng ký thành công
        del otp_storage[email]

        return Response({'message': 'Đăng ký thành công!'}, status=status.HTTP_201_CREATED)
