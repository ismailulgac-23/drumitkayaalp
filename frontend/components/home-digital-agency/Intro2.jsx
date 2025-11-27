'use client';
import React, { useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function Intro2() {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.intro-accord',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(
      '.intro-accord .img',
      { opacity: 0, x: -100, scale: 0.9 },
      { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out' }
    )
      .fromTo(
        '.intro-accord .sec-head',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.5'
      )
      .fromTo(
        '.intro-accord .accordion .item',
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
        },
        '-=0.4'
      );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === document.querySelector('.intro-accord')) {
          trigger.kill();
        }
      });
    };
  }, []);

  function openAccordion(event) {
    const items = document.querySelectorAll('.accordion-info');
    items.forEach((element) => {
      element.classList.remove('active');
      element.style.maxHeight = 0;
      element.parentElement.classList.remove('active');
    });
    event.currentTarget.parentElement.classList.add('active');
    event.currentTarget.nextElementSibling.style.maxHeight = '300px';
    event.currentTarget.nextElementSibling.classList.add('active');
    
    // GSAP animation for accordion
    gsap.fromTo(
      event.currentTarget.nextElementSibling,
      { opacity: 0, height: 0 },
      { opacity: 1, height: 'auto', duration: 0.4, ease: 'power2.out' }
    );
  }

  return (
    <section className="intro-accord">
      <div className="container ontop">
        <div className="row xlg-marg">
          <div className="col-lg-6">
            <div className="img md-mb50">
              <img src="/assets/imgs/arw2.png" alt="" />
            </div>
          </div>
          <div className="col-lg-6 valign">
            <div>
              <div className="sec-head mb-50">
                <h6 className="sub-title main-color mb-15">Neden Bizi Seçmelisiniz?</h6>
                <h3>
                  Sağlığınız için <br /> profesyonel hizmet anlayışımız.
                </h3>
              </div>
              <div className="accordion bord">
                <div className="item active wow fadeInUp" data-wow-delay=".1s">
                  <div onClick={openAccordion} className="title">
                    <h6>Modern Tıbbi Teknoloji</h6>
                    <span className="ico ti-plus"></span>
                  </div>
                  <div className="accordion-info">
                    <p className="">
                      En son teknolojik cihazlar ve modern tıbbi yöntemlerle 
                      hizmet veriyoruz. Teşhis ve tedavi süreçlerinde en güncel 
                      teknolojileri kullanarak en iyi sonuçları elde ediyoruz.
                    </p>
                  </div>
                </div>

                <div className="item wow fadeInUp" data-wow-delay=".3s">
                  <div onClick={openAccordion} className="title">
                    <h6>Deneyimli ve Uzman Ekip</h6>
                    <span className="ico ti-plus"></span>
                  </div>
                  <div className="accordion-info">
                    <p className="">
                      Alanında uzman ve deneyimli doktorlarımız ile sağlık 
                      personelimiz, sürekli eğitim alarak kendilerini geliştirmektedir. 
                      Her hasta için en uygun tedavi planını oluşturuyoruz.
                    </p>
                  </div>
                </div>

                <div className="item wow fadeInUp" data-wow-delay=".5s">
                  <div onClick={openAccordion} className="title">
                    <h6>Kişiselleştirilmiş Tedavi</h6>
                    <span className="ico ti-plus"></span>
                  </div>
                  <div className="accordion-info">
                    <p className="">
                      Her hasta benzersizdir. Bu nedenle her hasta için 
                      özel olarak hazırlanmış tedavi planları oluşturuyoruz. 
                      Sağlık yolculuğunuzda yanınızda oluyoruz.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Intro2;
