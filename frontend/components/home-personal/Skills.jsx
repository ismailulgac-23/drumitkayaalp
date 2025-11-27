'use client';
import React, { useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function Skills() {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.my-skills',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(
      '.my-skills .sec-head',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
      .fromTo(
        '.my-skills .item',
        { opacity: 0, y: 50, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(1.7)',
        },
        '-=0.4'
      )
      .fromTo(
        '.my-skills .value',
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'elastic.out(1, 0.5)',
        },
        '-=0.3'
      );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === document.querySelector('.my-skills')) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section className="my-skills section-padding">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-10">
            <div className="sec-head text-center mb-80">
              <h3>
                Sağlık Hizmetlerimizde <br />
                <span className="opacity-7">Uzmanlık Alanlarımız.</span>
              </h3>
            </div>
          </div>
        </div>
        <div className="row md-marg">
          <div className="col-lg-2 col-md-4 col-6">
            <div className="item mb-30">
              <div className="box-bord">
                <div className="img">
                  <img src="/assets/imgs/resume/s1.png" alt="" />
                </div>
                <span className="value">98%</span>
              </div>
              <h6 className="fz-18">Genel Muayene</h6>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-6">
            <div className="item mb-30">
              <div className="box-bord">
                <div className="img">
                  <img src="/assets/imgs/resume/s2.png" alt="" />
                </div>
                <span className="value">95%</span>
              </div>
              <h6 className="fz-18">Özel Tedaviler</h6>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-6">
            <div className="item mb-30">
              <div className="box-bord">
                <div className="img">
                  <img src="/assets/imgs/resume/s3.png" alt="" />
                </div>
                <span className="value">97%</span>
              </div>
              <h6 className="fz-18">Teşhis Hizmetleri</h6>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-6">
            <div className="item mb-30">
              <div className="box-bord">
                <div className="img">
                  <img src="/assets/imgs/resume/s5.png" alt="" />
                </div>
                <span className="value">96%</span>
              </div>
              <h6 className="fz-18">Konsültasyon</h6>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-6">
            <div className="item mb-30">
              <div className="box-bord">
                <div className="img">
                  <img src="/assets/imgs/resume/s4.png" alt="" />
                </div>
                <span className="value">94%</span>
              </div>
              <h6 className="fz-18">Acil Hizmetler</h6>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-6">
            <div className="item mb-30">
              <div className="box-bord">
                <div className="img">
                  <img src="/assets/imgs/resume/s6.png" alt="" />
                </div>
                <span className="value">99%</span>
              </div>
              <h6 className="fz-18">Hasta Memnuniyeti</h6>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Skills;
