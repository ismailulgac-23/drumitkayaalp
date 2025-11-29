'use client';
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { getImageUrl } from '@/common/imageHelper';

function ServiceDetailModal({ service, isOpen, onClose }) {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isOpen && service) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Animate overlay
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );

      // Animate modal content
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, scale: 0.8, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: 'back.out(1.2)',
        }
      );

      // Animate image
      const img = contentRef.current?.querySelector('.service-modal-img');
      if (img) {
        gsap.fromTo(
          img,
          { opacity: 0, scale: 1.1 },
          { opacity: 1, scale: 1, duration: 0.6, delay: 0.2, ease: 'power2.out' }
        );
      }

      // Animate text elements
      const title = contentRef.current?.querySelector('.service-modal-title');
      const description = contentRef.current?.querySelector('.service-modal-description');
      const price = contentRef.current?.querySelector('.service-modal-price');
      const duration = contentRef.current?.querySelector('.service-modal-duration');

      if (title) {
        gsap.fromTo(
          title,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, delay: 0.3, ease: 'power2.out' }
        );
      }

      if (description) {
        gsap.fromTo(
          description,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, delay: 0.4, ease: 'power2.out' }
        );
      }

      if (price) {
        gsap.fromTo(
          price,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.4, delay: 0.5, ease: 'back.out(1.5)' }
        );
      }

      if (duration) {
        gsap.fromTo(
          duration,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.4, delay: 0.5, ease: 'power2.out' }
        );
      }
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, service]);

  const handleClose = () => {
    if (overlayRef.current && contentRef.current) {
      gsap.to([overlayRef.current, contentRef.current], {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          onClose();
        },
      });
    } else {
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      handleClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

  if (!isOpen || !service) return null;

  return (
    <>
      <div
        ref={overlayRef}
        className="service-modal-overlay"
        onClick={handleOverlayClick}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <div
          ref={contentRef}
          className="service-modal-content"
          style={{
            backgroundColor: '#0f0f0f',
            borderRadius: '20px',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          }}
        >
          <button
            onClick={handleClose}
            className="service-modal-close"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'all 0.3s',
              color: '#fff',
              fontSize: '20px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'rotate(90deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'rotate(0deg)';
            }}
          >
            <span className="ti-close"></span>
          </button>

          <div style={{ padding: '40px' }}>
            {service.image && (
              <div
                className="service-modal-img"
                style={{
                  width: '100%',
                  height: '300px',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  marginBottom: '30px',
                  position: 'relative',
                }}
              >
                <img
                  src={getImageUrl(service.image) || '/placeholder.webp'}
                  alt={service.title}
                  onError={(e) => {
                    e.target.src = '/placeholder.webp';
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            )}

            <div className="service-modal-title">
              <h2
                style={{
                  fontSize: '36px',
                  fontWeight: 600,
                  marginBottom: '15px',
                  color: '#fff',
                  lineHeight: '1.2',
                }}
              >
                {service.title}
              </h2>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '25px',
                flexWrap: 'wrap',
              }}
            >
              {service.price && (
                <div
                  className="service-modal-price"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    padding: '15px 25px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      display: 'block',
                      marginBottom: '5px',
                    }}
                  >
                    Fiyat
                  </span>
                  <span
                    style={{
                      fontSize: '24px',
                      fontWeight: 600,
                      color: '#fff',
                    }}
                  >
                    {service.price.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
              )}

              {service.duration && (
                <div
                  className="service-modal-duration"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    padding: '15px 25px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      display: 'block',
                      marginBottom: '5px',
                    }}
                  >
                    Süre
                  </span>
                  <span
                    style={{
                      fontSize: '24px',
                      fontWeight: 600,
                      color: '#fff',
                    }}
                  >
                    {service.duration}
                  </span>
                </div>
              )}
            </div>

            <div className="service-modal-description">
              <p
                style={{
                  fontSize: '16px',
                  lineHeight: '1.8',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '30px',
                }}
              >
                {service.description || 'Profesyonel sağlık hizmeti sunuyoruz.'}
              </p>
            </div>

            <div style={{ marginTop: '30px' }}>
              <a
                href="/randevu-al"
                className="butn butn-md butn-bg radius-30"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span>Randevu Al</span>
                <span className="ti-arrow-top-right"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ServiceDetailModal;

