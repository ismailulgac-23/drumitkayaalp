"use client";
import React, { useState } from "react";
import Link from "next/link";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableContainer from "@/components/royal-common/Table";
import Button from "@/components/ui/button/Button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify/react/dist/iconify.js";
import ComponentCard from "@/components/common/ComponentCard";

export default function BeforeAfter() {
    const [items, setItems] = useState([
        {
            id: "1",
            title: "Diş Temizliği Öncesi - Sonrası",
            beforeImage: "https://example.com/before1.jpg",
            afterImage: "https://example.com/after1.jpg",
            description: "Profesyonel diş temizliği sonuçları",
            order: 1,
            isActive: true,
        },
        {
            id: "2",
            title: "Dolgu İşlemi Öncesi - Sonrası",
            beforeImage: "https://example.com/before2.jpg",
            afterImage: "https://example.com/after2.jpg",
            description: "Estetik dolgu sonuçları",
            order: 2,
            isActive: true,
        },
    ]);
    const [filters, setFilters] = useState({
        search: '',
    });

    const handleDelete = async (id) => {
        if (!window.confirm('Bu öğeyi silmek istediğinize emin misiniz?')) {
            return;
        }
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const toggleActive = (id, currentStatus) => {
        setItems(prev => 
            prev.map(item => 
                item.id === id ? { ...item, isActive: !currentStatus } : item
            )
        );
    };

    const filteredItems = items.filter(item => {
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
                item.title.toLowerCase().includes(searchLower) ||
                item.description.toLowerCase().includes(searchLower)
            );
        }
        return true;
    });

    return (
        <div>
            <PageBreadcrumb pageTitle="Öncesi-Sonrası Yönetimi" />
            <div className="space-y-6">
                <ComponentCard 
                    title="Öncesi-Sonrası Galerisi"
                    titleRightRenderer={
                        <Link href="/site-content/before-after/create">
                            <Button className="bg-primary text-white px-4 py-2">
                                <Icon icon="ri:add-line" className="mr-2" />
                                Yeni Ekle
                            </Button>
                        </Link>
                    }
                >
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Başlık veya açıklama ile ara..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                        />
                    </div>
                    <TableContainer
                        data={filteredItems}
                        navItems={["Sıra", "Başlık", "Açıklama", "Öncesi Görsel", "Sonrası Görsel", "Durum", "İşlemler"]}
                        renderItem={(item) => (
                            <TableRow key={item.id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {item.order}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start font-medium">
                                    {item.title}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="max-w-md truncate" title={item.description}>
                                        {item.description}
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="max-w-xs truncate text-sm text-gray-500">
                                        {item.beforeImage || "-"}
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="max-w-xs truncate text-sm text-gray-500">
                                        {item.afterImage || "-"}
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {item.isActive ? (
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
                                    <Link href={`/site-content/before-after/edit/${item.id}`}>
                                        <Button size="sm" variant="outline" className="flex items-center justify-center">
                                            <Icon icon="ri:edit-line" className="text-base" />
                                        </Button>
                                    </Link>
                                    <Button 
                                        size="sm" 
                                        variant="outline"
                                        className="flex items-center justify-center"
                                        onClick={() => toggleActive(item.id, item.isActive)}
                                    >
                                        <Icon 
                                            icon={item.isActive ? "ri:eye-off-line" : "ri:eye-line"} 
                                            className="text-base" 
                                        />
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="danger" 
                                        className="flex items-center justify-center"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <Icon icon="ri:delete-bin-line" className="text-base" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                        emptyMessage="Henüz öğe bulunmamaktadır"
                    />
                </ComponentCard>
            </div>
        </div>
    );
}

