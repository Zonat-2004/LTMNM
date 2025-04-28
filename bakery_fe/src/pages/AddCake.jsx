import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCake = () => {
  const navigate = useNavigate();

  // state cho form
  const [cake, setCake] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // state phụ
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  // fetch categories
  useEffect(() => {
    axios
      .get('http://localhost:8000/api/categories/')
      .then(res => {
        console.log('Danh mục:', res.data); // Debug danh mục
        setCategories(res.data);
      })
      .catch(() => setError('Không tải được danh mục'));
  }, []);

  const handleChange = e => {
    const { name: fieldName, value } = e.target;
    setCake(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!cake.name || !cake.description || !cake.price || !cake.category_id) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const formData = new FormData();
    formData.append('name', cake.name);
    formData.append('description', cake.description);
    formData.append('price', parseInt(cake.price, 10));
    formData.append('category_id', cake.category_id);
    if (imageFile) {
      console.log('imageFile:', imageFile);
      formData.append('image', imageFile);
    }

    // Debug dữ liệu gửi đi
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.post('http://localhost:8000/api/cakes/', formData);
      console.log('Bánh đã được thêm:', response.data);
      navigate('/admin/products');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Lỗi không xác định. Vui lòng kiểm tra lại.';
      setError(errorMessage);
      console.error('Lỗi chi tiết:', err.response || err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-6">
      <div className="container max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-pink-100 transform transition-all hover:shadow-xl">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-8 tracking-wide">
          🍰 Thêm mới bánh
        </h2>

        {error && (
          <div className="mb-6 text-center text-red-600 text-lg font-medium bg-red-50 py-2 px-4 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
          <div className="flex flex-col space-y-6">
            {/* Tên bánh */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="mr-2">📛</span> Tên bánh
              </label>
              <input
                type="text"
                name="name"
                className="w-full p-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:border-pink-400 focus:bg-white transition-all duration-300"
                value={cake.name}
                onChange={handleChange}
                placeholder="VD: Bánh kem socola"
                required
              />
            </div>

            {/* Mô tả */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="mr-2">📝</span> Mô tả
              </label>
              <textarea
                name="description"
                className="w-full p-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:border-pink-400 focus:bg-white transition-all duration-300"
                rows="3"
                value={cake.description}
                onChange={handleChange}
                placeholder="Mô tả ngắn gọn..."
                required
              />
            </div>

            {/* Giá */}
            <div className="flex flex-col">
              <label className="text-sm font-bold text-pink-700 flex items-center mb-2">
                <span className="mr-2">💰</span> Giá (VNĐ)
              </label>
              <input
                type="number"
                name="price"
                className="w-full p-3 rounded-lg border-2 border-pink-200 bg-pink-50 text-gray-700 focus:outline-none focus:border-pink-400 focus:bg-white transition-all duration-300"
                value={cake.price}
                onChange={handleChange}
                placeholder="200000"
                required
              />
            </div>

            {/* Hình ảnh */}
            <div className="flex flex-col">
              <label className="text-sm font-bold text-pink-700 flex items-center mb-2">
                <span className="mr-2">🖼️</span> Hình ảnh
              </label>
              {preview && (
                <div className="mb-3">
                  <img
                    src={preview}
                    alt="preview"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-pink-200 shadow-sm"
                  />
                </div>
              )}
              <input
                type="file"
                name="image"
                accept="image/*"
                className="w-full p-3 rounded-lg border-2 border-pink-200 bg-pink-50 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-pink-200 file:text-pink-700 hover:file:bg-pink-300 transition-all duration-300"
                onChange={handleFileChange}
              />
            </div>

            {/* Danh mục */}
            <div className="flex flex-col">
              <label className="text-sm font-bold text-pink-700 flex items-center mb-2">
                <span className="mr-2">📂</span> Danh mục
              </label>
              <select
                name="category_id"
                className="w-full p-3 rounded-lg border-2 border-pink-200 bg-pink-50 text-gray-700 focus:outline-none focus:border-pink-400 focus:bg-white transition-all duration-300"
                value={cake.category_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Nút bấm */}
          <div className="text-center mt-8">
            <button
              type="submit"
              className="bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-black font-bold py-3 px-8 rounded-full shadow-md transform hover:scale-105 transition-all duration-300 flex items-center justify-center mx-auto"
            >
              <span className="mr-2">🍰</span> Thêm bánh
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCake;