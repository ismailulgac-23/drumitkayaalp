import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');
  console.log('🧹 Cleaning database...');

  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'image');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Delete all data in correct order (respecting foreign key constraints)
  await prisma.appointment.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.beforeAfter.deleteMany({});
  await prisma.fAQ.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.patient.deleteMany({});
  await prisma.doctor.deleteMany({});
  await prisma.newsletter.deleteMany({});
  await prisma.contactChannel.deleteMany({});
  await prisma.userCategory.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.city.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.homeIntro.deleteMany({});
  await prisma.marqueeItem.deleteMany({});
  await prisma.homeAbout.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.marquee2Item.deleteMany({});
  await prisma.aboutPageIntro.deleteMany({});
  await prisma.contactMap.deleteMany({});

  console.log('✅ Database cleaned successfully!');
  console.log('');

  // Create Admin User
  console.log('👤 Creating admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@klinik.com' },
    update: {
      password: hashedPassword,
      isAdmin: true,
      isActive: true,
    },
    create: {
      email: 'admin@klinik.com',
      password: hashedPassword,
      name: 'Admin Kullanıcı',
      phoneNumber: '+905551234567',
      userType: 'PROVIDER',
      isAdmin: true,
      isActive: true,
    },
  });
  console.log(`  ✅ Created admin: ${admin.email} (Password: admin123)`);

  // Create Doctors
  console.log('👨‍⚕️ Creating doctors...');
  const doctor1 = await prisma.doctor.upsert({
    where: { email: 'ahmet.yilmaz@klinik.com' },
    update: {},
    create: {
      name: 'Dr. Ahmet Yılmaz',
      email: 'ahmet.yilmaz@klinik.com',
      phone: '0532 123 45 67',
      specialty: 'Genel Cerrahi',
      bio: '15 yıllık deneyimli genel cerrah',
      isActive: true,
    },
  });
  console.log(`  ✅ Created doctor: ${doctor1.name}`);

  const doctor2 = await prisma.doctor.upsert({
    where: { email: 'ayse.demir@klinik.com' },
    update: {},
    create: {
      name: 'Dr. Ayşe Demir',
      email: 'ayse.demir@klinik.com',
      phone: '0533 234 56 78',
      specialty: 'Dahiliye',
      bio: 'Uzman dahiliye doktoru',
      isActive: true,
    },
  });
  console.log(`  ✅ Created doctor: ${doctor2.name}`);

  const doctor3 = await prisma.doctor.upsert({
    where: { email: 'mehmet.kaya@klinik.com' },
      update: {},
      create: {
      name: 'Dr. Mehmet Kaya',
      email: 'mehmet.kaya@klinik.com',
      phone: '0534 345 67 89',
      specialty: 'Kardiyoloji',
      bio: 'Kardiyoloji uzmanı',
      isActive: true,
      },
    });
  console.log(`  ✅ Created doctor: ${doctor3.name}`);

  const doctor4 = await prisma.doctor.upsert({
    where: { email: 'zeynep.oz@klinik.com' },
    update: {},
    create: {
      name: 'Dr. Zeynep Öz',
      email: 'zeynep.oz@klinik.com',
      phone: '0535 456 78 90',
      specialty: 'Pediatri',
      bio: 'Çocuk sağlığı uzmanı',
      isActive: true,
    },
  });
  console.log(`  ✅ Created doctor: ${doctor4.name}`);

  // Create Services
  console.log('🏥 Creating services...');
  // Copy service images to uploads directory
  const serviceImages = ['3.png', '4.png', '5.png'];
  const serviceImageUrls: string[] = [];
  
  for (const img of serviceImages) {
    const sourcePath = path.join(process.cwd(), 'public', 'assets', 'imgs', 'serv-icons', img);
    const destPath = path.join(uploadsDir, `service-${Date.now()}-${img}`);
    
    if (fs.existsSync(sourcePath)) {
      try {
        fs.copyFileSync(sourcePath, destPath);
        serviceImageUrls.push(`/uploads/image/${path.basename(destPath)}`);
        console.log(`  ✅ Copied service image: ${img}`);
      } catch (error) {
        console.log(`  ⚠️ Could not copy ${img}, using placeholder`);
        serviceImageUrls.push('/assets/imgs/serv-icons/default.png');
      }
    } else {
      serviceImageUrls.push('/assets/imgs/serv-icons/default.png');
    }
  }

  const service1 = await prisma.service.upsert({
    where: { id: 'service-1' },
      update: { image: serviceImageUrls[0] || '/assets/imgs/serv-icons/default.png' },
      create: {
      title: 'Genel Muayene',
      description: 'Kapsamlı genel sağlık kontrolü ve muayene hizmetleri. Uzman doktorlarımız tarafından detaylı değerlendirme.',
      price: 500,
      duration: '30 dakika',
      image: serviceImageUrls[0] || '/assets/imgs/serv-icons/default.png',
      order: 1,
      isActive: true,
      },
    });
  console.log(`  ✅ Created service: ${service1.title}`);

  const service2 = await prisma.service.upsert({
    where: { id: 'service-2' },
    update: { image: serviceImageUrls[1] || '/assets/imgs/serv-icons/default.png' },
    create: {
      title: 'Özel Tedaviler',
      description: 'Özel tedavi programları ve kişiselleştirilmiş bakım hizmetleri. Modern tıbbi yöntemlerle en iyi sonuçlar.',
      price: 1500,
      duration: '60 dakika',
      image: serviceImageUrls[1] || '/assets/imgs/serv-icons/default.png',
      order: 2,
      isActive: true,
    },
  });
  console.log(`  ✅ Created service: ${service2.title}`);

  const service3 = await prisma.service.upsert({
    where: { id: 'service-3' },
      update: { image: serviceImageUrls[2] || '/assets/imgs/serv-icons/default.png' },
      create: {
      title: 'Konsültasyon',
      description: 'Uzman doktor konsültasyonları ve ikinci görüş hizmetleri. Sağlık sorularınız için profesyonel danışmanlık.',
      price: 800,
      duration: '45 dakika',
      image: serviceImageUrls[2] || '/assets/imgs/serv-icons/default.png',
      order: 3,
      isActive: true,
      },
    });
  console.log(`  ✅ Created service: ${service3.title}`);

  const service4 = await prisma.service.upsert({
    where: { id: 'service-4' },
      update: {},
      create: {
      title: 'Kontrol Muayenesi',
      description: 'Takip kontrol muayenesi',
      price: 300,
      duration: '20 dakika',
      order: 4,
      isActive: true,
      },
    });
  console.log(`  ✅ Created service: ${service4.title}`);

  const service5 = await prisma.service.upsert({
    where: { id: 'service-5' },
    update: {},
    create: {
      title: 'Acil Hizmet',
      description: 'Acil müdahale hizmeti',
      price: 2000,
      duration: '90 dakika',
      order: 5,
      isActive: true,
    },
  });
  console.log(`  ✅ Created service: ${service5.title}`);

  const service6 = await prisma.service.upsert({
    where: { id: 'service-6' },
    update: {},
    create: {
      title: 'Sağlık Taraması',
      description: 'Kapsamlı sağlık taraması',
      price: 2500,
      duration: '120 dakika',
      order: 6,
      isActive: true,
    },
  });
  console.log(`  ✅ Created service: ${service6.title}`);

  // Create Patients
  console.log('👥 Creating patients...');
  const patient1 = await prisma.patient.create({
    data: {
      name: 'Ahmet Yılmaz',
      phone: '0532 123 45 67',
      email: 'ahmet@example.com',
      birthDate: new Date('1985-05-15'),
      gender: 'Erkek',
      address: 'Kadıköy, İstanbul',
    },
  });
  console.log(`  ✅ Created patient: ${patient1.name}`);

  const patient2 = await prisma.patient.create({
    data: {
      name: 'Ayşe Demir',
      phone: '0533 234 56 78',
      email: 'ayse@example.com',
      birthDate: new Date('1990-08-22'),
      gender: 'Kadın',
      address: 'Üsküdar, İstanbul',
    },
  });
  console.log(`  ✅ Created patient: ${patient2.name}`);

  const patient3 = await prisma.patient.create({
    data: {
      name: 'Mehmet Kaya',
      phone: '0534 345 67 89',
      email: 'mehmet@example.com',
      birthDate: new Date('1978-12-03'),
      gender: 'Erkek',
      address: 'Beşiktaş, İstanbul',
    },
  });
  console.log(`  ✅ Created patient: ${patient3.name}`);

  // Create more patients
  const patient4 = await prisma.patient.create({
    data: {
      name: 'Fatma Şahin',
      phone: '0535 456 78 90',
      email: 'fatma@example.com',
      birthDate: new Date('1992-03-18'),
      gender: 'Kadın',
      address: 'Beyoğlu, İstanbul',
    },
  });
  console.log(`  ✅ Created patient: ${patient4.name}`);

  const patient5 = await prisma.patient.create({
    data: {
      name: 'Ali Öztürk',
      phone: '0536 567 89 01',
      email: 'ali@example.com',
      birthDate: new Date('1988-07-25'),
      gender: 'Erkek',
      address: 'Şişli, İstanbul',
    },
  });
  console.log(`  ✅ Created patient: ${patient5.name}`);

  // Create Appointments
  console.log('📅 Creating appointments...');
  const appointment1 = await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor1.id,
      serviceId: service1.id,
      name: patient1.name,
      phone: patient1.phone,
      email: patient1.email,
      date: new Date('2024-03-15'),
      time: '10:00',
      serviceName: service1.title,
      doctorName: doctor1.name,
      notes: 'Düzenli kontrol',
      status: 'Tamamlandı',
    },
  });
  console.log(`  ✅ Created appointment: ${appointment1.id}`);

  const appointment2 = await prisma.appointment.create({
    data: {
      patientId: patient2.id,
      doctorId: doctor2.id,
      serviceId: service2.id,
      name: patient2.name,
      phone: patient2.phone,
      email: patient2.email,
      date: new Date('2024-03-20'),
      time: '14:30',
      serviceName: service2.title,
      doctorName: doctor2.name,
      notes: 'Acil',
      status: 'Bekliyor',
    },
  });
  console.log(`  ✅ Created appointment: ${appointment2.id}`);

  const appointment3 = await prisma.appointment.create({
    data: {
      patientId: patient3.id,
      doctorId: doctor3.id,
      serviceId: service3.id,
      name: patient3.name,
      phone: patient3.phone,
      email: patient3.email,
      date: new Date('2024-03-25'),
      time: '11:00',
      serviceName: service3.title,
      doctorName: doctor3.name,
      status: 'Planlandı',
    },
  });
  console.log(`  ✅ Created appointment: ${appointment3.id}`);

  const appointment4 = await prisma.appointment.create({
    data: {
      patientId: patient4.id,
      doctorId: doctor4.id,
      serviceId: service4.id,
      name: patient4.name,
      phone: patient4.phone,
      email: patient4.email,
      date: new Date('2024-03-18'),
      time: '15:00',
      serviceName: service4.title,
      doctorName: doctor4.name,
      status: 'Tamamlandı',
    },
  });
  console.log(`  ✅ Created appointment: ${appointment4.id}`);

  const appointment5 = await prisma.appointment.create({
    data: {
      patientId: patient5.id,
      doctorId: doctor1.id,
      serviceId: service5.id,
      name: patient5.name,
      phone: patient5.phone,
      email: patient5.email,
      date: new Date('2024-03-22'),
      time: '09:00',
      serviceName: service5.title,
      doctorName: doctor1.name,
      status: 'Planlandı',
    },
  });
  console.log(`  ✅ Created appointment: ${appointment5.id}`);

  // Create Testimonials
  console.log('⭐ Creating testimonials...');
  // Copy testimonial avatars to uploads directory
  const testimAvatars = ['t1.jpg', 't2.jpg', 't3.jpg'];
  const testimAvatarUrls: string[] = [];
  
  for (const avatar of testimAvatars) {
    const sourcePath = path.join(process.cwd(), 'public', 'assets', 'imgs', 'testim', avatar);
    const destPath = path.join(uploadsDir, `testim-${Date.now()}-${avatar}`);
    
    if (fs.existsSync(sourcePath)) {
      try {
        fs.copyFileSync(sourcePath, destPath);
        testimAvatarUrls.push(`/uploads/image/${path.basename(destPath)}`);
        console.log(`  ✅ Copied testimonial avatar: ${avatar}`);
      } catch (error) {
        console.log(`  ⚠️ Could not copy ${avatar}, using placeholder`);
        testimAvatarUrls.push('/assets/imgs/testim/default-avatar.jpg');
      }
    } else {
      testimAvatarUrls.push('/assets/imgs/testim/default-avatar.jpg');
    }
  }

  const testimonial1 = await prisma.testimonial.create({
    data: {
      patientName: 'Ahmet Yılmaz',
      rating: 5,
      comment: 'Klinikte aldığım hizmet gerçekten çok profesyoneldi. Doktorlar çok ilgili ve deneyimli. Tedavi sürecim boyunca kendimi güvende hissettim.',
      avatarUrl: testimAvatarUrls[0] || '/assets/imgs/testim/default-avatar.jpg',
      date: new Date('2024-03-10'),
      isActive: true,
      userId: admin.id,
    },
  });
  console.log(`  ✅ Created testimonial: ${testimonial1.id}`);

  const testimonial2 = await prisma.testimonial.create({
    data: {
      patientName: 'Ayşe Demir',
      rating: 5,
      comment: 'Randevu alma süreci çok kolaydı ve bekleme süresi minimumdu. Doktorun verdiği bilgiler çok netti ve tedavi sonrası takip mükemmeldi.',
      avatarUrl: testimAvatarUrls[1] || '/assets/imgs/testim/default-avatar.jpg',
      date: new Date('2024-03-05'),
      isActive: true,
    },
  });
  console.log(`  ✅ Created testimonial: ${testimonial2.id}`);

  const testimonial3 = await prisma.testimonial.create({
    data: {
      patientName: 'Mehmet Kaya',
      rating: 5,
      comment: 'Tüm personel çok nazik ve profesyonel. Kliniğin temizliği ve hijyeni mükemmel. Kesinlikle tavsiye ederim.',
      avatarUrl: testimAvatarUrls[2] || '/assets/imgs/testim/default-avatar.jpg',
      date: new Date('2024-02-28'),
      isActive: true,
    },
  });
  console.log(`  ✅ Created testimonial: ${testimonial3.id}`);

  const testimonial4 = await prisma.testimonial.create({
    data: {
      patientName: 'Fatma Şahin',
      rating: 5,
      comment: 'Mükemmel bir hizmet aldım. Çok memnun kaldım!',
      date: new Date('2024-03-12'),
      isActive: true,
    },
  });
  console.log(`  ✅ Created testimonial: ${testimonial4.id}`);

  const testimonial5 = await prisma.testimonial.create({
    data: {
      patientName: 'Ali Öztürk',
      rating: 5,
      comment: 'Profesyonel ekip, temiz ortam. Kesinlikle tavsiye ederim.',
      date: new Date('2024-03-08'),
      isActive: true,
    },
  });
  console.log(`  ✅ Created testimonial: ${testimonial5.id}`);

  // Create FAQs
  console.log('❓ Creating FAQs...');
  const faq1 = await prisma.fAQ.create({
    data: {
      question: 'Randevu nasıl alabilirim?',
      answer: 'Randevu almak için web sitemizden online randevu formunu doldurabilir veya telefon ile iletişime geçebilirsiniz.',
      order: 1,
      isActive: true,
    },
  });
  console.log(`  ✅ Created FAQ: ${faq1.id}`);

  const faq2 = await prisma.fAQ.create({
    data: {
      question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
      answer: 'Nakit, kredi kartı ve banka kartı ile ödeme yapabilirsiniz.',
      order: 2,
      isActive: true,
    },
  });
  console.log(`  ✅ Created FAQ: ${faq2.id}`);

  const faq3 = await prisma.fAQ.create({
    data: {
      question: 'Sigorta kapsamında mı?',
      answer: 'Evet, birçok sigorta şirketi ile anlaşmamız bulunmaktadır.',
      order: 3,
      isActive: true,
    },
  });
  console.log(`  ✅ Created FAQ: ${faq3.id}`);

  const faq4 = await prisma.fAQ.create({
    data: {
      question: 'Randevu iptal edebilir miyim?',
      answer: 'Evet, randevunuzu en az 24 saat önceden iptal edebilirsiniz.',
      order: 4,
      isActive: true,
    },
  });
  console.log(`  ✅ Created FAQ: ${faq4.id}`);

  const faq5 = await prisma.fAQ.create({
    data: {
      question: 'Acil durumlarda ne yapmalıyım?',
      answer: 'Acil durumlarda 7/24 hizmet veren acil servisimizden yararlanabilirsiniz.',
      order: 5,
      isActive: true,
    },
  });
  console.log(`  ✅ Created FAQ: ${faq5.id}`);

  // Create BeforeAfter
  console.log('📸 Creating before-after items...');
  
  // Copy before-after images to uploads directory
  const beforeAfterImages = [
    { before: 'works/1/1.jpg', after: 'works/1/1.jpg' },
    { before: 'works/1/2.jpg', after: 'works/1/2.jpg' },
    { before: 'works/1/3.jpg', after: 'works/1/3.jpg' },
    { before: 'works/1/4.jpg', after: 'works/1/4.jpg' },
    { before: 'works/1/5.jpg', after: 'works/1/5.jpg' },
  ];
  const beforeAfterImageUrls: Array<{ before: string; after: string }> = [];
  
  for (const img of beforeAfterImages) {
    const beforeSource = path.join(process.cwd(), 'public', 'assets', 'imgs', img.before);
    const afterSource = path.join(process.cwd(), 'public', 'assets', 'imgs', img.after);
    const beforeDest = path.join(uploadsDir, `before-${Date.now()}-${path.basename(img.before)}`);
    const afterDest = path.join(uploadsDir, `after-${Date.now()}-${path.basename(img.after)}`);
    
    let beforeUrl = '/assets/imgs/works/default.jpg';
    let afterUrl = '/assets/imgs/works/default.jpg';
    
    if (fs.existsSync(beforeSource)) {
      try {
        fs.copyFileSync(beforeSource, beforeDest);
        beforeUrl = `/uploads/image/${path.basename(beforeDest)}`;
        console.log(`  ✅ Copied before image: ${img.before}`);
      } catch (error) {
        console.log(`  ⚠️ Could not copy before ${img.before}`);
      }
    }
    
    if (fs.existsSync(afterSource)) {
      try {
        fs.copyFileSync(afterSource, afterDest);
        afterUrl = `/uploads/image/${path.basename(afterDest)}`;
        console.log(`  ✅ Copied after image: ${img.after}`);
      } catch (error) {
        console.log(`  ⚠️ Could not copy after ${img.after}`);
      }
    }
    
    beforeAfterImageUrls.push({ before: beforeUrl, after: afterUrl });
  }

  const beforeAfter1 = await prisma.beforeAfter.create({
    data: {
      title: 'Diş Temizliği Öncesi - Sonrası',
      description: 'Profesyonel diş temizliği ile sağlıklı ve parlak bir gülümseme. Modern tekniklerle ağrısız ve etkili sonuçlar.',
      beforeImage: beforeAfterImageUrls[0].before,
      afterImage: beforeAfterImageUrls[0].after,
      order: 1,
      isActive: true,
    },
  });
  console.log(`  ✅ Created before-after: ${beforeAfter1.id}`);

  const beforeAfter2 = await prisma.beforeAfter.create({
    data: {
      title: 'Estetik Dolgu İşlemi',
      description: 'Doğal görünümlü estetik dolgu işlemleri. Görünmez ve dayanıklı çözümlerle mükemmel sonuçlar.',
      beforeImage: beforeAfterImageUrls[1].before,
      afterImage: beforeAfterImageUrls[1].after,
      order: 2,
      isActive: true,
    },
  });
  console.log(`  ✅ Created before-after: ${beforeAfter2.id}`);

  const beforeAfter3 = await prisma.beforeAfter.create({
    data: {
      title: 'Kanal Tedavisi Sonuçları',
      description: 'Uzman kanal tedavisi ile diş kurtarma. Ağrısız ve başarılı tedavi süreçleri.',
      beforeImage: beforeAfterImageUrls[2].before,
      afterImage: beforeAfterImageUrls[2].after,
      order: 3,
      isActive: true,
    },
  });
  console.log(`  ✅ Created before-after: ${beforeAfter3.id}`);

  const beforeAfter4 = await prisma.beforeAfter.create({
    data: {
      title: 'Ortodontik Tedavi',
      description: 'Modern ortodontik tedavi yöntemleri ile düzgün diş yapısı. Görünmez ve konforlu çözümler.',
      beforeImage: beforeAfterImageUrls[3].before,
      afterImage: beforeAfterImageUrls[3].after,
      order: 4,
      isActive: true,
    },
  });
  console.log(`  ✅ Created before-after: ${beforeAfter4.id}`);

  const beforeAfter5 = await prisma.beforeAfter.create({
    data: {
      title: 'İmplant Uygulaması',
      description: 'Kalıcı ve doğal görünümlü implant çözümleri. Uzun ömürlü ve güvenilir sonuçlar.',
      beforeImage: beforeAfterImageUrls[4].before,
      afterImage: beforeAfterImageUrls[4].after,
      order: 5,
      isActive: true,
    },
  });
  console.log(`  ✅ Created before-after: ${beforeAfter5.id}`);

  // Create sample contact channels
  console.log('📞 Creating contact channels...');
  const contactChannels = await Promise.all([
    prisma.contactChannel.create({
      data: {
        type: 'phone',
        label: 'Telefon',
        value: '0216 123 45 67',
        order: 1,
        isActive: true,
      },
    }),
    prisma.contactChannel.create({
      data: {
        type: 'whatsapp',
        label: 'WhatsApp',
        value: '905321234567',
        order: 2,
        isActive: true,
      },
    }),
    prisma.contactChannel.create({
      data: {
        type: 'email',
        label: 'Email',
        value: 'info@klinik.com',
        order: 3,
        isActive: true,
      },
    }),
    prisma.contactChannel.create({
      data: {
        type: 'address',
        label: 'Adres',
        value: 'İstanbul, Kadıköy',
        order: 4,
        isActive: true,
      },
    }),
    prisma.contactChannel.create({
      data: {
        type: 'working_hours',
        label: 'Çalışma Saatleri',
        value: 'Pazartesi - Cuma: 09:00 - 18:00\nCumartesi: 09:00 - 14:00',
        order: 5,
        isActive: true,
      },
    }),
    prisma.contactChannel.create({
      data: {
        type: 'social_media',
        label: 'Facebook',
        value: 'https://facebook.com/klinik',
        icon: 'fab fa-facebook-f',
        order: 6,
        isActive: true,
      },
    }),
    prisma.contactChannel.create({
      data: {
        type: 'social_media',
        label: 'Instagram',
        value: 'https://instagram.com/klinik',
        icon: 'fab fa-instagram',
        order: 7,
        isActive: true,
      },
    }),
    prisma.contactChannel.create({
      data: {
        type: 'social_media',
        label: 'LinkedIn',
        value: 'https://linkedin.com/company/klinik',
        icon: 'fab fa-linkedin-in',
        order: 8,
        isActive: true,
      },
    }),
    prisma.contactChannel.create({
      data: {
        type: 'social_media',
        label: 'Twitter',
        value: 'https://twitter.com/klinik',
        icon: 'fab fa-twitter',
        order: 9,
        isActive: true,
      },
    }),
  ]);
  console.log(`✅ Created ${contactChannels.length} contact channels`);

  // Create sample newsletter subscriptions
  console.log('📧 Creating newsletter subscriptions...');
  const newsletters = await Promise.all([
    prisma.newsletter.create({
      data: {
        email: 'user1@example.com',
        name: 'Ahmet Yılmaz',
        isActive: true,
      },
    }),
    prisma.newsletter.create({
      data: {
        email: 'user2@example.com',
        name: 'Ayşe Demir',
        isActive: true,
      },
    }),
    prisma.newsletter.create({
      data: {
        email: 'user3@example.com',
        name: 'Mehmet Kaya',
        isActive: true,
      },
    }),
    prisma.newsletter.create({
      data: {
        email: 'user4@example.com',
        name: 'Fatma Şahin',
        isActive: true,
      },
    }),
    prisma.newsletter.create({
      data: {
        email: 'user5@example.com',
        name: 'Ali Öztürk',
        isActive: false,
        unsubscribedAt: new Date('2024-02-15'),
      },
    }),
    prisma.newsletter.create({
      data: {
        email: 'user6@example.com',
        name: 'Zeynep Yıldız',
        isActive: true,
      },
    }),
  ]);
  console.log(`✅ Created ${newsletters.length} newsletter subscriptions`);

  // Create Logos
  console.log('🖼️ Creating logos...');
  
  // Copy logo.png to uploads directory if it exists
  const logoSource = path.join(process.cwd(), 'public', 'logo.png');
  let logoUrl = '/uploads/image/logo-seed.png';
  
  if (fs.existsSync(logoSource)) {
    const logoDest = path.join(uploadsDir, 'logo-seed.png');
    try {
      fs.copyFileSync(logoSource, logoDest);
      console.log('  ✅ Copied logo.png to uploads directory');
    } catch (error) {
      console.log('  ⚠️ Could not copy logo, using placeholder');
      logoUrl = '/assets/imgs/logo-light.png';
    }
  } else {
    // If logo doesn't exist, use a placeholder URL
    logoUrl = '/assets/imgs/logo-light.png';
    console.log('  ⚠️ Logo file not found, using placeholder');
  }

  const headerLogo = await prisma.logo.upsert({
    where: { type: 'header' },
    update: {
      url: logoUrl,
      name: 'Header Logo',
      alt: 'Klinik Logo',
      isActive: true,
    },
    create: {
      type: 'header',
      name: 'Header Logo',
      url: logoUrl,
      alt: 'Klinik Logo',
      isActive: true,
    },
  });
  console.log(`  ✅ Created header logo: ${headerLogo.id}`);

  const footerLogo = await prisma.logo.upsert({
    where: { type: 'footer' },
    update: {
      url: logoUrl,
      name: 'Footer Logo',
      alt: 'Klinik Logo',
      isActive: true,
    },
    create: {
      type: 'footer',
      name: 'Footer Logo',
      url: logoUrl,
      alt: 'Klinik Logo',
      isActive: true,
    },
  });
  console.log(`  ✅ Created footer logo: ${footerLogo.id}`);

  const faviconLogo = await prisma.logo.upsert({
    where: { type: 'favicon' },
    update: {
      url: logoUrl,
      name: 'Favicon',
      alt: 'Klinik Favicon',
      isActive: true,
    },
    create: {
      type: 'favicon',
      name: 'Favicon',
      url: logoUrl,
      alt: 'Klinik Favicon',
      isActive: true,
    },
  });
  console.log(`  ✅ Created favicon: ${faviconLogo.id}`);

  // Create Home Intro
  console.log('🏠 Creating home intro...');
  const homeIntro = await prisma.homeIntro.create({
    data: {
      smallTitle: 'Modern Sağlık Hizmetleri',
      mainTitle: 'Sağlığınız İçin Yanınızdayız',
      subTitle: 'Profesyonel ve Güvenilir Sağlık Hizmetleri',
      description: 'Sağlığınız bizim önceliğimiz. Modern tıbbi teknoloji ve deneyimli ekibimizle size en iyi hizmeti sunmak için buradayız. Randevu alın, sağlığınızı güvence altına alın.',
      buttonText: 'Randevu Al',
      buttonLink: '/randevu-al',
      backgroundImage: '/assets/imgs/header/p0.jpg',
      isActive: true,
    },
  });
  console.log(`  ✅ Created home intro: ${homeIntro.id}`);

  // Create Marquee Items
  console.log('📜 Creating marquee items...');
  const marqueeItems = await Promise.all([
    prisma.marqueeItem.create({
      data: { text: 'Genel Muayene', order: 1, isActive: true },
    }),
    prisma.marqueeItem.create({
      data: { text: 'Özel Tedaviler', order: 2, isActive: true },
    }),
    prisma.marqueeItem.create({
      data: { text: 'Konsültasyon', order: 3, isActive: true },
    }),
    prisma.marqueeItem.create({
      data: { text: 'Kontrol Muayenesi', order: 4, isActive: true },
    }),
    prisma.marqueeItem.create({
      data: { text: 'Acil Hizmetler', order: 5, isActive: true },
    }),
    prisma.marqueeItem.create({
      data: { text: 'Sağlık Taraması', order: 6, isActive: true },
    }),
    prisma.marqueeItem.create({
      data: { text: 'Teşhis Hizmetleri', order: 7, isActive: true },
    }),
    prisma.marqueeItem.create({
      data: { text: 'Tedavi Planlaması', order: 8, isActive: true },
    }),
  ]);
  console.log(`  ✅ Created ${marqueeItems.length} marquee items`);

  // Create Home About
  console.log('📖 Creating home about...');
  const homeAbout = await prisma.homeAbout.create({
    data: {
      image: '/assets/imgs/header/p2.jpg',
      smallTitle: 'Hakkımızda',
      title: 'Modern Tıbbi Teknoloji ve Deneyimli Ekip ile Sağlığınız İçin Hizmetinizdeyiz',
      content: 'Klinik olarak, hasta memnuniyetini ön planda tutarak, modern tıbbi teknoloji ve deneyimli ekibimizle en kaliteli sağlık hizmetini sunmaktayız. Yılların deneyimi ve sürekli gelişen tıp bilimi ile hastalarımıza en iyi tedavi seçeneklerini sunuyoruz.\n\nMisyonumuz, her hasta için kişiselleştirilmiş tedavi planları oluşturmak ve sağlık yolculuğunuzda yanınızda olmaktır. Vizyonumuz ise, toplum sağlığını iyileştirmek ve herkes için erişilebilir, kaliteli sağlık hizmeti sunmaktır.',
      isActive: true,
    },
  });
  console.log(`  ✅ Created home about: ${homeAbout.id}`);

  // Create Skills
  console.log('💪 Creating skills...');
  const skills = await Promise.all([
    prisma.skill.create({
      data: { percentage: 98, title: 'Genel Muayene', order: 1, isActive: true },
    }),
    prisma.skill.create({
      data: { percentage: 95, title: 'Özel Tedaviler', order: 2, isActive: true },
    }),
    prisma.skill.create({
      data: { percentage: 97, title: 'Teşhis Hizmetleri', order: 3, isActive: true },
    }),
    prisma.skill.create({
      data: { percentage: 96, title: 'Konsültasyon', order: 4, isActive: true },
    }),
    prisma.skill.create({
      data: { percentage: 94, title: 'Acil Hizmetler', order: 5, isActive: true },
    }),
    prisma.skill.create({
      data: { percentage: 99, title: 'Hasta Memnuniyeti', order: 6, isActive: true },
    }),
  ]);
  console.log(`  ✅ Created ${skills.length} skills`);

  // Create Marquee2 Items
  console.log('📜 Creating marquee2 items...');
  const marquee2Items = await Promise.all([
    prisma.marquee2Item.create({
      data: { text: 'Get In Touch', order: 1, isActive: true },
    }),
    prisma.marquee2Item.create({
      data: { text: 'Contact Us', order: 2, isActive: true },
    }),
  ]);
  console.log(`  ✅ Created ${marquee2Items.length} marquee2 items`);

  // Create About Page Intro
  console.log('📄 Creating about page intro...');
  const aboutPageIntro = await prisma.aboutPageIntro.create({
    data: {
      image: '/assets/imgs/intro/i1.jpg',
      title: 'Modern tıbbi teknoloji ve deneyimli ekibimizle sağlığınız için yanınızdayız.',
      content: 'Klinik olarak, hasta memnuniyetini ön planda tutarak, modern tıbbi teknoloji ve deneyimli ekibimizle en kaliteli sağlık hizmetini sunmaktayız. Yılların deneyimi ve sürekli gelişen tıp bilimi ile hastalarımıza en iyi tedavi seçeneklerini sunuyoruz.\n\nMisyonumuz, her hasta için kişiselleştirilmiş tedavi planları oluşturmak ve sağlık yolculuğunuzda yanınızda olmaktır. Vizyonumuz ise, toplum sağlığını iyileştirmek ve herkes için erişilebilir, kaliteli sağlık hizmeti sunmaktır.',
      isActive: true,
    },
  });
  console.log(`  ✅ Created about page intro: ${aboutPageIntro.id}`);

  // Create Contact Map
  console.log('🗺️ Creating contact map...');
  const contactMap = await prisma.contactMap.create({
    data: {
      iframeCode: '<iframe id="gmap_canvas" src="https://maps.google.com/maps?q=hollwood&t=&z=11&ie=UTF8&iwloc=&output=embed"></iframe>',
      isActive: true,
    },
  });
  console.log(`  ✅ Created contact map: ${contactMap.id}`);

  console.log('🎉 Seeding completed successfully!');
  console.log('\n📋 Admin Credentials:');
  console.log('   Email: admin@klinik.com');
  console.log('   Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
