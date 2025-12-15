'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getImageUrl } from '@/common/imageHelper';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function ServiceDetail() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchService();
    }
  }, [params.id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/services/${params.id}`);
      const data = await response.json();
      if (data.success) {
        setService(data.data);
      } else {
        router.push('/hizmetler');
      }
    } catch (error) {
      console.error('Error fetching service:', error);
      router.push('/hizmetler');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !service) return;

    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.service-detail-section',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(
      '.service-detail-section .service-title',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
      .fromTo(
        '.service-detail-section .service-image',
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo(
        '.service-detail-section .service-content',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.6'
      );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars?.trigger === document.querySelector('.service-detail-section')) {
          trigger.kill();
        }
      });
    };
  }, [service]);

  if (loading) {
    return (
      <section className="service-detail-section section-padding">
        <div className="container">
          <div className="text-center py-5">
            <div className="text-lg">Yükleniyor...</div>
          </div>
        </div>
      </section>
    );
  }

  if (!service) {
    return (
      <section className="service-detail-section section-padding">
        <div className="container">
          <div className="text-center py-5">
            <div className="text-lg">Hizmet bulunamadı.</div>
            <Link href="/hizmetler" className="butn butn-md butn-bg radius-30 mt-30">
              <span>Hizmetlere Dön</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="service-detail-section section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="mb-40">
                <Link
                  href="/hizmetler"
                  className="d-flex align-items-center main-color mb-30"
                  style={{ fontSize: '16px' }}
                >
                  <span className="ti-arrow-left mr-10"></span>
                  <span>Hizmetlere Dön</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              {service.image && (
                <div className="service-image mb-50">
                  <img
                    src={getImageUrl(service.image) || '/placeholder.webp'}
                    alt={service.title}
                    onError={(e) => {
                      e.target.src = '/placeholder.webp';
                    }}
                    style={{
                      width: '100%',
                      height: '500px',
                      objectFit: 'cover',
                      borderRadius: '15px',
                    }}
                  />
                </div>
              )}

              <div className="service-title mb-40">
                <h1 style={{ fontSize: '48px', fontWeight: 700, lineHeight: '1.2' }}>
                  {service.title}
                </h1>
                {service.price && (
                  <div className="mt-20">
                    <span className="main-color fz-24 fw-600">
                      ₺{service.price.toLocaleString('tr-TR')}
                    </span>
                  </div>
                )}
                {service.duration && (
                  <div className="mt-10">
                    <span className="opacity-7">Süre: {service.duration}</span>
                  </div>
                )}
              </div>

              <div className="service-content">
                <div
                  className="service-description dark-theme-content"
                  dangerouslySetInnerHTML={{ __html: service.description || '' }}
                />
              </div>

              <div className="mt-60">
                <Link
                  href="/randevu-al"
                  className="butn butn-md butn-bg radius-30 border border-white/60"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span>Randevu Al</span>
                  <span className="ti-arrow-top-right"></span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .service-description.dark-theme-content {
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.8;
          font-size: 16px;
        }

        .service-description.dark-theme-content h1,
        .service-description.dark-theme-content h2,
        .service-description.dark-theme-content h3,
        .service-description.dark-theme-content h4,
        .service-description.dark-theme-content h5,
        .service-description.dark-theme-content h6 {
          color: #fff;
          margin-top: 30px;
          margin-bottom: 15px;
          font-weight: 600;
        }

        .service-description.dark-theme-content h1 {
          font-size: 32px;
        }

        .service-description.dark-theme-content h2 {
          font-size: 28px;
        }

        .service-description.dark-theme-content h3 {
          font-size: 24px;
        }

        .service-description.dark-theme-content p {
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 20px;
        }

        .service-description.dark-theme-content ul,
        .service-description.dark-theme-content ol {
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 20px;
          padding-left: 30px;
        }

        .service-description.dark-theme-content li {
          margin-bottom: 10px;
        }

        .service-description.dark-theme-content a {
          color: var(--main-color, #ff6b6b);
          text-decoration: underline;
        }

        .service-description.dark-theme-content a:hover {
          color: var(--main-color, #ff6b6b);
          opacity: 0.8;
        }

        .service-description.dark-theme-content strong,
        .service-description.dark-theme-content b {
          color: #fff;
          font-weight: 600;
        }

        .service-description.dark-theme-content em,
        .service-description.dark-theme-content i {
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
        }

        .service-description.dark-theme-content blockquote {
          border-left: 4px solid var(--main-color, #ff6b6b);
          padding-left: 20px;
          margin: 20px 0;
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
        }

        .service-description.dark-theme-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }

        .service-description.dark-theme-content table th,
        .service-description.dark-theme-content table td {
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 12px;
          color: rgba(255, 255, 255, 0.8);
        }

        .service-description.dark-theme-content table th {
          background-color: rgba(255, 255, 255, 0.1);
          color: #fff;
          font-weight: 600;
        }

        .service-description.dark-theme-content img {
          max-width: 100%;
          height: auto;
          border-radius: 10px;
          margin: 20px 0;
        }

        .service-description.dark-theme-content code {
          background-color: rgba(255, 255, 255, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--main-color, #ff6b6b);
          font-family: monospace;
        }

        .service-description.dark-theme-content pre {
          background-color: rgba(255, 255, 255, 0.05);
          padding: 15px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 20px 0;
        }

        .service-description.dark-theme-content pre code {
          background-color: transparent;
          padding: 0;
          color: rgba(255, 255, 255, 0.9);
        }
      `}</style>
    </>
  );
}

export default ServiceDetail;

