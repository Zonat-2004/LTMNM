import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8000/api/login/', {
        phone,
        password,
      });
      // alert(res.data.message);
      // ✅ Lưu thông tin người dùng vào localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Đăng nhập thất bại.');
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h2 style={styles.title}>ĐĂNG NHẬP</h2>

        {errorMessage && (
          <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>
        )}

        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="Nhập số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            ĐĂNG NHẬP
          </button>
        </form>

        <div style={styles.registerLink}>
          Bạn chưa có tài khoản? <Link to="/register" style={styles.link}>Đăng ký ngay</Link>
        </div>

        <Link to="/forgot-password" style={styles.forgotPassword}>Quên mật khẩu</Link>
        <Link to="/" style={styles.backButton}>⬅ Quay lại</Link>
      </div>
    </div>
  );
};

const styles = {
  body: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#ff52c0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    margin: 0,
  },
  container: {
    background: 'white',
    padding: '30px',
    borderRadius: '20px',
    width: '350px',
    textAlign: 'center',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'black',
    marginBottom: '20px',
  },
  inputGroup: {
    margin: '15px 0',
    textAlign: 'left',
  },
  input: {
    width: 'calc(100% - 20px)',
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    backgroundColor: '#f8f8f8',
    fontSize: '16px',
    display: 'block',
    margin: 'auto',
  },
  button: {
    width: '100%',
    backgroundColor: '#ff52c0',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '20px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  registerLink: {
    marginTop: '10px',
    fontSize: '14px',
  },
  link: {
    fontWeight: 'bold',
    color: 'black',
    textDecoration: 'none',
  },
  forgotPassword: {
    color: 'red',
    fontSize: '14px',
    marginTop: '10px',
    display: 'block',
    textDecoration: 'none',
  },
  backButton: {
    color: 'red',
    fontSize: '14px',
    marginTop: '10px',
    display: 'block',
    textDecoration: 'none',
  },
};

export default LoginPage;
