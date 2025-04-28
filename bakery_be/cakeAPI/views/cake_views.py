from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from ..serializers import CakeSerializer
from ..database import db, get_object
from django.core.files.storage import default_storage      
from django.core.files.base import ContentFile              

class CakeListView(APIView):
    def get(self, request):
        cakes = list(db.cakes.find())
        for cake in cakes:
            cake['_id'] = str(cake['_id'])
            cake['category_id'] = str(cake['category_id'])
            category = db.categories.find_one({'_id': ObjectId(cake['category_id'])})
            cake['category_name'] = category['name'] if category else None
        serializer = CakeSerializer(cakes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CakeSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            new_cake = {
                'name': data['name'],
                'description': data['description'],
                'price': data['price'],
                'image': data['image'],
                'category_id': ObjectId(data['category_id'])
            }
            result = db.cakes.insert_one(new_cake)
            new_cake['_id'] = str(result.inserted_id)
            new_cake['category_id'] = str(new_cake['category_id'])
            return Response(CakeSerializer(new_cake).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CakeDetailView(APIView):
    def get(self, request, pk):
        cake = get_object(db.cakes, pk)
        if not cake:
            return Response({'error': 'Không tìm thấy bánh kem!'}, status=status.HTTP_404_NOT_FOUND)
        cake['_id'] = str(cake['_id'])
        cake['category_id'] = str(cake['category_id'])
        category = db.categories.find_one({'_id': ObjectId(cake['category_id'])})
        cake['category_name'] = category['name'] if category else None
        serializer = CakeSerializer(cake)
        return Response(serializer.data)

    def put(self, request, pk):
        # 2. Lấy document cũ
        cake = get_object(db.cakes, pk)
        if not cake:
            return Response({'error': 'Không tìm thấy bánh kem!'}, status=status.HTTP_404_NOT_FOUND)

        # 3. Lấy các field text
        name        = request.data.get('name')
        description = request.data.get('description')
        price       = request.data.get('price')
        category_id = ObjectId(request.data.get('category_id'))

        # 4. Xử lý ảnh mới (nếu có)
        if 'image' in request.FILES:
            img = request.FILES['image']
            # lưu file vào media/cakes/
            saved_path = default_storage.save(f'cakes/{img.name}', ContentFile(img.read()))
            image = saved_path  # đường dẫn tương đối, sẽ là e.g. "cakes/foo.jpg"
        else:
            # nếu không có file mới, giữ nguyên ảnh cũ
            image = request.data.get('image', cake.get('image'))

        # 5. Update MongoDB
        updated = {
            'name': name,
            'description': description,
            'price': price,
            'image': image,
            'category_id': category_id
        }
        db.cakes.update_one({'_id': ObjectId(pk)}, {'$set': updated})

        # 6. Convert về string id để return
        updated['_id']         = pk
        updated['category_id'] = str(category_id)

        return Response(CakeSerializer(updated).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        cake = get_object(db.cakes, pk)
        if not cake:
            return Response({'error': 'Không tìm thấy bánh kem!'}, status=status.HTTP_404_NOT_FOUND)
        db.cakes.delete_one({'_id': ObjectId(pk)})
        return Response({'message': 'Xóa bánh kem thành công.'}, status=status.HTTP_204_NO_CONTENT)
    
class CakeCreateView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = CakeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)