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
        // İlk 3 hizmeti al
        setServices(data.data.slice(0, 3));
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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.services-clas',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(
      '.services-clas .sec-head',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
      .fromTo(
        '.services-clas .item',
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: 'power2.out',
        },
        '-=0.4'
      );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === document.querySelector('.services-clas')) {
          trigger.kill();
        }
      });
    };
  }, [services]);


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
      <section className="services-clas">
        <div className="container section-padding bord-bottom-grd pt-0">
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
            <div className="row">
              {services.map((service, index) => (
                <div key={service.id || index} className="col-lg-4">
                  <div 
                    className="item sub-bg md-mb30"
                    onClick={() => handleServiceClick(service)}
                    style={{ cursor: 'pointer', transition: 'transform 0.3s' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div className="icon-img-60 opacity-5 mb-40 w-100">
                      <img 
                        src={getImageUrl(service.image) || '/placeholder.webp'} 
                        alt={service.title}
                        onError={(e) => {
                          e.target.src = '/placeholder.webp';
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <h5>{service.title}</h5>
                    <div className="text mt-40">
                      <div className="mb-10">
                        <span className="tag">Hizmet</span>
                      </div>
                      <p>
                        {service.description || 'Profesyonel sağlık hizmeti'}
                      </p>
                    </div>
                    <div className="mt-40">
                      <span className="ti-arrow-top-right"></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
