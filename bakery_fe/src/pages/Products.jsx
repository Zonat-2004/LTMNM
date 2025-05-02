import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CakeListAdmin = () => {
    const [cakes, setCakes] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/cakes/')
            .then(response => {
                console.log('Dữ liệu từ API:', response.data);
                setCakes(response.data);
            })
            .catch(error => {
                console.error('Lỗi khi tải danh sách bánh:', error);
            });
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            axios.delete(`http://localhost:8000/api/cakes/${id}/`)
                .then(() => {
                    setCakes(cakes.filter(cake => cake._id !== id));
                })
                .catch(error => {
                    console.error('Lỗi khi xóa bánh:', error);
                });
        }
    };

    const handleEdit = (id) => {
        window.location.href = `/admin/edit-cake/${id}`;
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">🍰 Quản lý Sản phẩm Bánh</h1>

            {/* Nút Thêm sản phẩm */}
            <div className="text-end mb-4">
                <Link to="/admin/add-cake" className="btn btn-success">
                    ➕ Thêm Sản phẩm
                </Link>
            </div>

            {/* Bảng Danh sách sản phẩm */}
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title">📋 Danh sách sản phẩm bánh</h5>
                </div>
                <div className="card-body">
                    <table className="table table-bordered table-striped text-center align-middle">
                        <thead className="table-danger">
                            <tr>
                                <th>ID</th>
                                <th>Tên bánh</th>
                                <th>Mô tả</th>
                                <th>Giá</th>
                                <th>Ảnh</th>
                                <th>Danh mục</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cakes.map((cake) => (
                                <tr key={cake._id}>
                                    <td>{cake._id}</td> {/* Cột ID mới */}
                                    <td>{cake.name}</td>
                                    <td>{cake.description}</td>
                                    <td>{cake.price} VND</td>
                                    <td>
                                        <img
                                            src={`http://localhost:8000${cake.image}`}
                                            alt={cake.name}
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                objectFit: 'cover',
                                                borderRadius: '8px'
                                            }}
                                        />
                                    </td>
                                    <td>{cake.category_name}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleEdit(cake._id)}
                                        >
                                            ✏️ Sửa
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(cake._id)}
                                        >
                                            🗑️ Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {cakes.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center">Không có sản phẩm nào</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
                .btn {
                    border-radius: 8px;
                }
                .table th, .table td {
                    vertical-align: middle;
                }
                .table-danger {
                    background-color: #ffccd5;
                }
            `}</style>
        </div>
    );
};

export default CakeListAdmin;
