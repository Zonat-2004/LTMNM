import React from "react";
import { Link } from "react-router-dom";

function AdminLayout({ children }) {
  return (
    <div className="admin-container" style={{ display: 'flex', minHeight: '100vh', background: '#fff0f5' }}>
      
      {/* Sidebar */}
      <aside style={{
        width: '250px',
        background: '#ffb6b9', // Hồng pastel
        color: 'white',
        padding: '30px 20px',
        display: 'flex',
        flexDirection: 'column',
        borderTopRightRadius: '20px',
        borderBottomRightRadius: '20px',
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'cursive', marginBottom: '40px', fontSize: '28px' }}>
          🎂 CakeShop
        </h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <CustomLink to="/admin" icon="fas fa-home" label="Trang chủ" />
          <CustomLink to="/admin/orders" icon="fas fa-receipt" label="Đơn hàng" />
          <CustomLink to="/admin/products" icon="fas fa-birthday-cake" label="Sản phẩm bánh" />
          <CustomLink to="/admin/categories" icon="fas fa-list-alt" label="Danh mục" />
          <CustomLink to="/admin/users" icon="fas fa-users" label="Khách hàng" />
          <CustomLink to="/admin/orders" icon="fas fa-box" label="Đơn hàng" />
          <div style={{ marginTop: 'auto' }}>
            <CustomLink to="/" icon="fas fa-arrow-left" label="Về Website" />
          </div>
        </nav>
      </aside>

      {/* Content */}
      <div style={{ flex: 1, padding: '30px', background: '#fffafc' }}>
        {/* Header */}
        <header style={{
          background: 'white',
          padding: '15px 25px',
          marginBottom: '25px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: '15px'
        }}>
          <h1 style={{ margin: 0, fontFamily: 'cursive', color: '#ff6f91' }}>
            Quản lý tiệm bánh
          </h1>
        </header>

        {/* Page Content */}
        <main>
          {children}
        </main>
      </div>

    </div>
  );
}

function CustomLink({ to, icon, label }) {
  return (
    <Link to={to} style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      color: 'white',
      textDecoration: 'none',
      fontSize: '18px',
      padding: '10px 15px',
      borderRadius: '12px',
      transition: 'background 0.3s',
      fontFamily: 'cursive'
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <i className={icon}></i> {label}
    </Link>
  );
}

export default AdminLayout;
