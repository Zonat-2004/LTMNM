from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from ..serializers import CategorySerializer
from ..database import db, get_object

class CategoryListView(APIView):
    def get(self, request):
        search_query = request.GET.get('search', '')  # Lấy từ khóa tìm kiếm từ query params

        # Lấy danh mục từ database, nếu có từ khóa tìm kiếm thì lọc theo tên
        if search_query:
            categories_query = db.categories.find({
                "name": {"$regex": search_query, "$options": "i"}  # Tìm kiếm không phân biệt chữ hoa, chữ thường
            })
        else:
            categories_query = db.categories.find()  # Nếu không có tìm kiếm, lấy tất cả danh mục

        # Chuyển đổi các ObjectId thành string
        categories = list(categories_query)
        for category in categories:
            category['_id'] = str(category['_id'])  # Đảm bảo _id là chuỗi để trả về JSON hợp lệ

        # Serialize dữ liệu và trả về
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            new_category = {'name': serializer.validated_data['name']}
            result = db.categories.insert_one(new_category)
            new_category['_id'] = str(result.inserted_id)
            return Response(CategorySerializer(new_category).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryDetailView(APIView):
    def get(self, request, pk):
        category = get_object(db.categories, pk)
        if not category:
            return Response({'error': 'Không tìm thấy danh mục!'}, status=status.HTTP_404_NOT_FOUND)
        category['_id'] = str(category['_id'])
        serializer = CategorySerializer(category)
        return Response(serializer.data)

    def put(self, request, pk):
        category = get_object(db.categories, pk)
        if not category:
            return Response({'error': 'Không tìm thấy danh mục!'}, status=status.HTTP_404_NOT_FOUND)
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            updated_category = {'name': serializer.validated_data['name']}
            db.categories.update_one({'_id': ObjectId(pk)}, {'$set': updated_category})
            updated_category['_id'] = pk
            return Response(CategorySerializer(updated_category).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        category = get_object(db.categories, pk)
        if not category:
            return Response({'error': 'Không tìm thấy danh mục!'}, status=status.HTTP_404_NOT_FOUND)
        db.categories.delete_one({'_id': ObjectId(pk)})
        return Response({'message': 'Xóa danh mục thành công.'}, status=status.HTTP_204_NO_CONTENT)