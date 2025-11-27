"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { Icon } from "@iconify/react";

export default function PatientInfoPage() {
    const [patients, setPatients] = useState([
        {
            id: "1",
            name: "Ahmet Yılmaz",
            phone: "0532 123 45 67",
            email: "ahmet@example.com",
            birthDate: "1985-05-15",
            gender: "Erkek",
            createdAt: "2024-01-15",
            totalAppointments: 5,
            totalProcedures: 3,
        },
        {
            id: "2",
            name: "Ayşe Demir",
            phone: "0533 234 56 78",
            email: "ayse@example.com",
            birthDate: "1990-08-22",
            gender: "Kadın",
            createdAt: "2024-02-10",
            totalAppointments: 8,
            totalProcedures: 6,
        },
        {
            id: "3",
            name: "Mehmet Kaya",
            phone: "0534 345 67 89",
            email: "mehmet@example.com",
            birthDate: "1978-12-03",
            gender: "Erkek",
            createdAt: "2024-01-20",
            totalAppointments: 3,
            totalProcedures: 2,
        },
        {
            id: "4",
            name: "Fatma Şahin",
            phone: "0535 456 78 90",
            email: "fatma@example.com",
            birthDate: "1992-03-18",
            gender: "Kadın",
            createdAt: "2024-03-05",
            totalAppointments: 2,
            totalProcedures: 1,
        },
        {
            id: "5",
            name: "Ali Öztürk",
            phone: "0536 567 89 01",
            email: "ali@example.com",
            birthDate: "1988-07-25",
            gender: "Erkek",
            createdAt: "2024-02-20",
            totalAppointments: 4,
            totalProcedures: 3,
        },
    ]);

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [messageType, setMessageType] = useState("custom");
    const [messageData, setMessageData] = useState({
        subject: "",
        greeting: "Sayın",
        content: "",
        closing: "Saygılarımızla,\nKlinik Yönetimi",
    });

    const messageTemplates = {
        welcome: {
            subject: "Hoş Geldiniz - Klinik Sistemimize Kayıt",
            greeting: "Sayın",
            content: `Klinik sistemimize kayıt olduğunuz için teşekkür ederiz. Size en iyi hizmeti sunabilmek için aşağıdaki bilgileri dikkatlice okuyunuz.

Hesabınız ile randevu alabilir, geçmiş randevularınızı görüntüleyebilir ve tedavi sürecinizi takip edebilirsiniz.

Randevu almak için sistem üzerinden uygun tarih ve saati seçebilirsiniz. Randevu saatinden 15 dakika önce kliniğimizde bulunmanız önemlidir.

Randevu Öncesi Hazırlık:
• Randevu saatinden 15 dakika önce kliniğimizde bulunun
• Kimlik belgenizi yanınızda getirin
• Varsa önceki tedavi raporlarınızı getirin
• Aç karnına gelmeniz gerekiyorsa doktorunuz size bildirecektir
• Kullandığınız ilaçların listesini yanınızda bulundurun

Randevu Sonrası Bakım:
• Doktorunuzun verdiği talimatları dikkatlice uygulayın
• İlaç kullanımı varsa zamanında ve doğru şekilde alın
• Kontrol randevularınızı aksatmayın
• Herhangi bir sorun yaşarsanız derhal kliniğimizle iletişime geçin

Önemli Notlar: Acil durumlarda 7/24 hizmet veren acil servisimizden yararlanabilirsiniz. Randevu iptal etmeniz gerekiyorsa en az 24 saat önceden bilgi veriniz.

Sorularınız için bizimle iletişime geçebilirsiniz. İletişim bilgilerimiz web sitemizde mevcuttur.

Kişisel bilgileriniz gizlilik politikamız çerçevesinde korunmaktadır. Verileriniz sadece tedavi süreciniz için kullanılmaktadır.`,
            closing: "Saygılarımızla,\nKlinik Yönetimi"
        },
        appointmentReminder: {
            subject: "Randevu Hatırlatması",
            greeting: "Sayın",
            content: `Yaklaşan randevunuz hakkında bilgilendirme yapmak istiyoruz.

Randevu Detayları:
• Tarih: [Randevu Tarihi]
• Saat: [Randevu Saati]
• Doktor: [Doktor Adı]
• Hizmet: [Hizmet Türü]

Lütfen randevu saatinden 15 dakika önce kliniğimizde bulununuz.

Randevu öncesi hazırlık:
• Kimlik belgenizi yanınızda getirin
• Varsa önceki tedavi raporlarınızı getirin
• Kullandığınız ilaçların listesini yanınızda bulundurun

Randevu iptal etmeniz gerekiyorsa en az 24 saat önceden bilgi veriniz.`,
            closing: "Saygılarımızla,\nKlinik Yönetimi"
        },
        postTreatment: {
            subject: "Tedavi Sonrası Bilgilendirme",
            greeting: "Sayın",
            content: `Tedaviniz tamamlanmıştır. Aşağıdaki bilgileri dikkatlice okuyunuz.

Tedavi Sonrası Bakım Talimatları:
• Doktorunuzun verdiği talimatları dikkatlice uygulayın
• İlaç kullanımı varsa zamanında ve doğru şekilde alın
• Kontrol randevularınızı aksatmayın
• Herhangi bir sorun yaşarsanız derhal kliniğimizle iletişime geçin

Önemli Uyarılar:
• Ağrı, şişlik veya kanama gibi durumlarda derhal kliniğimizle iletişime geçin
• İlaç kullanımında doktorunuzun talimatlarına uyun
• Kontrol randevularınızı aksatmayın

Sorularınız için bizimle iletişime geçebilirsiniz.`,
            closing: "Saygılarımızla,\nKlinik Yönetimi"
        },
        general: {
            subject: "Genel Bilgilendirme",
            greeting: "Sayın",
            content: `Size önemli bilgiler iletmek istiyoruz.

[Buraya genel bilgilendirme mesajınızı yazabilirsiniz]

Sorularınız için bizimle iletişime geçebilirsiniz. İletişim bilgilerimiz web sitemizde mevcuttur.`,
            closing: "Saygılarımızla,\nKlinik Yönetimi"
        }
    };

    const filteredPatients = patients.filter(patient => {
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            return (
                patient.name.toLowerCase().includes(searchLower) ||
                patient.phone.includes(searchTerm) ||
                patient.email.toLowerCase().includes(searchLower)
            );
        }
        return true;
    });

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setMessageData({
            subject: "",
            greeting: "Sayın",
            content: "",
            closing: "Saygılarımızla,\nKlinik Yönetimi",
        });
        setMessageType("custom");
    };

    const handleTemplateSelect = (templateKey) => {
        setMessageType(templateKey);
        if (messageTemplates[templateKey]) {
            setMessageData({ ...messageTemplates[templateKey] });
        }
    };

    const handleSendMessage = async () => {
        if (!selectedPatient) {
            alert("Lütfen bir hasta seçiniz!");
            return;
        }

        if (!messageData.subject || !messageData.content) {
            alert("Lütfen konu ve mesaj içeriğini doldurunuz!");
            return;
        }

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            const fullMessage = `${messageData.greeting} ${selectedPatient.name},\n\n${messageData.content}\n\n${messageData.closing}`;
            alert(`Mesaj başarıyla gönderildi!\n\nAlıcı: ${selectedPatient.name} (${selectedPatient.phone})\nKonu: ${messageData.subject}\n\nMesaj:\n${fullMessage}`);
        }, 1000);
    };

    const handleInputChange = (field, value) => {
        setMessageData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Hasta Bilgilendirme" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hasta Listesi */}
                <ComponentCard title="Hasta Listesi" className="flex flex-col h-full">
                    <div className="flex flex-col flex-1 space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Hasta adı, telefon veya email ile ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {filteredPatients.length > 0 ? (
                                <div className="grid grid-cols-3 gap-4">
                                    {filteredPatients.map((patient) => (
                                        <div
                                            key={patient.id}
                                            onClick={() => handlePatientSelect(patient)}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                selectedPatient?.id === patient.id
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                                                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Icon 
                                                            icon="ri:user-line" 
                                                            className="text-xl text-gray-500 dark:text-gray-400"
                                                        />
                                                        <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                                                            {patient.name}
                                                        </h3>
                                                        {selectedPatient?.id === patient.id && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                                                <Icon icon="ri:check-line" className="text-base" />
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                                        <div className="flex items-center gap-2">
                                                            <Icon icon="ri:phone-line" className="text-base" />
                                                            <span>{patient.phone}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Icon icon="ri:mail-line" className="text-base" />
                                                            <span>{patient.email || "Email yok"}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Icon icon="ri:calendar-line" className="text-base" />
                                                            <span>{new Date(patient.birthDate).toLocaleDateString('tr-TR')}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                                                {patient.totalAppointments} Randevu
                                                            </span>
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                                                                {patient.totalProcedures} İşlem
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 py-12">
                                    <Icon icon="ri:user-search-line" className="text-4xl mb-2" />
                                    <p>Hasta bulunamadı</p>
                                </div>
                            )}
                        </div>
                    </div>
                </ComponentCard>

                {/* Mesaj Gönderme Formu */}
                <ComponentCard title={selectedPatient ? `${selectedPatient.name} - Bilgilendirme Mesajı` : "Hasta Seçiniz"} className="flex flex-col h-full">
                    {selectedPatient ? (
                        <div className="flex flex-col flex-1 space-y-6">
                            {/* Seçilen Hasta Bilgileri */}
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">Seçilen Hasta:</h3>
                                <p className="text-sm"><strong>Ad:</strong> {selectedPatient.name}</p>
                                <p className="text-sm"><strong>Telefon:</strong> {selectedPatient.phone}</p>
                                <p className="text-sm"><strong>Email:</strong> {selectedPatient.email || "-"}</p>
                            </div>

                            {/* Mesaj Şablonları */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Mesaj Şablonu
                                </label>
                                <select
                                    value={messageType}
                                    onChange={(e) => handleTemplateSelect(e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                >
                                    <option value="custom">Özel Mesaj</option>
                                    <option value="welcome">Hoş Geldiniz Mesajı</option>
                                    <option value="appointmentReminder">Randevu Hatırlatması</option>
                                    <option value="postTreatment">Tedavi Sonrası Bilgilendirme</option>
                                    <option value="general">Genel Bilgilendirme</option>
                                </select>
                            </div>

                            {/* Mesaj Formu */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Konu <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={messageData.subject}
                                    onChange={(e) => handleInputChange('subject', e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    placeholder="Mesaj konusu"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Hitap
                                </label>
                                <input
                                    type="text"
                                    value={messageData.greeting}
                                    onChange={(e) => handleInputChange('greeting', e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    placeholder="Sayın"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Mesaj İçeriği <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={messageData.content}
                                    onChange={(e) => handleInputChange('content', e.target.value)}
                                    rows={12}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    placeholder="Detaylı bilgilendirme mesajınızı buraya yazın..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Kapanış
                                </label>
                                <textarea
                                    value={messageData.closing}
                                    onChange={(e) => handleInputChange('closing', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    placeholder="Saygılarımızla, Klinik Yönetimi"
                                />
                            </div>

                            {/* Mesaj Önizleme */}
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">Mesaj Önizleme:</h3>
                                <div className="text-sm whitespace-pre-wrap border border-gray-200 dark:border-gray-700 p-3 rounded bg-white dark:bg-gray-900">
                                    <strong>Konu:</strong> {messageData.subject || "(Konu belirtilmemiş)"}
                                    <br /><br />
                                    {messageData.greeting} {selectedPatient.name},
                                    <br /><br />
                                    {messageData.content || "(İçerik belirtilmemiş)"}
                                    <br /><br />
                                    {messageData.closing}
                                </div>
                            </div>

                            <div className="flex gap-4 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedPatient(null);
                                        setMessageData({
                                            subject: "",
                                            greeting: "Sayın",
                                            content: "",
                                            closing: "Saygılarımızla,\nKlinik Yönetimi",
                                        });
                                    }}
                                >
                                    Temizle
                                </Button>
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={loading || !messageData.subject || !messageData.content}
                                >
                                    {loading ? (
                                        <>
                                            <Icon icon="eos-icons:loading" className="mr-2" />
                                            Gönderiliyor...
                                        </>
                                    ) : (
                                        <>
                                            <Icon icon="ri:send-plane-fill" className="mr-2" />
                                            Mesajı Gönder
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center flex-1 text-gray-500 dark:text-gray-400">
                            <Icon icon="ri:user-search-line" className="text-5xl mb-4" />
                            <p>Lütfen sol taraftan bir hasta seçiniz</p>
                        </div>
                    )}
                </ComponentCard>
            </div>
        </div>
    );
}
