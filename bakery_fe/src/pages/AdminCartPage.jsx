import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminCartPage = () => {
    const [orders, setOrders] = useState([]);
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    // Lấy danh sách đơn hàng
    const fetchOrders = () => {
        axios.get('http://localhost:8000/api/orders/')
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => {
                console.error('Lỗi khi tải đơn hàng:', error);
            });
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Cập nhật trạng thái đơn hàng
    const handleUpdateStatus = (orderId, status) => {
        axios.patch(`http://localhost:8000/api/orders/${orderId}/update-status/`, {
            order_status: status
        })
        .then(() => {
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, order_status: status } : order
                )
            );
            setEditingOrderId(null); // Ẩn dropdown sau khi cập nhật
        })
        .catch(error => {
            console.error('Lỗi cập nhật trạng thái:', error);
        });
    };

    // Xóa đơn hàng với xác nhận
    const handleDeleteOrder = (orderId) => {
        const isConfirmed = window.confirm("Bạn có chắc muốn xóa đơn hàng này?");
        if (isConfirmed) {
            axios.delete(`http://localhost:8000/api/orders/${orderId}/delete/`)
                .then(() => {
                    // Cập nhật lại danh sách đơn hàng sau khi xóa
                    setOrders(prev => prev.filter(order => order._id !== orderId));
                    alert('Đơn hàng đã được xóa thành công!');
                })
                .catch(error => {
                    console.error('Lỗi khi xóa đơn hàng:', error);
                });
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">📦 Danh sách đơn hàng</h1>

            {orders.length === 0 ? (
                <div className="alert alert-danger text-center">
                    Không có đơn hàng nào.
                </div>
            ) : (
                orders.map((order, index) => (
                    <div key={index} className="card mb-4">
                        <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">🧾 Đơn hàng #{index + 1}</h5>
                        </div>
                        <div className="card-body">
                            <p><strong>👤 Người nhận:</strong> {order.shipping_address.recipient_name}</p>
                            <p><strong>📞 SĐT:</strong> {order.shipping_address.phone}</p>
                            <p><strong>📍 Địa chỉ:</strong> {order.shipping_address.address}</p>
                            <p><strong>💳 Thanh toán:</strong> {order.payment_method === 'cod' ? 'Thanh toán khi nhận hàng' : order.payment_method}</p>
                            <p><strong>📅 Ngày đặt:</strong> {new Date(order.created_at).toLocaleString('vi-VN')}</p>

                            <table className="table table-bordered text-center mt-3">
                                <thead className="table-warning">
                                    <tr>
                                        <th>Tên bánh</th>
                                        <th>Ảnh</th>
                                        <th>Giá</th>
                                        <th>Số lượng</th>
                                        <th>Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item, i) => (
                                        <tr key={i}>
                                            <td>{item.cake.name}</td>
                                            <td>
                                                <img
                                                    src={`http://localhost:8000${item.cake.image}`}
                                                    alt={item.cake.name}
                                                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                                                />
                                            </td>
                                            <td>{item.cake.price.toLocaleString()} VND</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.total_price.toLocaleString()} VND</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="text-end">
                                <strong>Tổng tiền đơn hàng: </strong>
                                <span className="text-danger fw-bold">
                                    {order.total_order_price.toLocaleString()} VND
                                </span>
                            </div>

                            <p className="mt-2">
                                <strong>🚚 Trạng thái:</strong>
                                <span className={`ms-2 badge ${
                                    order.order_status === 'pending' ? 'bg-secondary' :
                                    order.order_status === 'confirmed' ? 'bg-primary' :
                                    order.order_status === 'shipping' ? 'bg-warning text-dark' :
                                    order.order_status === 'delivered' ? 'bg-success' :
                                    order.order_status === 'cancelled' ? 'bg-danger' :
                                    'bg-dark'
                                }`}>
                                    { {
                                        pending: 'Đang xử lý',
                                        confirmed: 'Đã xác thực',
                                        shipping: 'Đang giao hàng',
                                        delivered: 'Đã giao hàng',
                                        cancelled: 'Đã huỷ'
                                    }[order.order_status] || 'Không xác định'}
                                </span>
                            </p>

                            {/* Nút sửa trạng thái */}
                            {editingOrderId !== order._id ? (
                                <button
                                    className="btn btn-outline-warning w-100 mt-3 d-flex align-items-center justify-content-center fw-bold"
                                    style={{ fontSize: '1.1rem', transition: 'all 0.3s' }}
                                    onClick={() => {
                                        setEditingOrderId(order._id);
                                        setNewStatus(order.order_status);
                                    }}
                                >
                                    ✏️ <span className="ms-2">Chỉnh sửa trạng thái</span>
                                </button>
                            ) : (
                                <div className="d-flex flex-wrap align-items-center mt-3 gap-2">
                                    <select
                                        className="form-select"
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        style={{ maxWidth: '220px', flex: '1 1 auto' }}
                                    >
                                        <option value="pending">Đang xử lý</option>
                                        <option value="confirmed">Đã xác thực</option>
                                        <option value="shipping">Đang giao hàng</option>
                                        <option value="delivered">Đã giao hàng</option>
                                        <option value="cancelled">Đã huỷ</option>
                                    </select>
                                    <button
                                        className="btn btn-success fw-bold"
                                        onClick={() => handleUpdateStatus(order._id, newStatus)}
                                    >
                                        💾 Lưu
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setEditingOrderId(null)}
                                    >
                                        ❌ Hủy
                                    </button>
                                </div>
                            )}

                            {/* Nút xóa đơn hàng */}
                            <button
                                className="btn btn-outline-danger w-100 mt-3 d-flex align-items-center justify-content-center fw-bold"
                                style={{ fontSize: '1.1rem', transition: 'all 0.3s' }}
                                onClick={() => handleDeleteOrder(order._id)}
                            >
                                🗑️ <span className="ms-2">Xóa đơn hàng này</span>
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default AdminCartPage;
