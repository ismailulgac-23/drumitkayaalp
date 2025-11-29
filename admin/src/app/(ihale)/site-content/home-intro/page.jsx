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

export default function HomeIntro() {
    const [intro, setIntro] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchIntro();
    }, []);

    const fetchIntro = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/home-intro/all');
            if (response.data.success && response.data.data.length > 0) {
                setIntro(response.data.data[0]);
            }
        } catch (error) {
            console.error('Error fetching home intro:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu intro\'yu silmek istediğinize emin misiniz?')) {
            return;
        }
        try {
            await axios.delete(`/home-intro/${id}`);
            alert('Intro başarıyla silindi');
            fetchIntro();
        } catch (error) {
            console.error('Error deleting intro:', error);
            alert('Intro silinirken bir hata oluştu');
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
            <PageBreadcrumb pageTitle="Anasayfa Intro" />
            <div className="space-y-6">
                <ComponentCard 
                    title="Anasayfa Intro Yönetimi"
                    titleRightRenderer={
                        <Link href="/site-content/home-intro/create">
                            <Button className="bg-primary text-white px-4 py-2">
                                <Icon icon="ri:add-line" className="mr-2" />
                                Yeni Intro Ekle
                            </Button>
                        </Link>
                    }
                >
                    {intro ? (
                        <TableContainer
                            data={[intro]}
                            navItems={["Görsel", "Başlık", "Durum", "İşlemler"]}
                            renderItem={(item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        {item.backgroundImage ? (
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${item.backgroundImage}`}
                                                alt="Background"
                                                className="w-20 h-20 object-cover rounded"
                                                onError={(e) => { e.target.src = '/placeholder.webp'; }}
                                            />
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div>
                                            <div className="font-semibold">{item.mainTitle}</div>
                                            {item.smallTitle && (
                                                <div className="text-sm text-gray-500">{item.smallTitle}</div>
                                            )}
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
                                        <Link href={`/site-content/home-intro/edit/${item.id}`}>
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
                            emptyMessage="Henüz intro eklenmemiş"
                        />
                    ) : (
                        <div className="text-center py-12">
                            <Icon icon="ri:file-text-line" className="text-6xl text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4 text-lg">Henüz intro eklenmemiş</p>
                            <Link href="/site-content/home-intro/create">
                                <Button className="bg-primary text-white px-6 py-2">
                                    <Icon icon="ri:add-line" className="mr-2" />
                                    İlk Intro'yu Ekle
                                </Button>
                            </Link>
                        </div>
                    )}
                </ComponentCard>
            </div>
        </div>
    );
}

