from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from ..database import db, get_object

@api_view(['PATCH'])
def update_user_staff_status(request, pk):
    """
    API cập nhật quyền admin (is_staff) cho người dùng
    """
    user = get_object(db.users, pk)
    if not user:
        return Response({'error': 'Không tìm thấy người dùng!'}, status=status.HTTP_404_NOT_FOUND)

    is_staff = request.data.get('is_staff')
    if is_staff is None:
        return Response({'error': 'Thiếu trường is_staff'}, status=status.HTTP_400_BAD_REQUEST)

    # Chuyển đổi thành boolean nếu gửi từ frontend là string
    if isinstance(is_staff, str):
        is_staff = is_staff.lower() == 'true'

    db.users.update_one({'_id': ObjectId(pk)}, {'$set': {'is_staff': is_staff}})
    return Response({'message': 'Cập nhật quyền admin thành công!'}, status=status.HTTP_200_OK)
