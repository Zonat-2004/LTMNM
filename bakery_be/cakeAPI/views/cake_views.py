from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from bson import ObjectId
from ..serializers import CakeSerializer
from ..database import db, get_object
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

class CakeListView(APIView):
    def get(self, request):
        search_query = request.GET.get('search', '')  # Lấy từ khóa tìm kiếm từ query params

        # Lấy danh sách bánh từ database, nếu có từ khóa tìm kiếm thì lọc theo tên bánh
        if search_query:
            cakes_query = db.cakes.find({
                "name": {"$regex": search_query, "$options": "i"}  # Tìm kiếm không phân biệt chữ hoa, chữ thường
            })
        else:
            cakes_query = db.cakes.find()  # Nếu không có tìm kiếm, lấy tất cả bánh

        # Chuyển đổi các ObjectId thành string
        cakes = list(cakes_query)
        for cake in cakes:
            cake['_id'] = str(cake['_id'])
            cake['category_id'] = str(cake['category_id'])
            cake['category'] = cake['category_id']  # Thêm category vào kết quả trả về
            category = db.categories.find_one({'_id': ObjectId(cake['category_id'])})
            cake['category_name'] = category['name'] if category else None

        # Serialize dữ liệu và trả về
        serializer = CakeSerializer(cakes, many=True)
        return Response(serializer.data)
    
    def post(self, request, *args, **kwargs):
        serializer = CakeSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            image = validated_data.pop('image', None)
            if image:
                saved_path = default_storage.save(f'cakes/{image.name}', ContentFile(image.read()))
                validated_data['image'] = saved_path
            validated_data['category_id'] = validated_data.pop('category')
            result = db.cakes.insert_one(validated_data)
            validated_data['_id'] = str(result.inserted_id)
            validated_data['category_id'] = str(validated_data['category_id'])

            # --- thêm dòng này: đưa lại 'category' để CakeSerializer không lỗi ---
            validated_data['category'] = validated_data['category_id']
            return Response(CakeSerializer(validated_data).data, status=status.HTTP_201_CREATED)
        print("Serializer errors:", serializer.errors)  # Log lỗi chi tiết
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True  # ← cho phép cập nhật 1 phần
        return super().update(request, *args, **kwargs)

# class CakeCreateView(APIView):
#     parser_classes = [MultiPartParser, FormParser]

#     def post(self, request, *args, **kwargs):
#         serializer = CakeSerializer(data=request.data)
#         if serializer.is_valid():
#             validated_data = serializer.validated_data
#             image = validated_data.pop('image', None)
#             if image:
#                 saved_path = default_storage.save(f'cakes/{image.name}', ContentFile(image.read()))
#                 validated_data['image'] = saved_path
#             validated_data['category_id'] = validated_data.pop('category')
#             result = db.cakes.insert_one(validated_data)
#             validated_data['_id'] = str(result.inserted_id)
#             validated_data['category_id'] = str(validated_data['category_id'])
#             return Response(CakeSerializer(validated_data).data, status=status.HTTP_201_CREATED)
#         print("Serializer errors:", serializer.errors)  # Log lỗi chi tiết
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CakeDetailView(APIView):
    def get(self, request, pk):
        cake = get_object(db.cakes, pk)
        if not cake:
            return Response({'error': 'Không tìm thấy bánh kem!'}, status=status.HTTP_404_NOT_FOUND)
        cake['_id'] = str(cake['_id'])
        cake['category_id'] = str(cake['category_id'])
        cake['category'] = cake['category_id']
        category = db.categories.find_one({'_id': ObjectId(cake['category_id'])})
        cake['category_name'] = category['name'] if category else None
        serializer = CakeSerializer(cake)
        return Response(serializer.data)

    def put(self, request, pk):
        cake = get_object(db.cakes, pk)
        if not cake:
            return Response({'error': 'Không tìm thấy bánh kem!'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CakeSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            image = validated_data.pop('image', None)
            if image:
                saved_path = default_storage.save(f'cakes/{image.name}', ContentFile(image.read()))
                validated_data['image'] = saved_path
            validated_data['category_id'] = validated_data.pop('category')
            db.cakes.update_one({'_id': ObjectId(pk)}, {'$set': validated_data})
            validated_data['_id'] = pk
            validated_data['category_id'] = str(validated_data['category_id'])
            return Response(CakeSerializer(validated_data).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        cake = get_object(db.cakes, pk)
        if not cake:
            return Response({'error': 'Không tìm thấy bánh kem!'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CakeSerializer(cake, data=request.data, partial=True)  # Thêm partial=True để chỉ cập nhật các field gửi lên
        if serializer.is_valid():
            validated_data = serializer.validated_data
            image = validated_data.pop('image', None)
            if image:
                saved_path = default_storage.save(f'cakes/{image.name}', ContentFile(image.read()))
                validated_data['image'] = saved_path
            validated_data['category_id'] = validated_data.pop('category')
            db.cakes.update_one({'_id': ObjectId(pk)}, {'$set': validated_data})
            validated_data['_id'] = pk
            validated_data['category_id'] = str(validated_data['category_id'])
            return Response(CakeSerializer(validated_data).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        cake = get_object(db.cakes, pk)
        if not cake:
            return Response({'error': 'Không tìm thấy bánh kem!'}, status=status.HTTP_404_NOT_FOUND)
        db.cakes.delete_one({'_id': ObjectId(pk)})
        return Response({'message': 'Xóa bánh kem thành công.'}, status=status.HTTP_204_NO_CONTENT)
