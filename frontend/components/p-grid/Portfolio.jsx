'use client';
import initIsotope from '@/common/initIsotope';
import React, { useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

  useEffect(() => {
    initIsotope();
  }, []);
  
  const beforeAfterCases = [
    {
      category: 'temizlik',
      title: 'Diş Temizliği Öncesi - Sonrası',
      description: 'Profesyonel diş temizliği ile sağlıklı ve parlak bir gülümseme',
      image: '/assets/imgs/works/2/1.jpg',
      link: '/project-details'
    },
    {
      category: 'estetik',
      title: 'Estetik Dolgu İşlemi',
      description: 'Doğal görünümlü estetik dolgu işlemleri',
      image: '/assets/imgs/works/2/2.jpg',
      link: '/project-details'
    },
    {
      category: 'tedavi',
      title: 'Kanal Tedavisi Sonuçları',
      description: 'Uzman kanal tedavisi ile diş kurtarma',
      image: '/assets/imgs/works/2/3.jpg',
      link: '/project-details'
    },
    {
      category: 'ortodonti',
      title: 'Ortodontik Tedavi',
      description: 'Modern ortodontik tedavi yöntemleri ile düzgün diş yapısı',
      image: '/assets/imgs/works/2/4.jpg',
      link: '/project-details'
    },
    {
      category: 'implant',
      title: 'İmplant Uygulaması',
      description: 'Kalıcı ve doğal görünümlü implant çözümleri',
      image: '/assets/imgs/works/2/5.jpg',
      link: '/project-details'
    },
    {
      category: 'estetik',
      title: 'Gülüş Tasarımı',
      description: 'Kişiye özel gülüş tasarımı ve estetik uygulamalar',
      image: '/assets/imgs/works/2/6.jpg',
      link: '/project-details'
    },
  ];

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
      <div className="container">
        <div className="gallery row md-marg">
          {beforeAfterCases.map((caseItem, index) => (
            <div key={index} className={`col-lg-4 col-md-6 items ${caseItem.category}`}>
              <div className="item mb-50">
                <div className="img">
                  <img src={caseItem.image} alt={caseItem.title} />
                </div>
                <div className="cont d-flex align-items-end mt-30">
                  <div>
                    <span className="p-color mb-5 sub-title">{caseItem.category}</span>
                    <h6>{caseItem.title}</h6>
                    <p className="mt-10">{caseItem.description}</p>
                  </div>
                  <div className="ml-auto">
                    <a href={caseItem.link}>
                      <span className="ti-arrow-top-right"></span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Portfolio;
