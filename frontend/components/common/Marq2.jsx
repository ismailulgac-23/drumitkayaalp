'use client';
import React, { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function Marq2() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(`${API_URL}/api/marquee2-items`);
      const data = await response.json();
      if (data.success && data.data) {
        setItems(data.data.map(item => item.text));
      }
    } catch (error) {
      console.error('Error fetching marquee2 items:', error);
    }
  };

  if (items.length === 0) {
    return null;
  }

  // Her item için 6 kopya oluştur
  const AllMarquess = Array(6).fill(items).flat();
  const AllContact = Array(6).fill(items).flat();

  return (
    <section className="call-marq section-padding o-hidden">
      <div className="main-marq lrg sub-bg pt-20 pb-20">
        <div className="slide-har st1">
          <div className="box">
            {AllMarquess.map((item, i) => (
              <div key={i} className="item">
                <h4 className="d-flex align-items-center">
                  <span>{item}</span>
                  <span className="icon-img-50 ml-40">
                    <img src="/assets/imgs/star.png" alt="" />
                  </span>
                </h4>
              </div>
            ))}
            {AllMarquess.map((item, i) => (
              <div key={`dup-${i}`} className="item">
                <h4 className="d-flex align-items-center">
                  <span>{item}</span>
                  <span className="icon-img-50 ml-40">
                    <img src="/assets/imgs/star.png" alt="" />
                  </span>
                </h4>
              </div>
            ))}
          </div>

          <a href="/page-contact" className="overlay-link"></a>
        </div>
      </div>
      <div className="main-marq bord-item">
        <div className="slide-har st2">
          <div className="box">
            {AllContact.map((item, i) => (
              <div key={i} className="item">
                <h4 className="d-flex align-items-center">
                  <span>{item}</span>
                </h4>
              </div>
            ))}
          </div>
          <div className="box">
            {AllContact.map((item, i) => (
              <div key={`dup2-${i}`} className="item">
                <h4 className="d-flex align-items-center">
                  <span>{item}</span>
                </h4>
              </div>
            ))}
          </div>

          <a href="/page-contact" className="overlay-link"></a>
        </div>
      </div>
    </section>
  );
}

export default Marq2;
