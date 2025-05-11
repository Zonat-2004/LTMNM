import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa'; // Thêm icon email

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const navigate = useNavigate();

  // Gửi OTP
  const handleSendOTP = async () => {
    if (!email) {
      setMessage('Vui lòng nhập email.');
      setMessageType('error');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8000/api/forgot-password/', { email });
      setMessage(res.data.message); // Gửi OTP thành công
      setMessageType('success');
      setIsOtpSent(true); // Đánh dấu OTP đã được gửi
    } catch (err) {
      setMessage(err.response?.data?.error || 'Lỗi gửi OTP.');
      setMessageType('error');
    }
  };

  // Xác minh OTP
  const handleVerifyOTP = async () => {
    if (!otp) {
      setMessage('Vui lòng nhập mã OTP.');
      setMessageType('error');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8000/api/reset-password/verify/', { email, otp });
      if (res.data.verified) {
        // Truyền cả email và OTP qua state
        navigate('/reset-password', { state: { email, otp } }); 
      } else {
        setMessage('OTP không đúng.');
        setMessageType('error');
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Lỗi xác minh OTP.');
      setMessageType('error');
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h2 style={styles.title}>Quên Mật Khẩu</h2>

        {message && (
          <div style={{ color: messageType === 'error' ? 'red' : 'green', marginBottom: '10px' }}>
            {message}
          </div>
        )}

        {/* Input Email */}
        <div style={styles.formGroup}>
          <label>Email</label>
          <div style={styles.inputGroup}>
            <span style={styles.icon}><FaEnvelope /></span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
              style={styles.input}
            />
          </div>
        </div>
        <button onClick={handleSendOTP} style={styles.button}>
          Gửi mã OTP
        </button>

        {/* Chuyển sang form nhập OTP sau khi OTP đã gửi thành công */}
        {isOtpSent && (
          <>
            <div style={styles.formGroup}>
              <label>Mã OTP</label>
              <div style={styles.inputGroup}>
                <span style={styles.icon}><i className="fas fa-lock"></i></span>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Nhập mã OTP"
                  style={styles.input}
                />
              </div>
            </div>
            <button onClick={handleVerifyOTP} style={styles.button}>
              Xác nhận OTP
            </button>
          </>
        )}

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

export default ForgotPassword;
