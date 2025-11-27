'use client';
import React, { useEffect, useLayoutEffect } from 'react';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function Testimonials() {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    
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
  }, []);

  const swiperOptions = {
    modules: [Navigation],
    slidesPerView: 'auto',

    spaceBetween: 30,
    loop: true,
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

  const testimonials = [
    {
      title: 'Mükemmel Hizmet',
      text: 'Klinikte aldığım hizmet gerçekten çok profesyoneldi. Doktorlar çok ilgili ve deneyimli. Tedavi sürecim boyunca kendimi güvende hissettim.',
      name: 'Ahmet Yılmaz',
      role: 'Hasta',
      image: '/assets/imgs/testim/t1.jpg',
    },
    {
      title: 'Çok Memnun Kaldım',
      text: 'Randevu alma süreci çok kolaydı ve bekleme süresi minimumdu. Doktorun verdiği bilgiler çok netti ve tedavi sonrası takip mükemmeldi.',
      name: 'Ayşe Demir',
      role: 'Hasta',
      image: '/assets/imgs/testim/t2.jpg',
    },
    {
      title: 'Profesyonel Ekip',
      text: 'Tüm personel çok nazik ve profesyonel. Kliniğin temizliği ve hijyeni mükemmel. Kesinlikle tavsiye ederim.',
      name: 'Mehmet Kaya',
      role: 'Hasta',
      image: '/assets/imgs/testim/t3.jpg',
    },
  ];

  return (
    <section className="testim-modern section-padding sub-bg bord-top-grd bord-bottom-grd">
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
          <Swiper
            {...swiperOptions}
            id="content-carousel-container-unq-testim"
            className="swiper-container"
            data-swiper="container"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="item">
                  <div className="cont">
                    <h6 className="sub-title mb-15">{testimonial.title}</h6>
                    <div className="text">
                      <p>"{testimonial.text}"</p>
                    </div>
                  </div>
                  <div className="info">
                    <div className="d-flex align-items-center">
                      <div>
                        <div className="img fit-img">
                          <img src={testimonial.image} alt={testimonial.name} />
                        </div>
                      </div>
                      <div className="ml-20">
                        <h6 className="fz-18">{testimonial.name}</h6>
                        <span className="p-color opacity-8 fz-15 mt-5">
                          {testimonial.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
