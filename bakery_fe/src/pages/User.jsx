import React, { useEffect, useState } from 'react';
import axios from 'axios';

const User = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({ name: '', email: '', phone: '', password: '' });

  useEffect(() => {
    axios.get('http://localhost:8000/api/users/')
      .then((res) => setUsers(res.data))
      .catch((err) => console.error('Lỗi khi lấy người dùng:', err));
  }, []);

  const handleEditUser = (id) => {
    const userToEdit = users.find((usr) => usr._id === id);
    setEditingUser(userToEdit);
    setUpdatedUser({
      name: userToEdit.name,
      email: userToEdit.email,
      phone: userToEdit.phone,
      password: userToEdit.password,
    });
  };

  const handleUpdateUser = () => {
    if (!updatedUser.name || !updatedUser.email || !updatedUser.phone || !updatedUser.password) return;

    axios.put(`http://localhost:8000/api/users/${editingUser._id}/`, updatedUser)
      .then((res) => {
        setUsers(users.map((usr) => (usr._id === editingUser._id ? res.data : usr)));
        setEditingUser(null);
        setUpdatedUser({ name: '', email: '', phone: '', password: '' });
      })
      .catch((err) => console.error('Lỗi khi sửa người dùng:', err));
  };

  const handleDeleteUser = (id) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?');
    if (!confirmDelete) return;

    axios.delete(`http://localhost:8000/api/users/${id}/`)
      .then(() => {
        setUsers(users.filter((usr) => usr._id !== id));
      })
      .catch((err) => console.error('Lỗi khi xóa người dùng:', err));
  };

  return (
    <div className="container py-5">
      <h2 className="text-center text-danger mb-4">👤 Danh sách người dùng</h2>

      <div className="text-end mb-4">
        <button className="btn btn-success">
          ➕ Thêm Người Dùng
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-danger">
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Điện thoại</th>
              <th>Mật khẩu</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.password}</td>
                  <td>
                    <button className="btn btn-warning btn-sm" onClick={() => handleEditUser(user._id)}>
                      ✏️ Sửa
                    </button>
                    <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDeleteUser(user._id)}>
                      🗑️ Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">Không có người dùng nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form sửa người dùng */}
      {editingUser && (
        <div className="card mt-5 shadow-sm p-4">
          <h4 className="mb-4 text-primary text-center">✏️ Cập nhật thông tin người dùng</h4>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Tên</label>
              <input
                type="text"
                className="form-control"
                value={updatedUser.name}
                onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={updatedUser.email}
                onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Số điện thoại</label>
              <input
                type="text"
                className="form-control"
                value={updatedUser.phone}
                onChange={(e) => setUpdatedUser({ ...updatedUser, phone: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Mật khẩu</label>
              <input
                type="password"
                className="form-control"
                value={updatedUser.password}
                onChange={(e) => setUpdatedUser({ ...updatedUser, password: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4 text-end">
            <button className="btn btn-primary me-2" onClick={handleUpdateUser}>
              ✅ Cập nhật
            </button>
            <button className="btn btn-secondary" onClick={() => setEditingUser(null)}>
              ❌ Hủy
            </button>
          </div>
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

        .btn:hover {
          opacity: 0.8;
        }

        .table-hover tbody tr:hover {
          background-color: #fafafa;
        }

        .form-control {
          border-radius: 8px;
        }

        .card {
          border-radius: 12px;
          background-color: #fdfdfd;
        }
      `}</style>
    </div>
  );
};

export default User;
