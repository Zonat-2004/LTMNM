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
    parser_classes = [MultiPartParser, FormParser]
    
    def get(self, request):
        cakes = list(db.cakes.find())
        for cake in cakes:
            cake['_id'] = str(cake['_id'])
            cake['category_id'] = str(cake['category_id'])
            cake['category'] = cake['category_id']        # ← thêm dòng này
            category = db.categories.find_one({'_id': ObjectId(cake['category_id'])})
            cake['category_name'] = category['name'] if category else None
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
        cake['category']    = cake['category_id']      # ← thêm dòng này!
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

    def delete(self, request, pk):
        cake = get_object(db.cakes, pk)
        if not cake:
            return Response({'error': 'Không tìm thấy bánh kem!'}, status=status.HTTP_404_NOT_FOUND)
        db.cakes.delete_one({'_id': ObjectId(pk)})
        return Response({'message': 'Xóa bánh kem thành công.'}, status=status.HTTP_204_NO_CONTENT)