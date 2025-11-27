"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { Icon } from "@iconify/react";
import TableContainer from "@/components/royal-common/Table";
import { TableCell, TableRow } from "@/components/ui/table";

export default function PatientDetail() {
    const params = useParams();
    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [procedures, setProcedures] = useState([]);

    useEffect(() => {
        // Simulate fetching patient data
        setPatient({
            id: params.id,
            name: "Ahmet Yılmaz",
            phone: "0532 123 45 67",
            email: "ahmet@example.com",
            birthDate: "1985-05-15",
            gender: "Erkek",
            address: "İstanbul, Kadıköy",
            notes: "Düzenli hasta",
            createdAt: "2024-01-15",
        });

        setAppointments([
            {
                id: "1",
                date: "2024-03-15",
                time: "10:00",
                doctor: "Dr. Mehmet Öz",
                service: "Kontrol",
                status: "Tamamlandı",
            },
            {
                id: "2",
                date: "2024-03-20",
                time: "14:30",
                doctor: "Dr. Ayşe Demir",
                service: "Tedavi",
                status: "Bekliyor",
            },
            {
                id: "3",
                date: "2024-03-25",
                time: "11:00",
                doctor: "Dr. Mehmet Öz",
                service: "Kontrol",
                status: "Planlandı",
            },
        ]);

        setProcedures([
            {
                id: "1",
                name: "Diş Temizliği",
                date: "2024-01-20",
                doctor: "Dr. Mehmet Öz",
                price: 500,
                status: "Tamamlandı",
            },
            {
                id: "2",
                name: "Dolgu",
                date: "2024-02-10",
                doctor: "Dr. Ayşe Demir",
                price: 800,
                status: "Tamamlandı",
            },
            {
                id: "3",
                name: "Kanal Tedavisi",
                date: "2024-03-05",
                doctor: "Dr. Mehmet Öz",
                price: 1500,
                status: "Tamamlandı",
            },
        ]);
    }, [params.id]);

    if (!patient) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Hasta Detayı" />
                <div className="flex justify-center items-center h-64">
                    <p>Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageBreadcrumb 
                pageTitle={`Hasta Detayı - ${patient.name}`}
                titleRightRenderer={
                    <Link href={`/patients/edit/${patient.id}`}>
                        <Button variant="outline">
                            <Icon icon="ri:edit-line" className="mr-2" />
                            Düzenle
                        </Button>
                    </Link>
                }
            />
            <div className="space-y-6">
                {/* Patient Info */}
                <ComponentCard title="Hasta Bilgileri">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Ad Soyad
                            </label>
                            <p className="text-base font-semibold text-gray-800 dark:text-white">{patient.name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Telefon
                            </label>
                            <p className="text-base text-gray-800 dark:text-white">{patient.phone}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Email
                            </label>
                            <p className="text-base text-gray-800 dark:text-white">{patient.email || "-"}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Doğum Tarihi
                            </label>
                            <p className="text-base text-gray-800 dark:text-white">
                                {new Date(patient.birthDate).toLocaleDateString('tr-TR')}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Cinsiyet
                            </label>
                            <p className="text-base text-gray-800 dark:text-white">{patient.gender}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Kayıt Tarihi
                            </label>
                            <p className="text-base text-gray-800 dark:text-white">
                                {new Date(patient.createdAt).toLocaleDateString('tr-TR')}
                            </p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Adres
                            </label>
                            <p className="text-base text-gray-800 dark:text-white">{patient.address || "-"}</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Notlar
                            </label>
                            <p className="text-base text-gray-800 dark:text-white">{patient.notes || "-"}</p>
                        </div>
                    </div>
                </ComponentCard>

                {/* Appointments */}
                <ComponentCard title="Randevular">
                    <TableContainer
                        data={appointments}
                        navItems={["Tarih", "Saat", "Doktor", "Hizmet", "Durum"]}
                        renderItem={(appointment) => (
                            <TableRow key={appointment.id}>
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
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                            {appointment.status}
                                        </span>
                                    )}
                                </TableCell>
                            </TableRow>
                        )}
                        emptyMessage="Henüz randevu bulunmamaktadır"
                    />
                </ComponentCard>

                {/* Procedures */}
                <ComponentCard title="Yaptırdığı İşlemler">
                    <TableContainer
                        data={procedures}
                        navItems={["İşlem Adı", "Tarih", "Doktor", "Fiyat", "Durum"]}
                        renderItem={(procedure) => (
                            <TableRow key={procedure.id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start font-medium">
                                    {procedure.name}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {new Date(procedure.date).toLocaleDateString('tr-TR')}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {procedure.doctor}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start font-semibold">
                                    ₺{procedure.price.toLocaleString('tr-TR')}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                        {procedure.status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        )}
                        emptyMessage="Henüz işlem bulunmamaktadır"
                    />
                </ComponentCard>
            </div>
        </div>
    );
}

