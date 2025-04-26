import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Home.css';
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.jpg';

const Home = () => {
  return (
    <section className="banner position-relative">
      <div id="bannerCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
        
        {/* Indicators */}
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#bannerCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#bannerCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
        </div>

        {/* Slides */}
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={banner1} className="d-block w-100" alt="Bánh kem 1" />
          </div>
          <div className="carousel-item">
            <img src={banner2} className="d-block w-100" alt="Bánh kem 2" />
          </div>
        </div>

        {/* Controls */}
        <button className="carousel-control-prev" type="button" data-bs-target="#bannerCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#bannerCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>

        {/* Overlay */}
        <div className="banner-overlay">
          <h1 className="display-4 fw-bold text-pink">BAKERY CAKE</h1>
          <p className="lead text-pink">Chào mừng tới trang web</p>
          <a href="/api/" className="btn btn-light btn-lg mt-3">ĐẶT BÁNH NGAY</a>
        </div>

      </div>
    </section>
  );
};

export default Home;
