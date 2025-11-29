'use client';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getImageUrl } from '@/common/imageHelper';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function Intro() {
  const [intro, setIntro] = useState(null);

  useEffect(() => {
    fetchIntro();
  }, []);

  const fetchIntro = async () => {
    try {
      const response = await fetch(`${API_URL}/api/about-page-intro`);
      const data = await response.json();
      if (data.success && data.data) {
        setIntro(data.data);
      }
    } catch (error) {
      console.error('Error fetching about page intro:', error);
    }
  };

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !intro) return;

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
  }, [intro]);

  if (!intro) {
    return null;
  }

  const imageUrl = getImageUrl(intro.image) || '/assets/imgs/intro/i1.jpg';
  const contentParts = intro.content ? intro.content.split('\n\n') : [];

  return (
    <section className="page-intro section-padding pb-0">
      <div className="container">
        <div className="row md-marg">
          <div className="col-lg-6">
            <div className="img md-mb80">
              <img src={imageUrl} alt="Klinik" style={{ width: 500, borderRadius: 16, height: 500, objectFit: 'cover' }} />
            </div>
          </div>
          <div className="col-lg-6 valign">
            <div className="cont">
              {intro.title && (
                <h3 className="mb-30">
                  {intro.title}
                </h3>
              )}
              {contentParts.map((part, index) => (
                <p key={index} className={index > 0 ? 'mt-20' : ''}>
                  {part}
                </p>
              ))}
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
