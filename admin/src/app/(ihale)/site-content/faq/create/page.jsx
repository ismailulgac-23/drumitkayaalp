"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import axios from "@/axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function CreateFAQ() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        order: "",
        isActive: true,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.post('/faqs', {
                question: formData.question,
                answer: formData.answer,
                order: formData.order || 0,
                isActive: formData.isActive,
            });

            if (response.data.success) {
                alert("Soru başarıyla eklendi!");
                router.push("/site-content/faq");
            } else {
                alert("Bir hata oluştu!");
            }
        } catch (error) {
            console.error('Error creating FAQ:', error);
            alert("Bir hata oluştu!");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div>
            <PageBreadcrumb 
                pageTitle="Yeni Soru Ekle"
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
                                disabled={loading}
                            >
                                {loading ? "Kaydediliyor..." : "Kaydet"}
                            </Button>
                        </div>
                    </form>
                </ComponentCard>
            </div>
        </div>
    );
}

