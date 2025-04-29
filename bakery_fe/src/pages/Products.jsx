import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link nếu bạn muốn điều hướng sang trang thêm sản phẩm

const CakeListAdmin = () => {
    const [cakes, setCakes] = useState([]);

    // Lấy danh sách bánh từ API
    useEffect(() => {
        axios.get('http://localhost:8000/api/cakes/')
            .then(response => {
                console.log('Dữ liệu từ API:', response.data);  // ← thêm dòng này
                setCakes(response.data);
            })
            .catch(error => {
                console.error('Lỗi khi tải danh sách bánh:', error);
            });
    }, []);

    // Xóa sản phẩm bánh
    const handleDelete = (id) => {
        // Xác nhận trước khi xóa
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            axios.delete(`http://localhost:8000/api/cakes/${id}/`)
                .then(() => {
                    setCakes(cakes.filter(cake => cake._id !== id)); // Cập nhật danh sách bánh sau khi xóa
                })
                .catch(error => {
                    console.error('Lỗi khi xóa bánh:', error);
                });
        }
    };

    // Thực hiện điều hướng tới trang chỉnh sửa bánh
    const handleEdit = (id) => {
        // Điều hướng đến trang chỉnh sửa bánh, truyền theo ID bánh
        window.location.href = `/admin/edit-cake/${id}`;
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Quản lý Sản phẩm Bánh</h1>

            {/* Nút Thêm sản phẩm */}
            <div className="text-end mb-4">
                <Link to="/admin/add-cake" className="btn btn-success">
                    Thêm Sản phẩm
                </Link>
            </div>

            {/* Bảng Danh sách sản phẩm */}
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title">Danh sách sản phẩm bánh</h5>
                </div>
                <div className="card-body">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Tên bánh</th>
                                <th>Mô tả</th>
                                <th>Giá</th>
                                <th>Ảnh</th>
                                <th>Danh mục</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>{cakes.map((cake) => (
                                <tr key={cake._id}>
                                    <td>{cake.name}</td>
                                    <td>{cake.description}</td>
                                    <td>{cake.price} VND</td>
                                    <td>
                                        <img
                                            src={`http://localhost:8000${cake.image}`}
                                            alt={cake.name}
                                            style={{ width: '100px', 
                                            height: '100px', 
                                            objectFit: 'cover', 
                                            borderRadius: '8px' 
                                        }}
                                        />
                                    </td>
                                    <td>{cake.category_name}</td>
                                    <td>
                                        <button className="btn btn-warning me-2" onClick={() => handleEdit(cake._id)}>
                                            Sửa
                                        </button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(cake._id)}>
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CakeListAdmin;
