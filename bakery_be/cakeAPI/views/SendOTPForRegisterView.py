from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import random
from .otp_store import otp_storage
from ..database import db

class SendOTPForRegisterView(APIView):
    def post(self, request):
        email = request.data.get('email')

        if not email:
            return Response({'error': 'Vui lòng nhập email.'}, status=status.HTTP_400_BAD_REQUEST)

        # Kiểm tra nếu email đã tồn tại thì không cho gửi OTP đăng ký
        if db.users.find_one({'email': email}):
            return Response({'error': 'Email đã tồn tại trong hệ thống.'}, status=status.HTTP_400_BAD_REQUEST)

        otp = str(random.randint(100000, 999999))
        otp_storage[email] = otp  # Lưu OTP vào bộ nhớ tạm (có thể là Redis, hoặc một dict như ví dụ này)

        # Giả lập gửi OTP (thực tế bạn cần gửi qua email)
        print(f'[OTP Đăng ký gửi tới {email}]: {otp}')

        return Response({'message': 'OTP đăng ký đã được gửi (giả lập).'}, status=status.HTTP_200_OK)
class VerifyOTPview(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        if not email or not otp:
            return Response({'error': 'Vui lòng cung cấp email và OTP.'}, status=status.HTTP_400_BAD_REQUEST)

        # Kiểm tra nếu OTP có trong otp_storage
        stored_otp = otp_storage.get(email)
        
        if not stored_otp:
            return Response({'error': 'OTP không được tìm thấy. Vui lòng gửi lại OTP.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Kiểm tra OTP
        if stored_otp != otp:
            return Response({'error': 'OTP không đúng hoặc đã hết hạn.'}, status=status.HTTP_400_BAD_REQUEST)

        # Nếu OTP chính xác
        return Response({'message': 'OTP xác thực thành công! Bạn có thể đăng ký tài khoản.'}, status=status.HTTP_200_OK)