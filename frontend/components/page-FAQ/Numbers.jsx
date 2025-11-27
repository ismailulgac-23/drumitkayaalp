'use client';
import React, { useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function Numbers() {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);

    const scrollTriggers = [];

    const items = document.querySelectorAll('.numbers-crev .item');
    if (items.length === 0) return;

    items.forEach((item, index) => {
      const trigger1 = gsap.fromTo(
        item,
        { opacity: 0, y: 50, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
      scrollTriggers.push(trigger1.scrollTrigger);

      const stroke = item.querySelector('.stroke');
      if (stroke) {
        const text = stroke.textContent;
        const isPercentage = text.includes('%');
        const isPlus = text.includes('+');
        const number = parseFloat(text.replace(/[^0-9.]/g, ''));

        if (!isNaN(number)) {
          // Create a data object for animation
          const counter = { value: 0 };
          
          const trigger2 = gsap.to(counter, {
            value: number,
            duration: 2,
            ease: 'power2.out',
            onUpdate: function () {
              let displayValue = Math.round(counter.value);
              if (isPercentage) {
                stroke.textContent = displayValue + '%';
              } else if (isPlus) {
                stroke.textContent = displayValue + '+';
              } else {
                stroke.textContent = displayValue;
              }
            },
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          });
          scrollTriggers.push(trigger2.scrollTrigger);
        }
      }
    });

    return () => {
      scrollTriggers.forEach((trigger) => {
        if (trigger) trigger.kill();
      });
    };
  }, []);

  return (
    <section className="numbers-crev section-padding o-hidden">
      <div className="container">
        <div className="row lg-marg justify-content-center">
          <div className="col-lg-4 col-md-6">
            <div className="item text-center md-mb50">
              <div className="o-hidden">
                <h3 className="stroke">100%</h3>
              </div>
              <h6 className="p-color sub-title">Hasta Memnuniyeti</h6>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="item text-center md-mb50">
              <div className="o-hidden">
                <h3 className="stroke">5000+</h3>
              </div>
              <h6 className="p-color sub-title">Başarılı Tedavi</h6>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="item text-center">
              <div className="o-hidden">
                <h3 className="stroke">15+</h3>
              </div>
              <h6 className="p-color sub-title">Yıllık Deneyim</h6>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Numbers;
