import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Auth Pages
    login: {
      title: 'Welcome Back',
      subtitle: 'Sign in to your account to continue',
      email: 'Email Address',
      password: 'Password',
      signIn: 'Sign In',
      noAccount: 'New to FarmLink?',
      createAccount: 'Create an Account',
      signingIn: 'Signing in...',
    },
    register: {
      title: 'Create Account',
      subtitle: 'Join our community today',
      fullName: 'Full Name',
      email: 'Email Address',
      password: 'Password',
      phone: 'Phone Number',
      address: 'Address',
      consumer: 'Consumer - Buy Products',
      farmer: 'Farmer - Sell Products',
      createBtn: 'Create Account',
      haveAccount: 'Already have an account?',
      signIn: 'Sign In',
      creatingAccount: 'Creating Account...',
    },
    // Products Pages
    products: {
      title: 'Fresh Products',
      subtitle: 'Browse our selection of fresh produce from local farmers',
      search: 'Search products...',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      addToCart: 'Add to Cart',
      quantity: 'Quantity',
      showing: 'Showing',
      products: 'product',
      noProducts: 'No products found',
      loadMore: 'Load More Products',
      loading: 'Loading...',
    },
    // Navigation
    nav: {
      products: 'Products',
      cart: 'Cart',
      orders: 'Orders',
      dashboard: 'Dashboard',
      myProducts: 'My Products',
      addProduct: 'Add Product',
      language: 'Language',
      login: 'Login',
      signup: 'Sign Up',
      logout: 'Logout',
    },
    // Cart
    cart: {
      title: 'Shopping Cart',
      subtitle: 'Review your items before checkout',
      empty: 'Your cart is empty',
      total: 'Total',
      checkout: 'Proceed to Checkout',
      remove: 'Remove',
      quantity: 'Quantity',
    },
    // Checkout
    checkout: {
      title: 'Checkout',
      subtitle: 'Review your order and provide delivery information',
      deliveryAddress: 'Delivery Address',
      notes: 'Additional Notes (optional)',
      paymentMethod: 'Payment Method',
      cod: 'Cash on Delivery',
      placeOrder: 'Place Order',
      placingOrder: 'Placing Order...',
    },
    // Orders
    orders: {
      title: 'My Orders',
      subtitle: 'View your order history and track deliveries',
      noOrders: 'No orders found',
      orderDetails: 'Order Details',
      orderDate: 'Order Date',
      total: 'Total',
      status: 'Status',
    },
    // Farmer Dashboard
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Manage your products and track orders',
      totalProducts: 'Total Products',
      totalOrders: 'Total Orders',
      totalRevenue: 'Total Revenue',
      recentOrders: 'Recent Orders',
    },
    // Farmer Products
    farmerProducts: {
      title: 'My Products',
      subtitle: 'Manage your product listings',
      addProduct: 'Add New Product',
      edit: 'Edit',
      delete: 'Delete',
      noProducts: 'No products found',
    },
    // Add Product
    addProduct: {
      title: 'Add New Product',
      subtitle: 'Fill in the details to add a new product',
      name: 'Product Name',
      description: 'Description',
      price: 'Price',
      quantity: 'Quantity',
      category: 'Category',
      image: 'Product Image URL',
      addBtn: 'Add Product',
      adding: 'Adding Product...',
      success: 'Product added successfully!',
    },
    // Edit Product
    editProduct: {
      title: 'Edit Product',
      subtitle: 'Update your product details',
      updateBtn: 'Update Product',
      updating: 'Updating Product...',
      success: 'Product updated successfully!',
    },
    // Farmer Orders
    farmerOrders: {
      title: 'Orders',
      subtitle: 'View and manage orders for your products',
      noOrders: 'No orders found',
      markAsDelivered: 'Mark as Delivered',
    },
  },
  np: {
    // Auth Pages
    login: {
      title: 'स्वागत छ',
      subtitle: 'तपाईंको खातामा साइन इन गर्नुहोस्',
      email: 'ईमेल',
      password: 'पासवर्ड',
      signIn: 'साइन इन गर्नुहोस्',
      noAccount: 'FarmLink मा नयाँ हुनुहुन्छ?',
      createAccount: 'खाता बनाउनुहोस्',
      signingIn: 'साइन इन हुँदै...',
    },
    register: {
      title: 'खाता बनाउनुहोस्',
      subtitle: 'आज हाम्रो समुदायमा जोडिनुहोस्',
      fullName: 'पूरा नाम',
      email: 'ईमेल',
      password: 'पासवर्ड',
      phone: 'फोन नम्बर',
      address: 'ठेगाना',
      consumer: 'उपभोक्ता - उत्पाद किनिनुहोस्',
      farmer: 'किसान - उत्पाद बेच्नुहोस्',
      createBtn: 'खाता बनाउनुहोस्',
      haveAccount: 'पहिले नै खाता छ?',
      signIn: 'साइन इन गर्नुहोस्',
      creatingAccount: 'खाता बनाउँदै...',
    },
    // Products Pages
    products: {
      title: 'ताजा उत्पादहरु',
      subtitle: 'स्थानीय किसानहरुबाट ताजा उपज ब्राउज गर्नुहोस्',
      search: 'उत्पादहरु खोज्नुहोस्...',
      inStock: 'स्टकमा छ',
      outOfStock: 'स्टकबाहिर',
      addToCart: 'कार्टमा थप्नुहोस्',
      quantity: 'मात्रा',
      showing: 'देखाइँदै',
      products: 'उत्पाद',
      noProducts: 'उत्पादहरु फेला परेन',
      loadMore: 'थप उत्पादहरु लोड गर्नुहोस्',
      loading: 'लोड हुँदै...',
    },
    // Navigation
    nav: {
      products: 'उत्पादहरु',
      cart: 'कार्ट',
      orders: 'अर्डरहरु',
      dashboard: 'ड्यासबोर्ड',
      myProducts: 'मेरा उत्पादहरु',
      addProduct: 'उत्पाद थप्नुहोस्',
      language: 'भाषा',
      login: 'लगइन',
      signup: 'साइन अप',
      logout: 'लगआउट',
    },
    // Cart
    cart: {
      title: 'शपिङ कार्ट',
      subtitle: 'चेकआउट अघि तपाईंको वस्तुहरू समीक्षा गर्नुहोस्',
      empty: 'तपाईंको कार्ट खाली छ',
      total: 'कुल',
      checkout: 'चेकआउटमा जानुहोस्',
      remove: 'हटाउनुहोस्',
      quantity: 'मात्रा',
    },
    // Checkout
    checkout: {
      title: 'चेकआउट',
      subtitle: 'तपाईंको अर्डर समीक्षा गर्नुहोस् र डिलिभरी जानकारी प्रदान गर्नुहोस्',
      deliveryAddress: 'डिलिभरी ठेगाना',
      notes: 'थप नोट्स (वैकल्पिक)',
      paymentMethod: 'भुक्तानी विधि',
      cod: 'नगद भुक्तानी',
      placeOrder: 'अर्डर राख्नुहोस्',
      placingOrder: 'अर्डर राख्दै...',
    },
    // Orders
    orders: {
      title: 'मेरा अर्डरहरु',
      subtitle: 'तपाईंको अर्डर इतिहास हेर्नुहोस् र डिलिभरी ट्र्याक गर्नुहोस्',
      noOrders: 'अर्डरहरु फेला परेन',
      orderDetails: 'अर्डर विवरण',
      orderDate: 'अर्डर मिति',
      total: 'कुल',
      status: 'स्थिति',
    },
    // Farmer Dashboard
    dashboard: {
      title: 'ड्यासबोर्ड',
      subtitle: 'तपाईंका उत्पादहरू व्यवस्थापन गर्नुहोस् र अर्डरहरू ट्र्याक गर्नुहोस्',
      totalProducts: 'कुल उत्पादहरू',
      totalOrders: 'कुल अर्डरहरू',
      totalRevenue: 'कुल राजस्व',
      recentOrders: 'हालका अर्डरहरू',
    },
    // Farmer Products
    farmerProducts: {
      title: 'मेरा उत्पादहरु',
      subtitle: 'तपाईंको उत्पाद सूची व्यवस्थापन गर्नुहोस्',
      addProduct: 'नयाँ उत्पाद थप्नुहोस्',
      edit: 'सम्पादन गर्नुहोस्',
      delete: 'मेटाउनुहोस्',
      noProducts: 'उत्पादहरु फेला परेन',
    },
    // Add Product
    addProduct: {
      title: 'नयाँ उत्पाद थप्नुहोस्',
      subtitle: 'नयाँ उत्पाद थप्न विवरण भर्नुहोस्',
      name: 'उत्पादको नाम',
      description: 'विवरण',
      price: 'मूल्य',
      quantity: 'मात्रा',
      category: 'श्रेणी',
      image: 'उत्पाद चित्र URL',
      addBtn: 'उत्पाद थप्नुहोस्',
      adding: 'उत्पाद थप्दै...',
      success: 'उत्पाद सफलतापूर्वक थपियो!',
    },
    // Edit Product
    editProduct: {
      title: 'उत्पाद सम्पादन गर्नुहोस्',
      subtitle: 'तपाईंको उत्पाद विवरण अपडेट गर्नुहोस्',
      updateBtn: 'उत्पाद अपडेट गर्नुहोस्',
      updating: 'उत्पाद अपडेट गर्दै...',
      success: 'उत्पाद सफलतापूर्वक अपडेट गरियो!',
    },
    // Farmer Orders
    farmerOrders: {
      title: 'अर्डरहरु',
      subtitle: 'तपाईंका उत्पादहरूका अर्डरहरू हेर्नुहोस् र व्यवस्थापन गर्नुहोस्',
      noOrders: 'अर्डरहरु फेला परेन',
      markAsDelivered: 'डिलिभर गरिएको रूपमा चिन्ह लगाउनुहोस्',
    },
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('selectedLanguage') || 'en';
  });

  const t = (path) => {
    const keys = path.split('.');
    let value = translations[language];
    
    for (const key of keys) {
      value = value?.[key];
    }
    
    return value || path;
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
