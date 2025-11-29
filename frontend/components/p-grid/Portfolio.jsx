'use client';
import initIsotope from '@/common/initIsotope';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getImageUrl } from '@/common/imageHelper';

function Portfolio() {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.work-grid',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(
      '.work-grid .sec-head',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
      .fromTo(
        '.work-grid .filter',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(
        '.work-grid .gallery .item',
        { opacity: 0, y: 80, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
        },
        '-=0.3'
      );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === document.querySelector('.work-grid')) {
          trigger.kill();
        }
      });
    };
  }, []);

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

  useEffect(() => {
    if (beforeAfterCases.length > 0) {
      initIsotope();
    }
  }, [beforeAfterCases]);

  return (
    <section className="work-grid section-padding pb-0">
      <div className="container">
        <div className="row mb-80">
          <div className="col-lg-4">
            <div className="sec-head">
              <h6 className="sub-title main-color mb-10">BAŞARI HİKAYELERİMİZ</h6>
              <h3>Öncesi - Sonrası Galerisi</h3>
            </div>
          </div>
          <div className="filtering col-lg-8 d-flex justify-content-end align-items-end">
            <div>
              <div className="filter">
                <span data-filter="*" className="active" data-count="06">
                  Tümü
                </span>
                <span data-filter=".temizlik" data-count="01">
                  Temizlik
                </span>
                <span data-filter=".estetik" data-count="02">
                  Estetik
                </span>
                <span data-filter=".tedavi" data-count="01">
                  Tedavi
                </span>
                <span data-filter=".ortodonti" data-count="01">
                  Ortodonti
                </span>
                <span data-filter=".implant" data-count="01">
                  İmplant
                </span>
              </div>
            </div>
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
        <div className="container">
          <div className="gallery row md-marg">
            {beforeAfterCases.map((caseItem, index) => {
              const imageUrl = getImageUrl(caseItem.afterImage) || getImageUrl(caseItem.beforeImage) || '/placeholder.webp';
              return (
                <div key={caseItem.id || index} className={`col-lg-4 col-md-6 items`}>
                  <div className="item mb-50">
                    <div className="img">
                      <img 
                        src={imageUrl} 
                        alt={caseItem.title}
                        onError={(e) => {
                          e.target.src = '/placeholder.webp';
                        }}
                      />
                    </div>
                    <div className="cont d-flex align-items-end mt-30">
                      <div>
                        <span className="p-color mb-5 sub-title">Öncesi-Sonrası</span>
                        <h6>{caseItem.title}</h6>
                        <p className="mt-10">{caseItem.description || ''}</p>
                      </div>
                      <div className="ml-auto">
                        <a href="/oncesi-sonrasi">
                          <span className="ti-arrow-top-right"></span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

export default Portfolio;
