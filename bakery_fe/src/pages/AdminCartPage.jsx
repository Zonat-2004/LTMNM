import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminCartPage() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/api/carts/')
      .then(res => {
        if (Array.isArray(res.data)) {
          setCarts(res.data);
        } else {
          setCarts([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi khi tải đơn hàng:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>📦 Danh sách đơn hàng</h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>Đang tải dữ liệu...</p>
      ) : carts.length === 0 ? (
        <p style={{ textAlign: "center", fontStyle: "italic" }}>Không có đơn hàng nào.</p>
      ) : (
        carts.map((cart, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              padding: "1.5rem",
              marginBottom: "1.5rem",
              backgroundColor: "#fefefe"
            }}
          >
            <p><strong>👤 Người dùng:</strong> {cart.user_id}</p>
            <p><strong>📅 Ngày tạo:</strong> {new Date(cart.created_at).toLocaleString('vi-VN', {
  timeZone: 'Asia/Ho_Chi_Minh'
})}</p>
            <p><strong>💰 Tổng tiền:</strong> {cart.total_cart_price?.toLocaleString()} VND</p>
            <p><strong>🛒 Số lượng sản phẩm:</strong> {cart.items_count}</p>

            <h4 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>📋 Chi tiết sản phẩm:</h4>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f0f0f0" }}>
                  <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Tên bánh</th>
                  <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Số lượng</th>
                  <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(cart.items) ? (
                  cart.items.map((item, i) => (
                    <tr key={i}>
                      <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{item.cake_name || "Không rõ"}</td>
                      <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{item.quantity}</td>
                      <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{item.total_price?.toLocaleString()} VND</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ padding: "0.5rem", textAlign: "center" }}>Không có sản phẩm</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminCartPage;
