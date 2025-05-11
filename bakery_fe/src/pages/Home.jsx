import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Home.css';
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.jpg';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [featuredCakes, setFeaturedCakes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/cakes/')
      .then(response => {
        const shuffledCakes = shuffleArray(response.data);
        setFeaturedCakes(shuffledCakes.slice(0, 7));
      })
      .catch(error => {
        console.error('Lỗi khi lấy sản phẩm:', error);
      });
  }, []);

  const shuffleArray = (array) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const scrollLeft = () => {
    const container = document.getElementById('scroll-container');
    if (container.scrollLeft <= 0) {
      container.scrollLeft = container.scrollWidth - container.offsetWidth;
    } else {
      container.scrollBy({ left: -600, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('scroll-container');
    if (container.scrollLeft + container.offsetWidth >= container.scrollWidth) {
      container.scrollLeft = 0;
    } else {
      container.scrollBy({ left: 600, behavior: 'smooth' });
    }
  };

  const handleAddToCart = (cake) => {
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const cakeIndex = existingCart.findIndex(item => item._id === cake._id);

    if (cakeIndex >= 0) {
      existingCart[cakeIndex].quantity += 1;
    } else {
      cake.quantity = 1;
      existingCart.push(cake);
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    alert(`✅ Đã thêm "${cake.name}" vào giỏ hàng!`);
  };

  return (
    <>
      <section className="banner position-relative">
        <div id="bannerCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#bannerCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#bannerCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
          </div>

          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={banner1} className="banner-img d-block w-100" alt="Bánh kem 1" />
            </div>
            <div className="carousel-item">
              <img src={banner2} className="banner-img d-block w-100" alt="Bánh kem 2" />
            </div>
          </div>

          <button className="carousel-control-prev" type="button" data-bs-target="#bannerCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#bannerCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>

          <div className="banner-overlay text-center">
            <h1 className="hero-title">BAKERY CAKE</h1>
            <p className="hero-subtitle">Chào mừng tới trang web</p>
            <Link to="/cakes" className="btn btn-light btn-lg mt-3">ĐẶT BÁNH NGAY</Link>
          </div>
        </div>
      </section>

      <section className="featured-products py-5">
        <div className="container position-relative">
          <h2 className="text-center mb-4 text-pink">Sản phẩm nổi bật</h2>

          <button className="scroll-btn left" onClick={scrollLeft}>‹</button>

          <div className="featured-product-list-horizontal" id="scroll-container">
            {featuredCakes.map((cake) => (
              <div key={cake._id} className="featured-cake-card">
                <div className="featured-cake-image-wrapper">
                  <img
                    src={`http://localhost:8000${cake.image}`}
                    className="featured-cake-image"
                    alt={cake.name}
                  />
                </div>
                <div className="featured-cake-body d-flex flex-column">
                  <h5 className="featured-cake-title">{cake.name}</h5>
                  <p className="featured-cake-description">{cake.description}</p>
                  <p className="featured-cake-price">{`Giá: ${cake.price.toLocaleString()} VND`}</p>
                  <div className="d-flex gap-2 mt-auto">
                    <button className="featured-btn-buy flex-fill" onClick={() => navigate('/orderform', { state: { cake } })}>
                      💗 Mua ngay
                    </button>
                    <button className="featured-btn-cart" onClick={() => handleAddToCart(cake)}>
                      🛒
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="scroll-btn right" onClick={scrollRight}>›</button>
        </div>
      </section>

      <style>{`
        .hero-title {
          font-size: 4rem;
          font-weight: 800;
          color: #ffccda;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          letter-spacing: 2px;
        }

        .hero-subtitle {
          font-size: 1.5rem;
          font-weight: 500;
          color: #fff3f6;
          text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
          margin-top: 10px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .featured-btn-cart {
          background-color: #ffe082;
          color: #5d4037;
          border: none;
          border-radius: 20px;
          padding: 8px;
          font-weight: bold;
          transition: background 0.3s;
          width: 50px;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .featured-btn-cart:hover {
          background-color: #ffd54f;
        }

        .featured-btn-buy {
          background: linear-gradient(135deg, #ff85a2, #f06292);
          color: white;
          border: none;
          border-radius: 30px;
          padding: 10px;
          font-weight: bold;
          transition: background 0.3s;
          width: 100%;
        }

        .featured-btn-buy:hover {
          background: linear-gradient(135deg, #f06292, #ff85a2);
        }

        .scroll-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          font-size: 2rem;
          padding: 10px;
          cursor: pointer;
          border-radius: 50%;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .scroll-btn.left {
          left: 20px;
        }

        .scroll-btn.right {
          right: 20px;
        }

        .scroll-btn:hover {
          background-color: rgba(0, 0, 0, 0.7);
        }
      `}</style>
    </>
  );
};

export default Home;
