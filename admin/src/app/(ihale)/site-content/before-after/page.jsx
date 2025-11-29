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

export default function BeforeAfter() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/before-after');
            if (response.data.success) {
                setItems(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching before-after items:', error);
            alert('Öncesi-Sonrası öğeleri yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu öğeyi silmek istediğinize emin misiniz?')) {
            return;
        }
        try {
            await axios.delete(`/before-after/${id}`);
            alert('Öğe başarıyla silindi');
            fetchItems();
        } catch (error) {
            console.error('Error deleting before-after item:', error);
            alert('Öğe silinirken bir hata oluştu');
        }
    };

    const toggleActive = async (id, currentStatus) => {
        try {
            await axios.put(`/before-after/${id}`, { isActive: !currentStatus });
            fetchItems();
        } catch (error) {
            console.error('Error toggling before-after item:', error);
            alert('Öğe durumu güncellenirken bir hata oluştu');
        }
    };

    const filteredItems = items.filter(item => {
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
                item.title?.toLowerCase().includes(searchLower) ||
                item.description?.toLowerCase().includes(searchLower)
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
                                        {item.description || "-"}
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {item.beforeImage ? (
                                        <img 
                                            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${item.beforeImage}`}
                                            alt="Before"
                                            className="w-20 h-20 object-cover rounded"
                                            onError={(e) => { e.target.src = '/placeholder.webp'; }}
                                        />
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {item.afterImage ? (
                                        <img 
                                            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${item.afterImage}`}
                                            alt="After"
                                            className="w-20 h-20 object-cover rounded"
                                            onError={(e) => { e.target.src = '/placeholder.webp'; }}
                                        />
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
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
