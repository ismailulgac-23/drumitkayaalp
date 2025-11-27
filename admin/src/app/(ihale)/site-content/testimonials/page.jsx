"use client";
import React, { useState } from "react";
import Link from "next/link";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableContainer from "@/components/royal-common/Table";
import Button from "@/components/ui/button/Button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify/react/dist/iconify.js";
import ComponentCard from "@/components/common/ComponentCard";

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState([
        {
            id: "1",
            patientName: "Ahmet Yılmaz",
            rating: 5,
            comment: "Çok memnun kaldım, harika bir hizmet!",
            date: "2024-03-10",
            isActive: true,
        },
        {
            id: "2",
            patientName: "Ayşe Demir",
            rating: 5,
            comment: "Profesyonel ve güler yüzlü bir ekip. Teşekkürler!",
            date: "2024-03-05",
            isActive: true,
        },
        {
            id: "3",
            patientName: "Mehmet Kaya",
            rating: 4,
            comment: "İyi bir deneyimdi, tavsiye ederim.",
            date: "2024-02-28",
            isActive: true,
        },
    ]);
    const [filters, setFilters] = useState({
        search: '',
    });

    const handleDelete = async (id) => {
        if (!window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
            return;
        }
        setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id));
    };

    const toggleActive = (id, currentStatus) => {
        setTestimonials(prev => 
            prev.map(testimonial => 
                testimonial.id === id ? { ...testimonial, isActive: !currentStatus } : testimonial
            )
        );
    };

    const filteredTestimonials = testimonials.filter(testimonial => {
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
                testimonial.patientName.toLowerCase().includes(searchLower) ||
                testimonial.comment.toLowerCase().includes(searchLower)
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

