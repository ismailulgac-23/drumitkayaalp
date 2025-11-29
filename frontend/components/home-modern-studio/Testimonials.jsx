'use client';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getImageUrl } from '@/common/imageHelper';

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/testimonials`);
      const data = await response.json();
      if (data.success && data.data) {
        setTestimonials(data.data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || testimonials.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.testim-modern',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(
      '.testim-modern .sec-head',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
      .fromTo(
        '.testim-modern .item',
        { opacity: 0, x: 50, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: 'power2.out',
        },
        '-=0.4'
      );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === document.querySelector('.testim-modern')) {
          trigger.kill();
        }
      });
    };
  }, [testimonials]);

  const swiperOptions = {
    modules: [Navigation],
    slidesPerView: 'auto',
    spaceBetween: 30,
    loop: testimonials.length > 1,
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      640: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 'auto',
      },
    },
    navigation: {
      nextEl: '.testim-modern .swiper-button-next',
      prevEl: '.testim-modern .swiper-button-prev',
    },
  };

  return (
    <section className="testim-modern section-padding sub-bg bord-top-grd bord-bottom-grd">
      <style jsx>{`
        .testim-modern .swiper-slide {
          height: 390px;
          display: flex;
        }
        .testim-modern .swiper-slide > .item {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .testim-modern .swiper-slide .cont {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .testim-modern .swiper-slide .text {
          flex: 1;
          display: flex;
          align-items: flex-start;
        }
        .testim-modern .swiper-slide .text p {
          margin: 0;
        }
        .testim-modern .swiper-slide .info {
          margin-top: auto;
          padding-top: 20px;
        }
      `}</style>
      <div className="container">
        <div className="sec-head mb-80">
          <div className="d-flex align-items-center">
            <div>
              <span className="sub-title main-color mb-5">Hasta Yorumları</span>
              <h3 className="fw-600 fz-50 text-u d-rotate wow">
                <span className="rotate-text">
                  Memnuniyet <span className="fw-200">Yorumları.</span>
                </span>
              </h3>
            </div>
            <div className="ml-auto">
              <div className="swiper-arrow-control">
                <div className="swiper-button-prev">
                  <span className="ti-arrow-left"></span>
                </div>
                <div className="swiper-button-next">
                  <span className="ti-arrow-right"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="testim-swiper3 out-right"
          data-carousel="swiper"
          data-loop="true"
          data-space="30"
        >
          {loading ? (
            <div className="text-center py-5">
              <p>Yükleniyor...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-5">
              <p>Henüz yorum bulunmamaktadır.</p>
            </div>
          ) : (
            <Swiper
              {...swiperOptions}
              id="content-carousel-container-unq-testim"
              className="swiper-container"
              data-swiper="container"
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={testimonial.id || index} style={{ height: '390px' }}>
                  <div className="item" style={{ height: '390px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div className="cont">
                      <h6 className="sub-title mb-15">
                        {Array(testimonial.rating).fill(0).map((_, i) => (
                          <span key={i} className="main-color">★</span>
                        ))}
                      </h6>
                      <div className="text">
                        <p>"{testimonial.comment}"</p>
                      </div>
                    </div>
                    <div className="info">
                      <div className="d-flex align-items-center">
                        <div>
                          <div className="img fit-img">
                            <img
                              src={getImageUrl(testimonial.avatarUrl) || '/placeholder.webp'}
                              alt={testimonial.patientName}
                              onError={(e) => {
                                e.target.src = '/placeholder.webp';
                              }}
                            />
                          </div>
                        </div>
                        <div className="ml-20">
                          <h6 className="fz-18">{testimonial.patientName}</h6>
                          <span className="p-color opacity-8 fz-15 mt-5">
                            Hasta
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
