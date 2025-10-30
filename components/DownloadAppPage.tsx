
import React from 'react';
import { useLanguage } from '../types';
import AppStoreIcon from './AppStoreIcon';
import GooglePlayIcon from './GooglePlayIcon';
import QrCodeIcon from './QrCodeIcon';

const DownloadAppPage: React.FC = () => {
    const { t } = useLanguage();

    const DownloadButton: React.FC<{ href: string; icon: React.ReactNode; text: string; subtext: string; }> = ({ href, icon, text, subtext }) => (
        <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-gray-800/50 border border-white/10 p-4 rounded-lg hover:bg-gray-700 transition-colors transform hover:-translate-y-1 duration-300">
            <div className="text-4xl text-white">{icon}</div>
            <div>
                <p className="text-xs text-gray-400">{subtext}</p>
                <p className="font-semibold text-white">{text}</p>
            </div>
        </a>
    );

    return (
        <section className="py-16 sm:py-24 animate-fade-in">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                        {t('downloadAppPage.title')}
                    </h1>
                    <p className="mt-4 text-lg text-gray-300">
                        {t('downloadAppPage.subtitle')}
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative flex justify-center">
                        <div className="absolute w-60 h-60 bg-teal-500/20 rounded-full blur-3xl"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1200&auto=format&fit=crop"
                            alt="App preview on phone"
                            className="relative w-full max-w-sm rounded-[2.5rem] border-8 border-gray-700 shadow-2xl"
                        />
                    </div>
                    
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <DownloadButton 
                                href="#" 
                                icon={<AppStoreIcon />}
                                subtext={t('downloadAppPage.appStore')}
                                text="App Store"
                            />
                             <DownloadButton 
                                href="#" 
                                icon={<GooglePlayIcon />}
                                subtext={t('downloadAppPage.googlePlay')}
                                text="Google Play"
                            />
                        </div>
                        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center gap-6">
                            <div className="p-4 bg-white rounded-lg">
                                <QrCodeIcon />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{t('downloadAppPage.scanQr')}</h3>
                                <p className="text-gray-400 mt-1">{t('downloadAppPage.subtitle')}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default DownloadAppPage;
