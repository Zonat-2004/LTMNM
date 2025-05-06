import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CakeList = () => {
  const [cakes, setCakes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredCakes, setFilteredCakes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/categories/')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Lỗi lấy danh mục:', err));
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/cakes/')
      .then((res) => {
        setCakes(res.data);
        setFilteredCakes(res.data);
        setLoading(false);
      })
      .catch((err) => console.error('Lỗi khi tải bánh:', err));
  }, []);

  const handleFilter = () => {
    let filtered = cakes;

    if (selectedCategory) {
      filtered = filtered.filter((cake) => cake.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      const keywords = searchTerm.toLowerCase().split(' ');
      filtered = filtered.filter((cake) =>
        keywords.every(
          (keyword) =>
            cake.name.toLowerCase().includes(keyword) ||
            cake.description.toLowerCase().includes(keyword)
        )
      );
    }

    setFilteredCakes(filtered);
    setShowSearchResult(true);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setShowSearchResult(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleFilter();
    }
  };

  const handleAddToCart = (cake) => {
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];

    const cakeIndex = existingCart.findIndex((item) => item._id === cake._id);

    if (cakeIndex >= 0) {
      existingCart[cakeIndex].quantity += 1;
    } else {
      cake.quantity = 1;
      existingCart.push(cake);
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    alert(`✅ Đã thêm "${cake.name}" vào giỏ hàng!`);
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4 text-danger">🍰 Danh Sách Bánh 🍰</h1>

      <div className="mb-3 d-flex flex-column flex-md-row justify-content-center align-items-center gap-3">
        <div className="search-wrapper">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm bánh..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress}
          />
        </div>

        <select
          className="form-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">-- Tất cả danh mục --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button className="btn-filter" onClick={handleFilter}>
          Tìm kiếm
        </button>
      </div>

      {showSearchResult && (searchTerm || selectedCategory) && (
        <p className="text-center mb-4 fw-bold text-secondary">
          Kết quả tìm kiếm
          {searchTerm && (
            <>
              {' '}
              cho từ khóa "<span className="text-danger">{searchTerm}</span>"
            </>
          )}
          {selectedCategory && (
            <>
              {searchTerm && ' và'}
              {' danh mục '}
              "<span className="text-danger">
                {categories.find((cat) => cat._id === selectedCategory)?.name || ''}
              </span>"
            </>
          )}
        </p>
      )}

      {loading && <p className="text-center">Đang tải...</p>}

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
                  <div className="d-flex gap-2 mt-2">
                    <button
                      className="btn-buy flex-fill"
                      onClick={() => navigate('/orderform', { state: { cake } })}
                    >
                      💗 Mua ngay
                    </button>
                    <button
                      className="btn-cart flex-fill"
                      onClick={() => handleAddToCart(cake)}
                    >
                      🛒
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">Không có sản phẩm nào</p>
        )}
      </div>

      <style>{`
        .cake-card {
          background-color: #fff0f5;
          border-radius: 16px;
          box-shadow: 0 4px 10px rgba(255, 192, 203, 0.4);
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

        .btn-cart {
          background-color: #ffe082;
          color: #5d4037;
          border: none;
          border-radius: 30px;
          padding: 10px;
          font-weight: bold;
          transition: background 0.3s;
        }

        .btn-cart:hover {
          background-color: #ffd54f;
        }

        .btn-filter {
          background-color: #ff6f91;
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 30px;
          font-weight: bold;
          transition: background 0.2s;
        }

        .btn-filter:hover {
          background-color: #ff4f7d;
        }

        .form-select,
        .search-wrapper input {
          padding: 10px 15px;
          font-size: 1rem;
          border-radius: 20px;
          border: 2px solid #ff6f91;
          outline: none;
          transition: box-shadow 0.3s;
        }

        .form-select:focus,
        .search-wrapper input:focus {
          box-shadow: 0 0 0 0.2rem rgba(255, 111, 145, 0.4);
        }

        .search-wrapper {
          width: 100%;
          max-width: 350px;
        }

        @media (max-width: 768px) {
          .mb-3.d-flex {
            flex-direction: column;
          }

          .search-wrapper {
            margin-bottom: 10px;
          }

          .form-select {
            margin-top: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default CakeList;
