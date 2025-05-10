import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/order/${orderId}/`);
        setOrder(res.data);
      } catch (err) {
        console.error('Lỗi khi lấy đơn hàng:', err);
        setError('Không tìm thấy đơn hàng.');
      }
    };

    fetchOrder();
  }, [orderId]);

  const formatDateToVietnam = (isoDate) => {
    const date = new Date(isoDate);
    const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' };
    return {
      date: date.toLocaleDateString('vi-VN', optionsDate),
      time: date.toLocaleTimeString('vi-VN', optionsTime),
    };
  };

  const getOrderStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đã giao hàng';
      case 'delivered':
        return 'Đã nhận hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const handleCancelOrder = async () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
      try {
        await axios.patch(`http://localhost:8000/api/order/${order._id}/`, {
          order_status: 'cancelled',
        });
        alert('Đơn hàng đã được hủy');
        // Cập nhật lại trạng thái hiển thị
        setOrder(prev => ({ ...prev, order_status: 'cancelled' }));
      } catch (error) {
        console.error('Lỗi khi hủy đơn hàng:', error);
        alert('Không thể hủy đơn hàng. Vui lòng thử lại sau.');
      }
    }
  };

  if (error) {
    return <div className="alert alert-danger text-center mt-4">{error}</div>;
  }

  if (!order) {
    return <div className="text-center mt-4">Đang tải đơn hàng...</div>;
  }

  const { date, time } = formatDateToVietnam(order.created_at);

  return (
    <div className="container py-5">
      <button className="btn btn-outline-primary mb-3" onClick={() => navigate('/orders')}>
        ⬅️ Quay lại danh sách đơn hàng
      </button>

      <h2 className="text-center text-primary mb-4">📦 Chi tiết đơn hàng</h2>

      <div className="card shadow p-4">
        <h5>🆔 Mã đơn: {order._id}</h5>
        <p>👤 Người nhận: {order.shipping_address.recipient_name}</p>
        <p>📍 Địa chỉ: {order.shipping_address.address}</p>
        <p>📞 SĐT: {order.shipping_address.phone}</p>
        <p>💳 Thanh toán: {order.payment_method === 'cod' ? 'Thanh toán khi nhận hàng' : 'QR Code'}</p>
        <p>📅 Ngày đặt:</p>
        <ul>
          <li>Ngày: {date}</li>
          <li>Giờ: {time}</li>
        </ul>
        <p>🚚 Trạng thái: <strong>{getOrderStatusText(order.order_status)}</strong></p>

        <h5 className="mt-4">🧁 Danh sách sản phẩm:</h5>
        <table className="table table-bordered table-striped">
          <thead className="table-secondary">
            <tr>
              <th>Hình ảnh</th>
              <th>Tên bánh</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Tổng</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td>
                  <img
                    src={`http://localhost:8000${item.cake.image}`}
                    alt={item.cake.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                </td>
                <td>{item.cake.name}</td>
                <td>{item.cake.price.toLocaleString()} VND</td>
                <td>{item.quantity}</td>
                <td>{(item.quantity * item.cake.price).toLocaleString()} VND</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h4 className="text-end text-success mt-3">
          🧾 Tổng tiền: {order.total_order_price.toLocaleString()} VND
        </h4>
      </div>

      {/* Thêm nút hủy đơn ở dưới */}
      {order.order_status === 'pending' && (
        <div className="text-center mt-4">
          <button className="btn btn-danger" onClick={handleCancelOrder}>
            Hủy đơn
          </button>
        </div>
      )}

      <div className="text-center mt-4">
        <button className="btn btn-outline-primary" onClick={() => navigate('/orders')}>
          ⬅️ Quay lại danh sách đơn hàng
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
