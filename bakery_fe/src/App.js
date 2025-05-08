import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from "react";
import MainLayout from "./layout/MainLayout";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Home from './pages/Home';
import Admin from './pages/Admin';
import AdminLayout from "./layout/AdminLayout";
import CakeListAdmin from './pages/Products';
import CakeList from './pages/CakeList';
import AddCake from './pages/AddCake';
import LoginPage from './pages/Login';
import Register from './pages/Register';
import EditCake from './pages/EditCake';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Category from './pages/Category';
import User from './pages/User';
import OrderForm from './pages/OrderForm';
import Cart from './pages/Cart';
import AdminCartPage from './pages/AdminCartPage';
import ProtectedRoute from './pages/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route trang người dùng */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/cakes" element={<MainLayout><CakeList /></MainLayout>} />
        <Route path="/orderform" element={<MainLayout><OrderForm /></MainLayout>} />
        <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        {/* Các route admin cần bảo vệ */}
        <Route 
          path="/admin" 
          element={<ProtectedRoute element={<AdminLayout><Admin /></AdminLayout>} isAdmin={true} />} 
        />
        <Route 
          path="/admin/products" 
          element={<ProtectedRoute element={<AdminLayout><CakeListAdmin /></AdminLayout>} isAdmin={true} />} 
        />
        <Route 
          path="/admin/add-cake" 
          element={<ProtectedRoute element={<AdminLayout><AddCake /></AdminLayout>} isAdmin={true} />} 
        />
        <Route 
          path="/admin/edit-cake/:id" 
          element={<ProtectedRoute element={<AdminLayout><EditCake /></AdminLayout>} isAdmin={true} />} 
        />
        <Route 
          path="/admin/categories" 
          element={<ProtectedRoute element={<AdminLayout><Category /></AdminLayout>} isAdmin={true} />} 
        />
        <Route 
          path="/admin/users" 
          element={<ProtectedRoute element={<AdminLayout><User /></AdminLayout>} isAdmin={true} />} 
        />
        <Route 
          path="/admin/carts" 
          element={<ProtectedRoute element={<AdminLayout><AdminCartPage /></AdminLayout>} isAdmin={true} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
