"use client";
import React, { useState } from "react";
import Link from "next/link";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableContainer from "@/components/royal-common/Table";
import Button from "@/components/ui/button/Button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify/react/dist/iconify.js";
import ComponentCard from "@/components/common/ComponentCard";

export default function Services() {
    const [services, setServices] = useState([
        {
            id: "1",
            title: "Diş Temizliği",
            description: "Profesyonel diş temizliği hizmeti",
            price: 500,
            duration: "30 dakika",
            image: "",
            isActive: true,
        },
        {
            id: "2",
            title: "Dolgu",
            description: "Estetik ve sağlam dolgu işlemleri",
            price: 800,
            duration: "45 dakika",
            image: "",
            isActive: true,
        },
        {
            id: "3",
            title: "Kanal Tedavisi",
            description: "Uzman kanal tedavisi hizmeti",
            price: 1500,
            duration: "60 dakika",
            image: "",
            isActive: true,
        },
    ]);
    const [filters, setFilters] = useState({
        search: '',
    });

    const handleDelete = async (id) => {
        if (!window.confirm('Bu hizmeti silmek istediğinize emin misiniz?')) {
            return;
        }
        setServices(prev => prev.filter(service => service.id !== id));
    };

    const toggleActive = (id, currentStatus) => {
        setServices(prev => 
            prev.map(service => 
                service.id === id ? { ...service, isActive: !currentStatus } : service
            )
        );
    };

    const filteredServices = services.filter(service => {
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
                service.title.toLowerCase().includes(searchLower) ||
                service.description.toLowerCase().includes(searchLower)
            );
        }
        return true;
    });

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
                        navItems={["Hizmet Adı", "Açıklama", "Fiyat", "Süre", "Durum", "İşlemler"]}
                        renderItem={(service) => (
                            <TableRow key={service.id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start font-medium">
                                    {service.title}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {service.description}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start font-semibold">
                                    ₺{service.price.toLocaleString('tr-TR')}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {service.duration}
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
                                        variant={service.isActive ? "outline" : "outline"}
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

