import React from 'react';
import '../css/Footer.css';

const Footer = () => {
  return (
    <>
      {/* Footer Services */}
      <footer className="footer-services">
        <div className="container text-center">
          <h3 className="fw-bold">Services We Offer</h3>

          <div className="services-grid-3">
            <div className="service-item">
              <i className="fas fa-cookie-bite"></i>
              <h5>Cookies Cakes</h5>
              <p>We offer the best cookies cakes. Lorem Ipsum is simply dummy text.</p>
            </div>
            <div className="service-item">
              <i className="fas fa-birthday-cake"></i>
              <h5>Tasty Cupcakes</h5>
              <p>Absolutely delicious cake</p>
            </div>
            <div className="service-item">
              <i className="fas fa-heart"></i>
              <h5>Wedding Cakes</h5>
              <p>Check out our tasty wedding cakes.</p>
            </div>
            <div className="service-item">
              <i className="fas fa-book-open"></i>
              <h5>Awesome Recipes</h5>
              <p>Discover amazing recipes for baking lovers.</p>
            </div>
            <div className="service-item">
              <i className="fas fa-utensils"></i>
              <h5>Menu Planner</h5>
              <p>Customizable menu planning services.</p>
            </div>
            <div className="service-item">
              <i className="fas fa-truck"></i>
              <h5>Home Delivery</h5>
              <p>We provide free home delivery for orders.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Footer Company Info */}
      <footer className="footer-company">
        <div className="container">
          <div className="company-grid">
            <div>
              <h4 className="brand-name">Cakecious</h4>
              <p>Cakecious is a WordPress theme for Bakery and related businesses.</p>
              <div className="social-icons">
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-linkedin-in"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-google-plus-g"></i></a>
              </div>
            </div>

            <div>
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li><a href="#">Your Account</a></li>
                <li><a href="#">View Order</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms & Conditions</a></li>
              </ul>
            </div>

            <div>
              <h5>Work Times</h5>
              <p>Mon - Thu: 8 am - 8 pm</p>
              <p>Fri: 8 am - 8 pm</p>
              <p>Sat: 9 am - 4 pm</p>
              <p>Sun: Closed</p>
            </div>

            <div>
              <h5>Contact Info</h5>
              <p className="fw-bold">(1800) 574 9687</p>
              <p>TBK Baker</p>
              <p>000 Lê Văn Sỹ </p>
              <p><a href="mailto:cakeciousdemo@email.com">tbkbakery000@gmail.com</a></p>
            </div>
          </div>

          <hr />
          <div className="text-center">
            <p>Bakery TBK &copy; 2025 All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
