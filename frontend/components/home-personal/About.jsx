'use client';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getImageUrl } from '@/common/imageHelper';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function About() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/home-about`);
      const data = await response.json();
      if (data.success && data.data) {
        setAbout(data.data);
      }
    } catch (error) {
      console.error('Error fetching home about:', error);
    }
  };
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !about) return;
    
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.about-author',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(
      '.about-author .profile-img',
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
    )
      .fromTo(
        '.about-author .cont h6',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.5'
      )
      .fromTo(
        '.about-author .cont h4',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4'
      )
      .fromTo(
        '.about-author .cont p',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.2 },
        '-=0.3'
      )
      .fromTo(
        '.about-author .numbers .item',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.2 },
        '-=0.2'
      );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === document.querySelector('.about-author')) {
          trigger.kill();
        }
      });
    };
  }, [about]);

  if (!about) {
    return null;
  }

  const imageUrl = getImageUrl(about.image) || '/assets/imgs/header/p2.jpg';
  const contentParts = about.content ? about.content.split('\n\n') : [];

  return (
    <section className="about-author section-padding">
      <div className="container with-pad">
        <div className="row lg-marg">
          <div className="col-lg-5 valign">
            <div className="profile-img">
              <div className="img">
                <img src={imageUrl} alt="Klinik Hakkında" />
              </div>
              <span className="icon">
                <img src="/assets/imgs/resume/icon1.png" alt="" />
              </span>
              <span className="icon">
                <img src="/assets/imgs/resume/icon2.png" alt="" />
              </span>
              <span className="icon">
                <img src="/assets/imgs/resume/icon3.png" alt="" />
              </span>
              <span className="icon">
                <img src="/assets/imgs/resume/icon4.png" alt="" />
              </span>
            </div>
          </div>
          <div className="col-lg-7 valign">
            <div className="cont">
              {about.smallTitle && (
                <h6 className="sub-title main-color mb-30">{about.smallTitle}</h6>
              )}
              <div className="text">
                {about.title && (
                  <h4 className="mb-30">
                    <span className="fw-200">{about.title}</span>
                  </h4>
                )}
                {contentParts.map((part, index) => (
                  <p key={index} className={index > 0 ? 'mt-20' : ''}>
                    {part}
                  </p>
                ))}

                <div className="numbers mt-50">
                  <div className="row lg-marg">
                    <div className="col-md-6">
                      <div className="item bord-thin-top pt-30 d-flex align-items-end mt-20">
                        <div>
                          <h3 className="fw-300 mb-10">100%</h3>
                          <h6 className="p-color sub-title">
                            Hasta Memnuniyeti
                          </h6>
                        </div>
                        <div className="ml-auto">
                          <div className="icon-img-40">
                            <img src="/assets/imgs/arw0.png" alt="" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="item bord-thin-top pt-30 d-flex align-items-end mt-20">
                        <div>
                          <h3 className="fw-300 mb-10">15+</h3>
                          <h6 className="p-color sub-title">
                            Yıllık Deneyim
                          </h6>
                        </div>
                        <div className="ml-auto">
                          <div className="icon-img-40">
                            <img src="/assets/imgs/arw0.png" alt="" />
                          </div>
                        </div>
                      </div>
                    </div>
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

export default About;
