import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="Logo" />
          <p> Tomato delivers fresh, delicious meals from your favorite local restaurants to your doorstep, fast and hassle-free. Eat happy, anytime!
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="Facebook" />
            <img src={assets.twitter_icon} alt="Twitter" />
            <img src={assets.linkedin_icon} alt="LinkedIn" />
          </div>
        </div>

        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+983-456-5250</li>
            <li>Contact: amansh@gmail.com</li>
          </ul>
        </div>
      </div>

      <hr />
      <p className="footer-copyright">
        Copyright 2025 © amansh.com — All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
