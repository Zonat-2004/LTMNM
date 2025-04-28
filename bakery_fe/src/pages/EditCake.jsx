import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditCake = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate(); // Dùng useNavigate để chuyển hướng

  const [cake, setCake] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category_id: ''
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dữ liệu bánh và danh mục khi trang được load
  useEffect(() => {
    // Lấy dữ liệu bánh theo id
    axios.get(`http://localhost:8000/api/cakes/${id}/`)
      .then(response => {
        setCake(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Không thể tải dữ liệu bánh. Vui lòng thử lại sau.');
        setLoading(false);
      });

    // Lấy danh mục từ API
    axios.get('http://localhost:8000/api/categories/')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        setError('Không thể tải danh mục. Vui lòng thử lại sau.');
        setLoading(false);
      });
  }, [id]);

  // Cập nhật giá trị khi thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCake({
      ...cake,
      [name]: value
    });
  };

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    // Gửi PUT request để cập nhật sản phẩm mà không có ảnh mới
    axios.put(`http://localhost:8000/api/cakes/${id}/`, cake)
      .then(() => {
        alert('Sửa sản phẩm thành công');
        navigate('/admin/products');  // Điều hướng về danh sách sản phẩm sau khi sửa
      })
      .catch(error => {
        setError('Có lỗi xảy ra. Vui lòng thử lại.');
        console.error(error);
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Chỉnh sửa Bánh</h1>

      {loading ? (
        <p>Đang tải thông tin bánh...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Tên bánh */}
          <div className="form-group">
            <label>Tên Bánh</label>
            <input
              type="text"
              name="name"
              value={cake.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          {/* Mô tả */}
          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              name="description"
              value={cake.description}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          {/* Giá */}
          <div className="form-group">
            <label>Giá</label>
            <input
              type="number"
              name="price"
              value={cake.price}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          {/* Ảnh (Hiển thị ảnh hiện tại) */}
          <div className="form-group">
            <label>Ảnh</label>
            {cake.image && (
              <div className="mt-3">
                <img
                  src={`http://localhost:8000/media/${cake.image}`}
                  alt={cake.name}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                />
              </div>
            )}
          </div>

          {/* Danh mục */}
          <div className="form-group">
            <label>Danh mục</label>
            <select
              name="category_id"
              value={cake.category_id}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Chọn danh mục</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Nút lưu thay đổi */}
          <button type="submit" className="btn btn-success mt-3">
            Lưu thay đổi
          </button>
        </form>
      )}
    </div>
  );
};

export default EditCake;
