export type Language = 'en' | 'fr' | 'ar';

export interface Translation {
  login: {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    submit: string;
    heroTitle: string;
    heroSubtitle: string;
    heroDesc: string;
    secure: string;
    fast: string;
    requestAccess: string;
    joinNetwork: string;
    requestSent: string;
    requestSentDesc: string;
    businessName: string;
    businessNamePlaceholder: string;
    phoneNumber: string;
    rememberMe: string;
    forgotPassword: string;
    submitRequest: string;
    noAccount: string;
    hasAccount: string;
    login: string;
  };
  nav: {
    dashboard: string;
    create: string;
    deliveries: string;
    admin: string;
    profile: string;
  };
  dashboard: {
    totalDeliveries: string;
    completed: string;
    pending: string;
    refusalRate: string;
    adsTitle: string;
    newDelivery: string;
    appFee: string;
    confirmationFee: string;
    deliveryStats: string;
    totalRevenue: string;
    activeBusinesses: string;
    pendingDeliveries: string;
    avgDeliveryTime: string;
    activeDeliveries: string;
    inTransit: string;
    fleetStatus: string;
    fleetStatusDesc: string;
    week: string;
    month: string;
  };
  create: {
    title: string;
    pickup: string;
    dropoff: string;
    clientName: string;
    clientPhone: string;
    pricing: string;
    distancePrice: string;
    scheduled: string;
    priority: string;
    weather: string;
    callOffice: string;
    total: string;
    confirm: string;
    noDestination: string;
    selectOnMap: string;
    myLocation: string;
    pickupPlaceholder: string;
    dropoffPlaceholder: string;
    noDestPlaceholder: string;
    clientNamePlaceholder: string;
    clientPhonePlaceholder: string;
    basePrice: string;
    nightTariff: string;
    adminFixedPrice: string;
    confirmed: string;
    selectLocation: string;
    mapPlaceholder: string;
    mapInstruction: string;
    packagePrice: string;
    deliveryFee: string;
    deliveryFeeUnknown: string;
  };
  list: {
    title: string;
    status: {
      pending: string;
      confirmed: string;
      done: string;
      denied: string;
    };
  };
  admin: {
    title: string;
    subtitle: string;
    stats: string;
    businesses: string;
    management: string;
    weatherToggle: string;
    nightTariff: string;
    signupRequests: string;
    setFixedPrice: string;
    fixedPrice: string;
    save: string;
    business: string;
    contact: string;
    date: string;
    status: string;
    actions: string;
    searchBusinesses: string;
    filter: string;
    phone: string;
    saved: string;
    successFixedPrice: string;
  };
  profile: {
    title: string;
    subtitle: string;
    businessName: string;
    phone: string;
    email: string;
    update: string;
    changePhoto: string;
    success: string;
  };
  landing: {
    heroTitle: string;
    heroSubtitle: string;
    heroBatna: string;
    getStarted: string;
    login: string;
    features: string;
    b2bSolutions: string;
    about: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    batnaOnly: string;
    talkToExpert: string;
    watchDemo: string;
    awardWinning: string;
    activePartners: string;
    deliveries: string;
    reliability: string;
    delivered: string;
    liveTracking: string;
    batnaCenter: string;
    demoTitle: string;
    demoSubtitle: string;
    demoDesc: string;
    instantDispatch: string;
    instantDispatchDesc: string;
    liveTrackingTitle: string;
    liveTrackingDesc: string;
    smartRouting: string;
    smartRoutingDesc: string;
    b2bTitle: string;
    b2bDesc: string;
    partnerWithUs: string;
    b2bFeature1: string;
    b2bFeature2: string;
    b2bFeature3: string;
    b2bFeature4: string;
    efficiency: string;
    efficiencyDesc: string;
    readyToTransform: string;
    joinBusinesses: string;
    footerDesc: string;
    platform: string;
    company: string;
    contact: string;
    phone: string;
    email: string;
    address: string;
    pricing: string;
    careers: string;
    privacy: string;
    terms: string;
    rights: string;
    joinAsDriver: string;
    driverTitle: string;
    driverDesc: string;
    whatsappJoin: string;
  };
}

