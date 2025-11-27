"use client";
import React, { useState } from "react";
import Link from "next/link";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableContainer from "@/components/royal-common/Table";
import Button from "@/components/ui/button/Button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify/react/dist/iconify.js";
import ComponentCard from "@/components/common/ComponentCard";

export default function FAQ() {
    const [faqs, setFaqs] = useState([
        {
            id: "1",
            question: "Randevu nasıl alabilirim?",
            answer: "Randevu almak için web sitemizden online randevu formunu doldurabilir veya telefon ile iletişime geçebilirsiniz.",
            order: 1,
            isActive: true,
        },
        {
            id: "2",
            question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
            answer: "Nakit, kredi kartı ve banka kartı ile ödeme yapabilirsiniz.",
            order: 2,
            isActive: true,
        },
        {
            id: "3",
            question: "Sigorta kapsamında mı?",
            answer: "Evet, birçok sigorta şirketi ile anlaşmamız bulunmaktadır.",
            order: 3,
            isActive: true,
        },
    ]);
    const [filters, setFilters] = useState({
        search: '',
    });

    const handleDelete = async (id) => {
        if (!window.confirm('Bu soruyu silmek istediğinize emin misiniz?')) {
            return;
        }
        setFaqs(prev => prev.filter(faq => faq.id !== id));
    };

    const toggleActive = (id, currentStatus) => {
        setFaqs(prev => 
            prev.map(faq => 
                faq.id === id ? { ...faq, isActive: !currentStatus } : faq
            )
        );
    };

    const filteredFaqs = faqs.filter(faq => {
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
                faq.question.toLowerCase().includes(searchLower) ||
                faq.answer.toLowerCase().includes(searchLower)
            );
        }
        return true;
    });

    return (
        <div>
            <PageBreadcrumb pageTitle="Sıkça Sorulan Sorular" />
            <div className="space-y-6">
                <ComponentCard 
                    title="SSS Yönetimi"
                    titleRightRenderer={
                        <Link href="/site-content/faq/create">
                            <Button className="bg-primary text-white px-4 py-2">
                                <Icon icon="ri:add-line" className="mr-2" />
                                Yeni Soru Ekle
                            </Button>
                        </Link>
                    }
                >
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Soru veya cevap ile ara..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                        />
                    </div>
                    <TableContainer
                        data={filteredFaqs}
                        navItems={["Sıra", "Soru", "Cevap", "Durum", "İşlemler"]}
                        renderItem={(faq) => (
                            <TableRow key={faq.id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {faq.order}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start font-medium">
                                    {faq.question}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="max-w-md truncate" title={faq.answer}>
                                        {faq.answer}
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {faq.isActive ? (
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
                                    <Link href={`/site-content/faq/edit/${faq.id}`}>
                                        <Button size="sm" variant="outline" className="flex items-center justify-center">
                                            <Icon icon="ri:edit-line" className="text-base" />
                                        </Button>
                                    </Link>
                                    <Button 
                                        size="sm" 
                                        variant="outline"
                                        className="flex items-center justify-center"
                                        onClick={() => toggleActive(faq.id, faq.isActive)}
                                    >
                                        <Icon 
                                            icon={faq.isActive ? "ri:eye-off-line" : "ri:eye-line"} 
                                            className="text-base" 
                                        />
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="danger" 
                                        className="flex items-center justify-center"
                                        onClick={() => handleDelete(faq.id)}
                                    >
                                        <Icon icon="ri:delete-bin-line" className="text-base" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                        emptyMessage="Henüz soru bulunmamaktadır"
                    />
                </ComponentCard>
            </div>
        </div>
    );
}

