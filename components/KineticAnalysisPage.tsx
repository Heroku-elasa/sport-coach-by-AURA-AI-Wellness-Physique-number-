import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, KineticAnalysisResult } from '../types';
import { analyzeKineticMovement } from '../services/geminiService';

interface KineticAnalysisPageProps {
    handleApiError: (err: unknown) => string;
}

const KineticAnalysisPage: React.FC<KineticAnalysisPageProps> = ({ handleApiError }) => {
    const { t, language } = useLanguage();
    const [status, setStatus] = useState<'idle' | 'analyzing' | 'results'>('idle');
    const [selectedMovement, setSelectedMovement] = useState<string>('sprint');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<KineticAnalysisResult | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const startCamera = async () => {
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera error:", err);
            setError(t('kineticAnalysisPage.noCamera'));
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    useEffect(() => {
        if (status === 'idle') {
            startCamera();
        } else {
            stopCamera();
        }
        // Cleanup on component unmount
        return () => stopCamera();
    }, [status]);

    const handleAnalyze = async () => {
        setStatus('analyzing');
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        // Simulate a few seconds of "recording"
        setTimeout(async () => {
            try {
                const result = await analyzeKineticMovement(selectedMovement, language);
                setAnalysisResult(result);
            } catch (err) {
                const msg = handleApiError(err);
                setError(msg);
            } finally {
                setIsLoading(false);
                setStatus('results');
            }
        }, 4000); // 4-second animation
    };

    const handleReset = () => {
        setStatus('idle');
        setError(null);
        setAnalysisResult(null);
    };

    const movements = t('kineticAnalysisPage.movements');

    const renderContent = () => {
        if (status === 'results') {
            return (
                <div className="w-full max-w-4xl mx-auto space-y-8">
                    {isLoading && <p>{t('kineticAnalysisPage.analyzing')}</p>}
                    {error && <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div>}
                    {analysisResult && (
                        <div className="bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-white/10 space-y-8 animate-fade-in">
                            <h2 className="text-3xl font-bold text-white text-center">{t('kineticAnalysisPage.resultsTitle')}</h2>
                            
                            <section>
                                <h3 className="text-xl font-semibold text-indigo-300 mb-3">{t('kineticAnalysisPage.keyMetrics')}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {analysisResult.keyMetrics.map(item => (
                                        <div key={item.metric} className="bg-gray-900/50 p-4 rounded-lg">
                                            <p className="font-bold text-white">{item.metric}: <span className="font-mono text-indigo-300">{item.value}</span></p>
                                            <p className="text-xs text-gray-400 mt-1">{item.explanation}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-indigo-300 mb-3">{t('kineticAnalysisPage.performanceInsights')}</h3>
                                <ul className="list-disc list-inside space-y-2 text-sm text-gray-300 bg-gray-900/50 p-4 rounded-lg">
                                    {analysisResult.performanceInsights.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </section>

                             <section>
                                <h3 className="text-xl font-semibold text-indigo-300 mb-3">{t('kineticAnalysisPage.correctiveDrills')}</h3>
                                <div className="space-y-3">
                                    {analysisResult.correctiveDrills.map((item, i) => (
                                        <div key={i} className="bg-gray-900/50 p-4 rounded-lg flex items-start gap-4">
                                            <div className="flex-grow">
                                                <p className="font-semibold text-white">{item.drill}</p>
                                                <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                                            </div>
                                            <a 
                                                href={`https://www.youtube.com/results?search_query=how+to+do+${encodeURIComponent(item.drill)}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                title={`Watch video for ${item.drill}`}
                                                className="flex-shrink-0 text-indigo-300 hover:text-indigo-100 transition-transform transform hover:scale-125 mt-1"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                </svg>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </section>

                        </div>
                    )}
                     <div className="text-center mt-8">
                        <button onClick={handleReset} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors">
                            {t('kineticAnalysisPage.newAnalysisButton')}
                        </button>
                    </div>
                </div>
            );
        }

        return (
             <div className="w-full max-w-2xl mx-auto bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-white/10 space-y-6">
                {error && <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div>}
                
                <div className="relative aspect-[3/4] bg-black rounded-lg overflow-hidden border border-white/10">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100"></video>
                    {status === 'analyzing' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 animate-fade-in">
                           <svg viewBox="0 0 100 100" className="w-full h-full absolute opacity-80">
                                {/* Simple skeleton lines */}
                                <line x1="50" y1="20" x2="50" y2="50" stroke="cyan" strokeWidth="1" className="line-draw" /> {/* Spine */}
                                <line x1="50" y1="30" x2="40" y2="40" stroke="cyan" strokeWidth="1" className="line-draw" style={{ animationDelay: '0.2s' }}/> {/* L arm */}
                                <line x1="50" y1="30" x2="60" y2="40" stroke="cyan" strokeWidth="1" className="line-draw" style={{ animationDelay: '0.2s' }}/> {/* R arm */}
                                <line x1="40" y1="40" x2="35" y2="55" stroke="cyan" strokeWidth="1" className="line-draw" style={{ animationDelay: '0.4s' }}/>
                                <line x1="60" y1="40" x2="65" y2="55" stroke="cyan" strokeWidth="1" className="line-draw" style={{ animationDelay: '0.4s' }}/>
                                <line x1="50" y1="50" x2="45" y2="70" stroke="cyan" strokeWidth="1" className="line-draw" style={{ animationDelay: '0.6s' }}/> {/* L leg */}
                                <line x1="50" y1="50" x2="55" y2="70" stroke="cyan" strokeWidth="1" className="line-draw" style={{ animationDelay: '0.6s' }}/> {/* R leg */}
                                <line x1="45" y1="70" x2="45" y2="90" stroke="cyan" strokeWidth="1" className="line-draw" style={{ animationDelay: '0.8s' }}/>
                                <line x1="55" y1="70" x2="55" y2="90" stroke="cyan" strokeWidth="1" className="line-draw" style={{ animationDelay: '0.8s' }}/>
                                <circle cx="50" cy="15" r="5" stroke="cyan" strokeWidth="1" fill="none" className="line-draw" /> {/* Head */}
                           </svg>
                           <div className="relative text-center text-white p-4 bg-black/50 rounded-lg">
                                <div className="w-8 h-8 mx-auto border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
                                <p className="mt-4 font-semibold">{t('kineticAnalysisPage.analyzing')}</p>
                           </div>
                        </div>
                    )}
                </div>

                <p className="text-center text-gray-400 text-sm">{t('kineticAnalysisPage.instructions')}</p>
                
                <div>
                    <label htmlFor="movement-select" className="block text-sm font-medium text-gray-300 mb-2">{t('kineticAnalysisPage.selectMovement')}</label>
                    <select 
                        id="movement-select"
                        value={selectedMovement}
                        onChange={e => setSelectedMovement(e.target.value)}
                        disabled={status === 'analyzing'}
                        className="w-full bg-gray-700 p-3 rounded-md text-white mt-1 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {Object.entries(movements).map(([key, value]) => (
                            <option key={key} value={key}>{value as string}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleAnalyze}
                    disabled={status === 'analyzing' || !!error}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-500 transition-colors"
                >
                    {t('kineticAnalysisPage.startButton')}
                </button>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="text-center max-w-4xl mx-auto mb-12">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{t('kineticAnalysisPage.title')}</h1>
                <p className="mt-4 text-lg text-gray-300">{t('kineticAnalysisPage.subtitle')}</p>
            </div>
            {renderContent()}
        </div>
    );
};

export default KineticAnalysisPage;