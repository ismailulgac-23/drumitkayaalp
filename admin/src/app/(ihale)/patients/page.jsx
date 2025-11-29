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

export default function Patients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
    });

    useEffect(() => {
        fetchPatients();
    }, [filters]);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            
            const response = await axios.get(`/patients?${params.toString()}`);
            if (response.data.success) {
                setPatients(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching patients:', error);
            alert('Hastalar yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu hastayı silmek istediğinize emin misiniz?')) {
            return;
        }
        try {
            await axios.delete(`/patients/${id}`);
            alert('Hasta başarıyla silindi');
            fetchPatients();
        } catch (error) {
            console.error('Error deleting patient:', error);
            alert('Hasta silinirken bir hata oluştu');
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
            <PageBreadcrumb pageTitle="Hasta Yönetimi" />
            <div className="space-y-6">
                <ComponentCard 
                    title="Hastalar"
                    titleRightRenderer={
                        <Link href="/patients/create">
                            <Button className="bg-primary text-white px-4 py-2">
                                <Icon icon="ri:add-line" className="mr-2" />
                                Yeni Hasta Ekle
                            </Button>
                        </Link>
                    }
                >
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Hasta adı, telefon veya email ile ara..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                        />
                    </div>
                    <TableContainer
                        data={patients}
                        navItems={["Ad Soyad", "Telefon", "Email", "Doğum Tarihi", "Cinsiyet", "Randevu Sayısı", "İşlem Sayısı", "Kayıt Tarihi", "İşlemler"]}
                        renderItem={(patient) => (
                            <TableRow key={patient.id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start font-medium">
                                    {patient.name}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {patient.phone}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {patient.email || "-"}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {patient.birthDate ? new Date(patient.birthDate).toLocaleDateString('tr-TR') : "-"}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {patient.gender || "-"}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                        {patient.totalAppointments || 0}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                                        {patient.totalProcedures || 0}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(patient.createdAt).toLocaleDateString('tr-TR')}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start flex gap-2">
                                    <Link href={`/patients/${patient.id}`}>
                                        <Button size="sm" variant="outline" className="flex items-center justify-center">
                                            <Icon icon="ri:eye-line" className="text-base" />
                                        </Button>
                                    </Link>
                                    <Link href={`/patients/edit/${patient.id}`}>
                                        <Button size="sm" variant="outline" className="flex items-center justify-center">
                                            <Icon icon="ri:edit-line" className="text-base" />
                                        </Button>
                                    </Link>
                                    <Button 
                                        size="sm" 
                                        variant="danger" 
                                        className="flex items-center justify-center"
                                        onClick={() => handleDelete(patient.id)}
                                    >
                                        <Icon icon="ri:delete-bin-line" className="text-base" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                        emptyMessage="Henüz hasta bulunmamaktadır"
                    />
                </ComponentCard>
            </div>
        </div>
    );
}
