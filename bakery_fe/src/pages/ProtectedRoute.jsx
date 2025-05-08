import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, isAdmin, ...rest }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const accessToken = localStorage.getItem('access');
  
  return (
    // Kiểm tra nếu người dùng chưa đăng nhập hoặc không có quyền admin
    !accessToken ? (
      // Nếu chưa đăng nhập, chuyển hướng đến trang login
      <Navigate to="/login" />
    ) : isAdmin && !user?.is_staff ? (
      // Nếu yêu cầu quyền admin nhưng người dùng không phải admin
      <Navigate to="/login" />
    ) : (
      // Nếu đã đăng nhập và có quyền truy cập, render component
      Component
    )
  );
};

export default ProtectedRoute;
