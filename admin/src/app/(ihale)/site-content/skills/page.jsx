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

export default function Skills() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/skills');
            if (response.data.success) {
                setSkills(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching skills:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu uzmanlık alanını silmek istediğinize emin misiniz?')) {
            return;
        }
        try {
            await axios.delete(`/skills/${id}`);
            alert('Uzmanlık alanı başarıyla silindi');
            fetchSkills();
        } catch (error) {
            console.error('Error deleting skill:', error);
            alert('Uzmanlık alanı silinirken bir hata oluştu');
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
            <PageBreadcrumb pageTitle="Uzmanlık Alanları" />
            <div className="space-y-6">
                <ComponentCard 
                    title="Uzmanlık Alanları Yönetimi"
                    titleRightRenderer={
                        <Link href="/site-content/skills/create">
                            <Button className="bg-primary text-white px-4 py-2">
                                <Icon icon="ri:add-line" className="mr-2" />
                                Yeni Uzmanlık Alanı Ekle
                            </Button>
                        </Link>
                    }
                >
                    <TableContainer
                        data={skills}
                        navItems={["Yüzdelik", "Başlık", "Sıra", "Durum", "İşlemler"]}
                        renderItem={(skill) => (
                            <TableRow key={skill.id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start font-semibold">
                                    {skill.percentage}%
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start font-medium">
                                    {skill.title}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {skill.order}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {skill.isActive ? (
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
                                    <Link href={`/site-content/skills/edit/${skill.id}`}>
                                        <Button size="sm" variant="outline" className="flex items-center justify-center">
                                            <Icon icon="ri:edit-line" className="text-base" />
                                        </Button>
                                    </Link>
                                    <Button 
                                        size="sm" 
                                        variant="danger" 
                                        className="flex items-center justify-center"
                                        onClick={() => handleDelete(skill.id)}
                                    >
                                        <Icon icon="ri:delete-bin-line" className="text-base" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                        emptyMessage="Henüz uzmanlık alanı bulunmamaktadır"
                    />
                </ComponentCard>
            </div>
        </div>
    );
}

