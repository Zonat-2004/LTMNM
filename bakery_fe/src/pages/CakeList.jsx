import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CakeList = () => {
  const [cakes, setCakes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredCakes, setFilteredCakes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResult, setShowSearchResult] = useState(false); // State mới

  useEffect(() => {
    // Lấy danh sách danh mục từ API
    axios.get('http://localhost:8000/api/categories/')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Lỗi lấy danh mục:', err));
  }, []);

  useEffect(() => {
    // Lấy danh sách bánh từ API
    axios.get('http://localhost:8000/api/cakes/')
      .then(res => {
        setCakes(res.data);
        setFilteredCakes(res.data);
      })
      .catch(err => console.error('Lỗi khi tải bánh:', err));
  }, []);

  const handleFilter = () => {
    let filtered = cakes;

    // Lọc theo danh mục
    if (selectedCategory) {
      filtered = filtered.filter(cake => cake.category === selectedCategory);
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm.trim()) {
      const keywords = searchTerm.toLowerCase().split(' ');
      filtered = filtered.filter(cake =>
        keywords.every(keyword =>
          cake.name.toLowerCase().includes(keyword) ||
          cake.description.toLowerCase().includes(keyword)
        )
      );
    }

    setFilteredCakes(filtered);  // Cập nhật danh sách bánh đã lọc
    setShowSearchResult(true); // Hiển thị kết quả tìm kiếm
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);  // Cập nhật danh mục chọn
    setShowSearchResult(false); // Ẩn kết quả tìm kiếm cho đến khi người dùng nhấn tìm kiếm
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);  // Cập nhật từ khóa tìm kiếm
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleFilter();  // Lọc khi nhấn Enter
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4 text-danger">🍰 Danh Sách Bánh 🍰</h1>

      {/* Tìm kiếm và lọc */}
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
          onKeyDown={handleKeyPress}
        >
          <option value="">-- Tất cả danh mục --</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <button className="btn-filter" onClick={handleFilter}>Tìm kiếm</button>
      </div>

      {/* Kết quả tìm kiếm thông báo */}
      {showSearchResult && (searchTerm || selectedCategory) && (
        <p className="text-center mb-4 fw-bold text-secondary">
          Kết quả tìm kiếm
          {searchTerm && <> cho từ khóa "<span className="text-danger">{searchTerm}</span>"</>}
          {selectedCategory && (
            <>
              {searchTerm && ' và'}
              {' danh mục '}
              "<span className="text-danger">
                {categories.find(cat => cat._id === selectedCategory)?.name || ''}
              </span>"
            </>
          )}
        </p>
      )}

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
