import React, { useRef } from 'react';

interface CameraModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (file: File) => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    React.useEffect(() => {
        const startCamera = async () => {
            if (isOpen) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (err) {
                    console.error("Camera error:", err);
                    alert("لا يمكن الوصول إلى الكاميرا. يرجى التحقق من الأذونات.");
                    onClose();
                }
            }
        };

        const stopCamera = () => {
             if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        };

        if (isOpen) {
            startCamera();
        } else {
            stopCamera();
        }

        return () => stopCamera();
    }, [isOpen, onClose]);

    const takePicture = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                // Flip the image horizontally for a mirror effect
                context.translate(canvas.width, 0);
                context.scale(-1, 1);
                context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            }

            canvas.toBlob(blob => {
                if (blob) {
                    onCapture(new File([blob], "selfie.jpg", { type: "image/jpeg" }));
                }
                onClose();
            }, 'image/jpeg');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-[110] flex flex-col items-center justify-center animate-fade-in p-4">
            <video ref={videoRef} autoPlay playsInline className="w-full max-w-lg h-auto rounded-lg transform -scale-x-100"></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
            <div className="mt-6 flex items-center gap-6">
                <button onClick={onClose} className="bg-surface text-brand-dark font-bold py-3 px-8 rounded-full">إلغاء</button>
                <button onClick={takePicture} className="w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-white/50 ring-4 ring-black/20" aria-label="Take picture"></button>
            </div>
        </div>
    );
};

export default CameraModal;
