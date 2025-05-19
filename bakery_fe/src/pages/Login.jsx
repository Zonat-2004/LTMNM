import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState(''); // Đổi thành email
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8000/api/token/', {
        email, // Gửi email thay vì phone
        password,
      });

      localStorage.setItem('access', res.data.access);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      if (res.data.user.is_staff) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Đăng nhập thất bại.');
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h2 style={styles.title}>ĐĂNG NHẬP</h2>
        {errorMessage && <div style={styles.errorText}>{errorMessage}</div>}
        
        <form onSubmit={handleLogin}>
          <InputField
            label="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon="fas fa-envelope"
          />
          <InputField
            label="Mật khẩu"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon="fas fa-lock"
            toggleVisibility={() => setShowPassword(!showPassword)}
            showPassword={showPassword}
          />
          <button type="submit" style={styles.button}>ĐĂNG NHẬP</button>
        </form>

        <p style={styles.text}>
          Bạn chưa có tài khoản? <Link to="/register" style={styles.link}>Đăng ký ngay</Link>
        </p>
        <p style={styles.text}>
          <Link to="/forget" style={styles.link}>Quên mật khẩu?</Link>
        </p>
        <Link to="/" style={styles.backButton}>⬅ Quay lại</Link>
      </div>
    </div>
  );
};

const InputField = ({ label, name, type = "text", value, onChange, icon, toggleVisibility, showPassword }) => (
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
      {toggleVisibility && (
        <span onClick={toggleVisibility} style={styles.eyeIcon}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      )}
    </div>
  </div>
);

const styles = {
  // (giữ nguyên phần style như bạn đã làm)
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

export default LoginPage;
