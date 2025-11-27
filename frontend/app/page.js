
import HomePersonal from '@/components/HomePersonal';

import generateStylesheetObject from '@/common/generateStylesheetsObject';

export const metadata = {
  title: 'Klinik - Modern Sağlık Hizmetleri',
  icons: {
    icon: '/assets/imgs/favicon.ico',
    shortcut: '/assets/imgs/favicon.ico',
    other: generateStylesheetObject([
      '/assets/css/plugins.css',
      '/assets/css/style.css',
      'https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600,700,800,900&display=swap',
      'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700&display=swap',
    ]),
  },
};
export default function Home() {
  return <HomePersonal />
}
