from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
import datetime
from cakeAPI.database import db
from cakeAPI.serializers import OrderSerializer

orders_collection = db["orders"]

class OrderListCreateView(APIView):
    def get(self, request):
        """Lấy danh sách tất cả đơn hàng"""
        orders = list(orders_collection.find())
        for order in orders:
            order["_id"] = str(order["_id"])
            order["user_id"] = str(order["user_id"])
            order["created_at"] = order["created_at"].isoformat()
            for item in order["items"]:
                item["cake_id"] = str(item["cake_id"])
        return Response(orders, status=status.HTTP_200_OK)

    def post(self, request):
        """Tạo mới đơn hàng"""
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            new_order = {
                "user_id": ObjectId(data["user_id"]),
                "total_price": data["total_price"],
                "status": data.get("status", "Pending"),
                "created_at": datetime.datetime.utcnow(),
                "items": []
            }

            for item in data["items"]:
                new_order["items"].append({
                    "cake_id": ObjectId(item["cake_id"]),
                    "name": item["name"],
                    "quantity": item["quantity"],
                    "price": item["price"]
                })

            inserted = orders_collection.insert_one(new_order)
            return Response({
                "message": "Đơn hàng đã được tạo",
                "order_id": str(inserted.inserted_id)
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)