// src/App.jsx
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
function App() {
  return (
    <Router>
      <Routes>
        {/* Route trang người dùng */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/cakes" element={<MainLayout><CakeList /></MainLayout>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={<AdminLayout><Admin /></AdminLayout>} />
        <Route path="/admin/products" element={<AdminLayout><CakeListAdmin /></AdminLayout>} />
        <Route path="/admin/add-cake" element={<AdminLayout><AddCake /></AdminLayout>} />
        <Route path="/admin/edit-cake/:id" element={<AdminLayout><EditCake /></AdminLayout>} />

      </Routes>
    </Router>
  );
}

export default App;