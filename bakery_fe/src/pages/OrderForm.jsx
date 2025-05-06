import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import qrImage from '../assets/qr.jpg';

const OrderForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart;

  const [cartItems, setCartItems] = useState(cart || []);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    address: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate('/cakelist');
    }
  }, [cart, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleQuantityChange = (index, value) => {
    const updated = [...cartItems];
    updated[index].quantity = value;
    setCartItems(updated);
  };

  const handleRemoveItem = (id) => {
    const updated = cartItems.filter(item => item._id !== id);
    setCartItems(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInfo.name || !userInfo.email || !userInfo.address) {
      setMessage('❌ Vui lòng điền đầy đủ thông tin.');
      return;
    }

    // Gửi dữ liệu về API tại đây nếu cần...

    setMessage(`🎉 Đơn hàng thành công! Thanh toán: ${paymentMethod === 'cod' ? 'Khi nhận hàng' : 'Mã QR'}`);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary mb-4">🛍️ Đặt Hàng</h2>

      {cartItems.length === 0 ? (
        <div className="alert alert-danger text-center">
          🛑 Không có sản phẩm trong giỏ hàng.
        </div>
      ) : (
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((cake, index) => (
                  <tr key={cake._id}>
                    <td>
                      <img
                        src={`http://localhost:8000${cake.image}`}
                        alt={cake.name}
                        className="img-fluid"
                        style={{ maxWidth: '50px', height: 'auto' }}
                      />
                    </td>
                    <td>{cake.name}</td>
                    <td>{cake.price.toLocaleString()} VND</td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={cake.quantity}
                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                        min="1"
                        style={{ width: '80px' }}
                      />
                    </td>
                    <td>{(cake.price * cake.quantity).toLocaleString()} VND</td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleRemoveItem(cake._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="col-md-4">
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

      <div className="text-center mt-4">
        <h4 className="text-success">Tổng tiền: {getTotalPrice().toLocaleString()} VND</h4>
      </div>
    </div>
  );
};

export default OrderForm;
