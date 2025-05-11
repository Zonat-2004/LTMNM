import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'; // Thêm biểu tượng mắt

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || ''; // Lấy email từ ForgotPassword component
  const otp = location.state?.otp || ''; // Lấy OTP từ ForgotPassword component

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State để hiển thị mật khẩu

  // Nếu không có email, quay lại trang forgot-password
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password', {
        replace: true,
        state: { error: 'Vui lòng nhập email trước khi đặt lại mật khẩu.' }
      });
    }
  }, [email, navigate]);

  // Hàm để thay đổi mật khẩu
  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('Mật khẩu không khớp.');
      setMessageType('error');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8000/api/reset-password/', {
        email,
        otp,
        new_password: newPassword,
      });
      setMessage(res.data.message || 'Đổi mật khẩu thành công!');
      setMessageType('success');
      setTimeout(() => navigate('/login'), 3000); // Chuyển đến trang login sau khi đổi mật khẩu thành công
    } catch (err) {
      setMessage(err.response?.data?.error || 'Lỗi đổi mật khẩu.');
      setMessageType('error');
    }
  };

  // Hàm để toggle trạng thái hiển thị mật khẩu
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h2 style={styles.title}>Đặt Lại Mật Khẩu</h2>

        {message && (
          <div style={{ color: messageType === 'error' ? 'red' : 'green', marginBottom: '10px' }}>
            {message}
          </div>
        )}

        {/* Hiển thị email */}
        <div style={styles.formGroup}>
          <label>Email của bạn</label>
          <div style={styles.inputGroup}>
            <span style={styles.icon}><FaEnvelope /></span>
            <input
              type="email"
              value={email}
              disabled
              style={{
                ...styles.input,
                backgroundColor: '#eee',
                cursor: 'not-allowed',
                color: '#666',
              }}
            />
          </div>
        </div>

        {/* Hiển thị OTP */}
        {otp && (
          <div style={styles.formGroup}>
            <label>Mã OTP</label>
            <div style={styles.inputGroup}>
              <span style={styles.icon}><FaLock /></span>
              <input
                type="text"
                value={otp}
                disabled
                style={{
                  ...styles.input,
                  backgroundColor: '#eee',
                  cursor: 'not-allowed',
                  color: '#666',
                }}
              />
            </div>
          </div>
        )}

        {/* Nhập mật khẩu mới */}
        <div style={styles.formGroup}>
          <label htmlFor="newPassword">Mật khẩu mới</label>
          <div style={styles.inputGroup}>
            <span style={styles.icon}><FaLock /></span>
            <input
              type={showPassword ? 'text' : 'password'} // Toggle giữa password và text
              id="newPassword"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
            />
            <span onClick={togglePasswordVisibility} style={styles.eyeIcon}>
              {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Hiển thị biểu tượng mắt */}
            </span>
          </div>
        </div>

        {/* Xác nhận mật khẩu */}
        <div style={styles.formGroup}>
          <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
          <div style={styles.inputGroup}>
            <span style={styles.icon}><FaLock /></span>
            <input
              type={showPassword ? 'text' : 'password'} // Toggle giữa password và text
              id="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
            />
            <span onClick={togglePasswordVisibility} style={styles.eyeIcon}>
              {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Hiển thị biểu tượng mắt */}
            </span>
          </div>
        </div>

        {/* Button Đổi mật khẩu */}
        <button onClick={handleReset} style={styles.button}>
          Đổi mật khẩu
        </button>

        {/* Link quay lại trang login */}
        <div style={styles.backButton}>
          <Link to="/login" style={styles.link}>
            ⬅ Quay lại
          </Link>
        </div>
      </div>
    </div>
  );
}

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
  eyeIcon: {
    color: '#d63384',
    fontSize: '20px',
    cursor: 'pointer',
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
  backButton: {
    display: 'block',
    marginTop: '10px',
    color: 'black',
    fontWeight: 'bold',
    textDecoration: 'none',
    fontSize: '14px',
  },
  link: {
    fontWeight: 'bold',
    color: 'black',
    textDecoration: 'none',
  },
};

export default ResetPassword;
