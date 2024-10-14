import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import logo from "../logos/Designer.jpeg";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-header">
        <div className="logo">
          {" "}
          <img src={logo} alt="KISIMA FC Logo" />
        </div>

        <h1 className="nav-head">KISIMA FC</h1>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to={"/"}>News </Link>
        </li>
        <li>
          <Link to={"/team"}>Team </Link>
        </li>
        <li>
          <Link to={"/schedule-page"}>Fixtures </Link>
        </li>
        <li>
          <Link to={"/academy"}>Academy </Link>
        </li>
        <li>
          <Link to={"/about"}>About</Link>
        </li>
        <li>
          <Link to={"/history"}>History </Link>
        </li>
        <li>
          <Link to={"/admin"}>Admin </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
