'use client';
import React, { useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import loadBackgroudImages from '@/common/loadBackgroudImages';

function Header() {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline();
    
    // Header entrance animation
    tl.fromTo(
      '.header-personal .caption h6',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '+=0.5'
    )
      .fromTo(
        '.header-personal .caption h1',
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo(
        '.header-personal .caption h3',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.6'
      )
      .fromTo(
        '.header-personal .caption p',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(
        '.header-personal .caption .butn',
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' },
        '-=0.3'
      )
      .fromTo(
        '.header-personal .info .item',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
        },
        '-=0.2'
      );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger?.closest('.header-personal')) {
          trigger.kill();
        }
      });
    };
  }, []);

  useEffect(() => {
    loadBackgroudImages();
  }, []);

  return (
    <div
      className="header header-personal valign bg-img"
      data-background="/assets/imgs/header/p0.jpg"
      data-overlay-dark="2"
    >
      <div className="container ontop">
        <div className="row">
          <div className="col-lg-7">
            <div className="caption">
              <h6 className="mb-15">
                <span className="icon-img-30 mr-10">
                  <img src="/assets/imgs/header/hi.png" alt="" />
                </span>{' '}
                Modern Sağlık Hizmetleri
              </h6>
              <h1 className="fw-700 mb-10">
                Sağlığınız İçin <span className="main-color">Yanınızdayız</span>
              </h1>
              <h3>Profesyonel ve Güvenilir Sağlık Hizmetleri</h3>
              <div className="row">
                <div className="col-lg-9">
                  <div className="text mt-30">
                    <p>
                      Sağlığınız bizim önceliğimiz. Modern tıbbi teknoloji ve deneyimli ekibimizle 
                      size en iyi hizmeti sunmak için buradayız. Randevu alın, sağlığınızı güvence altına alın.
                    </p>
                  </div>
                  <div className="d-flex align-items-center mt-60">
                    <a
                      href="/randevu-al"
                      className="butn butn-md butn-bord radius-30"
                    >
                      <span className="text">Randevu Al</span>
                    </a>
                    <div className="icon-img-60 ml-20">
                      <img
                        src="/assets/imgs/icon-img/arrow-down-big.png"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="info d-flex align-items-center justify-content-end mt-100">
          <div className="item">
            <h6 className="sub-title mb-10">Email :</h6>
            <span className="p-color">info@klinik.com</span>
          </div>
          <div className="item">
            <h6 className="sub-title mb-10">Telefon :</h6>
            <span className="p-color">0216 123 45 67</span>
          </div>
          <div className="item">
            <h6 className="sub-title mb-10">Adres :</h6>
            <span className="p-color">İstanbul, Kadıköy</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
