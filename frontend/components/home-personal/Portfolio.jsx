'use client';
import React, { useEffect } from 'react';

function Portfolio() {
  function Playing() {
    if (typeof window === 'undefined' || !window.gsap) return;
    
    const { gsap } = window;
    if (!gsap.plugins || !gsap.plugins.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    const cards = document.querySelectorAll('.cards .card-item');
    if (cards.length === 0) return;
    
    let stickDistance = 0;

    const firstCardST = ScrollTrigger.create({
      trigger: cards[0],
      start: 'center center',
    });

    const lastCardST = ScrollTrigger.create({
      trigger: cards[cards.length - 1],
      start: 'bottom bottom',
    });

    cards.forEach((card, index) => {
      const scale = 1 - (cards.length - index) * 0.025;
      const scaleDown = gsap.to(card, {
        scale: scale,
        transformOrigin: '50% ' + (lastCardST.start + stickDistance),
      });

      ScrollTrigger.create({
        trigger: card,
        start: 'center center',
        end: () => lastCardST.start + stickDistance,
        pin: true,
        pinSpacing: false,
        ease: 'none',
        animation: scaleDown,
        toggleActions: 'restart none none reverse',
      });
    });
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      Playing();
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (typeof window !== 'undefined' && window.ScrollTrigger) {
        ScrollTrigger.getAll().forEach((instance) => instance.kill());
      }
    };
  }, []);
  
  const beforeAfterCases = [
    {
      title: 'Diş Temizliği Öncesi - Sonrası',
      tags: ['Temizlik', 'Bakım'],
      description: 'Profesyonel diş temizliği ile sağlıklı ve parlak bir gülümseme. Modern tekniklerle ağrısız ve etkili sonuçlar.',
      image: '/assets/imgs/works/1/1.jpg',
      link: '/oncesi-sonrasi'
    },
    {
      title: 'Estetik Dolgu İşlemi',
      tags: ['Estetik', 'Dolgu'],
      description: 'Doğal görünümlü estetik dolgu işlemleri. Görünmez ve dayanıklı çözümlerle mükemmel sonuçlar.',
      image: '/assets/imgs/works/1/2.jpg',
      link: '/oncesi-sonrasi'
    },
    {
      title: 'Kanal Tedavisi Sonuçları',
      tags: ['Tedavi', 'Kanal'],
      description: 'Uzman kanal tedavisi ile diş kurtarma. Ağrısız ve başarılı tedavi süreçleri.',
      image: '/assets/imgs/works/1/3.jpg',
      link: '/oncesi-sonrasi'
    },
    {
      title: 'Ortodontik Tedavi',
      tags: ['Ortodonti', 'Düzeltme'],
      description: 'Modern ortodontik tedavi yöntemleri ile düzgün diş yapısı. Görünmez ve konforlu çözümler.',
      image: '/assets/imgs/works/1/4.jpg',
      link: '/oncesi-sonrasi'
    },
    {
      title: 'İmplant Uygulaması',
      tags: ['İmplant', 'Protez'],
      description: 'Kalıcı ve doğal görünümlü implant çözümleri. Uzun ömürlü ve güvenilir sonuçlar.',
      image: '/assets/imgs/works/1/5.jpg',
      link: '/oncesi-sonrasi'
    },
  ];

  return (
    <section className="work-card section-padding pb-0">
      <div className="container">
        <div className="sec-head mb-80">
          <div className="d-flex align-items-center">
            <div>
              <span className="sub-title main-color mb-5">Başarı Hikayelerimiz</span>
              <h3 className="fw-600 fz-50 text-u d-rotate wow">
                <span className="rotate-text">
                  Öncesi <span className="fw-200">Sonrası.</span>
                </span>
              </h3>
            </div>
            <div className="ml-auto vi-more">
              <a
                href="/oncesi-sonrasi"
                className="butn butn-sm butn-bord radius-30"
              >
                <span>Tümünü Gör</span>
              </a>
              <span className="icon ti-arrow-top-right"></span>
            </div>
          </div>
        </div>
        <div className="cards">
          {beforeAfterCases.map((caseItem, index) => (
            <div key={index} className="card-item sub-bg">
              <div className="row">
                <div className="col-lg-5">
                  <div className="cont">
                    <div>
                      <div className="mb-15">
                        {caseItem.tags.map((tag, tagIndex) => (
                          <a key={tagIndex} href={caseItem.link} className="tag">
                            {tag}
                          </a>
                        ))}
                      </div>
                      <h4>{caseItem.title}</h4>
                    </div>
                    <div>
                      <p>
                        {caseItem.description}
                      </p>
                      <a href={caseItem.link} className="underline mt-15">
                        <span className="text main-color sub-title">
                          Detayları Gör <i className="ti-arrow-top-right"></i>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-7">
                  <div className="img">
                    <img src={caseItem.image} alt={caseItem.title} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="sec-bottom mt-100">
        <div className="main-bg d-flex align-items-center">
          <h6 className="fz-14 fw-400">
            <span className="fw-600">1000+</span> başarılı tedavi
            ile güvenilir sağlık hizmeti
          </h6>
        </div>
      </div>
    </section>
  );
}

export default Portfolio;
