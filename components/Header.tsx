import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, Page } from '../types';

interface SiteHeaderProps {
    currentPage: Page;
    setPage: (page: Page) => void;
    isAuthenticated: boolean;
    onLoginClick: () => void;
    onLogoutClick: () => void;
    onSearchClick: () => void;
}

const SiteHeader: React.FC<SiteHeaderProps> = ({ currentPage, setPage, isAuthenticated, onLoginClick, onLogoutClick, onSearchClick }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [isLearnMenuOpen, setIsLearnMenuOpen] = useState(false);
  const [isBusinessMenuOpen, setIsBusinessMenuOpen] = useState(false);
  const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const langMenuRef = useRef<HTMLDivElement>(null);
  const servicesMenuRef = useRef<HTMLDivElement>(null);
  const learnMenuRef = useRef<HTMLDivElement>(null);
  const businessMenuRef = useRef<HTMLDivElement>(null);
  const aboutMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) setIsLangMenuOpen(false);
      if (servicesMenuRef.current && !servicesMenuRef.current.contains(event.target as Node)) setIsServicesMenuOpen(false);
      if (learnMenuRef.current && !learnMenuRef.current.contains(event.target as Node)) setIsLearnMenuOpen(false);
      if (businessMenuRef.current && !businessMenuRef.current.contains(event.target as Node)) setIsBusinessMenuOpen(false);
      if (aboutMenuRef.current && !aboutMenuRef.current.contains(event.target as Node)) setIsAboutMenuOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) setIsUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handlePageChange = (page: Page) => {
      setPage(page);
      setIsMobileMenuOpen(false);
      setIsServicesMenuOpen(false);
      setIsLearnMenuOpen(false);
      setIsBusinessMenuOpen(false);
      setIsAboutMenuOpen(false);
      setIsUserMenuOpen(false);
      window.scrollTo(0, 0);
  }
  
  const servicesLinks = [
      { key: 'skin_consultation', text: t('header.skinConsultation'), action: () => handlePageChange('skin_consultation') },
      { key: 'fitness_assessment', text: t('header.fitnessAssessment'), action: () => handlePageChange('fitness_assessment') },
      { key: 'posture_analysis', text: t('header.postureAnalysis'), action: () => handlePageChange('posture_analysis') },
      { key: 'cosmetic_simulator', text: t('header.cosmeticSimulator'), action: () => handlePageChange('cosmetic_simulator') },
      { key: 'physique_simulator', text: t('header.physiqueSimulator'), action: () => handlePageChange('physique_simulator') },
  ];

  const learnLinks = [
      { key: 'location_finder', text: t('header.locationFinder'), action: () => handlePageChange('location_finder') },
      { key: 'our_experts', text: t('header.ourExperts'), action: () => handlePageChange('our_experts') },
      { key: 'ai_consultant', text: t('header.aiCoach'), action: () => handlePageChange('ai_consultant') },
  ];

  const businessLinks = [
      { key: 'market_trends', text: t('header.marketTrends'), action: () => handlePageChange('market_trends') },
      { key: 'trend_hub', text: t('header.trendHub'), action: () => handlePageChange('trend_hub') },
      { key: 'content_creator', text: t('header.contentCreator'), action: () => handlePageChange('content_creator') },
      { key: 'seller_hub', text: t('header.sellerHub'), action: () => handlePageChange('seller_hub') },
      { key: 'barista_styler', text: t('header.baristaStyler'), action: () => handlePageChange('barista_styler') },
      { key: 'analytics', text: t('header.siteAnalytics'), action: () => handlePageChange('analytics') },
  ];

  const aboutLinks = [
      { key: 'collaboration', text: t('header.collaboration'), action: () => handlePageChange('collaboration') },
      { key: 'join_us', text: t('header.joinUs'), action: () => handlePageChange('join_us') },
  ];

  const accountLinks = [
      { key: 'my_consultations', text: t('header.myPlans'), action: () => handlePageChange('my_consultations') },
      { key: 'download_app', text: t('header.downloadApp'), action: () => handlePageChange('download_app') },
  ];

  const iconMap: Record<string, string> = {
    home: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    skin_consultation: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    fitness_assessment: "M13 10V3L4 14h7v7l9-11h-7z",
    posture_analysis: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m8-10a4 4 0 100-8 4 4 0 000 8z",
    cosmetic_simulator: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    physique_simulator: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    location_finder: "M17.657 16.828L12 21.5l-5.657-4.672a4 4 0 115.657-5.656 4 4 0 015.656 5.656z M12 13a1 1 0 100-2 1 1 0 000 2z",
    ai_consultant: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    market_trends: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    trend_hub: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1.131l-.293-.293a.998.998 0 00-1.414 0l-.293.293V6m0-1.131l.293-.293a.998.998 0 011.414 0l.293.293V6M3 12c0-1.657.895-3 2-3s2 1.343 2 3-1.343 2-2 2-2-1.343-2-2zM3 12c0-1.11.402-2.08 1-2.599M3 12v1m0-1v-.01M3 13v-1.131l-.293-.293a.998.998 0 00-1.414 0l-.293.293V13m0-1.131l.293-.293a.998.998 0 011.414 0l.293.293V13m0 0v-1.131l.293-.293a.998.998 0 001.414 0l.293.293V13 M12 3c0-1.657-.895-3-2-3s-2 1.343-2 3 1.343 2 2 2 2-1.343 2-2zM12 3c0-1.11-.402-2.08-1-2.599M12 3v1m0-1v-.01M12 2v-1.131l-.293-.293a.998.998 0 00-1.414 0l-.293.293V2m0-1.131l.293-.293a.998.998 0 011.414 0l.293.293V2m0 0v-1.131l.293-.293a.998.998 0 001.414 0l.293.293V2 M21 12c0-1.657-.895-3-2-3s-2 1.343-2 3 1.343 2 2 2 2-1.343 2-2zM21 12c0-1.11-.402-2.08-1-2.599M21 12v1m0-1v-.01M21 13v-1.131l-.293-.293a.998.998 0 00-1.414 0l-.293.293V13m0-1.131l.293-.293a.998.998 0 011.414 0l.293.293V13 M12 21c0-1.657-.895-3-2-3s-2 1.343-2 3 1.343 2 2 2 2-1.343 2-2zM12 21c0-1.11-.402-2.08-1-2.599M12 21v1m0-1v-.01M12 22v-1.131l-.293-.293a.998.998 0 00-1.414 0l-.293.293V22m0-1.131l.293-.293a.998.998 0 011.414 0l.293.293V22",
    content_creator: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    our_experts: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    collaboration: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    join_us: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
    seller_hub: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
    barista_styler: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1.131l-.293-.293a.998.998 0 00-1.414 0l-.293.293V6m0-1.131l.293-.293a.998.998 0 011.414 0l.293.293V6M3 12c0-1.657.895-3 2-3s2 1.343 2 3-1.343 2-2 2-2-1.343-2-2zM3 12c0-1.11.402-2.08 1-2.599M3 12v1m0-1v-.01M3 13v-1.131l-.293-.293a.998.998 0 00-1.414 0l-.293.293V13m0-1.131l.293-.293a.998.998 0 011.414 0l.293.293V13m0 0v-1.131l.293-.293a.998.998 0 001.414 0l.293.293V13 M12 3c0-1.657-.895-3-2-3s-2 1.343-2 3 1.343 2 2 2 2-1.343 2-2zM12 3c0-1.11-.402-2.08-1-2.599M12 3v1m0-1v-.01M12 2v-1.131l-.293-.293a.998.998 0 00-1.414 0l-.293.293V2m0-1.131l.293-.293a.998.998 0 011.414 0l.293.293V2m0 0v-1.131l.293-.293a.998.998 0 001.414 0l.293.293V2 M21 12c0-1.657-.895-3-2-3s-2 1.343-2 3 1.343 2 2 2 2-1.343 2-2zM21 12c0-1.11-.402-2.08-1-2.599M21 12v1m0-1v-.01M21 13v-1.131l-.293-.293a.998.998 0 00-1.414 0l-.293.293V13m0-1.131l.293-.293a.998.998 0 011.414 0l.293.293V13 M12 21c0-1.657-.895-3-2-3s-2 1.343-2 3 1.343 2 2 2 2-1.343 2-2zM12 21c0-1.11-.402-2.08-1-2.599M12 21v1m0-1v-.01M12 22v-1.131l-.293-.293a.998.998 0 00-1.414 0l-.293.293V22m0-1.131l.293-.293a.998.998 0 011.414 0l.293.293V22",
    my_consultations: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z",
    user_profile: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    download_app: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
    analytics: "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    login: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1",
    logout: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
  };

  const Icon: React.FC<{ path: string }> = ({ path }) => (
    <svg className="h-5 w-5 mr-4 rtl:ml-4 rtl:mr-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );

  const Dropdown: React.FC<{ title: string, links: typeof servicesLinks, isOpen: boolean, setIsOpen: (val: boolean) => void, menuRef: React.RefObject<HTMLDivElement> }> = ({ title, links, isOpen, setIsOpen, menuRef }) => {
    const isActive = links.some(l => l.key === currentPage);
    return (
      <div className="relative" ref={menuRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transform transition-all duration-200 hover:-translate-y-0.5 ${isActive ? 'text-teal-300' : ''}`}
        >
          {title}
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
        {isOpen && (
            <div className="absolute left-0 mt-2 w-56 origin-top-left rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10 animate-fade-in">
                <div className="p-1">
                    {links.map(link => (
                        <button key={link.key} onClick={link.action} className={`w-full text-left block px-4 py-2 text-sm rounded-md transition-colors ${currentPage === link.key ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                            {link.text}
                        </button>
                    ))}
                </div>
            </div>
        )}
      </div>
    );
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <button onClick={() => setPage('home')} className="flex-shrink-0 flex items-center space-x-2 rtl:space-x-reverse transform transition-transform hover:scale-105">
               <svg className="h-8 w-8 text-teal-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                 <path d="M10 3.5a1.5 1.5 0 011.396 2.21l-4.133 7.032a1.5 1.5 0 01-2.592-1.525L8.604 5.71A1.5 1.5 0 0110 3.5zM10 3.5a1.5 1.5 0 00-1.396 2.21l4.133 7.032a1.5 1.5 0 002.592-1.525L11.396 5.71A1.5 1.5 0 0010 3.5z" />
               </svg>
              <span className="font-bold text-xl text-white">AURA AI</span>
            </button>
            <nav className="hidden md:flex md:ml-10 md:space-x-1 lg:space-x-2 items-center">
              <button onClick={() => handlePageChange('home')} className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transform transition-all duration-200 hover:-translate-y-0.5 ${currentPage === 'home' ? 'text-teal-300' : ''}`}>
                {t('header.home')}
              </button>
              <Dropdown title={t('header.aiServices')} links={servicesLinks} isOpen={isServicesMenuOpen} setIsOpen={setIsServicesMenuOpen} menuRef={servicesMenuRef} />
              <Dropdown title={t('header.findAndLearn')} links={learnLinks} isOpen={isLearnMenuOpen} setIsOpen={setIsLearnMenuOpen} menuRef={learnMenuRef} />
              <Dropdown title={t('header.forBusiness')} links={businessLinks} isOpen={isBusinessMenuOpen} setIsOpen={setIsBusinessMenuOpen} menuRef={businessMenuRef} />
              <Dropdown title={t('header.aboutUs')} links={aboutLinks} isOpen={isAboutMenuOpen} setIsOpen={setIsAboutMenuOpen} menuRef={aboutMenuRef} />
              {accountLinks.map(link => (
                  <button key={link.key} onClick={link.action} className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transform transition-all duration-200 hover:-translate-y-0.5 ${currentPage === link.key ? 'text-teal-300' : ''}`}>
                    {link.text}
                  </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            <button onClick={onSearchClick} className="flex items-center text-gray-300 hover:text-white transform transition-transform hover:scale-110" aria-label="Search">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <div className="relative" ref={langMenuRef}>
                <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="flex items-center text-gray-300 hover:text-white transform transition-transform hover:scale-110" aria-label="Change language">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m4 13l4-4M19 9l-4 4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
                {isLangMenuOpen && (
                    <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="language-menu">
                        <div className="p-1" role="none">
                            <button 
                                onClick={() => { setLanguage('en'); setIsLangMenuOpen(false); }} 
                                className={`w-full text-left block px-4 py-2 text-sm rounded-md transition-colors ${language === 'en' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                                role="menuitem"
                            >
                                English
                            </button>
                            <button 
                                onClick={() => { setLanguage('fa'); setIsLangMenuOpen(false); }} 
                                className={`w-full text-left block px-4 py-2 text-sm rounded-md transition-colors ${language === 'fa' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                                role="menuitem"
                            >
                                فارسی (Persian)
                            </button>
                            <button 
                                onClick={() => { setLanguage('ar'); setIsLangMenuOpen(false); }} 
                                className={`w-full text-left block px-4 py-2 text-sm rounded-md transition-colors ${language === 'ar' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                                role="menuitem"
                            >
                                العربية (Arabic)
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="hidden sm:block">
                {isAuthenticated ? (
                    <div className="relative" ref={userMenuRef}>
                        <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none ring-2 ring-offset-2 ring-offset-gray-900 ring-teal-500">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </button>
                        {isUserMenuOpen && (
                             <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10 animate-fade-in">
                                <div className="p-1">
                                    <button onClick={() => handlePageChange('user_profile')} className="w-full text-left block px-4 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">{t('header.myProfile')}</button>
                                    <button onClick={() => handlePageChange('my_consultations')} className="w-full text-left block px-4 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">{t('header.myPlans')}</button>
                                    <div className="border-t border-gray-700 my-1"></div>
                                    <button onClick={() => { onLogoutClick(); setIsUserMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-sm rounded-md text-red-400 hover:bg-red-500/20 hover:text-red-300">{t('header.logout')}</button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <button onClick={onLoginClick} className="px-4 py-2 bg-gray-700/50 border border-gray-500 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors text-sm">
                        {t('header.login')}
                    </button>
                )}
            </div>

            <div className="flex md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-gray-900/95 backdrop-blur-sm overflow-hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'max-h-[85vh] shadow-2xl border-t border-white/10' : 'max-h-0'}`}>
        <div className="p-4 space-y-1 overflow-y-auto max-h-[85vh]">
             <button onClick={() => handlePageChange('home')} className={`w-full text-left flex items-center px-4 py-3 rounded-md text-base font-medium ${currentPage === 'home' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                <Icon path={iconMap['home']} /> {t('header.home')}
            </button>
            
            <div className="pt-2 border-t border-gray-700 mt-2">
                <h3 className="px-4 py-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">{t('header.aiServices')}</h3>
                <div className="space-y-1">
                    {servicesLinks.map(link => (
                        <button key={link.key} onClick={link.action} className={`w-full text-left flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-3 rounded-md text-base font-medium ${currentPage === link.key ? 'bg-teal-600/80 text-white' : ''}`}>
                            <Icon path={iconMap[link.key]} /> {link.text}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="pt-2 border-t border-gray-700 mt-2">
              <h3 className="px-4 py-2 mt-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">{t('header.findAndLearn')}</h3>
              <div className="space-y-1">
                {learnLinks.map(link => (
                    <button key={link.key} onClick={link.action} className={`w-full text-left flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-3 rounded-md text-base font-medium ${currentPage === link.key ? 'bg-teal-600/80 text-white' : ''}`}>
                        <Icon path={iconMap[link.key]} /> {link.text}
                    </button>
                ))}
              </div>
            </div>
            
             <div className="pt-2 border-t border-gray-700 mt-2">
              <h3 className="px-4 py-2 mt-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">{t('header.forBusiness')}</h3>
              <div className="space-y-1">
                {businessLinks.map(link => (
                    <button key={link.key} onClick={link.action} className={`w-full text-left flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-3 rounded-md text-base font-medium ${currentPage === link.key ? 'bg-teal-600/80 text-white' : ''}`}>
                         <Icon path={iconMap[link.key]} /> {link.text}
                    </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-700 mt-2">
              <h3 className="px-4 py-2 mt-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">{t('header.aboutUs')}</h3>
              <div className="space-y-1">
                {aboutLinks.map(link => (
                    <button key={link.key} onClick={link.action} className={`w-full text-left flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-3 rounded-md text-base font-medium ${currentPage === link.key ? 'bg-teal-600/80 text-white' : ''}`}>
                         <Icon path={iconMap[link.key]} /> {link.text}
                    </button>
                ))}
              </div>
            </div>

             <div className="pt-2 border-t border-gray-700 mt-2">
              <h3 className="px-4 py-2 mt-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">Account & App</h3>
              <div className="space-y-1">
                {accountLinks.map(link => (
                    <button key={link.key} onClick={link.action} className={`w-full text-left flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-3 rounded-md text-base font-medium ${currentPage === link.key ? 'bg-teal-600/80 text-white' : ''}`}>
                         <Icon path={iconMap[link.key]} /> {link.text}
                    </button>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-gray-700">
                {isAuthenticated ? (
                  <>
                    <button onClick={() => handlePageChange('user_profile')} className="w-full text-left flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-3 rounded-md text-base font-medium">
                        <Icon path={iconMap['user_profile']} /> {t('header.myProfile')}
                    </button>
                    <button onClick={() => { onLogoutClick(); setIsMobileMenuOpen(false); }} className="w-full text-left flex items-center text-red-400 hover:bg-red-500/20 hover:text-red-300 px-4 py-3 rounded-md text-base font-medium">
                        <Icon path={iconMap['logout']} /> {t('header.logout')}
                    </button>
                  </>
                ) : (
                    <button onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }} className="w-full text-left flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-3 rounded-md text-base font-medium">
                        <Icon path={iconMap['login']} /> {t('header.login')}
                    </button>
                )}
            </div>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;