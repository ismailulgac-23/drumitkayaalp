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

export default function ContactMap() {
    const [map, setMap] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMap();
    }, []);

    const fetchMap = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/contact-map/all');
            if (response.data.success && response.data.data.length > 0) {
                setMap(response.data.data[0]);
            }
        } catch (error) {
            console.error('Error fetching contact map:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu haritayı silmek istediğinize emin misiniz?')) {
            return;
        }
        try {
            await axios.delete(`/contact-map/${id}`);
            alert('Harita başarıyla silindi');
            fetchMap();
        } catch (error) {
            console.error('Error deleting map:', error);
            alert('Harita silinirken bir hata oluştu');
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
            <PageBreadcrumb pageTitle="İletişim Haritası" />
            <div className="space-y-6">
                <ComponentCard 
                    title="İletişim Haritası Yönetimi"
                    titleRightRenderer={
                        <Link href="/site-content/contact-map/create">
                            <Button className="bg-primary text-white px-4 py-2">
                                <Icon icon="ri:add-line" className="mr-2" />
                                Yeni Harita Ekle
                            </Button>
                        </Link>
                    }
                >
                    {map ? (
                        <TableContainer
                            data={[map]}
                            navItems={["Iframe Kodu", "Durum", "İşlemler"]}
                            renderItem={(item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="max-w-2xl">
                                            <div className="text-sm text-gray-600 dark:text-gray-400 break-all font-mono bg-gray-50 dark:bg-gray-800 p-3 rounded">
                                                {item.iframeCode.substring(0, 150)}...
                                            </div>
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
                                        <Link href={`/site-content/contact-map/edit/${item.id}`}>
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
                            emptyMessage="Henüz harita eklenmemiş"
                        />
                    ) : (
                        <div className="text-center py-12">
                            <Icon icon="ri:map-pin-line" className="text-6xl text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4 text-lg">Henüz harita eklenmemiş</p>
                            <Link href="/site-content/contact-map/create">
                                <Button className="bg-primary text-white px-6 py-2">
                                    <Icon icon="ri:add-line" className="mr-2" />
                                    İlk Haritayı Ekle
                                </Button>
                            </Link>
                        </div>
                    )}
                </ComponentCard>
            </div>
        </div>
    );
}

