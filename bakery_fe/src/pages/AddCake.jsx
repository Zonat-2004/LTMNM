import React, { useState } from 'react';
import axios from 'axios';

const AddCake = () => {
  const [newCake, setNewCake] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category_id: ''
  });

  // Xử lý khi nhấn thêm sản phẩm
  const handleAdd = () => {
    axios.post('http://localhost:8000/api/cakes/', newCake)
      .then(response => {
        alert('Sản phẩm đã được thêm thành công!');
        setNewCake({ name: '', description: '', price: '', image: '', category_id: '' }); // Reset form
      })
      .catch(error => {
        console.error('Lỗi khi thêm bánh:', error);
        alert('Có lỗi xảy ra khi thêm sản phẩm');
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Thêm Sản phẩm Bánh</h1>
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Thông tin sản phẩm mới</h5>
        </div>
        <div className="card-body">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Tên bánh"
            value={newCake.name}
            onChange={(e) => setNewCake({ ...newCake, name: e.target.value })}
          />
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Mô tả"
            value={newCake.description}
            onChange={(e) => setNewCake({ ...newCake, description: e.target.value })}
          />
          <input
            type="number"
            className="form-control mb-3"
            placeholder="Giá"
            value={newCake.price}
            onChange={(e) => setNewCake({ ...newCake, price: e.target.value })}
          />
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Đường dẫn ảnh"
            value={newCake.image}
            onChange={(e) => setNewCake({ ...newCake, image: e.target.value })}
          />
          <input
            type="text"
            className="form-control mb-3"
            placeholder="ID danh mục"
            value={newCake.category_id}
            onChange={(e) => setNewCake({ ...newCake, category_id: e.target.value })}
          />
          <button className="btn btn-primary w-100" onClick={handleAdd}>Thêm sản phẩm</button>
        </div>
      </div>
    </div>
  );
};

export default AddCake;
