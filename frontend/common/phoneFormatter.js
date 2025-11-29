/**
 * Telefon numarasını +90 (XXX) XXX XXXX formatına çevirir
 * @param {string} phone - Formatlanacak telefon numarası
 * @returns {string} - Formatlanmış telefon numarası
 */
export function formatPhoneNumber(phone) {
  if (!phone) return '';
  
  // Sadece rakamları al
  const digits = phone.replace(/\D/g, '');
  
  // Eğer boşsa, orijinal değeri döndür
  if (!digits) return phone;
  
  // Türkiye telefon numarası kontrolü
  let cleanNumber = digits;
  
  // +90 ile başlıyorsa kaldır (zaten ekleyeceğiz)
  if (cleanNumber.startsWith('90') && cleanNumber.length >= 12) {
    cleanNumber = cleanNumber.substring(2);
  }
  
  // 0 ile başlıyorsa kaldır
  if (cleanNumber.startsWith('0')) {
    cleanNumber = cleanNumber.substring(1);
  }
  
  // 10 haneli olmalı (alan kodu + numara)
  if (cleanNumber.length === 10) {
    // Format: +90 (XXX) XXX XXXX
    const areaCode = cleanNumber.substring(0, 3);
    const firstPart = cleanNumber.substring(3, 6);
    const secondPart = cleanNumber.substring(6, 10);
    return `+90 (${areaCode}) ${firstPart} ${secondPart}`;
  }
  
  // Eğer format uygun değilse, orijinal değeri döndür
  return phone;
}

/**
 * Telefon numarasını tel: linki için temizler (sadece rakamlar, +90 ile başlar)
 * @param {string} phone - Temizlenecek telefon numarası
 * @returns {string} - Temizlenmiş telefon numarası (tel: linki için)
 */
export function cleanPhoneForTelLink(phone) {
  if (!phone) return '';
  
  // Sadece rakamları al
  const digits = phone.replace(/\D/g, '');
  
  if (!digits) return phone;
  
  let cleanNumber = digits;
  
  // +90 ile başlıyorsa kaldır
  if (cleanNumber.startsWith('90') && cleanNumber.length >= 12) {
    cleanNumber = cleanNumber.substring(2);
  }
  
  // 0 ile başlıyorsa kaldır
  if (cleanNumber.startsWith('0')) {
    cleanNumber = cleanNumber.substring(1);
  }
  
  // +90 ekle
  if (cleanNumber.length === 10) {
    return `+90${cleanNumber}`;
  }
  
  // Eğer format uygun değilse, orijinal değeri döndür
  return phone;
}