export const translations: Record<Language, Translation> = {
  en: {
    login: {
      title: 'Welcome Back',
      subtitle: 'Login to manage your deliveries in Batna.',
      email: 'Email Address',
      password: 'Password',
      submit: 'Login',
      heroTitle: 'Accelerate Your',
      heroSubtitle: 'Business Growth.',
      heroDesc: 'Join the elite network of businesses optimizing their logistics with Nitro\'s award-winning technology. Exclusively in Batna.',
      secure: 'Secure',
      fast: 'Fast',
      requestAccess: 'Request Access',
      joinNetwork: 'Join the Nitro network in Batna.',
      requestSent: 'Request Sent!',
      requestSentDesc: 'Our team will review your application and contact you shortly.',
      businessName: 'Business Name',
      businessNamePlaceholder: 'Your Business Name',
      phoneNumber: 'Phone Number',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      submitRequest: 'Submit Request',
      noAccount: 'Don\'t have an account?',
      hasAccount: 'Already have an account?',
      login: 'Login',
    },
    nav: {
      dashboard: 'Dashboard',
      create: 'New Delivery',
      deliveries: 'Deliveries',
      admin: 'Admin',
      profile: 'Profile',
    },
    dashboard: {
      totalDeliveries: 'Total Deliveries',
      completed: 'Completed',
      pending: 'Pending',
      refusalRate: 'Refuse Rate',
      adsTitle: 'Nitro Express: Faster than ever!',
      newDelivery: 'New Delivery',
      appFee: 'App Fee (20 DA)',
      confirmationFee: 'Confirmation Fee (30 DA)',
      deliveryStats: 'Delivery Stats',
      totalRevenue: 'Total Revenue',
      activeBusinesses: 'Active Businesses',
      pendingDeliveries: 'Pending Deliveries',
      avgDeliveryTime: 'Avg. Delivery Time',
      activeDeliveries: 'Active Deliveries',
      inTransit: 'In Transit',
      fleetStatus: 'Fleet Status',
      fleetStatusDesc: 'High demand in Batna. Priority couriers available.',
      week: 'Week',
      month: 'Month',
    },
    create: {
      title: 'Create Delivery',
      pickup: 'Pickup Location',
      dropoff: 'Drop-off Location',
      clientName: 'Client Name',
      clientPhone: 'Client Phone',
      pricing: 'Pricing Breakdown',
      distancePrice: 'Distance-based price',
      scheduled: 'Scheduled delivery',
      priority: 'Priority',
      weather: 'Bad weather',
      callOffice: 'Call office',
      total: 'Final Price',
      confirm: 'Confirm Delivery',
      noDestination: 'No destination (Add 30 DA)',
      selectOnMap: 'Select on Map',
      myLocation: 'My Location',
      pickupPlaceholder: 'Pickup Address',
      dropoffPlaceholder: 'Drop-off Address',
      noDestPlaceholder: 'No destination needed',
      clientNamePlaceholder: 'Client Name',
      clientPhonePlaceholder: '0770 00 00 00',
      basePrice: 'Base Price',
      nightTariff: 'Night Tariff',
      adminFixedPrice: 'Admin Fixed Price',
      confirmed: 'Confirmed!',
      selectLocation: 'Select Location',
      mapPlaceholder: 'Interactive Map for Batna',
      mapInstruction: 'Click a point on the map to select the address',
      packagePrice: 'Package value (DA)',
      deliveryFee: 'Delivery fee',
      deliveryFeeUnknown: 'Unknown',
    },
    list: {
      title: 'Delivery List',
      status: {
        pending: 'Pending',
        confirmed: 'Confirmed',
        done: 'Done',
        denied: 'Denied',
      },
    },
    admin: {
      title: 'Admin Dashboard',
      subtitle: 'Platform overview and management for Batna.',
      stats: 'Platform Statistics',
      businesses: 'Business Partners',
      management: 'Delivery Management',
      weatherToggle: 'Weather Alert',
      nightTariff: 'Night Tariffs (+150 DA)',
      signupRequests: 'Signup Requests',
      setFixedPrice: 'Set Fixed Price',
      fixedPrice: 'Fixed Price',
      save: 'Save',
      business: 'Business',
      contact: 'Contact',
      date: 'Date',
      status: 'Status',
      actions: 'Actions',
      searchBusinesses: 'Search businesses...',
      filter: 'Filter',
      phone: 'Phone',
      saved: 'Saved!',
      successFixedPrice: 'Fixed price saved successfully!',
    },
    profile: {
      title: 'Business Profile',
      subtitle: 'Manage your business identity on Nitro.',
      businessName: 'Business Name',
      phone: 'Phone Number',
      email: 'Email Address',
      update: 'Update Profile',
      changePhoto: 'Change Photo',
      success: 'Profile updated successfully!',
    },
    landing: {
      heroTitle: 'Fast, Reliable B2B Delivery',
      heroSubtitle: 'The ultimate logistics platform for your business. Deliver faster, track better, and grow your reach with Nitro.',
      heroBatna: 'In Batna.',
      getStarted: 'Get Started',
      login: 'Login',
      features: 'Features',
      b2bSolutions: 'B2B Solutions',
      about: 'About',
      feature1Title: 'Real-time Tracking',
      feature1Desc: 'Monitor your deliveries in real-time with our advanced GPS tracking system.',
      feature2Title: 'Smart Pricing',
      feature2Desc: 'Transparent, distance-based pricing with flexible add-ons for every need.',
      feature3Title: 'Business Analytics',
      feature3Desc: 'Gain valuable insights into your delivery performance with detailed reports.',
      batnaOnly: 'Exclusively in Batna',
      talkToExpert: 'Talk to Expert',
      watchDemo: 'Watch Demo',
      awardWinning: '2026 Award Winning Platform',
      activePartners: 'Active Partners',
      deliveries: 'Deliveries',
      reliability: 'Reliability',
      delivered: 'Delivered',
      liveTracking: 'Live Tracking',
      batnaCenter: 'Batna Center',
      demoTitle: 'Experience the Future of Logistics.',
      demoSubtitle: 'Live Platform Demo',
      demoDesc: 'See how Nitro transforms your business operations with real-time tracking, automated dispatching, and smart analytics.',
      instantDispatch: 'Instant Dispatch',
      instantDispatchDesc: 'Orders are assigned to the nearest courier in seconds.',
      liveTrackingTitle: 'Live Tracking',
      liveTrackingDesc: 'Your customers see exactly where their package is.',
      smartRouting: 'Smart Routing',
      smartRoutingDesc: 'AI-powered routes to avoid traffic in Batna.',
      b2bTitle: 'Empower Your Business with Nitro.',
      b2bDesc: 'From local restaurants to large-scale retailers, Nitro provides the logistics infrastructure you need to scale.',
      partnerWithUs: 'Partner with Us',
      b2bFeature1: 'Fixed pricing for high-volume partners',
      b2bFeature2: 'Dedicated support for business accounts',
      b2bFeature3: 'Detailed analytics and performance tracking',
      b2bFeature4: 'Priority fleet access during peak hours',
      efficiency: 'Efficiency',
      efficiencyDesc: 'Average efficiency increase for our B2B partners in Batna.',
      readyToTransform: 'Ready to Transform Your Logistics?',
      joinBusinesses: 'Join hundreds of businesses in Batna that trust Nitro for their daily deliveries.',
      footerDesc: 'The ultimate logistics platform for businesses in Batna. Fast, reliable, and smart.',
      platform: 'Platform',
      company: 'Company',
      contact: 'Contact',
      phone: '+213 770 38 88 63',
      email: 'nitrodeliverydz@gmail.com',
      address: 'Batna, Algeria',
      pricing: 'Pricing',
      careers: 'Careers',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      rights: '© 2026 Nitro Platform. All rights reserved.',
      joinAsDriver: 'Join as a Driver',
      driverTitle: 'Become a Nitro Courier',
      driverDesc: 'Earn on your own schedule. Join the fastest growing delivery network in Batna.',
      whatsappJoin: 'Join on WhatsApp',
    },
  },
  fr: {
    login: {
      title: 'Bon retour',
      subtitle: 'Connectez-vous pour gérer vos livraisons à Batna.',
      email: 'Adresse e-mail',
      password: 'Mot de passe',
      submit: 'Connexion',
      heroTitle: 'Accélérez la croissance',
      heroSubtitle: 'de votre entreprise.',
      heroDesc: 'Rejoignez le réseau d\'élite des entreprises optimisant leur logistique avec la technologie primée de Nitro. Exclusivement à Batna.',
      secure: 'Sécurisé',
      fast: 'Rapide',
      requestAccess: 'Demander l\'accès',
      joinNetwork: 'Rejoignez le réseau Nitro à Batna.',
      requestSent: 'Demande envoyée !',
      requestSentDesc: 'Notre équipe examinera votre demande et vous contactera prochainement.',
      businessName: 'Nom de l\'entreprise',
      businessNamePlaceholder: 'Le nom de votre entreprise',
      phoneNumber: 'Numéro de téléphone',
      rememberMe: 'Se souvenir de moi',
      forgotPassword: 'Mot de passe oublié ?',
      submitRequest: 'Envoyer la demande',
      noAccount: 'Vous n\'avez pas de compte ?',
      hasAccount: 'Vous avez déjà un compte ?',
      login: 'Connexion',
    },
    nav: {
      dashboard: 'Tableau de bord',
      create: 'Nouvelle livraison',
      deliveries: 'Livraisons',
      admin: 'Admin',
      profile: 'Profil',
    },
    dashboard: {
      totalDeliveries: 'Total livraisons',
      completed: 'Terminées',
      pending: 'En attente',
      refusalRate: 'Taux de refus',
      adsTitle: 'Nitro Express : Plus rapide que jamais !',
      newDelivery: 'Nouvelle livraison',
      appFee: 'Frais d\'application (20 DA)',
      confirmationFee: 'Frais de confirmation (30 DA)',
      deliveryStats: 'Stats de livraison',
      totalRevenue: 'Revenu total',
      activeBusinesses: 'Entreprises actives',
      pendingDeliveries: 'Livraisons en attente',
      avgDeliveryTime: 'Temps moyen de livraison',
      activeDeliveries: 'Livraisons actives',
      inTransit: 'En transit',
      fleetStatus: 'État de la flotte',
      fleetStatusDesc: 'Forte demande à Batna. Coursiers prioritaires disponibles.',
      week: 'Semaine',
      month: 'Mois',
    },
    create: {
      title: 'Créer une livraison',
      pickup: 'Lieu de ramassage',
      dropoff: 'Lieu de dépôt',
      clientName: 'Nom du client',
      clientPhone: 'Téléphone du client',
      pricing: 'Détails du prix',
      distancePrice: 'Prix basé sur la distance',
      scheduled: 'Livraison programmée',
      priority: 'Priorité',
      weather: 'Mauvais temps',
      callOffice: 'Appeler le bureau',
      total: 'Prix final',
      confirm: 'Confirmer la livraison',
      noDestination: 'Sans destination (+30 DA)',
      selectOnMap: 'Choisir sur la carte',
      myLocation: 'Ma position',
      pickupPlaceholder: 'Adresse de ramassage',
      dropoffPlaceholder: 'Adresse de dépôt',
      noDestPlaceholder: 'Aucune destination requise',
      clientNamePlaceholder: 'Nom du client',
      clientPhonePlaceholder: '0770 00 00 00',
      basePrice: 'Prix de base',
      nightTariff: 'Tarif de nuit',
      adminFixedPrice: 'Prix fixe Admin',
      confirmed: 'Confirmé !',
      selectLocation: 'Choisir le lieu',
      mapPlaceholder: 'Carte interactive de Batna',
      mapInstruction: 'Cliquez sur un point de la carte pour sélectionner l\'adresse',
      packagePrice: 'Valeur du colis (DA)',
      deliveryFee: 'Frais de livraison',
      deliveryFeeUnknown: 'Inconnu',
    },
    list: {
      title: 'Liste des livraisons',
      status: {
        pending: 'En attente',
        confirmed: 'Confirmé',
        done: 'Terminé',
        denied: 'Refusé',
      },
    },
    admin: {
      title: 'Tableau de bord Admin',
      subtitle: 'Aperçu et gestion de la plateforme pour Batna.',
      stats: 'Statistiques plateforme',
      businesses: 'Partenaires',
      management: 'Gestion des livraisons',
      weatherToggle: 'Alerte météo',
      nightTariff: 'Tarifs de nuit (+150 DA)',
      signupRequests: 'Demandes d\'inscription',
      setFixedPrice: 'Définir prix fixe',
      fixedPrice: 'Prix fixe',
      save: 'Enregistrer',
      business: 'Entreprise',
      contact: 'Contact',
      date: 'Date',
      status: 'Statut',
      actions: 'Actions',
      searchBusinesses: 'Rechercher des entreprises...',
      filter: 'Filtrer',
      phone: 'Téléphone',
      saved: 'Enregistré !',
      successFixedPrice: 'Prix fixe enregistré avec succès !',
    },
    profile: {
      title: 'Profil Business',
      subtitle: 'Gérez l\'identité de votre entreprise sur Nitro.',
      businessName: 'Nom de l\'entreprise',
      phone: 'Numéro de téléphone',
      email: 'Adresse email',
      update: 'Mettre à jour',
      changePhoto: 'Changer la photo',
      success: 'Profil mis à jour avec succès !',
    },
    landing: {
      heroTitle: 'Livraison B2B Rapide et Fiable',
      heroSubtitle: 'La plateforme logistique ultime pour votre entreprise. Livrez plus vite, suivez mieux et développez votre portée avec Nitro.',
      heroBatna: 'À Batna.',
      getStarted: 'Commencer',
      login: 'Connexion',
      features: 'Fonctionnalités',
      b2bSolutions: 'Solutions B2B',
      about: 'À propos',
      feature1Title: 'Suivi en Temps Réel',
      feature1Desc: 'Surveillez vos livraisons en temps réel grâce à notre système de suivi GPS avancé.',
      feature2Title: 'Tarification Intelligente',
      feature2Desc: 'Une tarification transparente basée sur la distance avec des options flexibles.',
      feature3Title: 'Analyses Business',
      feature3Desc: 'Obtenez des informations précieuses sur vos performances de livraison.',
      batnaOnly: 'Exclusivement à Batna',
      talkToExpert: 'Parler à un expert',
      watchDemo: 'Voir la démo',
      awardWinning: 'Plateforme primée 2026',
      activePartners: 'Partenaires actifs',
      deliveries: 'Livraisons',
      reliability: 'Fiabilité',
      delivered: 'Livré',
      liveTracking: 'Suivi en direct',
      batnaCenter: 'Centre de Batna',
      demoTitle: 'Découvrez l\'avenir de la logistique.',
      demoSubtitle: 'Démo de la plateforme',
      demoDesc: 'Découvrez comment Nitro transforme vos opérations commerciales avec un suivi en temps réel et des analyses intelligentes.',
      instantDispatch: 'Envoi instantané',
      instantDispatchDesc: 'Les commandes sont attribuées au coursier le plus proche en quelques secondes.',
      liveTrackingTitle: 'Suivi en direct',
      liveTrackingDesc: 'Vos clients voient exactement où se trouve leur colis.',
      smartRouting: 'Routage intelligent',
      smartRoutingDesc: 'Itinéraires optimisés par IA pour éviter le trafic à Batna.',
      b2bTitle: 'Boostez votre entreprise avec Nitro.',
      b2bDesc: 'Des restaurants locaux aux grands détaillants, Nitro fournit l\'infrastructure logistique dont vous avez besoin.',
      partnerWithUs: 'Devenir partenaire',
      b2bFeature1: 'Tarification fixe pour les partenaires à gros volume',
      b2bFeature2: 'Support dédié pour les comptes business',
      b2bFeature3: 'Analyses détaillées et suivi des performances',
      b2bFeature4: 'Accès prioritaire à la flotte pendant les heures de pointe',
      efficiency: 'Efficacité',
      efficiencyDesc: 'Augmentation moyenne de l\'efficacité pour nos partenaires B2B à Batna.',
      readyToTransform: 'Prêt à transformer votre logistique ?',
      joinBusinesses: 'Rejoignez des centaines d\'entreprises à Batna qui font confiance à Nitro.',
      footerDesc: 'La plateforme logistique ultime pour les entreprises à Batna. Rapide, fiable et intelligente.',
      platform: 'Plateforme',
      company: 'Entreprise',
      contact: 'Contact',
      phone: '+213 770 38 88 63',
      email: 'nitrodeliverydz@gmail.com',
      address: 'Batna, Algérie',
      pricing: 'Tarifs',
      careers: 'Carrières',
      privacy: 'Politique de confidentialité',
      terms: 'Conditions d\'utilisation',
      rights: '© 2026 Nitro Platform. Tous droits réservés.',
      joinAsDriver: 'Devenir coursier',
      driverTitle: 'Rejoignez l\'équipe Nitro',
      driverDesc: 'Gagnez de l\'argent selon votre propre emploi du temps. Rejoignez le réseau de livraison à la croissance la plus rapide à Batna.',
      whatsappJoin: 'Rejoindre sur WhatsApp',
    },
  },
  ar: {
    login: {
      title: 'مرحباً بعودتك',
      subtitle: 'سجل الدخول لإدارة توصيلاتك في باتنة.',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      submit: 'تسجيل الدخول',
      heroTitle: 'سرّع نمو',
      heroSubtitle: 'أعمالك.',
      heroDesc: 'انضم إلى شبكة النخبة من الشركات التي تعمل على تحسين خدماتها اللوجستية باستخدام تقنية نيترو الحائزة على جوائز. حصرياً في باتنة.',
      secure: 'آمن',
      fast: 'سريع',
      requestAccess: 'طلب انضمام',
      joinNetwork: 'انضم إلى شبكة نيترو في باتنة.',
      requestSent: 'تم إرسال الطلب!',
      requestSentDesc: 'سيقوم فريقنا بمراجعة طلبك والاتصال بك قريباً.',
      businessName: 'اسم الشركة',
      businessNamePlaceholder: 'اسم شركتك',
      phoneNumber: 'رقم الهاتف',
      rememberMe: 'تذكرني',
      forgotPassword: 'نسيت كلمة المرور؟',
      submitRequest: 'إرسال الطلب',
      noAccount: 'ليس لديك حساب؟',
      hasAccount: 'لديك حساب بالفعل؟',
      login: 'تسجيل الدخول',
    },
    nav: {
      dashboard: 'لوحة التحكم',
      create: 'طلب جديد',
      deliveries: 'الطلبات',
      admin: 'الأدمن',
      profile: 'الملف الشخصي',
    },
    dashboard: {
      totalDeliveries: 'إجمالي الطلبات',
      completed: 'المكتملة',
      pending: 'قيد الانتظار',
      refusalRate: 'معدل الرفض',
      adsTitle: 'نيترو إكسبريس: أسرع من أي وقت مضى!',
      newDelivery: 'طلب جديد',
      appFee: 'رسوم التطبيق (20 دج)',
      confirmationFee: 'رسوم التأكيد (30 دج)',
      deliveryStats: 'إحصائيات التوصيل',
      totalRevenue: 'إجمالي الإيرادات',
      activeBusinesses: 'الشركات النشطة',
      pendingDeliveries: 'طلبات قيد الانتظار',
      avgDeliveryTime: 'متوسط وقت التوصيل',
      activeDeliveries: 'الطلبات النشطة',
      inTransit: 'في الطريق',
      fleetStatus: 'حالة الأسطول',
      fleetStatusDesc: 'طلب مرتفع في باتنة. المندوبون ذوو الأولوية متاحون.',
      week: 'أسبوع',
      month: 'شهر',
    },
    create: {
      title: 'إنشاء طلب توصيل',
      pickup: 'موقع الاستلام',
      dropoff: 'موقع التسليم',
      clientName: 'اسم العميل',
      clientPhone: 'رقم الهاتف',
      pricing: 'تفاصيل السعر',
      distancePrice: 'السعر حسب المسافة',
      scheduled: 'توصيل مجدول',
      priority: 'أولوية',
      weather: 'طقس سيء',
      callOffice: 'اتصال بالمكتب',
      total: 'السعر النهائي',
      confirm: 'تأكيد الطلب',
      noDestination: 'بدون وجهة (+30 دج)',
      selectOnMap: 'اختر من الخريطة',
      myLocation: 'موقعي',
      pickupPlaceholder: 'عنوان الاستلام',
      dropoffPlaceholder: 'عنوان التسليم',
      noDestPlaceholder: 'لا توجد وجهة مطلوبة',
      clientNamePlaceholder: 'اسم العميل',
      clientPhonePlaceholder: '0770 00 00 00',
      basePrice: 'السعر الأساسي',
      nightTariff: 'تعريفة ليلية',
      adminFixedPrice: 'سعر ثابت من الأدمن',
      confirmed: 'تم التأكيد!',
      selectLocation: 'اختر الموقع',
      mapPlaceholder: 'خريطة تفاعلية لباتنة',
      mapInstruction: 'انقر على نقطة في الخريطة لاختيار العنوان',
      packagePrice: 'قيمة الطرد (دج)',
      deliveryFee: 'أجرة التوصيل',
      deliveryFeeUnknown: 'غير معروف',
    },
    list: {
      title: 'قائمة الطلبات',
      status: {
        pending: 'قيد الانتظار',
        confirmed: 'مؤكد',
        done: 'تم التسليم',
        denied: 'مرفوض',
      },
    },
    admin: {
      title: 'لوحة تحكم الأدمن',
      subtitle: 'نظرة عامة على المنصة وإدارتها في باتنة.',
      stats: 'إحصائيات المنصة',
      businesses: 'شركاء العمل',
      management: 'إدارة الطلبات',
      weatherToggle: 'تنبيه الطقس',
      nightTariff: 'تعريفة ليلية (+150 دج)',
      signupRequests: 'طلبات الانضمام',
      setFixedPrice: 'تحديد سعر ثابت',
      fixedPrice: 'سعر ثابت',
      save: 'حفظ',
      business: 'الشركة',
      contact: 'الاتصال',
      date: 'التاريخ',
      status: 'الحالة',
      actions: 'إجراءات',
      searchBusinesses: 'البحث عن الشركات...',
      filter: 'تصفية',
      phone: 'الهاتف',
      saved: 'تم الحفظ!',
      successFixedPrice: 'تم حفظ السعر الثابت بنجاح!',
    },
    profile: {
      title: 'ملف الشركة',
      subtitle: 'إدارة هوية شركتك على نيترو.',
      businessName: 'اسم الشركة',
      phone: 'رقم الهاتف',
      email: 'البريد الإلكتروني',
      update: 'تحديث الملف',
      changePhoto: 'تغيير الصورة',
      success: 'تم تحديث الملف بنجاح!',
    },
    landing: {
      heroTitle: 'توصيل B2B سريع وموثوق',
      heroSubtitle: 'المنصة اللوجستية الأمثل لعملك. قدم خدماتك بشكل أسرع، تتبع بشكل أفضل، ووسع نطاق وصولك مع نيترو.',
      heroBatna: 'في باتنة.',
      getStarted: 'ابدأ الآن',
      login: 'تسجيل الدخول',
      features: 'المميزات',
      b2bSolutions: 'حلول B2B',
      about: 'حول',
      feature1Title: 'تتبع في الوقت الفعلي',
      feature1Desc: 'راقب شحناتك في الوقت الفعلي من خلال نظام تتبع GPS المتقدم لدينا.',
      feature2Title: 'تسعير ذكي',
      feature2Desc: 'تسعير شفاف يعتمد على المسافة مع إضافات مرنة لكل الاحتياجات.',
      feature3Title: 'تحليلات الأعمال',
      feature3Desc: 'احصل على رؤى قيمة حول أداء التوصيل الخاص بك من خلال تقارير مفصلة.',
      batnaOnly: 'حصرياً في باتنة',
      talkToExpert: 'تحدث مع خبير',
      watchDemo: 'مشاهدة العرض',
      awardWinning: 'المنصة الحائزة على جوائز 2026',
      activePartners: 'شركاء نشطون',
      deliveries: 'عمليات توصيل',
      reliability: 'الموثوقية',
      delivered: 'تم التوصيل',
      liveTracking: 'تتبع مباشر',
      batnaCenter: 'وسط باتنة',
      demoTitle: 'اختبر مستقبل الخدمات اللوجستية.',
      demoSubtitle: 'عرض حي للمنصة',
      demoDesc: 'شاهد كيف يحول نيترو عمليات عملك من خلال التتبع في الوقت الفعلي والإرسال الآلي والتحليلات الذكية.',
      instantDispatch: 'إرسال فوري',
      instantDispatchDesc: 'يتم تعيين الطلبات لأقرب مندوب في ثوانٍ.',
      liveTrackingTitle: 'تتبع مباشر',
      liveTrackingDesc: 'يرى عملاؤك بالضبط أين توجد طرودهم.',
      smartRouting: 'توجيه ذكي',
      smartRoutingDesc: 'مسارات مدعومة بالذكاء الاصطناعي لتجنب الازدحام في باتنة.',
      b2bTitle: 'قم بتمكين عملك مع نيترو.',
      b2bDesc: 'من المطاعم المحلية إلى تجار التجزئة الكبار، يوفر نيترو البنية التحتية اللوجستية التي تحتاجها للتوسع.',
      partnerWithUs: 'شريك معنا',
      b2bFeature1: 'تسعير ثابت للشركاء ذوي الحجم الكبير',
      b2bFeature2: 'دعم مخصص لحسابات الأعمال',
      b2bFeature3: 'تحليلات مفصلة وتتبع الأداء',
      b2bFeature4: 'أولوية الوصول إلى الأسطول خلال ساعات الذروة',
      efficiency: 'الكفاءة',
      efficiencyDesc: 'متوسط زيادة الكفاءة لشركائنا B2B في باتنة.',
      readyToTransform: 'جاهز لتحويل خدماتك اللوجستية؟',
      joinBusinesses: 'انضم إلى مئات الشركات في باتنة التي تثق في نيترو لتوصيلاتها اليومية.',
      footerDesc: 'المنصة اللوجستية النهائية للشركات في باتنة. سريعة وموثوقة وذكية.',
      platform: 'المنصة',
      company: 'الشركة',
      contact: 'اتصال',
      phone: '+213 770 38 88 63',
      email: 'nitrodeliverydz@gmail.com',
      address: 'باتنة، الجزائر',
      pricing: 'الأسعار',
      careers: 'وظائف',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الخدمة',
      rights: '© 2026 منصة نيترو. جميع الحقوق محفوظة.',
      joinAsDriver: 'انضم كمندوب',
      driverTitle: 'كن مندوباً في نيترو',
      driverDesc: 'اربح وفقاً لجدولك الخاص. انضم إلى أسرع شبكة توصيل نمواً في باتنة.',
      whatsappJoin: 'انضم عبر واتساب',
    },
  },
};
