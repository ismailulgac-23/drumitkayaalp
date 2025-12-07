'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getImageUrl } from '@/common/imageHelper';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function BlogAPI() {
  const params = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    if (params.id) {
      fetchBlog();
      fetchRelatedBlogs();
    }
  }, [params.id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/blogs/${params.id}`);
      const data = await response.json();
      if (data.success) {
        setBlog(data.data);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blogs`);
      const data = await response.json();
      if (data.success) {
        // Exclude current blog and get first 3
        const related = (data.data || [])
          .filter(b => b.id !== params.id)
          .slice(0, 3);
        setRelatedBlogs(related);
      }
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  if (loading) {
    return (
      <section className="blog section-padding">
        <div className="container">
          <div className="text-center">
            <div className="text-lg">Yükleniyor...</div>
          </div>
        </div>
      </section>
    );
  }

  if (!blog) {
    return (
      <section className="blog section-padding">
        <div className="container">
          <div className="text-center">
            <div className="text-lg">Blog bulunamadı.</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="blog section-padding">
      <div className="container">
        <div className="row xlg-marg">
          <div className="col-lg-8">
            <div className="main-post">
              <div className="item pb-60">
                {blog.image && (
                  <div className="img mb-50">
                    <img 
                      src={getImageUrl(blog.image) || '/placeholder.webp'} 
                      style={{
                        width: "100%",
                        height: 500,
                        objectFit: "contain"
                      }}
                      alt={blog.title}
                      onError={(e) => {
                        e.target.src = '/placeholder.webp';
                      }}
                    />
                  </div>
                )}
                <article>
                  <h2 className="mb-30">{blog.title}</h2>
                  <div className="text">
                    <p style={{ whiteSpace: 'pre-wrap' }}>{blog.description}</p>
                  </div>
                </article>

                <div className="info-area flex pt-50 bord-thin-top">
                  <div>
                    <div className="d-flex align-items-center">
                      <div className="post-date">
                        {new Date(blog.createdAt).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="sidebar">
              <div className="widget">
                <h6 className="title-widget">Ara</h6>
                <div className="search-box">
                  <input type="text" name="search-post" placeholder="Ara" />
                  <span className="icon pe-7s-search"></span>
                </div>
              </div>
              {relatedBlogs.length > 0 && (
                <div className="widget last-post-thum">
                  <h6 className="title-widget">Son Yazılar</h6>
                  {relatedBlogs.map((relatedBlog) => (
                    <div key={relatedBlog.id} className="item d-flex align-items-center">
                      <div>
                        <div className="img">
                          <Link href={`/blog/${relatedBlog.id}`}>
                            {relatedBlog.image ? (
                              <img 
                                src={getImageUrl(relatedBlog.image) || '/placeholder.webp'} 
                                alt={relatedBlog.title}
                                onError={(e) => {
                                  e.target.src = '/placeholder.webp';
                                }}
                              />
                            ) : (
                              <div style={{ width: '80px', height: '80px', background: '#f0f0f0' }}></div>
                            )}
                            <span className="date">
                              <span>
                                {new Date(relatedBlog.createdAt).getDate()} / <br />
                                {new Date(relatedBlog.createdAt).toLocaleDateString('tr-TR', { month: 'short' })}
                              </span>
                            </span>
                          </Link>
                        </div>
                      </div>
                      <div className="cont">
                        <h6>
                          <Link href={`/blog/${relatedBlog.id}`}>
                            {relatedBlog.title.length > 50
                              ? `${relatedBlog.title.substring(0, 50)}...`
                              : relatedBlog.title}
                          </Link>
                        </h6>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BlogAPI;

