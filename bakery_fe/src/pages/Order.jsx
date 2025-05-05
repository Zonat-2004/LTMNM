import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);

  // Lấy danh sách đơn hàng
  useEffect(() => {
    axios.get('http://localhost:8000/api/orders/')
      .then((res) => setOrders(res.data))
      .catch((err) => console.error('Lỗi khi lấy đơn hàng:', err));
  }, []);

  // Xóa đơn hàng
  const handleDeleteOrder = (id) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này không?');
    if (!confirmDelete) return;

    axios.delete(`http://localhost:8000/api/orders/${id}/`)
      .then(() => {
        setOrders(orders.filter((order) => order._id !== id));
      })
      .catch((err) => console.error('Lỗi khi xóa đơn hàng:', err));
  };

  // Sửa đơn hàng
  const handleEditOrder = (id) => {
    const orderToEdit = orders.find((order) => order._id === id);
    setEditingOrder(orderToEdit);
  };

  // Cập nhật đơn hàng
  const handleUpdateOrder = () => {
    if (!editingOrder) return;

    axios.put(`http://localhost:8000/api/orders/${editingOrder._id}/`, {
      status: editingOrder.status
    })
    .then((res) => {
      setOrders(orders.map((order) => 
        order._id === editingOrder._id ? res.data : order
      ));
      setEditingOrder(null); // Đóng form sửa sau khi cập nhật
    })
    .catch((err) => console.error('Lỗi khi cập nhật đơn hàng:', err));
  };

  return (
    <div className="container py-5">
      <h2 className="text-center text-danger mb-4">📦 Danh sách đơn hàng</h2>

      {/* Bảng danh sách đơn hàng */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-danger">
            <tr>
              <th>ID</th>
              <th>ID người dùng</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user_id}</td>
                  <td>{order.total_price}</td>
                  <td>{order.status}</td>
                  <td>{order.created_at}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEditOrder(order._id)}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => handleDeleteOrder(order._id)}
                    >
                      🗑️ Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">Không có đơn hàng nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form sửa đơn hàng */}
      {editingOrder && (
        <div className="mt-4">
          <h4>Sửa đơn hàng</h4>
          <input
            type="text"
            className="form-control"
            value={editingOrder.status}
            onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value })}
          />
          <button className="btn btn-primary mt-2" onClick={handleUpdateOrder}>
            ✅ Cập nhật
          </button>
          <button className="btn btn-secondary mt-2 ms-2" onClick={() => setEditingOrder(null)}>
            ❌ Hủy
          </button>
        </div>
      )}

      <style jsx>{`
        .table th, .table td {
          text-align: center;
          vertical-align: middle;
        }

        .table-danger {
          background-color: #ffccd5;
        }

        .btn {
          border-radius: 8px;
        }

        .container {
          max-width: 1200px;
        }
      `}</style>
    </div>
  );
};

export default Order;
