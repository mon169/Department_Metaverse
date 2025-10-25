import React from 'react';

function Header() {
  return (
    <nav className="navbar navbar-expand-lg bg-secondary text-uppercase fixed-top">
      <div className="container">
        <a className="navbar-brand" href="#page-top">software-engineering-metaverse</a>
        <button
          className="navbar-toggler text-uppercase font-weight-bold bg-primary text-white rounded"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          메뉴
          <i className="fas fa-bars"></i>
        </button>
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav ms-auto"></ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;