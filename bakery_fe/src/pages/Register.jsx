import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State để hiển thị mật khẩu
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State cho xác nhận mật khẩu
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Xoá lỗi khi người dùng chỉnh sửa
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/registers/', {
        name,
        phone,
        email,
        password,
      });
      alert('Đăng ký thành công!');
      navigate('/login');
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Lỗi đăng ký. Vui lòng thử lại.';
      setError(errorMsg);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword); // Chuyển trạng thái hiển thị mật khẩu
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword); // Chuyển trạng thái hiển thị xác nhận mật khẩu
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h2 style={styles.title}>ĐĂNG KÝ</h2>
        <form onSubmit={handleSubmit}>
          <InputField label="Họ và Tên" name="name" value={formData.name} onChange={handleChange} icon="fas fa-user" />
          <InputField label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} icon="fas fa-phone" />
          {error.toLowerCase().includes('số điện thoại') && (
            <div style={styles.errorText}>{error}</div>
          )}
          <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} icon="fas fa-envelope" />
          {error.toLowerCase().includes('email') && (
            <div style={styles.errorText}>{error}</div>
          )}
          <div style={styles.formGroup}>
            <label>Mật khẩu</label>
            <div style={styles.inputGroup}>
              <span style={styles.icon}><i className="fas fa-lock"></i></span>
              <input
                type={showPassword ? "text" : "password"} // Thay đổi type dựa trên trạng thái showPassword
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                required
                style={styles.input}
              />
              <span 
                onClick={togglePassword} 
                style={styles.eyeIcon}>
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>
          </div>
          <div style={styles.formGroup}>
            <label>Xác nhận mật khẩu</label>
            <div style={styles.inputGroup}>
              <span style={styles.icon}><i className="fas fa-key"></i></span>
              <input
                type={showConfirmPassword ? "text" : "password"} // Thay đổi type dựa trên trạng thái showConfirmPassword
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Xác nhận mật khẩu"
                required
                style={styles.input}
              />
              <span 
                onClick={toggleConfirmPassword} 
                style={styles.eyeIcon}>
                <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>
          </div>
          {error && !error.toLowerCase().includes('số điện thoại') && !error.toLowerCase().includes('email') && (
            <div style={styles.errorText}>{error}</div>
          )}
          <button type="submit" style={styles.button}>ĐĂNG KÝ</button>
        </form>
        <p style={styles.text}>
          Bạn đã có tài khoản? <Link to="/login" style={styles.link}>Đăng nhập</Link>
        </p>
        <Link to="/" style={styles.backButton}>⬅ Quay lại</Link>
      </div>
    </div>
  );
};

const InputField = ({ label, name, type = "text", value, onChange, icon }) => (
  <div style={styles.formGroup}>
    <label>{label}</label>
    <div style={styles.inputGroup}>
      <span style={styles.icon}><i className={icon}></i></span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Nhập ${label.toLowerCase()}`}
        required
        style={styles.input}
      />
    </div>
  </div>
);

const styles = {
  body: {
    backgroundColor: '#ff66b2',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '20px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    width: '420px',
    textAlign: 'center',
    border: '6px solid #ff66b2',
  },
  title: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: '26px',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '15px',
    textAlign: 'left',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    background: '#f8e6eb',
    borderRadius: '30px',
    padding: '10px 15px',
    border: '2px solid #ddd',
  },
  icon: {
    color: '#d63384',
    fontSize: '18px',
    paddingRight: '10px',
  },
  input: {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    width: '100%',
    fontSize: '16px',
    padding: '5px',
  },
  button: {
    backgroundColor: '#ff66b2',
    color: 'white',
    fontSize: '18px',
    border: 'none',
    padding: '12px',
    width: '100%',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: '10px',
  },
  text: {
    marginTop: '15px',
    fontSize: '14px',
  },
  link: {
    fontWeight: 'bold',
    color: 'black',
    textDecoration: 'none',
  },
  backButton: {
    display: 'block',
    marginTop: '10px',
    color: 'black',
    fontWeight: 'bold',
    textDecoration: 'none',
    fontSize: '14px',
  },
  errorText: {
    color: 'red',
    fontSize: '14px',
    marginTop: '5px',
    textAlign: 'left',
    marginBottom: '10px',
  },
  eyeIcon: {
    cursor: 'pointer',
    fontSize: '20px',
    color: '#d63384',
  },
};

export default Register;
