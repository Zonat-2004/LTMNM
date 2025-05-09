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

# Hàm chuyển đổi ObjectId thành chuỗi
def convert_objectid(obj):
    if isinstance(obj, dict):
        return {k: convert_objectid(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_objectid(i) for i in obj]
    elif isinstance(obj, ObjectId):
        return str(obj)
    else:
        return obj

# API lấy danh sách đơn hàng
class OrderListView(APIView):
    def get(self, request):
        try:
            orders = list(orders_collection.find())
            orders = [convert_objectid(order) for order in orders]  # Chuyển đổi toàn bộ dữ liệu
            serializer = OrderSerializer(orders, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# API tạo đơn hàng mới
class OrderCreateView(APIView):
    def post(self, request):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            try:
                order_data = serializer.validated_data
                order_id = orders_collection.insert_one(order_data).inserted_id
                return Response({"message": "Đơn hàng đã được tạo thành công!", "order_id": str(order_id)},
                                status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
