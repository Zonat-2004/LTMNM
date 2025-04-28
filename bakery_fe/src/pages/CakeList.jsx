import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CakeList = () => {
  const [cakes, setCakes] = useState([]);

  // Lấy danh sách bánh từ API khi component được render
  useEffect(() => {
    axios.get('http://localhost:8000/api/cakes/')
      .then(response => {
        setCakes(response.data); // Lưu dữ liệu vào state cakes
      })
      .catch(error => {
        console.error('Lỗi khi tải danh sách bánh:', error);
      });
  }, []); // Chỉ chạy khi component mount

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Sản phẩm Bánh</h1>

      {/* Bảng Danh sách sản phẩm */}
      <div className="row">
        {cakes.length > 0 ? (
          cakes.map((cake) => (
            <div key={cake._id} className="col-md-4 mb-4">
              <div className="card">
                <img src={`http://localhost:8000/media/${cake.image}`} alt={cake.name} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{cake.name}</h5>
                  <p className="card-text">{cake.description}</p>
                  <p className="card-text">Giá: {cake.price} VND</p>
                  <button className="btn btn-primary">Mua ngay</button>
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
