from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import random
from bson import ObjectId
from ..serializers import UserSerializer
from ..database import db, get_object
from .otp_store import otp_storage  # Import từ file otp_store.py

class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Vui lòng nhập email.'}, status=status.HTTP_400_BAD_REQUEST)

        user = db.users.find_one({'email': email})
        if not user:
            return Response({'error': 'Email không tồn tại trong hệ thống.'}, status=status.HTTP_404_NOT_FOUND)

        otp = str(random.randint(100000, 999999))
        otp_storage[email] = otp

        # In OTP ra console (giả lập gửi email)
        print(f'[OTP gửi tới {email}]: {otp}')

        return Response({'message': 'OTP đã được gửi tới email (giả lập).'}, status=status.HTTP_200_OK)

class ResetPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')

        if not all([email, otp, new_password]):
            return Response({'error': 'Thiếu thông tin.'}, status=status.HTTP_400_BAD_REQUEST)

        if email not in otp_storage or otp_storage[email] != otp:
            return Response({'error': 'OTP không đúng hoặc đã hết hạn.'}, status=status.HTTP_400_BAD_REQUEST)

        result = db.users.update_one(
            {'email': email},
            {'$set': {'password': new_password}}
        )

        if result.modified_count == 0:
            return Response({'error': 'Không thể đổi mật khẩu.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Xoá OTP sau khi dùng xong
        del otp_storage[email]

        return Response({'message': 'Đổi mật khẩu thành công.'}, status=status.HTTP_200_OK)
class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        if not email or not otp:
            return Response({'error': 'Thiếu thông tin.'}, status=status.HTTP_400_BAD_REQUEST)

        if otp_storage.get(email) == otp:
            return Response({'verified': True}, status=status.HTTP_200_OK)
        return Response({'verified': False}, status=status.HTTP_200_OK)
