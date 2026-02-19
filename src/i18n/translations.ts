export type Language = 'en' | 'ro' | 'ru';

export const languageLabels: Record<Language, string> = {
  en: 'English',
  ro: 'Română',
  ru: 'Русский',
};

const translations = {
  en: {
    // AppBar
    findAPro: 'Find a pro',
    becomeAPro: 'Become a pro',
    signIn: 'Sign in',

    // Hero
    heroChip: 'Modern • Verified pros • Fast booking',
    heroTitle: 'Hire trusted pros for any repair, install, or renovation.',
    heroDescription:
      'HandsForHire connects people with skilled craftsmen — electricians, plumbers, carpenters, painters and more. Browse, compare, and book in minutes.',
    findAProfessional: 'Find a professional',
    becomeAProfessional: 'Become a professional',
    verifiedProfiles: 'Verified profiles',
    ratingsReviews: 'Ratings & reviews',
    securePayments: 'Secure payments',

    // Categories
    popularCategories: 'Popular categories',
    electrician: 'Electrician',
    plumber: 'Plumber',
    carpenter: 'Carpenter',
    painter: 'Painter',
    hvac: 'HVAC',
    handyman: 'Handyman',

    // How it works
    howItWorks: 'How it works',
    step1Title: 'Describe your job',
    step1Desc: 'Tell us what you need and where.',
    step2Title: 'Compare professionals',
    step2Desc: 'Check profiles, ratings, and pricing.',
    step3Title: 'Book & get it done',
    step3Desc: 'Message, schedule, and pay securely.',

    // Featured pros
    featuredProfessionals: 'Featured professionals',
    handPickedReviews: 'Hand-picked based on reviews',
    verified: 'Verified',
    topRated: 'Top rated',
    fastResponse: 'Fast response',

    // Testimonials
    peopleLoveIt: 'People love it',
    testimonial1: 'Booked a plumber in 10 minutes. Super smooth.',
    testimonial2: 'Great quality work and fair price. Loved the reviews feature.',
    testimonial3: 'Found a reliable electrician for my apartment renovation.',

    // CTA
    readyToGetWorkDone: 'Ready to get work done?',
    ctaDescription: "Post a job or join as a professional — we'll handle the matching.",

    // Footer
    footerText: 'HandsForHire. Built with care.',
  },

  ro: {
    // AppBar
    findAPro: 'Găsește un specialist',
    becomeAPro: 'Devino specialist',
    signIn: 'Autentificare',

    // Hero
    heroChip: 'Modern • Specialiști verificați • Rezervare rapidă',
    heroTitle: 'Angajează specialiști de încredere pentru orice reparație, instalare sau renovare.',
    heroDescription:
      'HandsForHire conectează oamenii cu meșterii calificați — electricieni, instalatori, tâmplari, zugravi și mulți alții. Răsfoiește, compară și rezervă în câteva minute.',
    findAProfessional: 'Găsește un specialist',
    becomeAProfessional: 'Devino specialist',
    verifiedProfiles: 'Profile verificate',
    ratingsReviews: 'Evaluări și recenzii',
    securePayments: 'Plăți securizate',

    // Categories
    popularCategories: 'Categorii populare',
    electrician: 'Electrician',
    plumber: 'Instalator',
    carpenter: 'Tâmplar',
    painter: 'Zugrav',
    hvac: 'HVAC',
    handyman: 'Meșter universal',

    // How it works
    howItWorks: 'Cum funcționează',
    step1Title: 'Descrie lucrarea',
    step1Desc: 'Spune-ne ce ai nevoie și unde.',
    step2Title: 'Compară specialiștii',
    step2Desc: 'Verifică profilurile, evaluările și prețurile.',
    step3Title: 'Rezervă și gata',
    step3Desc: 'Trimite mesaje, programează și plătește în siguranță.',

    // Featured pros
    featuredProfessionals: 'Specialiști recomandați',
    handPickedReviews: 'Selectați pe baza recenziilor',
    verified: 'Verificat',
    topRated: 'Cel mai bine evaluat',
    fastResponse: 'Răspuns rapid',

    // Testimonials
    peopleLoveIt: 'Oamenii adoră',
    testimonial1: 'Am rezervat un instalator în 10 minute. Super simplu.',
    testimonial2: 'Calitate excelentă și preț corect. Îmi place funcția de recenzii.',
    testimonial3: 'Am găsit un electrician de încredere pentru renovarea apartamentului.',

    // CTA
    readyToGetWorkDone: 'Ești gata să finalizezi lucrarea?',
    ctaDescription: 'Postează o lucrare sau alătură-te ca specialist — noi ne ocupăm de potrivire.',

    // Footer
    footerText: 'HandsForHire. Construit cu grijă.',
  },

  ru: {
    // AppBar
    findAPro: 'Найти мастера',
    becomeAPro: 'Стать мастером',
    signIn: 'Войти',

    // Hero
    heroChip: 'Современно • Проверенные мастера • Быстрое бронирование',
    heroTitle: 'Наймите проверенных мастеров для любого ремонта, установки или реновации.',
    heroDescription:
      'HandsForHire связывает людей с квалифицированными мастерами — электриками, сантехниками, плотниками, малярами и другими. Просматривайте, сравнивайте и бронируйте за минуты.',
    findAProfessional: 'Найти специалиста',
    becomeAProfessional: 'Стать специалистом',
    verifiedProfiles: 'Проверенные профили',
    ratingsReviews: 'Рейтинги и отзывы',
    securePayments: 'Безопасные платежи',

    // Categories
    popularCategories: 'Популярные категории',
    electrician: 'Электрик',
    plumber: 'Сантехник',
    carpenter: 'Плотник',
    painter: 'Маляр',
    hvac: 'Кондиционирование',
    handyman: 'Мастер на все руки',

    // How it works
    howItWorks: 'Как это работает',
    step1Title: 'Опишите задачу',
    step1Desc: 'Расскажите, что вам нужно и где.',
    step2Title: 'Сравните специалистов',
    step2Desc: 'Проверьте профили, рейтинги и цены.',
    step3Title: 'Забронируйте и готово',
    step3Desc: 'Пишите, назначайте время и платите безопасно.',

    // Featured pros
    featuredProfessionals: 'Рекомендуемые специалисты',
    handPickedReviews: 'Отобраны на основе отзывов',
    verified: 'Проверен',
    topRated: 'Лучший рейтинг',
    fastResponse: 'Быстрый ответ',

    // Testimonials
    peopleLoveIt: 'Людям нравится',
    testimonial1: 'Забронировала сантехника за 10 минут. Очень удобно.',
    testimonial2: 'Отличное качество работы и справедливая цена. Понравилась функция отзывов.',
    testimonial3: 'Нашла надёжного электрика для ремонта квартиры.',

    // CTA
    readyToGetWorkDone: 'Готовы приступить к делу?',
    ctaDescription: 'Разместите заказ или присоединитесь как специалист — мы подберём пару.',

    // Footer
    footerText: 'HandsForHire. Сделано с заботой.',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
export default translations;
