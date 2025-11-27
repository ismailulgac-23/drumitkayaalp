'use client';
import React, { useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function Services() {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);

    const scrollTriggers = [];

    const items = document.querySelectorAll('.services-inline2 .item');
    if (items.length === 0) return;

    items.forEach((item, index) => {
      const trigger1 = gsap.fromTo(
        item,
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
      scrollTriggers.push(trigger1.scrollTrigger);

      // Animate child elements
      const num = item.querySelector('.num');
      const title = item.querySelector('h2');
      const text = item.querySelector('.text');
      const img = item.querySelector('.img');

      if (num) {
        const trigger2 = gsap.fromTo(
          num,
          { opacity: 0, scale: 0, rotation: -180 },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.8,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
            },
          }
        );
        scrollTriggers.push(trigger2.scrollTrigger);
      }

      if (title) {
        const trigger3 = gsap.fromTo(
          title,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
            },
          }
        );
        scrollTriggers.push(trigger3.scrollTrigger);
      }

      if (text) {
        const trigger4 = gsap.fromTo(
          text,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
            },
          }
        );
        scrollTriggers.push(trigger4.scrollTrigger);
      }

      if (img) {
        const trigger5 = gsap.fromTo(
          img,
          { opacity: 0, scale: 0.8, x: 50 },
          {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
            },
          }
        );
        scrollTriggers.push(trigger5.scrollTrigger);
      }
    });

    return () => {
      scrollTriggers.forEach((trigger) => {
        if (trigger) trigger.kill();
      });
    };
  }, []);

  return (
    <section className="services-inline2 section-padding sub-bg bord-bottom-grd bord-top-grd">
      <div className="container ontop">
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
        <div className="item">
          <div className="row md-marg align-items-end">
            <div className="col-lg-4">
              <div>
                <span className="num">01</span>
                <div>
                  <span className="sub-title main-color mb-10">Genel Sağlık</span>
                  <h2>
                    Genel <span className="fw-200">Muayene</span>
                  </h2>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="text md-mb80">
                <p>
                  Kapsamlı genel sağlık kontrolü ve muayene hizmetleri. 
                  Uzman doktorlarımız tarafından detaylı değerlendirme ve 
                  kişiselleştirilmiş tedavi planları.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="img fit-img">
                <img src="/assets/imgs/serv-img/1.jpg" alt="Genel Muayene" />
                <a href="/hizmetler">
                  <span className="ti-arrow-top-right"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="item">
          <div className="row md-marg align-items-end">
            <div className="col-lg-4">
              <div>
                <span className="num">02</span>
                <div>
                  <span className="sub-title main-color mb-10">Özel Tedavi</span>
                  <h2>
                    Özel <span className="fw-200">Tedaviler</span>
                  </h2>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="text md-mb80">
                <p>
                  Özel tedavi programları ve kişiselleştirilmiş bakım hizmetleri. 
                  Modern tıbbi yöntemlerle en iyi sonuçlar için uzman ekibimizle 
                  yanınızdayız.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="img fit-img">
                <img src="/assets/imgs/serv-img/2.jpg" alt="Özel Tedaviler" />
                <a href="/hizmetler">
                  <span className="ti-arrow-top-right"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="item pb-0">
          <div className="row md-marg align-items-end">
            <div className="col-lg-4">
              <div>
                <span className="num">03</span>
                <div>
                  <span className="sub-title main-color mb-10">Danışmanlık</span>
                  <h2>
                    Uzman <span className="fw-200">Konsültasyon</span>
                  </h2>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="text md-mb80">
                <p>
                  Uzman doktor konsültasyonları ve ikinci görüş hizmetleri. 
                  Sağlık sorularınız için profesyonel danışmanlık ve 
                  detaylı bilgilendirme.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="img fit-img">
                <img src="/assets/imgs/serv-img/3.jpg" alt="Konsültasyon" />
                <a href="/hizmetler">
                  <span className="ti-arrow-top-right"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
