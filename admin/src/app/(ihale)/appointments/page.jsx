"use client";
import React, { useState } from "react";
import Link from "next/link";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableContainer from "@/components/royal-common/Table";
import Button from "@/components/ui/button/Button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify/react/dist/iconify.js";
import ComponentCard from "@/components/common/ComponentCard";

export default function Appointments() {
    const [appointments, setAppointments] = useState([
        {
            id: "1",
            patientName: "Ahmet Yılmaz",
            patientPhone: "0532 123 45 67",
            date: "2024-03-15",
            time: "10:00",
            doctor: "Dr. Mehmet Öz",
            service: "Kontrol",
            status: "Tamamlandı",
            notes: "Düzenli kontrol",
        },
        {
            id: "2",
            patientName: "Ayşe Demir",
            patientPhone: "0533 234 56 78",
            date: "2024-03-20",
            time: "14:30",
            doctor: "Dr. Ayşe Demir",
            service: "Tedavi",
            status: "Bekliyor",
            notes: "Acil",
        },
        {
            id: "3",
            patientName: "Mehmet Kaya",
            patientPhone: "0534 345 67 89",
            date: "2024-03-25",
            time: "11:00",
            doctor: "Dr. Mehmet Öz",
            service: "Kontrol",
            status: "Planlandı",
            notes: "",
        },
    ]);
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
    });

    const handleDelete = async (id) => {
        if (!window.confirm('Bu randevuyu silmek istediğinize emin misiniz?')) {
            return;
        }
        setAppointments(prev => prev.filter(appointment => appointment.id !== id));
    };

    const filteredAppointments = appointments.filter(appointment => {
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
                appointment.patientName.toLowerCase().includes(searchLower) ||
                appointment.patientPhone.includes(searchLower) ||
                appointment.doctor.toLowerCase().includes(searchLower)
            );
        }
        if (filters.status !== 'all') {
            return appointment.status === filters.status;
        }
        return true;
    });

    return (
        <div>
            <PageBreadcrumb pageTitle="Randevu Yönetimi" />
            <div className="space-y-6">
                <ComponentCard 
                    title="Randevular"
                    titleRightRenderer={
                        <Link href="/appointments/create">
                            <Button className="bg-primary text-white px-4 py-2">
                                <Icon icon="ri:add-line" className="mr-2" />
                                Yeni Randevu Ekle
                            </Button>
                        </Link>
                    }
                >
                    <div className="mb-4 flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Hasta adı, telefon veya doktor ile ara..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                        />
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="rounded-md border border-input bg-background px-3 py-2"
                        >
                            <option value="all">Tüm Durumlar</option>
                            <option value="Planlandı">Planlandı</option>
                            <option value="Bekliyor">Bekliyor</option>
                            <option value="Tamamlandı">Tamamlandı</option>
                            <option value="İptal">İptal</option>
                        </select>
                    </div>
                    <TableContainer
                        data={filteredAppointments}
                        navItems={["Hasta", "Telefon", "Tarih", "Saat", "Doktor", "Hizmet", "Durum", "İşlemler"]}
                        renderItem={(appointment) => (
                            <TableRow key={appointment.id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start font-medium">
                                    {appointment.patientName}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {appointment.patientPhone}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {new Date(appointment.date).toLocaleDateString('tr-TR')}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {appointment.time}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {appointment.doctor}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {appointment.service}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {appointment.status === "Tamamlandı" ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                            {appointment.status}
                                        </span>
                                    ) : appointment.status === "Bekliyor" ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                                            {appointment.status}
                                        </span>
                                    ) : appointment.status === "İptal" ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                            {appointment.status}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                            {appointment.status}
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start flex gap-2">
                                    <Link href={`/appointments/edit/${appointment.id}`}>
                                        <Button size="sm" variant="outline" className="flex items-center justify-center">
                                            <Icon icon="ri:edit-line" className="text-base" />
                                        </Button>
                                    </Link>
                                    <Button 
                                        size="sm" 
                                        variant="danger" 
                                        className="flex items-center justify-center"
                                        onClick={() => handleDelete(appointment.id)}
                                    >
                                        <Icon icon="ri:delete-bin-line" className="text-base" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                        emptyMessage="Henüz randevu bulunmamaktadır"
                    />
                </ComponentCard>
            </div>
        </div>
    );
}

