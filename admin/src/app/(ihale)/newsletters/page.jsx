"use client";
import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { Icon } from "@iconify/react";
import axios from "@/axios";

export default function NewslettersPage() {
    const [newsletters, setNewsletters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterActive, setFilterActive] = useState("all");

    useEffect(() => {
        fetchNewsletters();
    }, []);

    const fetchNewsletters = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (filterActive !== 'all') params.append('isActive', filterActive === 'active' ? 'true' : 'false');

            const response = await axios.get(`/newsletters?${params.toString()}`);
            if (response.data.success) {
                setNewsletters(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching newsletters:', error);
            alert('Bültenler yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchNewsletters();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, filterActive]);

    const handleToggle = async (id) => {
        try {
            const response = await axios.patch(`/newsletters/${id}/toggle`);
            if (response.data.success) {
                fetchNewsletters();
            }
        } catch (error) {
            console.error('Error toggling newsletter:', error);
            alert('Durum değiştirilirken bir hata oluştu');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bu bülten kaydını silmek istediğinize emin misiniz?')) {
            return;
        }

        try {
            const response = await axios.delete(`/newsletters/${id}`);
            if (response.data.success) {
                fetchNewsletters();
            }
        } catch (error) {
            console.error('Error deleting newsletter:', error);
            alert('Bülten kaydı silinirken bir hata oluştu');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <h1 className="text-2xl font-bold">Yükleniyor...</h1>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageBreadcrumb pageTitle="Mail Bülteni" />
            <ComponentCard title="Bülten Aboneleri">
                <div className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Email veya isim ile ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                            />
                        </div>
                        <select
                            value={filterActive}
                            onChange={(e) => setFilterActive(e.target.value)}
                            className="rounded-md border border-input bg-background px-3 py-2"
                        >
                            <option value="all">Tümü</option>
                            <option value="active">Aktif</option>
                            <option value="inactive">Pasif</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Email</th>
                                    <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">İsim</th>
                                    <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Durum</th>
                                    <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Abone Tarihi</th>
                                    <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newsletters.length > 0 ? (
                                    newsletters.map((newsletter) => (
                                        <tr key={newsletter.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <td className="p-3">{newsletter.email}</td>
                                            <td className="p-3">{newsletter.name || "-"}</td>
                                            <td className="p-3">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    newsletter.isActive 
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                }`}>
                                                    {newsletter.isActive ? 'Aktif' : 'Pasif'}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                {new Date(newsletter.subscribedAt).toLocaleDateString('tr-TR')}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleToggle(newsletter.id)}
                                                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                                        title={newsletter.isActive ? 'Pasif Et' : 'Aktif Et'}
                                                    >
                                                        <Icon 
                                                            icon={newsletter.isActive ? "ri:eye-off-line" : "ri:eye-line"} 
                                                            className="text-xl"
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(newsletter.id)}
                                                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                                        title="Sil"
                                                    >
                                                        <Icon icon="ri:delete-bin-line" className="text-xl" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400">
                                            <Icon icon="ri:inbox-line" className="text-4xl mx-auto mb-2" />
                                            <p>Bülten kaydı bulunamadı</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </ComponentCard>
        </div>
    );
}

