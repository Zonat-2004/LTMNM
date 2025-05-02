import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [updatedCategoryName, setUpdatedCategoryName] = useState('');

  // Lấy danh sách danh mục
  useEffect(() => {
    axios.get('http://localhost:8000/api/categories/')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Lỗi khi lấy danh mục:', err));
  }, []);

  // Thêm danh mục mới
  const handleAddCategory = () => {
    if (!newCategory.trim()) return;

    axios.post('http://localhost:8000/api/categories/', { name: newCategory })
      .then((res) => {
        setCategories([...categories, res.data]);
        setNewCategory('');
      })
      .catch((err) => console.error('Lỗi khi thêm danh mục:', err));
  };

  // Sửa danh mục
  const handleEditCategory = (id) => {
    const categoryToEdit = categories.find((cat) => cat._id === id);
    setEditingCategory(categoryToEdit);
    setUpdatedCategoryName(categoryToEdit.name);
  };

  const handleUpdateCategory = () => {
    if (!updatedCategoryName.trim()) return;

    axios.put(`http://localhost:8000/api/categories/${editingCategory._id}/`, { name: updatedCategoryName })
      .then((res) => {
        setCategories(categories.map((cat) => (cat._id === editingCategory._id ? res.data : cat)));
        setEditingCategory(null);
        setUpdatedCategoryName('');
      })
      .catch((err) => console.error('Lỗi khi sửa danh mục:', err));
  };

  // Xóa danh mục
  const handleDeleteCategory = (id) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa danh mục này không?');
    if (!confirmDelete) return;

    axios.delete(`http://localhost:8000/api/categories/${id}/`)
      .then(() => {
        setCategories(categories.filter((cat) => cat._id !== id));
      })
      .catch((err) => console.error('Lỗi khi xóa danh mục:', err));
  };

  return (
    <div className="container py-5">
      <h2 className="text-center text-danger mb-4">📂 Danh mục sản phẩm</h2>

      {/* Form thêm danh mục */}
      <div className="mb-4 d-flex gap-2 align-items-center">
        <input
          type="text"
          className="form-control w-75"
          placeholder="Nhập tên danh mục mới"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button className="btn btn-success" onClick={handleAddCategory}>
          ➕ Thêm danh mục
        </button>
      </div>

      {/* Bảng danh mục */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-danger">
            <tr>
              <th>ID</th> {/* Cột ID */}
              <th>Tên danh mục</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <tr key={cat._id}>
                  <td>{cat._id}</td> {/* Hiển thị ID */}
                  <td>{cat.name}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEditCategory(cat._id)}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => handleDeleteCategory(cat._id)}
                    >
                      🗑️ Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">Không có danh mục nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form sửa danh mục */}
      {editingCategory && (
        <div className="mt-4">
          <h4>Sửa danh mục</h4>
          <input
            type="text"
            className="form-control"
            value={updatedCategoryName}
            onChange={(e) => setUpdatedCategoryName(e.target.value)}
          />
          <button className="btn btn-primary mt-2" onClick={handleUpdateCategory}>
            ✅ Cập nhật
          </button>
          <button className="btn btn-secondary mt-2 ms-2" onClick={() => setEditingCategory(null)}>
            ❌ Hủy
          </button>
        </div>
      )}

      <style jsx>{`
        .table th, .table td {
          text-align: center;
          vertical-align: middle;
        }

        .table-danger {
          background-color: #ffccd5;
        }

        .btn {
          border-radius: 8px;
        }

        .container {
          max-width: 1200px;
        }
      `}</style>
    </div>
  );
};

export default Category;
