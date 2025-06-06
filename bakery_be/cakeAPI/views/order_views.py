from pymongo import MongoClient
from bson import ObjectId
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers import OrderSerializer

# Kết nối MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client.QuanLyWebBanBanh
orders_collection = db.orders

# Hàm chuyển ObjectId -> str
def convert_objectid(obj):
    if isinstance(obj, dict):
        return {k: convert_objectid(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_objectid(i) for i in obj]
    elif isinstance(obj, ObjectId):
        return str(obj)
    else:
        return obj

# ✅ Lấy danh sách đơn hàng
class OrderListView(APIView):
    def get(self, request):
        try:
            orders = list(orders_collection.find())
            orders = [convert_objectid(order) for order in orders]
            serializer = OrderSerializer(orders, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ✅ Tạo đơn hàng mới
class OrderCreateView(APIView):
    def post(self, request):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            try:
                order_data = serializer.validated_data
                order_id = orders_collection.insert_one(order_data).inserted_id
                return Response({
                    "message": "Đơn hàng đã được tạo thành công!",
                    "order_id": str(order_id)
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Lấy chi tiết đơn hàng
class OrderDetailView(APIView):
    def get(self, request, order_id):
        try:
            order = orders_collection.find_one({'_id': ObjectId(order_id)})
            if order:
                order = convert_objectid(order)
                serializer = OrderSerializer(order)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Không tìm thấy đơn hàng'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ✅ Cập nhật trạng thái đơn hàng
class OrderStatusUpdateView(APIView):
    def patch(self, request, order_id):
        try:
            data = request.data
            if 'order_status' not in data:
                return Response({'error': 'Thiếu trường order_status'}, status=status.HTTP_400_BAD_REQUEST)

            result = orders_collection.update_one(
                {'_id': ObjectId(order_id)},
                {'$set': {'order_status': data['order_status']}}
            )

            if result.modified_count == 1:
                return Response({'message': 'Cập nhật trạng thái thành công'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Không thể cập nhật đơn hàng'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class OrderDeleteView(APIView):
    def delete(self, request, order_id):
        try:
            result = orders_collection.delete_one({'_id': ObjectId(order_id)})
            
            if result.deleted_count == 1:
                return Response({'message': 'Đơn hàng đã được xóa thành công'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Không tìm thấy đơn hàng để xóa'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
