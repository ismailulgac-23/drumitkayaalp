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

export default function MarqueeItems() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/marquee-items');
            if (response.data.success) {
                setItems(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching marquee items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu item\'ı silmek istediğinize emin misiniz?')) {
            return;
        }
        try {
            await axios.delete(`/marquee-items/${id}`);
            alert('Item başarıyla silindi');
            fetchItems();
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Item silinirken bir hata oluştu');
        }
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
            <PageBreadcrumb pageTitle="Marquee Items" />
            <div className="space-y-6">
                <ComponentCard 
                    title="Marquee Items Yönetimi"
                    titleRightRenderer={
                        <Link href="/site-content/marquee-items/create">
                            <Button className="bg-primary text-white px-4 py-2">
                                <Icon icon="ri:add-line" className="mr-2" />
                                Yeni Item Ekle
                            </Button>
                        </Link>
                    }
                >
                    <TableContainer
                        data={items}
                        navItems={["Metin", "Sıra", "Durum", "İşlemler"]}
                        renderItem={(item) => (
                            <TableRow key={item.id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start font-medium">
                                    {item.text}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {item.order}
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
                                    <Link href={`/site-content/marquee-items/edit/${item.id}`}>
                                        <Button size="sm" variant="outline" className="flex items-center justify-center">
                                            <Icon icon="ri:edit-line" className="text-base" />
                                        </Button>
                                    </Link>
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
                        emptyMessage="Henüz item bulunmamaktadır"
                    />
                </ComponentCard>
            </div>
        </div>
    );
}

