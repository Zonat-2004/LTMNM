import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Home.css';
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.jpg';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [featuredCakes, setFeaturedCakes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/cakes/')
      .then(response => {
        const shuffledCakes = shuffleArray(response.data);
        setFeaturedCakes(shuffledCakes.slice(0, 7)); // Lấy 7 sản phẩm ngẫu nhiên
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

  // Cuộn sang trái
  const scrollLeft = () => {
    const container = document.getElementById('scroll-container');
    if (container.scrollLeft <= 0) {
      container.scrollLeft = container.scrollWidth - container.offsetWidth; // Cuộn về cuối danh sách
    } else {
      container.scrollBy({ left: -600, behavior: 'smooth' }); // Cuộn sang trái
    }
  };

  // Cuộn sang phải
  const scrollRight = () => {
    const container = document.getElementById('scroll-container');
    if (container.scrollLeft + container.offsetWidth >= container.scrollWidth) {
      container.scrollLeft = 0; // Cuộn về đầu danh sách
    } else {
      container.scrollBy({ left: 600, behavior: 'smooth' }); // Cuộn sang phải
    }
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

          <div className="banner-overlay">
            <h1 className="display-4 fw-bold text-pink">BAKERY CAKE</h1>
            <p className="lead text-pink">Chào mừng tới trang web</p>
            <Link to="/cakes" className="btn btn-light btn-lg mt-3">ĐẶT BÁNH NGAY</Link>
          </div>
        </div>
      </section>

      {/* Sản phẩm nổi bật dạng cuộn ngang */}
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
                  <p className="featured-cake-price">{`Giá: ${cake.price} VNĐ`}</p>
                  <button className="featured-btn-buy mt-auto">💗 Mua ngay</button>
                </div>
              </div>
            ))}
          </div>

          <button className="scroll-btn right" onClick={scrollRight}>›</button>
        </div>
      </section>
    </>
  );
};

export default Home;
