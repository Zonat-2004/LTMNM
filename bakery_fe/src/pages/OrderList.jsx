import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/orders/');
        setOrders(res.data);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', err);
        setError('Không thể tải danh sách đơn hàng.');
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  };

  const getOrderStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Đang xử lý';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'shipping':
        return 'Đang giao hàng';
      case 'shipped':
        return 'Đã giao hàng';
      case 'delivered':
        return 'Đã nhận hàng';
      case 'cancelled':
        return 'Đã huỷ';
      default:
        return 'Không xác định';
    }
  };

  const getProductNames = (items) => {
    return items.map((item) => item.cake.name).join(', ');
  };

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary mb-4">📋 Danh sách đơn hàng</h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      <div className="row">
        {orders.map((order) => (
          <div className="col-md-4 mb-4" key={order._id}>
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Mã đơn: {order._id}</h5>
                <p className="card-text">Sản phẩm: {getProductNames(order.items)}</p>
                <p className="card-text">Ngày đặt: {formatDate(order.created_at)}</p>
                <p className="card-text">Giá tiền: {order.total_order_price.toLocaleString()} VND</p>
                <p className="card-text">
                  Trạng thái: <strong>{getOrderStatusText(order.order_status)}</strong>
                </p>
                <Link to={`/orders/${order._id}`} className="btn btn-info btn-block">
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;
