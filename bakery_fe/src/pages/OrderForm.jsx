import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import qrImage from '../assets/qr.jpg';

const OrderForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasAlertedRef = useRef(false); // 🔒 Đảm bảo chỉ cảnh báo 1 lần

  const [cartItems, setCartItems] = useState([]);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    address: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [message, setMessage] = useState('');

  // ✅ Kiểm tra đăng nhập
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      if (!hasAlertedRef.current) {
        hasAlertedRef.current = true;
        alert('⚠️ Bạn cần đăng nhập để đặt hàng!');
        navigate('/login');
      }
    } else {
      const parsedUser = JSON.parse(user);
      setUserInfo({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        address: ''
      });
    }
  }, [navigate]);

  // ✅ Load sản phẩm từ location
  useEffect(() => {
    const cake = location.state?.cake;
    const cart = location.state?.cart;

    if (cake) {
      setCartItems([{ ...cake, quantity: 1 }]);
    } else if (cart?.length > 0) {
      setCartItems(cart);
    } else {
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
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

    const { name, email, address } = userInfo;
    if (!name || !email || !address) {
      setMessage('❌ Vui lòng điền đầy đủ thông tin.');
      return;
    }

    // TODO: Gửi dữ liệu đơn hàng tới API backend nếu cần
    console.log('Đơn hàng gửi:', {
      userInfo,
      paymentMethod,
      cartItems
    });

    setMessage(`🎉 Đặt hàng thành công! Thanh toán: ${paymentMethod === 'cod' ? 'Khi nhận hàng' : 'Mã QR'}`);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary mb-4">🛍️ Đặt Hàng</h2>

      {cartItems.length === 0 ? (
        <div className="alert alert-danger text-center">🛑 Không có sản phẩm trong giỏ hàng.</div>
      ) : (
        <div className="row">
          {/* Danh sách sản phẩm */}
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
                        style={{ maxWidth: '50px' }}
                      />
                    </td>
                    <td>{cake.name}</td>
                    <td>{cake.price.toLocaleString()} VND</td>
                    <td>
                      <input
                        type="number"
                        value={cake.quantity}
                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                        min="1"
                        className="form-control"
                        style={{ width: '80px' }}
                      />
                    </td>
                    <td>{(cake.price * cake.quantity).toLocaleString()} VND</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleRemoveItem(cake._id)}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Thông tin đặt hàng */}
          <div className="col-md-4">
            <form onSubmit={handleSubmit} className="p-4 border rounded bg-light shadow-sm">
              <div className="mb-3">
                <label className="form-label">Họ và Tên</label>
                <input type="text" name="name" value={userInfo.name} onChange={handleChange} required className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" name="email" value={userInfo.email} onChange={handleChange} required className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Địa chỉ</label>
                <input type="text" name="address" value={userInfo.address} onChange={handleChange} required className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Phương thức thanh toán</label>
                <select className="form-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <option value="cod">Thanh toán khi nhận hàng</option>
                  <option value="qr">Mã QR</option>
                </select>
              </div>

              {paymentMethod === 'qr' && (
                <div className="text-center my-3">
                  <p className="text-muted">Quét mã QR để thanh toán:</p>
                  <img src={qrImage} alt="QR Code" style={{ maxWidth: '200px' }} />
                </div>
              )}

              <button type="submit" className="btn btn-primary w-100 mt-3">
                ✅ Đặt hàng
              </button>

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
