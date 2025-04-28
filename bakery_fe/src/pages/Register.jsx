import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h2 style={styles.title}>ĐĂNG KÝ</h2>
        <form>
          <div style={styles.formGroup}>
            <label>Họ và Tên</label>
            <div style={styles.inputGroup}>
              <span style={styles.icon}><i className="fas fa-user"></i></span>
              <input type="text" placeholder="Nhập họ và tên" required style={styles.input} />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label>Số điện thoại</label>
            <div style={styles.inputGroup}>
              <span style={styles.icon}><i className="fas fa-phone"></i></span>
              <input type="text" placeholder="Nhập số điện thoại" required style={styles.input} />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label>Email</label>
            <div style={styles.inputGroup}>
              <span style={styles.icon}><i className="fas fa-envelope"></i></span>
              <input type="email" placeholder="Nhập email" required style={styles.input} />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label>Mật khẩu</label>
            <div style={styles.inputGroup}>
              <span style={styles.icon}><i className="fas fa-lock"></i></span>
              <input type="password" placeholder="Nhập mật khẩu" required style={styles.input} />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label>Xác nhận mật khẩu</label>
            <div style={styles.inputGroup}>
              <span style={styles.icon}><i className="fas fa-key"></i></span>
              <input type="password" placeholder="Xác nhận mật khẩu" required style={styles.input} />
            </div>
          </div>

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
    transform: 'scale(0.9)',
    transformOrigin: 'center',
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
};

export default Register;
