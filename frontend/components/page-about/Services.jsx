'use client';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ServiceDetailModal from '@/components/common/ServiceDetailModal';
import { getImageUrl } from '@/common/imageHelper';

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/services`);
      const data = await response.json();
      if (data.success && data.data) {
        setServices(data.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || services.length === 0) return;
    
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
  }, [services]);

  const formatServiceTitle = (title) => {
    if (!title) return '';
    const words = title.split(' ');
    if (words.length > 1) {
      return (
        <>
          {words[0]} <span className="fw-200">{words.slice(1).join(' ')}</span>
        </>
      );
    }
    return title;
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedService(null);
    }, 300);
  };

  return (
    <>
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
          {loading ? (
            <div className="text-center py-5">
              <p>Yükleniyor...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-5">
              <p>Henüz hizmet bulunmamaktadır.</p>
            </div>
          ) : (
            services.map((service, index) => (
              <div
                key={service.id || index}
                className={`item ${index === services.length - 1 ? 'pb-0' : ''}`}
                onClick={() => handleServiceClick(service)}
                style={{ cursor: 'pointer', transition: 'opacity 0.3s' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                <div className="row md-marg align-items-end">
                  <div className="col-lg-4">
                    <div>
                      <span className="num">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <span className="sub-title main-color mb-10">
                          {service.category || 'Sağlık Hizmeti'}
                        </span>
                        <h2>{formatServiceTitle(service.title)}</h2>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="text md-mb80">
                      <p>
                        {service.description ||
                          'Profesyonel sağlık hizmeti sunuyoruz.'}
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="img fit-img">
                      <img
                        src={getImageUrl(service.image) || '/placeholder.webp'}
                        alt={service.title}
                        onError={(e) => {
                          e.target.src = '/placeholder.webp';
                        }}
                      />
                      <div style={{ pointerEvents: 'none' }}>
                        <span className="ti-arrow-top-right"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      <ServiceDetailModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default Services;
