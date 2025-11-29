'use client';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import loadBackgroudImages from '@/common/loadBackgroudImages';
import { getImageUrl } from '@/common/imageHelper';
import { formatPhoneNumber, cleanPhoneForTelLink } from '@/common/phoneFormatter';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function Header() {
  const [intro, setIntro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactChannels, setContactChannels] = useState([]);

  useEffect(() => {
    fetchIntro();
    fetchContactChannels();
  }, []);

  const fetchIntro = async () => {
    try {
      const response = await fetch(`${API_URL}/api/home-intro`);
      const data = await response.json();
      if (data.success && data.data) {
        setIntro(data.data);
      }
    } catch (error) {
      console.error('Error fetching home intro:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContactChannels = async () => {
    try {
      const response = await fetch(`${API_URL}/api/contact-channels`);
      const data = await response.json();
      if (data.success) {
        setContactChannels(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching contact channels:', error);
    }
  };

  const getContactChannel = (type) => {
    return contactChannels.find(ch => ch.type === type);
  };

  const phoneChannel = getContactChannel('phone');
  const emailChannel = getContactChannel('email');
  const addressChannel = getContactChannel('address');

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !intro) return;

    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline();

    // Header entrance animation
    tl.fromTo(
      '.header-personal .caption h6',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '+=0.5'
    )
      .fromTo(
        '.header-personal .caption h1',
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo(
        '.header-personal .caption h3',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.6'
      )
      .fromTo(
        '.header-personal .caption p',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(
        '.header-personal .caption .butn',
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' },
        '-=0.3'
      )
      .fromTo(
        '.header-personal .info .item',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
        },
        '-=0.2'
      );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        try {
          const triggerElement = trigger.vars?.trigger;
          // Check if trigger is a DOM element and has closest method
          if (triggerElement && typeof triggerElement.closest === 'function') {
            if (triggerElement.closest('.header-personal')) {
              trigger.kill();
            }
          }
        } catch (error) {
          // Silently handle errors during cleanup (element might be removed)
          console.warn('Error cleaning up ScrollTrigger:', error);
        }
      });
    };
  }, [intro]);

  useEffect(() => {
    if (intro && typeof window !== 'undefined') {
      const backgroundImage = getImageUrl(intro.backgroundImage) || '/assets/imgs/header/p0.jpg';
      const headerElement = document.querySelector('.header-personal');
      if (headerElement) {
        headerElement.setAttribute('data-background', backgroundImage);
        // Trigger background image load
        loadBackgroudImages();
      }
    }
  }, [intro]);

  if (loading || !intro) {
    return null;
  }

  const backgroundImage = getImageUrl(intro.backgroundImage) || '/assets/imgs/header/p0.jpg';

  return (
    <div
      className="header header-personal valign bg-img"
      data-background={backgroundImage}
      data-overlay-dark="2"
    >
      <div className="container ontop">
        <div className="row">
          <div className="col-lg-7">
            <div className="caption">
              {intro.smallTitle && (
                <h6 className="mb-15">
                  <span className="icon-img-30 mr-10">
                    <img src="/assets/imgs/header/hi.png" alt="" />
                  </span>{' '}
                  {intro.smallTitle}
                </h6>
              )}
              <h1 className="fw-700 mb-10">
                <span>{intro.mainTitle}</span>
              </h1>
              {intro.subTitle && <h3 className='main-color'>{intro.subTitle}</h3>}
              <div className="row">
                <div className="col-lg-9">
                  {intro.description && (
                    <div className="text mt-30">
                      <p>{intro.description}</p>
                    </div>
                  )}
                  {intro.buttonText && intro.buttonLink && (
                    <div className="d-flex align-items-center mt-60">
                      <a
                        href={intro.buttonLink}
                        className="butn butn-md butn-bord radius-30"
                      >
                        <span className="text">{intro.buttonText}</span>
                      </a>
                      <div className="icon-img-60 ml-20">
                        <img
                          src="/assets/imgs/icon-img/arrow-down-big.png"
                          alt=""
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="info d-flex align-items-center justify-content-end mt-100">
          {emailChannel && (
            <div className="item">
              <h6 className="sub-title mb-10">Email :</h6>
              <span className="p-color">{emailChannel.value}</span>
            </div>
          )}
          {phoneChannel && (
            <div className="item">
              <h6 className="sub-title mb-10">Telefon :</h6>
              <a href={`tel:${cleanPhoneForTelLink(phoneChannel.value)}`} className="p-color">
                {formatPhoneNumber(phoneChannel.value)}
              </a>
            </div>
          )}
          {addressChannel && (
            <div className="item">
              <h6 className="sub-title mb-10">Adres :</h6>
              <span className="p-color">{addressChannel.value}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
