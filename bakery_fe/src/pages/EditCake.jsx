import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditCake = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cake, setCake] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: ''
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cakeRes = await axios.get(`http://localhost:8000/api/cakes/${id}/`);
        setCake(cakeRes.data);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải dữ liệu bánh.');
        setLoading(false);
      }

      try {
        const catRes = await axios.get('http://localhost:8000/api/categories/');
        setCategories(catRes.data);
      } catch (err) {
        setError('Không thể tải danh mục.');
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCake((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', cake.name);
    formData.append('description', cake.description);
    formData.append('price', cake.price);
    formData.append('category', cake.category);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      const response = await axios.patch(`http://localhost:8000/api/cakes/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        validateStatus: (status) => (status >= 200 && status < 300) || status === 204
      });

      // Kiểm tra nếu có phản hồi hợp lệ, hiển thị thông báo thành công
      if (response.status === 200) {
        alert('Cập nhật thành công!');
        navigate('/admin/products'); // Chuyển hướng đến trang danh sách bánh
      }
    } catch (err) {
      console.error(err.response?.data || err.message); // Log lỗi chi tiết
      setError('Có lỗi xảy ra khi cập nhật. Kiểm tra console để biết chi tiết.');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Chỉnh sửa Bánh</h1>
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label>Tên bánh</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={cake.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mt-3">
            <label>Mô tả</label>
            <textarea
              name="description"
              className="form-control"
              value={cake.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mt-3">
            <label>Giá</label>
            <input
              type="number"
              name="price"
              className="form-control"
              value={cake.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mt-3">
            <label>Ảnh hiện tại</label>
            {cake.image && (
              <div className="my-2">
                <img
                  src={previewImage || `http://localhost:8000/${cake.image}`}
                  alt={cake.name}
                  style={{ width: 120, height: 120, objectFit: 'cover' }}
                />
              </div>
            )}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="form-control"
            />
          </div>

          <div className="form-group mt-3">
            <label>Danh mục</label>
            <select
              name="category"
              className="form-control"
              value={cake.category}
              onChange={handleChange}
              required
            >
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex justify-content-start mt-4 space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="btn btn-secondary"
            >
              Quay lại
            </button>
            <button type="submit" className="btn btn-success">
              Lưu thay đổi
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditCake;
