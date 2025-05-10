import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminCartPage = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/orders/')
            .then(response => {
                console.log('Dữ liệu đơn hàng:', response.data);
                setOrders(response.data);
            })
            .catch(error => {
                console.error('Lỗi khi tải đơn hàng:', error);
            });
    }, []);

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
                        <div className="card-header bg-info text-white">
                            <h5>🧾 Đơn hàng #{index + 1}</h5>
                        </div>
                        <div className="card-body">
                            <p><strong>👤 Người nhận:</strong> {order.shipping_address.recipient_name}</p>
                            <p><strong>📞 SĐT:</strong> {order.shipping_address.phone}</p>
                            <p><strong>📍 Địa chỉ:</strong> {order.shipping_address.address}</p>
                            <p><strong>💳 Thanh toán:</strong> {order.payment_method === 'cod' ? 'Thanh toán khi nhận hàng' : order.payment_method}</p>
                            <p><strong>📅 Ngày đặt:</strong> {new Date(order.created_at).toLocaleString()}</p>

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
                                <span className={`ms-2 badge bg-${order.order_status === 'pending' ? 'secondary' : 'success'}`}>
                                    {order.order_status === 'pending' ? 'Đang xử lý' : order.order_status}
                                </span>
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default AdminCartPage;
