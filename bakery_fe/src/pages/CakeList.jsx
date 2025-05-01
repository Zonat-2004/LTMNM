import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CakeList = () => {
  const [cakes, setCakes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredCakes, setFilteredCakes] = useState([]);

  // Lấy danh mục khi trang load
  useEffect(() => {
    axios.get('http://localhost:8000/api/categories/')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Lỗi lấy danh mục:', err));
  }, []);

  // Lấy bánh mỗi khi trang load
  useEffect(() => {
    axios.get('http://localhost:8000/api/cakes/')
      .then(res => {
        setCakes(res.data);
        setFilteredCakes(res.data); // Mặc định hiển thị tất cả
      })
      .catch(err => console.error('Lỗi khi tải bánh:', err));
  }, []);

  // Hàm lọc bánh theo danh mục
  const handleFilter = () => {
    if (!selectedCategory) {
      setFilteredCakes(cakes); // Hiển thị tất cả nếu không có danh mục chọn
    } else {
      const filtered = cakes.filter(cake => cake.category === selectedCategory);
      setFilteredCakes(filtered);
    }
  };

  return (
    <div className="container py-5">
      <style>{`
        .cake-card {
          background-color: #fff0f5;
          border: none;
          border-radius: 16px;
          box-shadow: 0 4px 10px rgba(255, 192, 203, 0.4);
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s;
        }

        .cake-card:hover {
          transform: translateY(-5px);
        }

        .cake-image-wrapper {
          height: 250px;
          overflow: hidden;
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
        }

        .cake-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cake-body {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .cake-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #d63384;
        }

        .cake-description {
          flex-grow: 1;
          color: #555;
          margin-top: 10px;
          font-size: 0.95rem;
        }

        .cake-price {
          font-weight: bold;
          color: #c2185b;
          margin: 12px 0;
        }

        .btn-buy {
          background: linear-gradient(135deg, #ff85a2, #f06292);
          color: white;
          border: none;
          border-radius: 30px;
          padding: 10px;
          font-weight: bold;
          transition: background 0.3s;
          width: 100%;
        }

        .btn-buy:hover {
          background: linear-gradient(135deg, #f06292, #ff85a2);
        }

        .btn-filter {
          margin-top: 10px;
          background-color: #ff6f91; /* Màu tone hồng nhẹ */
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 30px;
          font-weight: bold;
          transition: background 0.2s;
        }

        .btn-filter:hover {
          background-color: #ff4f7d; /* Đổi màu khi hover */
        }

        /* Cải tiến phần dropdown và nút lọc */
        .form-select {
          padding: 10px 15px;
          font-size: 1rem;
          border-radius: 20px;
          border: 2px solid #ff6f91; /* Màu hồng nhẹ */
          outline: none;
          transition: box-shadow 0.3s;
        }

        .form-select:focus {
          box-shadow: 0 0 0 0.2rem rgba(255, 111, 145, 0.4);
        }

        .dropdown-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        .dropdown-container .btn-filter {
          width: 150px;
        }

        /* Chỉnh sửa căn chỉnh cho dropdown và nút lọc để căn bằng nhau */
        .mb-4.d-flex {
          align-items: center;
          justify-content: center;
          gap: 15px;
        }
      `}</style>

      <h1 className="text-center mb-4 text-danger">🍰 Danh Sách Bánh 🍰</h1>

      {/* Dropdown + nút lọc */}
      <div className="mb-4 d-flex flex-column flex-md-row justify-content-center align-items-center gap-3">
        <select
          className="form-select w-75 w-md-50"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">-- Tất cả danh mục --</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <button className="btn-filter" onClick={handleFilter}>Lọc</button>
      </div>

      {/* Danh sách bánh */}
      <div className="row">
        {filteredCakes.length > 0 ? (
          filteredCakes.map((cake) => (
            <div key={cake._id} className="col-md-4 mb-4 d-flex">
              <div className="cake-card w-100">
                <div className="cake-image-wrapper">
                  <img
                    src={`http://localhost:8000${cake.image}`}
                    alt={cake.name}
                    className="cake-image"
                  />
                </div>
                <div className="cake-body">
                  <div className="cake-title">{cake.name}</div>
                  <div className="cake-description">{cake.description}</div>
                  <div className="cake-price">Giá: {cake.price.toLocaleString()} VND</div>
                  <button className="btn-buy">💗 Mua ngay</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">Không có sản phẩm nào</p>
        )}
      </div>
    </div>
  );
};

export default CakeList;
