'use client';
import React, { useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function Services() {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.services-clas',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(
      '.services-clas .sec-head',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
      .fromTo(
        '.services-clas .item',
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: 'power2.out',
        },
        '-=0.4'
      );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === document.querySelector('.services-clas')) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section className="services-clas">
      <div className="container section-padding bord-bottom-grd pt-0">
        <div className="sec-head mb-80">
          <div className="d-flex align-items-center">
            <div>
              <span className="sub-title main-color mb-5">Hizmetlerimiz</span>
              <h3 className="fw-600 fz-50 text-u d-rotate wow">
                <span className="rotate-text">
                  Sağlık <span className="fw-200">Hizmetleri.</span>
                </span>
              </h3>
            </div>
            <div className="ml-auto vi-more">
              <a
                href="/hizmetler"
                className="butn butn-sm butn-bord radius-30"
              >
                <span>Tümünü Gör</span>
              </a>
              <span className="icon ti-arrow-top-right"></span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4">
            <div className="item sub-bg md-mb30">
              <div className="icon-img-60 opacity-5 mb-40">
                <img src="/assets/imgs/serv-icons/3.png" alt="" />
              </div>
              <h5>Genel Muayene</h5>
              <div className="text mt-40">
                <div className="mb-10">
                  <span className="tag">Kontrol</span>
                  <span className="tag">Muayene</span>
                </div>
                <p>
                  Kapsamlı genel sağlık kontrolü ve muayene hizmetleri. 
                  Uzman doktorlarımız tarafından detaylı değerlendirme.
                </p>
              </div>
              <a href="/hizmetler" className="mt-40">
                <span className="ti-arrow-top-right"></span>
              </a>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="item sub-bg md-mb30">
              <div className="icon-img-60 opacity-5 mb-40">
                <img src="/assets/imgs/serv-icons/4.png" alt="" />
              </div>
              <h5>Özel Tedaviler</h5>
              <div className="text mt-40">
                <div className="mb-10">
                  <span className="tag">Tedavi</span>
                  <span className="tag">Bakım</span>
                </div>
                <p>
                  Özel tedavi programları ve kişiselleştirilmiş bakım hizmetleri. 
                  Modern tıbbi yöntemlerle en iyi sonuçlar.
                </p>
              </div>
              <a href="/hizmetler" className="mt-40">
                <span className="ti-arrow-top-right"></span>
              </a>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="item sub-bg">
              <div className="icon-img-60 opacity-5 mb-40">
                <img src="/assets/imgs/serv-icons/5.png" alt="" />
              </div>
              <h5>Konsültasyon</h5>
              <div className="text mt-40">
                <div className="mb-10">
                  <span className="tag">Danışmanlık</span>
                  <span className="tag">Konsültasyon</span>
                </div>
                <p>
                  Uzman doktor konsültasyonları ve ikinci görüş hizmetleri. 
                  Sağlık sorularınız için profesyonel danışmanlık.
                </p>
              </div>
              <a href="/hizmetler" className="mt-40">
                <span className="ti-arrow-top-right"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
