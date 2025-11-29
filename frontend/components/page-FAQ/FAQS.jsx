'use client';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function FAQS() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/faqs`);
      const data = await response.json();
      if (data.success && data.data) {
        setFaqs(data.data);
        // İlk item'ı açık yap
        if (data.data.length > 0) {
          setTimeout(() => {
            setOpenIndex(0);
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || faqs.length === 0) return;
    
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.page-faqs',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(
      '.page-faqs .sec-head',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
      .fromTo(
        '.page-faqs .accordion .item',
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
        },
        '-=0.4'
      )
      .fromTo(
        '.page-faqs .img1, .page-faqs .img2, .page-faqs .img3',
        { opacity: 0, scale: 0.8, rotation: -10 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
        },
        '-=0.3'
      );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === document.querySelector('.page-faqs')) {
          trigger.kill();
        }
      });
    };
  }, [faqs]);

  const handleAccordionClick = (index) => {
    if (openIndex === index) {
      // Aynı item'a tıklanırsa kapat
      setOpenIndex(null);
    } else {
      // Yeni item'ı aç
      setOpenIndex(index);
    }
  };

  useEffect(() => {
    // Accordion animasyonları için
    if (typeof window === 'undefined' || faqs.length === 0) return;

    const items = document.querySelectorAll('.accordion .item');
    items.forEach((item, index) => {
      const accordionInfo = item.querySelector('.accordion-info');
      const icon = item.querySelector('.ico');
      
      if (index === openIndex) {
        item.classList.add('active');
        if (accordionInfo) {
          accordionInfo.classList.add('active');
          // ScrollHeight'ı al ve animasyonlu aç
          const height = accordionInfo.scrollHeight;
          gsap.fromTo(
            accordionInfo,
            { maxHeight: 0, opacity: 0 },
            { maxHeight: height + 'px', opacity: 1, duration: 0.4, ease: 'power2.out' }
          );
        }
        if (icon) {
          gsap.to(icon, { rotation: 45, duration: 0.3, ease: 'power2.out' });
        }
      } else {
        item.classList.remove('active');
        if (accordionInfo) {
          accordionInfo.classList.remove('active');
          gsap.to(accordionInfo, { 
            maxHeight: 0, 
            opacity: 0, 
            duration: 0.3, 
            ease: 'power2.in',
            onComplete: () => {
              accordionInfo.style.maxHeight = '0px';
            }
          });
        }
        if (icon) {
          gsap.to(icon, { rotation: 0, duration: 0.3, ease: 'power2.out' });
        }
      }
    });
  }, [openIndex, faqs]);

  return (
    <section className="page-faqs section-padding pb-0 position-re">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div>
              <div className="sec-head mb-50 text-center">
                <h6 className="sub-title main-color mb-15">Sıkça Sorulan Sorular</h6>
                <h3>
                  Merak Ettiğiniz <br /> Sorular ve Cevapları
                </h3>
              </div>
              {loading ? (
                <div className="text-center py-5">
                  <p>Yükleniyor...</p>
                </div>
              ) : faqs.length === 0 ? (
                <div className="text-center py-5">
                  <p>Henüz soru bulunmamaktadır.</p>
                </div>
              ) : (
                <div className="accordion bord">
                  {faqs.map((faq, index) => (
                    <div
                      key={faq.id || index}
                      className={`item ${openIndex === index ? 'active' : ''} wow fadeInUp`}
                      data-wow-delay={`${(index + 1) * 0.2}s`}
                    >
                      <div
                        onClick={() => handleAccordionClick(index)}
                        className="title"
                        style={{ cursor: 'pointer' }}
                      >
                        <h6>{faq.question}</h6>
                        <span className="ico ti-plus"></span>
                      </div>
                      <div className="accordion-info" style={{ maxHeight: '0px', overflow: 'hidden' }}>
                        <p className="">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="img2">
        <img src="/assets/imgs/arw0.png" alt="" />
      </div>
    </section>
  );
}

export default FAQS;
