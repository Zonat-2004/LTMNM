import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa'; // Icon người dùng
import '../css/Header.css';

function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="logo">Bakery Shop</div>
      <nav className="nav-links">
        <Link to="/">Trang chủ</Link>
        <Link to="/cakes">Sản phẩm</Link>
        <Link to="/cart">Giỏ hàng</Link>
        <Link to="/orders">Đơn Hàng</Link>

        {user ? (
          <>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'white' }}>
              <FaUser /> {user.name || 'User'}
            </span>
            <button onClick={handleLogout} style={{ marginLeft: '10px', color: 'white', background: 'transparent', border: 'none', cursor: 'pointer' }}>
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Đăng nhập</Link>
            <Link to="/register">Đăng ký</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
