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

export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
    });

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/doctors');
            if (response.data.success) {
                setDoctors(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
            alert('Doktorlar yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu doktoru silmek istediğinize emin misiniz?')) {
            return;
        }
        try {
            await axios.delete(`/doctors/${id}`);
            alert('Doktor başarıyla silindi');
            fetchDoctors();
        } catch (error) {
            console.error('Error deleting doctor:', error);
            alert('Doktor silinirken bir hata oluştu');
        }
    };

    const toggleActive = async (id, currentStatus) => {
        try {
            await axios.put(`/doctors/${id}`, { isActive: !currentStatus });
            fetchDoctors();
        } catch (error) {
            console.error('Error toggling doctor:', error);
            alert('Doktor durumu güncellenirken bir hata oluştu');
        }
    };

    const filteredDoctors = doctors.filter(doctor => {
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
                doctor.name?.toLowerCase().includes(searchLower) ||
                doctor.specialty?.toLowerCase().includes(searchLower) ||
                doctor.email?.toLowerCase().includes(searchLower)
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
            <PageBreadcrumb pageTitle="Doktorlar Yönetimi" />
            <div className="space-y-6">
                <ComponentCard 
                    title="Doktorlar"
                    titleRightRenderer={
                        <Link href="/doctors/create">
                            <Button className="bg-primary text-white px-4 py-2">
                                <Icon icon="ri:add-line" className="mr-2" />
                                Yeni Doktor Ekle
                            </Button>
                        </Link>
                    }
                >
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Doktor adı, email veya uzmanlık ile ara..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                        />
                    </div>
                    <TableContainer
                        data={filteredDoctors}
                        navItems={["#", "Fotoğraf", "Ad Soyad", "Email", "Telefon", "Uzmanlık", "Aktif", "İşlem"]}
                        renderItem={(doctor) => {
                            const index = filteredDoctors.findIndex(d => d.id === doctor.id);
                            return (
                            <TableRow key={doctor.id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {index + 1}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {doctor.image ? (
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${doctor.image}`}
                                            alt={doctor.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                            onError={(e) => { e.target.src = '/placeholder.webp'; }}
                                        />
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start font-medium">
                                    {doctor.name}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {doctor.email || '-'}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {doctor.phone || '-'}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {doctor.specialty || '-'}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {doctor.isActive ? (
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
                                    <Link href={`/doctors/edit/${doctor.id}`}>
                                        <Button size="sm" variant="outline" className="flex items-center justify-center">
                                            <Icon icon="ri:edit-line" className="text-base" />
                                        </Button>
                                    </Link>
                                    <Button 
                                        size="sm" 
                                        variant="outline"
                                        className="flex items-center justify-center"
                                        onClick={() => toggleActive(doctor.id, doctor.isActive)}
                                    >
                                        <Icon 
                                            icon={doctor.isActive ? "ri:eye-off-line" : "ri:eye-line"} 
                                            className="text-base" 
                                        />
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="danger" 
                                        className="flex items-center justify-center"
                                        onClick={() => handleDelete(doctor.id)}
                                    >
                                        <Icon icon="ri:delete-bin-line" className="text-base" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                            );
                        }}
                        emptyMessage={filters.search ? 'Arama sonucu bulunamadı' : 'Henüz doktor eklenmemiş'}
                    />
                </ComponentCard>
            </div>
        </div>
    );
}

