'use client';
import React, { useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function About() {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.about-author',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(
      '.about-author .profile-img',
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
    )
      .fromTo(
        '.about-author .cont h6',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.5'
      )
      .fromTo(
        '.about-author .cont h4',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4'
      )
      .fromTo(
        '.about-author .cont p',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.2 },
        '-=0.3'
      )
      .fromTo(
        '.about-author .numbers .item',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.2 },
        '-=0.2'
      );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === document.querySelector('.about-author')) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section className="about-author section-padding">
      <div className="container with-pad">
        <div className="row lg-marg">
          <div className="col-lg-5 valign">
            <div className="profile-img">
              <div className="img">
                <img src="/assets/imgs/header/p2.jpg" alt="Klinik Hakkında" />
              </div>
              <span className="icon">
                <img src="/assets/imgs/resume/icon1.png" alt="" />
              </span>
              <span className="icon">
                <img src="/assets/imgs/resume/icon2.png" alt="" />
              </span>
              <span className="icon">
                <img src="/assets/imgs/resume/icon3.png" alt="" />
              </span>
              <span className="icon">
                <img src="/assets/imgs/resume/icon4.png" alt="" />
              </span>
            </div>
          </div>
          <div className="col-lg-7 valign">
            <div className="cont">
              <h6 className="sub-title main-color mb-30">Hakkımızda</h6>
              <div className="text">
                <h4 className="mb-30">
                  <span className="fw-200">
                    Modern Tıbbi Teknoloji ve Deneyimli Ekip
                  </span>{' '}
                  ile Sağlığınız İçin Hizmetinizdeyiz
                </h4>
                <p>
                  Klinik olarak, hasta memnuniyetini ön planda tutarak, modern tıbbi teknoloji 
                  ve deneyimli ekibimizle en kaliteli sağlık hizmetini sunmaktayız. 
                  Yılların deneyimi ve sürekli gelişen tıp bilimi ile hastalarımıza 
                  en iyi tedavi seçeneklerini sunuyoruz.
                </p>
                <p className="mt-20">
                  Misyonumuz, her hasta için kişiselleştirilmiş tedavi planları oluşturmak 
                  ve sağlık yolculuğunuzda yanınızda olmaktır. Vizyonumuz ise, 
                  toplum sağlığını iyileştirmek ve herkes için erişilebilir, kaliteli 
                  sağlık hizmeti sunmaktır.
                </p>

                <div className="numbers mt-50">
                  <div className="row lg-marg">
                    <div className="col-md-6">
                      <div className="item bord-thin-top pt-30 d-flex align-items-end mt-20">
                        <div>
                          <h3 className="fw-300 mb-10">100%</h3>
                          <h6 className="p-color sub-title">
                            Hasta Memnuniyeti
                          </h6>
                        </div>
                        <div className="ml-auto">
                          <div className="icon-img-40">
                            <img src="/assets/imgs/arw0.png" alt="" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="item bord-thin-top pt-30 d-flex align-items-end mt-20">
                        <div>
                          <h3 className="fw-300 mb-10">15+</h3>
                          <h6 className="p-color sub-title">
                            Yıllık Deneyim
                          </h6>
                        </div>
                        <div className="ml-auto">
                          <div className="icon-img-40">
                            <img src="/assets/imgs/arw0.png" alt="" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
