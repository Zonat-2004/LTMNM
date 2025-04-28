from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from ..serializers import UserSerializer
from ..database import db, get_object

class UserListView(APIView):
    def get(self, request):
        users = list(db.users.find())
        for user in users:
            user['_id'] = str(user['_id'])
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            new_user = {
                'name': data['name'],
                'email': data['email'],
                'password': data['password'],
                'phone': data['phone']
            }
            result = db.users.insert_one(new_user)
            new_user['_id'] = str(result.inserted_id)
            return Response(UserSerializer(new_user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(APIView):
    def get(self, request, pk):
        user = get_object(db.users, pk)
        if not user:
            return Response({'error': 'Không tìm thấy người dùng!'}, status=status.HTTP_404_NOT_FOUND)
        user['_id'] = str(user['_id'])
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, pk):
        user = get_object(db.users, pk)
        if not user:
            return Response({'error': 'Không tìm thấy người dùng!'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            updated_user = {
                'name': data['name'],
                'email': data['email'],
                'password': data['password'],
                'phone': data['phone']
            }
            db.users.update_one({'_id': ObjectId(pk)}, {'$set': updated_user})
            updated_user['_id'] = pk
            return Response(UserSerializer(updated_user).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        user = get_object(db.users, pk)
        if not user:
            return Response({'error': 'Không tìm thấy người dùng!'}, status=status.HTTP_404_NOT_FOUND)
        db.users.delete_one({'_id': ObjectId(pk)})
        return Response({'message': 'Xóa người dùng thành công.'}, status=status.HTTP_204_NO_CONTENT)