import React from 'react';
import { Link } from 'react-router-dom'; // Import Link từ react-router-dom
import '../css/Header.css'; // nhớ import file CSS riêng

function Header() {
  return (
    <header className="header">
      <div className="logo">Bakery Shop</div>

      <div className="search-bar">
        <input type="text" placeholder="Tìm kiếm bánh..." />
        <button><i className="fas fa-search"></i></button>
      </div>

      <nav className="nav-links">
        <Link to="/">Trang chủ</Link> {/* Liên kết đến trang chủ */}
        <div className="dropdown">
          <Link to="/cakes">Sản phẩm <i className="fas fa-caret-down"></i></Link> {/* Liên kết đến trang sản phẩm bánh */}
        </div>
        <Link to="/cart">Giỏ hàng</Link> {/* Giỏ hàng */}
        <Link to="/login">Đăng nhập</Link> {/* Đăng nhập */}
        <Link to="/register">Đăng ký</Link> {/* Đăng ký */}
      </nav>
    </header>
  );
}

export default Header;
