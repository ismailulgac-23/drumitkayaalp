'use client';
import React, { useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function Intro() {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.page-intro',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(
      '.page-intro .img',
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
    )
      .fromTo(
        '.page-intro .cont h3',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.5'
      )
      .fromTo(
        '.page-intro .cont p',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.2 },
        '-=0.4'
      )
      .fromTo(
        '.page-intro .cont a',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.2'
      );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === document.querySelector('.page-intro')) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section className="page-intro section-padding pb-0">
      <div className="container">
        <div className="row md-marg">
          <div className="col-lg-6">
            <div className="img md-mb80">
              <div className="row">
                <div className="col-6">
                  <img src="/assets/imgs/intro/i1.jpg" alt="Klinik" />
                  <div className="img-icon">
                    <img src="/assets/imgs/arw0.png" alt="" />
                  </div>
                </div>
                <div className="col-6 mt-40">
                  <img src="/assets/imgs/intro/i2.jpg" alt="Klinik" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 valign">
            <div className="cont">
              <h3 className="mb-30">
                Modern tıbbi teknoloji ve{' '}
                <span className="fw-200">deneyimli ekibimizle</span> sağlığınız
                için <span className="fw-200">yanınızdayız</span>.
              </h3>
              <p>
                Klinik olarak, hasta memnuniyetini ön planda tutarak, modern tıbbi 
                teknoloji ve deneyimli ekibimizle en kaliteli sağlık hizmetini sunmaktayız. 
                Yılların deneyimi ve sürekli gelişen tıp bilimi ile hastalarımıza 
                en iyi tedavi seçeneklerini sunuyoruz.
              </p>
              <p className="mt-20">
                Misyonumuz, her hasta için kişiselleştirilmiş tedavi planları oluşturmak 
                ve sağlık yolculuğunuzda yanınızda olmaktır. Vizyonumuz ise, 
                toplum sağlığını iyileştirmek ve herkes için erişilebilir, kaliteli 
                sağlık hizmeti sunmaktır.
              </p>
              <a href="/hizmetler" className="underline main-color mt-40">
                <span className="text">
                  Hizmetlerimiz <i className="ti-arrow-top-right"></i>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Intro;
