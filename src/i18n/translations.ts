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
    signIn: 'Log In',

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

    // FindAPro page
    findAProTitle: 'Find a Pro',
    findAProSubtitle: 'Search verified professionals by trade, location, rating, and budget.',
    search: 'Search',
    searchPlaceholder: 'electrician, plumber, verified...',
    cityPlaceholder: 'Chișinău, Bălți...',
    all: 'All',
    minimumRating: 'Minimum rating',
    hourlyRateLabel: 'Hourly rate',
    sort: 'Sort',
    sortRelevance: 'Relevance',
    sortRating: 'Rating',
    sortPriceLow: 'Price: low to high',
    sortPriceHigh: 'Price: high to low',
    clear: 'Clear',
    results: 'results',
    verifiedOnlyLabel: 'Verified only',
    viewProfile: 'View profile',
    message: 'Message',
    noResults: 'No results',
    noResultsHint: 'Try adjusting your filters or search terms.',

    // ViewProfileDialog
    years: 'years',
    close: 'Close',
    about: 'About',
    reviews: 'Reviews',
    showLess: 'Show less',
    viewMore: 'View more',

    // MessageDialog
    yourMessage: 'Your message',
    messagePlaceholder: 'Hi! I need help with...',
    cancel: 'Cancel',
    send: 'Send',

    // Login
    loginTitle: 'Login',
    email: 'Email',
    password: 'Password',
    rememberMe: 'Remember me',
    loggingIn: 'Logging in...',
    loginButton: 'Log in',
    noAccount: "Don't have an account?",
    createOne: 'Create one!',
    invalidEmail: 'Enter a valid email.',
    passwordTooShort: 'Password must be at least 6 characters.',
    loginFailed: 'Could not log in.',

    // Signup
    signupTitle: 'Create account',
    signupSubtitle: 'Mock signup (no backend).',
    confirmPassword: 'Confirm password',
    creatingAccount: 'Creating...',
    signupButton: 'Sign up',
    alreadyHaveAccount: 'Already have an account?',
    signInLink: 'Sign in',
    passwordsMismatch: "Passwords don't match.",
    signupFailed: 'Could not sign up.',

    // BecomeAPro
    becomeAProTitle: 'Become a Professional',
    becomeAProSubtitle: 'Fill out the form below to apply as a professional on HandsForHire.',
    fullName: 'Full name',
    age: 'Age',
    trade: 'Trade',
    city: 'City',
    hourlyRate: 'Hourly rate (€)',
    description: 'Description',
    descriptionPlaceholder: 'Describe your experience and skills...',
    submitApplication: 'Submit application',
    applicationSuccess: 'Application submitted successfully!',
    fieldRequired: 'This field is required',
    selectTrade: 'Select a trade',

    electricianDesc: 'Wiring, outlets, lighting, panels, troubleshooting, and safe electrical installs.',
    plumberDesc: 'Leaks, pipes, faucets, toilets, boilers, and quick fixes for water systems.',
    carpenterDesc: 'Furniture, doors, flooring, custom woodwork, repairs, and precise installations.',
    painterDesc: 'Walls and ceilings painting, surface prep, touch-ups, and clean finishing work.',
    hvacDesc: 'Air conditioning and ventilation: install, maintenance, filter changes, and diagnostics.',
    handymanDesc: 'General home repairs: mounting, assembling, small fixes, and everyday maintenance.',

    // Footer
    footerText: 'HandsForHire. Built with care.',
  },

  ro: {
    // AppBar
    findAPro: 'Găsește un specialist',
    becomeAPro: 'Devino specialist',
    signIn: 'Logare',

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

    // FindAPro page
    findAProTitle: 'Găsește un Specialist',
    findAProSubtitle: 'Caută specialiști verificați după meserie, locație, rating și buget.',
    search: 'Căutare',
    searchPlaceholder: 'electrician, instalator, verificat...',
    cityPlaceholder: 'Chișinău, Bălți...',
    all: 'Toate',
    minimumRating: 'Rating minim',
    hourlyRateLabel: 'Tarif pe oră',
    sort: 'Sortare',
    sortRelevance: 'Relevanță',
    sortRating: 'Evaluare',
    sortPriceLow: 'Preț: mic la mare',
    sortPriceHigh: 'Preț: mare la mic',
    clear: 'Șterge',
    results: 'rezultate',
    verifiedOnlyLabel: 'Doar verificați',
    viewProfile: 'Vezi profil',
    message: 'Mesaj',
    noResults: 'Fără rezultate',
    noResultsHint: 'Încearcă să ajustezi filtrele sau termenii de căutare.',

    // ViewProfileDialog
    years: 'ani',
    close: 'Închide',
    about: 'Despre',
    reviews: 'Recenzii',
    showLess: 'Arată mai puțin',
    viewMore: 'Vezi mai mult',

    // MessageDialog
    yourMessage: 'Mesajul tău',
    messagePlaceholder: 'Salut! Am nevoie de ajutor cu...',
    cancel: 'Anulează',
    send: 'Trimite',

    // Login
    loginTitle: 'Autentificare',
    email: 'Email',
    password: 'Parolă',
    rememberMe: 'Ține-mă minte',
    loggingIn: 'Se autentifică...',
    loginButton: 'Autentificare',
    noAccount: 'Nu ai cont?',
    createOne: 'Creează-ți unul!',
    invalidEmail: 'Introdu un email valid.',
    passwordTooShort: 'Parola trebuie să aibă minim 6 caractere.',
    loginFailed: 'Nu s-a putut face login.',

    // Signup
    signupTitle: 'Creează cont',
    signupSubtitle: 'Mock signup (fără backend).',
    confirmPassword: 'Confirmă parola',
    creatingAccount: 'Se creează...',
    signupButton: 'Înregistrare',
    alreadyHaveAccount: 'Ai deja cont?',
    signInLink: 'Autentifică-te',
    passwordsMismatch: 'Parolele nu coincid.',
    signupFailed: 'Nu s-a putut face signup.',

    // BecomeAPro
    becomeAProTitle: 'Devino Specialist',
    becomeAProSubtitle: 'Completează formularul de mai jos pentru a aplica ca specialist pe HandsForHire.',
    fullName: 'Nume complet',
    age: 'Vârstă',
    trade: 'Meserie',
    city: 'Oraș',
    hourlyRate: 'Tarif pe oră (€)',
    description: 'Descriere',
    descriptionPlaceholder: 'Descrie experiența și abilitățile tale...',
    submitApplication: 'Trimite cererea',
    applicationSuccess: 'Cererea a fost trimisă cu succes!',
    fieldRequired: 'Acest câmp este obligatoriu',
    selectTrade: 'Selectează o meserie',

    electricianDesc: 'Cablaje, prize, iluminat, tablouri electrice, depanare și instalări în siguranță.',
    plumberDesc: 'Scurgeri, țevi, robinete, toalete, boilere și reparații rapide pentru instalații sanitare.',
    carpenterDesc: 'Mobilă, uși, podele, lucrări din lemn la comandă, reparații și montaj precis.',
    painterDesc: 'Vopsire pereți și tavane, pregătire suprafețe, retușuri și finisaj curat.',
    hvacDesc: 'Climatizare și ventilație: instalare, mentenanță, filtre și diagnosticare.',
    handymanDesc: 'Reparații generale: montaj, asamblare, mici intervenții și întreținere zilnică.',

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

    // FindAPro page
    findAProTitle: 'Найти Специалиста',
    findAProSubtitle: 'Ищите проверенных специалистов по профессии, городу, рейтингу и бюджету.',
    search: 'Поиск',
    searchPlaceholder: 'электрик, сантехник, проверен...',
    cityPlaceholder: 'Кишинёв, Бельцы...',
    all: 'Все',
    minimumRating: 'Минимальный рейтинг',
    hourlyRateLabel: 'Почасовая ставка',
    sort: 'Сортировка',
    sortRelevance: 'Релевантность',
    sortRating: 'Рейтинг',
    sortPriceLow: 'Цена: по возрастанию',
    sortPriceHigh: 'Цена: по убыванию',
    clear: 'Очистить',
    results: 'результатов',
    verifiedOnlyLabel: 'Только проверенные',
    viewProfile: 'Посмотреть профиль',
    message: 'Сообщение',
    noResults: 'Нет результатов',
    noResultsHint: 'Попробуйте изменить фильтры или условия поиска.',

    // ViewProfileDialog
    years: 'лет',
    close: 'Закрыть',
    about: 'О себе',
    reviews: 'Отзывы',
    showLess: 'Показать меньше',
    viewMore: 'Показать ещё',

    // MessageDialog
    yourMessage: 'Ваше сообщение',
    messagePlaceholder: 'Привет! Мне нужна помощь с...',
    cancel: 'Отмена',
    send: 'Отправить',

    // Login
    loginTitle: 'Вход',
    email: 'Email',
    password: 'Пароль',
    rememberMe: 'Запомнить меня',
    loggingIn: 'Вход...',
    loginButton: 'Войти',
    noAccount: 'Нет аккаунта?',
    createOne: 'Создайте!',
    invalidEmail: 'Введите действительный email.',
    passwordTooShort: 'Пароль должен быть не менее 6 символов.',
    loginFailed: 'Не удалось войти.',

    // Signup
    signupTitle: 'Создать аккаунт',
    signupSubtitle: 'Mock регистрация (без бэкенда).',
    confirmPassword: 'Подтвердите пароль',
    creatingAccount: 'Создание...',
    signupButton: 'Зарегистрироваться',
    alreadyHaveAccount: 'Уже есть аккаунт?',
    signInLink: 'Войти',
    passwordsMismatch: 'Пароли не совпадают.',
    signupFailed: 'Не удалось зарегистрироваться.',

    // BecomeAPro
    becomeAProTitle: 'Стать Специалистом',
    becomeAProSubtitle: 'Заполните форму ниже, чтобы подать заявку как специалист на HandsForHire.',
    fullName: 'Полное имя',
    age: 'Возраст',
    trade: 'Специальность',
    city: 'Город',
    hourlyRate: 'Почасовая ставка (€)',
    description: 'Описание',
    descriptionPlaceholder: 'Опишите ваш опыт и навыки...',
    submitApplication: 'Отправить заявку',
    applicationSuccess: 'Заявка успешно отправлена!',
    fieldRequired: 'Это поле обязательно',
    selectTrade: 'Выберите специальность',

    electricianDesc: 'Проводка, розетки, освещение, электрощиты, диагностика и безопасная установка.',
    plumberDesc: 'Протечки, трубы, краны, сантехника, бойлеры и быстрые решения для воды.',
    carpenterDesc: 'Мебель, двери, полы, столярные работы, ремонт и точный монтаж.',
    painterDesc: 'Покраска стен и потолков, подготовка поверхности, мелкий ремонт и аккуратная отделка.',
    hvacDesc: 'Климат и вентиляция: установка, обслуживание, фильтры и диагностика.',
    handymanDesc: 'Бытовой мастер: мелкий ремонт, крепления, сборка, помощь по дому.',

    // Footer
    footerText: 'HandsForHire. Сделано с заботой.',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
export default translations;
