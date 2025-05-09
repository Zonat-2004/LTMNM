import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/order/${orderId}`);
        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi lấy thông tin đơn hàng:', error);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Hàm kiểm tra giá trị trước khi gọi toLocaleString
  const formatCurrency = (value) => {
    return value && !isNaN(value) ? value.toLocaleString() : '0';
  };

  if (loading) return <div>Đang tải...</div>;

  if (!order) return <div>Không tìm thấy đơn hàng này.</div>;

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary mb-4">Chi tiết đơn hàng #{order.order_id}</h2>
      <div className="row">
        <div className="col-md-8">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Hình ảnh</th>
                <th>Tên bánh</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tổng</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.cake._id}>
                  <td>
                    <img src={`http://localhost:8000${item.cake.image}`} alt={item.cake.name} style={{ maxWidth: '50px' }} />
                  </td>
                  <td>{item.cake.name}</td>
                  <td>{formatCurrency(item.cake.price)} VND</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.cake.price * item.quantity)} VND</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-md-4">
          <h4>Thông tin đơn hàng</h4>
          <p><strong>Ngày đặt:</strong> {new Date(order.created_at).toLocaleString()}</p>
          <p><strong>Tổng tiền:</strong> {formatCurrency(order.total_order_price)} VND</p>
          <p><strong>Trạng thái:</strong> {order.order_status}</p>
          <p><strong>Phương thức thanh toán:</strong> {order.payment_method}</p>
          <p><strong>Địa chỉ giao hàng:</strong> {order.shipping_address.address}</p>
          <p><strong>Số điện thoại:</strong> {order.shipping_address.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
