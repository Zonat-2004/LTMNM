import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import qrImage from '../assets/qr.jpg'; // điều chỉnh đường dẫn tùy theo vị trí file


const OrderForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cake = location.state?.cake;

  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    address: ''
  });
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!cake) {
      navigate('/cakelist');
    }
  }, [cake, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInfo.name || !userInfo.email || !userInfo.address) {
      setMessage('❌ Vui lòng điền đầy đủ thông tin.');
      return;
    }
    setMessage(`🎉 Đơn hàng thành công! Thanh toán: ${paymentMethod === 'cod' ? 'Khi nhận hàng' : 'Mã QR'}`);
  };

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary mb-4">🛍️ Đặt Hàng</h2>

      {!cake ? (
        <div className="alert alert-danger text-center">
          🛑 Không tìm thấy sản phẩm.
        </div>
      ) : (
        <div className="row g-4">
          {/* Cột trái - Thông tin sản phẩm */}
          <div className="col-md-6">
            <div className="card shadow-sm border-0 h-100">
              <img
                src={`http://localhost:8000${cake.image}`}
                alt={cake.name}
                className="card-img-top rounded-top"
                style={{ maxHeight: '300px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title text-danger">{cake.name}</h5>
                <p className="card-text">{cake.description}</p>
                <p className="fw-bold mb-1">Đơn giá: {cake.price.toLocaleString()} VND</p>
                <p className="mb-1">Số lượng: {quantity}</p>
                <p className="fw-bold">Tổng tiền: {(cake.price * quantity).toLocaleString()} VND</p>
              </div>
            </div>
          </div>

          {/* Cột phải - Thông tin khách hàng */}
          <div className="col-md-6">
            <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
              <div className="mb-3">
                <label className="form-label">Họ và Tên</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={userInfo.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={userInfo.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Địa chỉ</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={userInfo.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Số lượng</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phương thức thanh toán</label>
                <select
                  className="form-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="cod">Thanh toán khi nhận hàng</option>
                  <option value="qr">Mã QR</option>
                </select>
              </div>

              {paymentMethod === 'qr' && (
  <div className="text-center my-3">
    <p className="text-muted mb-2">Vui lòng quét mã QR để thanh toán:</p>
    <img
      src={qrImage}
      alt="Mã QR thanh toán"
      className="border rounded shadow-sm"
      style={{ maxWidth: '200px' }}
    />
  </div>
)}

              <div className="d-grid mt-4">
                <button type="submit" className="btn btn-primary">
                  ✅ Đặt hàng
                </button>
              </div>

              {message && (
                <div className="alert alert-success text-center mt-3">
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderForm;
