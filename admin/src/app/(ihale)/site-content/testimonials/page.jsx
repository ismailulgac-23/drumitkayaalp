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

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
    });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/testimonials');
            if (response.data.success) {
                setTestimonials(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            alert('Yorumlar yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
            return;
        }
        try {
            await axios.delete(`/testimonials/${id}`);
            alert('Yorum başarıyla silindi');
            fetchTestimonials();
        } catch (error) {
            console.error('Error deleting testimonial:', error);
            alert('Yorum silinirken bir hata oluştu');
        }
    };

    const toggleActive = async (id, currentStatus) => {
        try {
            await axios.put(`/testimonials/${id}`, { isActive: !currentStatus });
            fetchTestimonials();
        } catch (error) {
            console.error('Error toggling testimonial:', error);
            alert('Yorum durumu güncellenirken bir hata oluştu');
        }
    };

    const filteredTestimonials = testimonials.filter(testimonial => {
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
                testimonial.patientName?.toLowerCase().includes(searchLower) ||
                testimonial.comment?.toLowerCase().includes(searchLower)
            );
        }
        return true;
    });

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Icon
                key={i}
                icon={i < rating ? "ri:star-fill" : "ri:star-line"}
                className={i < rating ? "text-yellow-400" : "text-gray-300"}
            />
        ));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Yükleniyor...</div>
            </div>
        );
    }

    return (
        <div>
            <PageBreadcrumb pageTitle="Memnuniyet Yorumları" />
            <div className="space-y-6">
                <ComponentCard 
                    title="Müşteri Yorumları"
                    titleRightRenderer={
                        <Link href="/site-content/testimonials/create">
                            <Button className="bg-primary text-white px-4 py-2">
                                <Icon icon="ri:add-line" className="mr-2" />
                                Yeni Yorum Ekle
                            </Button>
                        </Link>
                    }
                >
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Hasta adı veya yorum ile ara..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                        />
                    </div>
                    <TableContainer
                        data={filteredTestimonials}
                        navItems={["Hasta Adı", "Puan", "Yorum", "Tarih", "Durum", "İşlemler"]}
                        renderItem={(testimonial) => (
                            <TableRow key={testimonial.id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start font-medium">
                                    {testimonial.patientName}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="flex items-center gap-1">
                                        {renderStars(testimonial.rating)}
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="max-w-md truncate" title={testimonial.comment}>
                                        {testimonial.comment}
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(testimonial.date).toLocaleDateString('tr-TR')}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {testimonial.isActive ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                            Aktif
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                            Pasif
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start flex gap-2">
                                    <Link href={`/site-content/testimonials/edit/${testimonial.id}`}>
                                        <Button size="sm" variant="outline" className="flex items-center justify-center">
                                            <Icon icon="ri:edit-line" className="text-base" />
                                        </Button>
                                    </Link>
                                    <Button 
                                        size="sm" 
                                        variant="outline"
                                        className="flex items-center justify-center"
                                        onClick={() => toggleActive(testimonial.id, testimonial.isActive)}
                                    >
                                        <Icon 
                                            icon={testimonial.isActive ? "ri:eye-off-line" : "ri:eye-line"} 
                                            className="text-base" 
                                        />
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="danger" 
                                        className="flex items-center justify-center"
                                        onClick={() => handleDelete(testimonial.id)}
                                    >
                                        <Icon icon="ri:delete-bin-line" className="text-base" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                        emptyMessage="Henüz yorum bulunmamaktadır"
                    />
                </ComponentCard>
            </div>
        </div>
    );
}
