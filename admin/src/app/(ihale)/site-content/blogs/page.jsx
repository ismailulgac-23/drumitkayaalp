"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableContainer from "@/components/royal-common/Table";
import Button from "@/components/ui/button/Button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify/react/dist/iconify.js";
import ComponentCard from "@/components/common/ComponentCard";
import axios from "@/axios";

export default function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
    });

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/blogs');
            if (response.data.success) {
                setBlogs(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
            alert('Bloglar yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu blogu silmek istediğinize emin misiniz?')) {
            return;
        }
        try {
            await axios.delete(`/blogs/${id}`);
            alert('Blog başarıyla silindi');
            fetchBlogs();
        } catch (error) {
            console.error('Error deleting blog:', error);
            alert('Blog silinirken bir hata oluştu');
        }
    };

    const toggleActive = async (id, currentStatus) => {
        try {
            await axios.put(`/blogs/${id}`, { isActive: !currentStatus });
            fetchBlogs();
        } catch (error) {
            console.error('Error toggling blog:', error);
            alert('Blog durumu güncellenirken bir hata oluştu');
        }
    };

    const filteredBlogs = blogs.filter(blog => {
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
                blog.title?.toLowerCase().includes(searchLower) ||
                blog.description?.toLowerCase().includes(searchLower)
            );
        }
        return true;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Yükleniyor...</div>
            </div>
        );
    }

    return (
        <div>
            <PageBreadcrumb pageTitle="Blog Yönetimi" />
            <div className="space-y-6">
                <ComponentCard 
                    title="Bloglar"
                    titleRightRenderer={
                        <Link href="/site-content/blogs/create">
                            <Button className="bg-primary text-white px-4 py-2">
                                <Icon icon="ri:add-line" className="mr-2" />
                                Yeni Blog Ekle
                            </Button>
                        </Link>
                    }
                >
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Blog başlığı veya açıklama ile ara..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                        />
                    </div>
                    <TableContainer
                        data={filteredBlogs}
                        navItems={["Görsel", "Başlık", "Açıklama", "Durum", "Oluşturulma", "İşlemler"]}
                        renderItem={(blog) => (
                            <TableRow key={blog.id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {blog.image ? (
                                        <img 
                                            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${blog.image}`}
                                            alt={blog.title}
                                            className="w-16 h-16 object-cover rounded"
                                            onError={(e) => { e.target.src = '/placeholder.webp'; }}
                                        />
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start font-medium">
                                    {blog.title}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {blog.description ? (
                                        <span className="line-clamp-2">
                                            {blog.description.length > 100 
                                                ? `${blog.description.substring(0, 100)}...` 
                                                : blog.description}
                                        </span>
                                    ) : "-"}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {blog.isActive ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                            Aktif
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                            Pasif
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start flex gap-2">
                                    <Link href={`/site-content/blogs/edit/${blog.id}`}>
                                        <Button size="sm" variant="outline" className="flex items-center justify-center">
                                            <Icon icon="ri:edit-line" className="text-base" />
                                        </Button>
                                    </Link>
                                    <Button 
                                        size="sm" 
                                        variant="outline"
                                        className="flex items-center justify-center"
                                        onClick={() => toggleActive(blog.id, blog.isActive)}
                                    >
                                        <Icon 
                                            icon={blog.isActive ? "ri:eye-off-line" : "ri:eye-line"} 
                                            className="text-base" 
                                        />
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="danger" 
                                        className="flex items-center justify-center"
                                        onClick={() => handleDelete(blog.id)}
                                    >
                                        <Icon icon="ri:delete-bin-line" className="text-base" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                        emptyMessage="Henüz blog bulunmamaktadır"
                    />
                </ComponentCard>
            </div>
        </div>
    );
}

