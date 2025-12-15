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

export default function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/services');
            if (response.data.success) {
                setServices(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            alert('Hizmetler yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu hizmeti silmek istediğinize emin misiniz?')) {
            return;
        }
        try {
            await axios.delete(`/services/${id}`);
            alert('Hizmet başarıyla silindi');
            fetchServices();
        } catch (error) {
            console.error('Error deleting service:', error);
            alert('Hizmet silinirken bir hata oluştu');
        }
    };

    const toggleActive = async (id, currentStatus) => {
        try {
            await axios.put(`/services/${id}`, { isActive: !currentStatus });
            fetchServices();
        } catch (error) {
            console.error('Error toggling service:', error);
            alert('Hizmet durumu güncellenirken bir hata oluştu');
        }
    };

    const filteredServices = services.filter(service => {
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
                service.title?.toLowerCase().includes(searchLower) ||
                service.description?.toLowerCase().includes(searchLower)
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
            <PageBreadcrumb pageTitle="Hizmetler Yönetimi" />
            <div className="space-y-6">
                <ComponentCard 
                    title="Hizmetler"
                    titleRightRenderer={
                        <Link href="/site-content/services/create">
                            <Button className="bg-primary text-white px-4 py-2">
                                <Icon icon="ri:add-line" className="mr-2" />
                                Yeni Hizmet Ekle
                            </Button>
                        </Link>
                    }
                >
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Hizmet adı veya açıklama ile ara..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                        />
                    </div>
                    <TableContainer
                        data={filteredServices}
                        navItems={["Görsel", "Hizmet Adı", "Fiyat", "Süre", "Durum", "İşlemler"]}
                        renderItem={(service) => (
                            <TableRow key={service.id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {service.image ? (
                                        <img 
                                            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${service.image}`}
                                            alt={service.title}
                                            className="w-16 h-16 object-cover rounded"
                                            onError={(e) => { e.target.src = '/placeholder.webp'; }}
                                        />
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start font-medium">
                                    {service.title}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start font-semibold">
                                    {service.price ? `₺${service.price.toLocaleString('tr-TR')}` : "-"}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {service.duration || "-"}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {service.isActive ? (
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
                                    <Link href={`/site-content/services/edit/${service.id}`}>
                                        <Button size="sm" variant="outline" className="flex items-center justify-center">
                                            <Icon icon="ri:edit-line" className="text-base" />
                                        </Button>
                                    </Link>
                                    <Button 
                                        size="sm" 
                                        variant="outline"
                                        className="flex items-center justify-center"
                                        onClick={() => toggleActive(service.id, service.isActive)}
                                    >
                                        <Icon 
                                            icon={service.isActive ? "ri:eye-off-line" : "ri:eye-line"} 
                                            className="text-base" 
                                        />
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="danger" 
                                        className="flex items-center justify-center"
                                        onClick={() => handleDelete(service.id)}
                                    >
                                        <Icon icon="ri:delete-bin-line" className="text-base" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                        emptyMessage="Henüz hizmet bulunmamaktadır"
                    />
                </ComponentCard>
            </div>
        </div>
    );
}
