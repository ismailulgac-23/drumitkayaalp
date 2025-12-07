"use client";
import React, { useState, useEffect } from "react";
import { getImageUrl } from "@/common/imageHelper";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function BlogsAPI() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/blogs`);
      const data = await response.json();
      if (data.success) {
        setBlogs(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="blog-main section-padding">
        <div className="container">
          <div className="text-center">
            <div className="text-lg">Yükleniyor...</div>
          </div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return (
      <section className="blog-main section-padding">
        <div className="container">
          <div className="text-center">
            <div className="text-lg">Henüz blog bulunmamaktadır.</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="blog-main section-padding">
      <div className="container">
        <div className="row lg-marg justify-content-around">
          {blogs.map((blog) => (
            <div key={blog.id} className="col-lg-4 item mb-80">
              {blog.image && (
                <div className="img">
                  <img
                    src={getImageUrl(blog.image) || "/placeholder.webp"}
                    style={{
                      width: "100%",
                      height: 300,
                      objectFit: "contain",
                    }}
                    alt={blog.title}
                    onError={(e) => {
                      e.target.src = "/placeholder.webp";
                    }}
                  />
                </div>
              )}
              <div className="content">
                <div className="d-flex align-items-center mb-15">
                  <div className="post-date">
                    {new Date(blog.createdAt).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <h3 className="mb-15">
                  <Link href={`/blog/${blog.id}`}>{blog.title}</Link>
                </h3>
                <p>
                  {blog.description && blog.description.length > 200
                    ? `${blog.description.substring(0, 200)}...`
                    : blog.description}
                </p>
                <Link
                  href={`/blog/${blog.id}`}
                  className="d-flex align-items-center main-color mt-40"
                >
                  <span className="text mr-15">Devamını Oku</span>
                  <span className="ti-arrow-top-right"></span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BlogsAPI;
