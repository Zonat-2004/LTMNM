import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CakeList = () => {
  const [cakes, setCakes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/cakes/')
      .then(response => {
        setCakes(response.data);
      })
      .catch(error => {
        console.error('Lỗi khi tải danh sách bánh:', error);
      });
  }, []);

  return (
    <div className="container py-5">
      {/* Nhúng CSS trực tiếp */}
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
      `}</style>

      <h1 className="text-center mb-5 text-danger">🍰 Danh Sách Bánh 🍰</h1>

      <div className="row">
        {cakes.length > 0 ? (
          cakes.map((cake) => (
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
