import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCake = () => {
  const navigate = useNavigate();
  const [cake, setCake] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/categories/')
      .then(res => setCategories(res.data))
      .catch(() => setError('Không tải được danh mục'));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setCake(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!cake.name || !cake.description || !cake.price || !cake.category) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const formData = new FormData();
    formData.append('name', cake.name);
    formData.append('description', cake.description);
    formData.append('price', parseInt(cake.price, 10));
    formData.append('category', cake.category);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await axios.post('http://localhost:8000/api/cakes/', formData);
      console.log('Bánh đã được thêm:', response.data);
      navigate('/admin/products');
    } catch (error) {
      let errorMessage = 'Lỗi không xác định.';
      if (error.response) {
        errorMessage = error.response.data?.message || JSON.stringify(error.response.data);
      } else if (error.request) {
        errorMessage = 'Không có phản hồi từ server.';
      } else {
        errorMessage = error.message;
      }
      setError(errorMessage);
    }
  };

  const handleGoBack = () => {
    navigate('/admin/products');
  };

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ fontSize: '28px', textAlign: 'center', marginBottom: '20px', color: '#4A90E2' }}>
        <i className="fas fa-cake" style={{ marginRight: '10px' }}></i> Thêm mới bánh
      </h2>

      {error && (
        <div style={{ color: '#D9534F', marginBottom: '15px', textAlign: 'center' }}>
          <strong>{error}</strong>
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#4A90E2' }}>Tên bánh</label>
          <input
            type="text"
            name="name"
            value={cake.name}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #DDD',
              borderRadius: '8px',
              fontSize: '16px',
              color: '#333',
              backgroundColor: '#fff',
              boxSizing: 'border-box',
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#4A90E2' }}>Mô tả</label>
          <textarea
            name="description"
            value={cake.description}
            onChange={handleChange}
            rows="4"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #DDD',
              borderRadius: '8px',
              fontSize: '16px',
              color: '#333',
              backgroundColor: '#fff',
              boxSizing: 'border-box',
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#4A90E2' }}>Giá (VNĐ)</label>
          <input
            type="number"
            name="price"
            value={cake.price}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #DDD',
              borderRadius: '8px',
              fontSize: '16px',
              color: '#333',
              backgroundColor: '#fff',
              boxSizing: 'border-box',
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#4A90E2' }}>Hình ảnh</label>
          {preview && (
            <div>
              <img
                src={preview}
                alt="preview"
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
              />
            </div>
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #DDD',
              borderRadius: '8px',
              fontSize: '16px',
              color: '#333',
              backgroundColor: '#fff',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#4A90E2' }}>Danh mục</label>
          <select
            name="category"
            value={cake.category}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #DDD',
              borderRadius: '8px',
              fontSize: '16px',
              color: '#333',
              backgroundColor: '#fff',
              boxSizing: 'border-box',
            }}
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              marginRight: '10px',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={e => e.target.style.backgroundColor = '#45a049'}
            onMouseOut={e => e.target.style.backgroundColor = '#4CAF50'}
          >
            <i className="fas fa-plus-circle" style={{ marginRight: '10px' }}></i> Thêm bánh
          </button>
          <button
            type="button"
            onClick={handleGoBack}
            style={{
              padding: '12px 24px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={e => e.target.style.backgroundColor = '#e53935'}
            onMouseOut={e => e.target.style.backgroundColor = '#f44336'}
          >
            <i className="fas fa-arrow-left" style={{ marginRight: '10px' }}></i> Quay lại
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCake;
