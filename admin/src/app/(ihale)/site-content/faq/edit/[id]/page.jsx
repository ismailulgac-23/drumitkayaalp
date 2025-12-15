"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import axios from "@/axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function EditFAQ() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        order: "",
        isActive: true,
    });

    useEffect(() => {
        fetchData();
    }, [params.id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/faqs/${params.id}`);
            if (response.data.success) {
                const data = response.data.data;
                setFormData({
                    question: data.question || "",
                    answer: data.answer || "",
                    order: data.order?.toString() || "0",
                    isActive: data.isActive !== undefined ? data.isActive : true,
                });
            }
        } catch (error) {
            console.error('Error fetching FAQ:', error);
            alert('Veri yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            const response = await axios.put(`/faqs/${params.id}`, {
                question: formData.question,
                answer: formData.answer,
                order: formData.order || 0,
                isActive: formData.isActive,
            });

            if (response.data.success) {
                alert("Soru başarıyla güncellendi!");
                router.push("/site-content/faq");
            } else {
                alert("Bir hata oluştu!");
            }
        } catch (error) {
            console.error('Error updating FAQ:', error);
            alert("Bir hata oluştu!");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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
            <PageBreadcrumb 
                pageTitle="Soru Düzenle"
            />
            <div className="space-y-6">
                <ComponentCard title="SSS Bilgileri">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Soru <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="question"
                                value={formData.question}
                                onChange={handleChange}
                                required
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                placeholder="Soru"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Cevap <span className="text-red-500">*</span>
                            </label>
                            <div className="ckeditor-wrapper">
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={formData.answer}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setFormData(prev => ({
                                            ...prev,
                                            answer: data
                                        }));
                                    }}
                                    config={{
                                        toolbar: [
                                            'heading', '|',
                                            'bold', 'italic', 'link', '|',
                                            'bulletedList', 'numberedList', '|',
                                            'blockQuote', 'insertTable', '|',
                                            'imageUpload', 'mediaEmbed', '|',
                                            'undo', 'redo'
                                        ],
                                        heading: {
                                            options: [
                                                { model: 'paragraph', title: 'Paragraf', class: 'ck-heading_paragraph' },
                                                { model: 'heading1', view: 'h1', title: 'Başlık 1', class: 'ck-heading_heading1' },
                                                { model: 'heading2', view: 'h2', title: 'Başlık 2', class: 'ck-heading_heading2' },
                                                { model: 'heading3', view: 'h3', title: 'Başlık 3', class: 'ck-heading_heading3' }
                                            ]
                                        }
                                    }}
                                />
                            </div>
                            <style jsx global>{`
                                .ckeditor-wrapper .ck-editor__editable {
                                    min-height: 300px;
                                }
                                .ckeditor-wrapper .ck-content {
                                    min-height: 300px;
                                }
                            `}</style>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Sıra
                            </label>
                            <input
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={handleChange}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                placeholder="1"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="rounded border-gray-300"
                            />
                            <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Aktif
                            </label>
                        </div>

                        <div className="flex gap-4 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                İptal
                            </Button>
                            <Button
                                type="submit"
                                disabled={saving}
                            >
                                {saving ? "Güncelleniyor..." : "Güncelle"}
                            </Button>
                        </div>
                    </form>
                </ComponentCard>
            </div>
        </div>
    );
}

