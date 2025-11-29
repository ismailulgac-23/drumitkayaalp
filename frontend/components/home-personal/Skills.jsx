'use client';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function Skills() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch(`${API_URL}/api/skills`);
      const data = await response.json();
      if (data.success && data.data) {
        setSkills(data.data);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || skills.length === 0) return;
    
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
  }, [skills]);

  if (skills.length === 0) {
    return null;
  }

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
          {skills.map((skill) => (
            <div key={skill.id} className="col-lg-2 col-md-4 col-6">
              <div className="item mb-30">
                <div className="box-bord">
                  <span className="value">{skill.percentage}%</span>
                </div>
                <h6 className="fz-18">{skill.title}</h6>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
