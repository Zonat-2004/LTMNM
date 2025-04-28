import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditCake = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State chính
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

  // File mới & preview
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Lấy dữ liệu bánh + danh mục
  useEffect(() => {
    axios.get(`http://localhost:8000/api/cakes/${id}/`)
      .then(r => {
        setCake(r.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải dữ liệu bánh.');
        setLoading(false);
      });

    axios.get('http://localhost:8000/api/categories/')
      .then(r => setCategories(r.data))
      .catch(() => setError('Không thể tải danh mục.'));
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setCake(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', cake.name);
    formData.append('description', cake.description);
    formData.append('price', cake.price);
    formData.append('category_id', cake.category_id);

    // *** Ghi chú quan trọng: phải append luôn field image ***
    if (selectedImage) {
      formData.append('image', selectedImage);
    } else {
      // nếu không đổi file, gửi luôn tên ảnh cũ để serializer đỡ lỗi
      formData.append('image', cake.image);
    }

    try {
      // Không set headers['Content-Type'] thủ công
      await axios.put(`http://localhost:8000/api/cakes/${id}/`, formData);
      alert('Cập nhật thành công');
      navigate('/admin/products');
    } catch (err) {
      console.error(err.response?.data || err);
      setError('Có lỗi xảy ra. Kiểm tra console để biết chi tiết.');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Chỉnh sửa Bánh</h1>
      {loading
        ? <p>Đang tải...</p>
        : error
          ? <div className="alert alert-danger">{error}</div>
          : (
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {/* Tên bánh */}
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

              {/* Mô tả */}
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

              {/* Giá */}
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

              {/* Ảnh */}
              <div className="form-group mt-3">
                <label>Ảnh hiện tại</label>
                {cake.image && (
                  <div className="my-2">
                    <img
                      src={previewImage || `http://localhost:8000/media/${cake.image}`}
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

              {/* Danh mục */}
              <div className="form-group mt-3">
                <label>Danh mục</label>
                <select
                  name="category_id"
                  className="form-control"
                  value={cake.category_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <button type="submit" className="btn btn-success mt-4">
                Lưu thay đổi
              </button>
            </form>

          )
      }
    </div>
  );
};

export default EditCake;
