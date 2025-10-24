import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage, PostureAnalysisResult } from '../types';

interface PostureAnalysisPageProps {
    onAnalyze: (imageBase64: string, mimeType: string, analysisType: 'posture' | 'squat') => void;
    isLoading: boolean;
    result: PostureAnalysisResult | null;
    isQuotaExhausted: boolean;
    handleApiError: (error: unknown) => string;
}

// URLs for sample images
const POSTURE_SAMPLE_URL = 'https://images.unsplash.com/photo-1599838634969-a88a45aa86a2?q=80&w=800&auto=format&fit=crop';
const SQUAT_SAMPLE_URL = 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=800&auto=format&fit=crop';


const PostureAnalysisPage: React.FC<PostureAnalysisPageProps> = ({ onAnalyze, isLoading, result, isQuotaExhausted, handleApiError }) => {
    const { t } = useLanguage();
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [analysisType, setAnalysisType] = useState<'posture' | 'squat'>('posture');
    const [sampleImage, setSampleImage] = useState(POSTURE_SAMPLE_URL);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        setSampleImage(analysisType === 'posture' ? POSTURE_SAMPLE_URL : SQUAT_SAMPLE_URL);
    }, [analysisType]);

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
        return () => {
            cleanupCamera();
        };
    }, [cleanupCamera]);

    const startCamera = async () => {
        cleanupCamera();
        setCameraError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsCameraOn(true);
        } catch (err) {
            setCameraError(t('postureAnalysisPage.cameraError'));
            handleApiError(err);
        }
    };
    
    const stopCamera = () => {
        cleanupCamera();
        setIsCameraOn(false);
    };
    
    const handleAnalyze = () => {
        if (!videoRef.current || !canvasRef.current) return;
        
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const context = canvas.getContext('2d');
        if (!context) return;
        
        // Flip the context horizontally to match the mirrored video feed before drawing
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        const base64 = dataUrl.split(',')[1];
        
        onAnalyze(base64, 'image/jpeg', analysisType);
    };

    const severityStyles: Record<string, string> = {
        Low: 'bg-green-500/20 text-green-300',
        Medium: 'bg-yellow-500/20 text-yellow-300',
        High: 'bg-red-500/20 text-red-300',
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{t('postureAnalysisPage.title')}</h1>
                <p className="mt-4 text-lg text-gray-300">{t('postureAnalysisPage.subtitle')}</p>
            </div>

            <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left Column: Camera and Controls */}
                <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg backdrop-blur-sm border border-white/10 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-center font-semibold text-gray-300 mb-2">{t('postureAnalysisPage.samplePose')}</h3>
                            <div className="relative aspect-[3/4] bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                                <img src={sampleImage} alt="Sample pose" className="w-full h-full object-cover transition-opacity duration-500" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-center font-semibold text-gray-300 mb-2">{t('postureAnalysisPage.yourCamera')}</h3>
                            <div className="relative aspect-[3/4] bg-gray-900 rounded-lg overflow-hidden border border-gray-700 flex items-center justify-center">
                                <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover transform -scale-x-100 ${isCameraOn ? 'block' : 'hidden'}`}></video>
                                {!isCameraOn && (
                                    <div className="text-center text-gray-500 p-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                        <p className="mt-2 text-xs">{t('postureAnalysisPage.getStarted')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {cameraError && <p className="text-sm text-red-400 text-center">{cameraError}</p>}
                    
                    <button onClick={isCameraOn ? stopCamera : startCamera} className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md transition-colors">
                        {isCameraOn ? t('postureAnalysisPage.stopCamera') : t('postureAnalysisPage.startCamera')}
                    </button>
                    
                    {isCameraOn && (
                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">{t('postureAnalysisPage.analysisType')}</label>
                                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-900/50 rounded-lg border border-gray-700">
                                    <button onClick={() => setAnalysisType('posture')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${analysisType === 'posture' ? 'bg-teal-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                                        {t('postureAnalysisPage.posture')}
                                    </button>
                                    <button onClick={() => setAnalysisType('squat')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${analysisType === 'squat' ? 'bg-teal-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                                        {t('postureAnalysisPage.squat')}
                                    </button>
                                </div>
                            </div>
                            <button onClick={handleAnalyze} disabled={isLoading || isQuotaExhausted} className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                                {isLoading ? t('postureAnalysisPage.analyzing') : analysisType === 'posture' ? t('postureAnalysisPage.analyzePosture') : t('postureAnalysisPage.analyzeSquat')}
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Column: Instructions and Results */}
                <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg backdrop-blur-sm border border-white/10 min-h-[400px]">
                    <h2 className="text-2xl font-bold text-white mb-4">{isLoading || result ? t('postureAnalysisPage.resultsTitle') : t('postureAnalysisPage.instructionsTitle')}</h2>
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-teal-400"></div>
                            <p className="mt-4 text-gray-400">{t('postureAnalysisPage.analyzing')}</p>
                        </div>
                    ) : result ? (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <h3 className="font-semibold text-teal-300 mb-2">{t('postureAnalysisPage.summary')}</h3>
                                <p className="text-sm text-gray-300 p-4 bg-gray-900/50 rounded-md border border-gray-700">{result.summary}</p>
                            </div>
                             <div>
                                <h3 className="font-semibold text-teal-300 mb-2">{t('postureAnalysisPage.keyObservations')}</h3>
                                <div className="space-y-3">
                                    {result.keyObservations.map(obs => (
                                        <div key={obs.observation} className="p-3 bg-gray-900/50 rounded-md">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-semibold text-white">{obs.observation}</h4>
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${severityStyles[obs.severity]}`}>{t('postureAnalysisPage.severity')}: {obs.severity}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">{obs.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-teal-300 mb-2">{t('postureAnalysisPage.correctiveExercises')}</h3>
                                <div className="space-y-3">
                                     {result.correctiveExercises.map(ex => (
                                        <div key={ex.name} className="p-3 bg-gray-900/50 rounded-md">
                                            <h4 className="font-semibold text-white">{ex.name} <span className="text-xs font-normal text-gray-400">({ex.repsAndSets})</span></h4>
                                            <p className="text-xs text-gray-400 mt-1">{ex.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 text-gray-300">
                             <ul className="space-y-3 text-sm">
                                {(t('postureAnalysisPage.instructions') as string[]).map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="font-bold text-teal-400 mr-2 rtl:ml-2 rtl:mr-0">{index + 1}.</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="text-center py-10 text-gray-500">
                                <p>{t('postureAnalysisPage.placeholder')}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    );
};

export default PostureAnalysisPage;