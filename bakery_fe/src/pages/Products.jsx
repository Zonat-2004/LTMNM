import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link nếu bạn muốn điều hướng sang trang thêm sản phẩm

const CakeListAdmin = () => {
  const [cakes, setCakes] = useState([]);

  // Lấy danh sách bánh từ API
  useEffect(() => {
    axios.get('http://localhost:8000/api/cakes/')
      .then(response => {
        setCakes(response.data);
      })
      .catch(error => {
        console.error('Lỗi khi tải danh sách bánh:', error);
      });
  }, []);

  // Xóa sản phẩm bánh
  const handleDelete = (id) => {
    axios.delete(`http://localhost:8000/api/cakes/${id}/`)
      .then(() => {
        setCakes(cakes.filter(cake => cake.id !== id)); // Cập nhật lại danh sách sau khi xóa
      })
      .catch(error => {
        console.error('Lỗi khi xóa bánh:', error);
      });
  };

  // Cập nhật thông tin sản phẩm bánh
  const handleEdit = (id, updatedCake) => {
    axios.put(`http://localhost:8000/api/cakes/${id}/`, updatedCake)
      .then(response => {
        setCakes(cakes.map(cake => (cake.id === id ? response.data : cake)));
      })
      .catch(error => {
        console.error('Lỗi khi sửa bánh:', error);
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Quản lý Sản phẩm Bánh</h1>

      {/* Nút Thêm sản phẩm */}
      <div className="text-end mb-4">
        <Link to="/admin/add-cake" className="btn btn-success">
          Thêm Sản phẩm
        </Link>
      </div>

      {/* Bảng Danh sách sản phẩm */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Danh sách sản phẩm bánh</h5>
        </div>
        <div className="card-body">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Tên bánh</th>
                <th>Mô tả</th>
                <th>Giá</th>
                <th>Ảnh</th>
                <th>Danh mục</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {cakes.map((cake) => (
                <tr key={cake.id}>
                  <td>{cake.name}</td>
                  <td>{cake.description}</td>
                  <td>{cake.price}</td>
                  <td><img src={`http://localhost:8000${cake.image}`} alt={cake.name} style={{ width: '100px' }} /></td>
                  <td>{cake.category_id}</td>
                  <td>
                    <button className="btn btn-warning me-2" onClick={() => handleEdit(cake.id, { ...cake, price: cake.price + 1000 })}>Sửa</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(cake.id)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CakeListAdmin;
