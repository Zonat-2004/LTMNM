// Header.jsx
import React from 'react';
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
        <a href="#">Trang chủ</a>
        <div className="dropdown">
          <a href="#">Sản phẩm <i className="fas fa-caret-down"></i></a>
          {/* Dropdown menu (nếu bạn muốn sau này) */}
        </div>
        <a href="#">Giỏ hàng</a>
        <a href="#">Đăng nhập</a>
        <a href="#">Đăng ký</a>
      </nav>
    </header>
  );
}

export default Header;
