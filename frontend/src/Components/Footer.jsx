import React from "react";
import "./Footer.css";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { SiAdidas } from "react-icons/si";
import { SiNike } from "react-icons/si";
import { SiPuma } from "react-icons/si";
import { SiFifa } from "react-icons/si";
import { SiEmirates } from "react-icons/si";
import { FaWhatsapp } from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Kisima FC</h3>
          <p className="footer-texts">
            Uniting our community through football.
          </p>
          <p className="footer-texts">
            <span>Home Ground:</span>Mahiga Primary, Nairobi
          </p>
        </div>
        <div className="footer-section">
          <h3 className="footer-title">Contact Us</h3>
          <p className="footer-text">
            <span>EMAIL:</span> info@kisima-fc
          </p>
          <p className="footer-text">
            {" "}
            <span>PHONE:</span> <li>+254 722387463</li> <li>+254 738049143</li>{" "}
            <li>+254 716487084</li>
          </p>
        </div>
        <div className="footer-section">
          <h3 className="footer-title">Follow Us</h3>
          <div className="footer-socials">
            <a
              href="https://www.facebook.com/profile.php?id=100083523874353"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook />
            </a>
            <a
              href="https://chat.whatsapp.com/JhKMm8iupRxLU2h3dk9KgU"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://instagram.com/kisima.fc"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com/kisima.fc"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsTwitterX />
            </a>
          </div>
        </div>
      </div>

      <div className="sports-logos">
        <ul>
          <li>
            <SiAdidas />
          </li>
          <li>
            <SiNike />
          </li>
          <li>
            <SiPuma />
          </li>
          <li>
            <SiFifa />
          </li>
          <li>
            <SiEmirates />
          </li>
        </ul>
      </div>
      <div className="footer-bottom">
        <p className="footer-bottom-text">
          © {currentYear} Kisima FC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
