'use client';
import Link from 'next/link';
import React, { useEffect } from 'react';

function Navbar() {
  function handleScroll() {
    const bodyScroll = window.scrollY;
    const navbar = document.querySelector('.navbar');

    if (bodyScroll > 300) navbar.classList.add('nav-scroll');
    else navbar.classList.remove('nav-scroll');
  }
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  function handleDropdownMouseMove(event) {
    event.currentTarget.querySelector('.dropdown-menu')?.classList.add('show');
  }

  function handleDropdownMouseLeave(event) {
    event.currentTarget
      .querySelector('.dropdown-menu')
      ?.classList.remove('show');
  }
  function handleToggleNav() {
    if (
      document
        .querySelector('.navbar .navbar-collapse')
        ?.classList.contains('show')
    ) {
      document
        .querySelector('.navbar .navbar-collapse')
        ?.classList.remove('show');
    } else if (
      !document
        .querySelector('.navbar .navbar-collapse')
        ?.classList.contains('show')
    ) {
      document.querySelector('.navbar .navbar-collapse')?.classList.add('show');
    }
  }
  return (
    <nav className="navbar navbar-expand-lg bord blur">
      <div className="container o-hidden">
        <a className="logo icon-img-100" href="/home-personal">
          <img src="/assets/imgs/logo-light.png" alt="logo" />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={handleToggleNav}
        >
          <span className="icon-bar">
            <i className="fas fa-bars"></i>
          </span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" style={{ margin: 0 }} href="/home-personal">
                <span className="rolling-text">ANASAYFA</span>
              </a>
            </li>
            <li className="nav-item">
              <Link className="nav-link" style={{ margin: 0 }} href="/hakkimizda">
                <span className="rolling-text">HAKKIMIZDA</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" style={{ margin: 0 }} href="/hizmetler">
                <span className="rolling-text">HİZMETLER</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" style={{ margin: 0 }} href="/oncesi-sonrasi">
                <span className="rolling-text">ÖNCESİ SONRASI</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" style={{ margin: 0 }} href="/sss">
                <span className="rolling-text">SSS</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" style={{ margin: 0 }} href="/iletisim">
                <span className="rolling-text">İLETİŞİM</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="contact-button">
          <Link
            href="/randevu-al"
            className="butn butn-sm butn-bg main-colorbg radius-5"
          >
            <span className="text">Randevu Al</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
