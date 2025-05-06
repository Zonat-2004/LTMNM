import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const removeFromCart = (cakeId) => {
    const updatedCart = cart.filter(item => item._id !== cakeId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const updateQuantity = (cakeId, quantity) => {
    const updatedCart = cart.map(item => {
      if (item._id === cakeId) {
        item.quantity = quantity;
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleOrder = () => {
    navigate('/orderform', { state: { cart } });
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4 text-danger">🛒 Giỏ Hàng 🛒</h1>

      {cart.length === 0 ? (
        <p className="text-center text-muted">Giỏ hàng của bạn hiện tại đang trống.</p>
      ) : (
        <>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {cart.map((item) => (
              <div key={item._id} className="col">
                <div className="card shadow-sm border-0">
                  <img
                    src={`http://localhost:8000${item.image}`}
                    alt={item.name}
                    className="card-img-top"
                    style={{ objectFit: 'cover', height: '250px' }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title text-danger">{item.name}</h5>
                    <p className="card-text text-muted">{item.description}</p>
                    <p className="fw-bold mb-1">Giá: {item.price.toLocaleString()} VND</p>
                    
                    {/* Thành tiền - đẹp hơn */}
                    <p className="fw-semibold text-white bg-success bg-opacity-75 py-2 px-3 rounded d-inline-block">
                      Thành tiền: {(item.price * item.quantity).toLocaleString()} VND
                    </p>

                    <div className="d-flex justify-content-center align-items-center gap-3 mb-3 mt-3">
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity === 1}
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                      <span className="quantity-text">{item.quantity}</span>
                      <button
                        className="btn btn-outline-success"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>

                    <button
                      className="btn btn-outline-danger mt-2"
                      onClick={() => removeFromCart(item._id)}
                    >
                      <i className="fas fa-trash"></i> Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h3 className="total-price text-success fw-bold fs-4">
              Tổng cộng: {getTotalPrice().toLocaleString()} VND
            </h3>
            <button
              className="btn btn-warning px-4 py-2 fs-5"
              onClick={handleOrder}
            >
              <i className="fas fa-credit-card"></i> Đặt hàng
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
