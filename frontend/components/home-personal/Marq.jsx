'use client';
import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function Marq() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(`${API_URL}/api/marquee-items`);
      const data = await response.json();
      if (data.success && data.data) {
        setItems(data.data.map(item => item.text));
      }
    } catch (error) {
      console.error('Error fetching marquee items:', error);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || items.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    const itemsElements = document.querySelectorAll('.marq .item');
    if (itemsElements.length === 0) return;

    gsap.fromTo(
      itemsElements,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.marq',
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="marq">
      <div className="main-marq lrg sub-bg pt-20 pb-20 shadow-off">
        <div className="slide-har st1">
          <div className="box">
            {items.map((item, i) => (
              <div key={i} className="item">
                <h4 className="d-flex align-items-center">
                  <span>{item}</span>
                  <span className="icon-img-50 ml-40">
                    <img src="/assets/imgs/star.png" alt="" />
                  </span>
                </h4>
              </div>
            ))}
          </div>
          <div className="box">
            {items.map((item, i) => (
              <div key={i} className="item">
                <h4 className="d-flex align-items-center">
                  <span>{item}</span>
                  <span className="icon-img-50 ml-40">
                    <img src="/assets/imgs/star.png" alt="" />
                  </span>
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Marq;
