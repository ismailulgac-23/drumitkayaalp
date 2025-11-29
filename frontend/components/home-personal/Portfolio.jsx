'use client';
import React, { useEffect, useState } from 'react';
import { getImageUrl } from '@/common/imageHelper';

function Portfolio() {
  const [beforeAfterCases, setBeforeAfterCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBeforeAfter();
  }, []);

  const fetchBeforeAfter = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/before-after`);
      const data = await response.json();
      if (data.success && data.data) {
        setBeforeAfterCases(data.data);
      }
    } catch (error) {
      console.error('Error fetching before-after cases:', error);
    } finally {
      setLoading(false);
    }
  };

  function Playing() {
    if (typeof window === 'undefined' || !window.gsap || beforeAfterCases.length === 0) return;
    
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
    if (beforeAfterCases.length === 0) return;
    
    const timer = setTimeout(() => {
      Playing();
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (typeof window !== 'undefined' && window.ScrollTrigger) {
        ScrollTrigger.getAll().forEach((instance) => instance.kill());
      }
    };
  }, [beforeAfterCases]);

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
        {loading ? (
          <div className="text-center py-5">
            <p>Yükleniyor...</p>
          </div>
        ) : beforeAfterCases.length === 0 ? (
          <div className="text-center py-5">
            <p>Henüz öncesi-sonrası görseli bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="cards">
            {beforeAfterCases.map((caseItem, index) => (
              <div key={caseItem.id || index} className="card-item sub-bg">
                <div className="row">
                  <div className="col-lg-5">
                    <div className="cont">
                      <div>
                        <h4>{caseItem.title}</h4>
                      </div>
                      <div>
                        <p>
                          {caseItem.description || ''}
                        </p>
                        <a href="/oncesi-sonrasi" className="underline mt-15">
                          <span className="text main-color sub-title">
                            Detayları Gör <i className="ti-arrow-top-right"></i>
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-7">
                    <div className="img">
                      <img 
                        src={getImageUrl(caseItem.afterImage) || getImageUrl(caseItem.beforeImage) || '/placeholder.webp'} 
                        alt={caseItem.title}
                        onError={(e) => {
                          e.target.src = '/placeholder.webp';
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
