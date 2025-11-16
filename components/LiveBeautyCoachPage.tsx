import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage, ProductRecommendation } from '../types';

interface LiveBeautyCoachPageProps {
    onAnalyze: (imageBase64: string, mimeType: string) => void;
    isLoading: boolean;
    result: { image: string | null; recommendations: ProductRecommendation[] | null } | null;
    isQuotaExhausted: boolean;
    handleApiError: (error: unknown) => string;
}

const LiveBeautyCoachPage: React.FC<LiveBeautyCoachPageProps> = ({ onAnalyze, isLoading, result, isQuotaExhausted, handleApiError }) => {
    const { t } = useLanguage();
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const cleanupCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }, []);

    useEffect(() => {
        if (isCameraOn && streamRef.current && videoRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
        
        return () => {
            cleanupCamera();
        };
    }, [isCameraOn, cleanupCamera]);


    const startCamera = async () => {
        cleanupCamera();
        setCameraError(null);
        setIsCameraReady(false);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } });
            streamRef.current = stream;
            setIsCameraOn(true);
        } catch (err: any) {
            let errorMessage = t('liveBeautyCoachPage.errors.generic');
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                errorMessage = t('liveBeautyCoachPage.errors.permissionDenied');
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                errorMessage = t('liveBeautyCoachPage.errors.notFound');
            }
            setCameraError(errorMessage);
            console.error("Camera access error:", err);
        }
    };
    
    const stopCamera = () => {
        cleanupCamera();
        setIsCameraOn(false);
        setIsCameraReady(false);
    };
    
    const handleAnalyze = () => {
        setCameraError(null);
        if (!videoRef.current || !canvasRef.current || !isCameraReady || videoRef.current.videoWidth === 0) {
            setCameraError(t('liveBeautyCoachPage.errors.cameraNotReady'));
            return;
        }
        
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const context = canvas.getContext('2d');
        if (!context) return;
        
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        const base64 = dataUrl.split(',')[1];
        
        setCapturedImage(dataUrl);
        onAnalyze(base64, 'image/jpeg');
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{t('liveBeautyCoachPage.title')}</h1>
                <p className="mt-4 text-lg text-gray-300">{t('liveBeautyCoachPage.subtitle')}</p>
            </div>
            
            <div className="mt-12 max-w-6xl mx-auto bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-white/10">
                {!isCameraOn ? (
                    <div className="text-center p-8">
                        <p className="text-gray-400 mb-6">{t('liveBeautyCoachPage.getStarted')}</p>
                        <button onClick={startCamera} className="px-8 py-3 bg-fuchsia-600 text-white font-bold rounded-lg hover:bg-fuchsia-700 transition-colors shadow-lg shadow-fuchsia-500/20">
                            {t('liveBeautyCoachPage.startCamera')}
                        </button>
                        {cameraError && (
                            <div className="mt-6 max-w-lg mx-auto p-4 bg-red-900/50 border-l-4 border-red-500 text-red-200 text-left" role="alert">
                                <p className="font-bold">Camera Error</p>
                                <p className="text-sm">{cameraError}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="relative aspect-video max-w-4xl mx-auto bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                            <video 
                                ref={videoRef} 
                                onCanPlay={() => setIsCameraReady(true)}
                                autoPlay 
                                playsInline 
                                muted 
                                className="block w-full h-full object-cover transform -scale-x-100"
                            ></video>
                             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-full px-4 flex flex-col items-center gap-4">
                                {cameraError && <div className="p-2 text-xs bg-red-900/80 text-red-200 rounded-md">{cameraError}</div>}
                                <div className="flex gap-4">
                                    <button onClick={handleAnalyze} disabled={isLoading || isQuotaExhausted || !isCameraReady} className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-full transition-colors disabled:bg-gray-500 flex items-center gap-2 shadow-2xl">
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
                                        ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.83 4h2.34a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        )}
                                        <span>{isLoading ? t('liveBeautyCoachPage.analyzing') : !isCameraReady ? t('liveBeautyCoachPage.preparingCamera') : t('liveBeautyCoachPage.captureAndAnalyze')}</span>
                                    </button>
                                    <button onClick={stopCamera} className="p-4 bg-gray-700/50 hover:bg-gray-700 text-white rounded-full transition-colors shadow-2xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                             </div>
                        </div>
                    </div>
                )}

                {(capturedImage || result) && (
                    <div className="mt-8 pt-8 border-t border-white/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-center font-bold text-gray-300 mb-2">{t('liveBeautyCoachPage.before')}</h3>
                                    <img src={capturedImage!} alt="Before" className="rounded-lg w-full block" />
                                </div>
                            </div>
                             <div className="space-y-4">
                                <div>
                                    <h3 className="text-center font-bold text-gray-300 mb-2">{t('liveBeautyCoachPage.after')}</h3>
                                    {isLoading ? (
                                        <div className="aspect-[16/9] bg-gray-700 rounded-lg flex items-center justify-center"><div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-fuchsia-400"></div></div>
                                    ) : (
                                        <img src={result?.image || capturedImage!} alt="After" className="rounded-lg w-full block" />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                            <h3 className="text-xl font-bold text-white mb-4">{t('liveBeautyCoachPage.recommendationsTitle')}</h3>
                             {isLoading ? (
                                 <div className="space-y-4 animate-pulse">
                                    {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-700 rounded-lg"></div>)}
                                 </div>
                             ) : result?.recommendations ? (
                                <div className="space-y-4">
                                {result.recommendations.map((item, index) => (
                                    <a href={item.link} target="_blank" rel="noopener noreferrer" key={index} className="flex items-start gap-4 p-4 bg-gray-900/50 rounded-lg border border-transparent hover:border-fuchsia-500 transition-colors">
                                        <div className="flex-shrink-0 w-12 h-12 bg-fuchsia-900/50 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-fuchsia-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 003.86.517l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5zM12 6.5a2.5 2.5 0 000 5" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8V5" /><path strokeLinecap="round" strokeLinejoin="round" d="M7 10.5h3.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5H13" /></svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">{item.name}</p>
                                            <p className="text-sm text-gray-400">{item.description}</p>
                                        </div>
                                    </a>
                                ))}
                                </div>
                             ) : null}
                        </div>
                    </div>
                )}

            </div>
            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    );
};

export default LiveBeautyCoachPage;