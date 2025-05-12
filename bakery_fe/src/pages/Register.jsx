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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      if (!otpSent) {
        await axios.post('http://localhost:8000/api/send-otp-register/', { email });
        setOtpSent(true);
        alert('Mã OTP đã được gửi đến email của bạn!');
      } else {
        await axios.post('http://localhost:8000/api/registers/', {
          name,
          phone,
          email,
          password,
          otp,
        });
        alert('Đăng ký thành công!');
        navigate('/login');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Đã xảy ra lỗi. Vui lòng thử lại!';
      setError(errorMsg);
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h2 style={styles.title}>ĐĂNG KÝ</h2>
        <form onSubmit={handleSubmit}>
          <InputField label="Họ và Tên" name="name" value={formData.name} onChange={handleChange} icon="fas fa-user" />
          <InputField label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} icon="fas fa-phone" />
          <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} icon="fas fa-envelope" />

          <PasswordField
            label="Mật khẩu"
            name="password"
            value={formData.password}
            onChange={handleChange}
            show={showPassword}
            toggle={() => setShowPassword(!showPassword)}
          />

          <PasswordField
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            show={showConfirmPassword}
            toggle={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          {otpSent && (
            <div style={styles.formGroup}>
              <label>Nhập mã OTP</label>
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Nhập mã OTP"
                required
                style={styles.input}
              />
            </div>
          )}

          {error && <div style={styles.errorText}>{error}</div>}

          <button type="submit" style={styles.button}>
            {otpSent ? 'Xác nhận OTP và Đăng ký' : 'Gửi OTP'}
          </button>
        </form>
        <p style={styles.text}>
          Bạn đã có tài khoản? <Link to="/login" style={styles.link}>Đăng nhập</Link>
        </p>
        <Link to="/" style={styles.backButton}>⬅ Quay lại</Link>
      </div>
    </div>
  );
};

const InputField = ({ label, name, type = 'text', value, onChange, icon }) => (
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

const PasswordField = ({ label, name, value, onChange, show, toggle }) => (
  <div style={styles.formGroup}>
    <label>{label}</label>
    <div style={styles.inputGroup}>
      <span style={styles.icon}><i className="fas fa-lock"></i></span>
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Nhập ${label.toLowerCase()}`}
        required
        style={styles.input}
      />
      <span onClick={toggle} style={styles.eyeIcon}>
        <i className={`fas ${show ? "fa-eye-slash" : "fa-eye"}`}></i>
      </span>
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
    marginBottom: '10px',
  },
  eyeIcon: {
    cursor: 'pointer',
    fontSize: '20px',
    color: '#d63384',
  },
};

export default Register;
