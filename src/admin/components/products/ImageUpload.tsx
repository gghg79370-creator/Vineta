import React, { useState, useCallback, useEffect } from 'react';
import { ArrowUpTrayIcon, XCircleIcon } from '../../../components/icons';

type ImageSource = File | string;

const ImagePreview = ({ file }: { file: ImageSource }) => {
    const [objectUrl, setObjectUrl] = useState<string | null>(null);

    useEffect(() => {
        if (typeof file === 'string') {
            setObjectUrl(file);
            return;
        }
        
        const url = URL.createObjectURL(file);
        setObjectUrl(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [file]);

    if (!objectUrl) return null;

    return (
        <img
            src={objectUrl}
            alt={typeof file === 'string' ? 'product image' : file.name}
            className="w-full h-full object-cover rounded-lg pointer-events-none" // pointer-events-none to prevent img drag behavior
        />
    );
};

interface ImageUploadProps {
    initialImages?: string[];
    onImagesChange: (images: ImageSource[]) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ initialImages = [], onImagesChange }) => {
    const [images, setImages] = useState<ImageSource[]>(initialImages);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    
    // State for reordering
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    useEffect(() => {
        onImagesChange(images);
    }, [images, onImagesChange]);

    const onDrop = useCallback((acceptedFiles: FileList) => {
        setIsDraggingOver(false);
        const newImages = Array.from(acceptedFiles);
        setImages(prev => [...prev, ...newImages]);
    }, []);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onDrop(e.dataTransfer.files);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            onDrop(e.target.files);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    // Reordering handlers
    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };
    
    const handleDragOverItem = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    const handleDropItem = (dropIndex: number) => {
        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            return;
        };
        
        const newImages = [...images];
        const draggedItem = newImages.splice(draggedIndex, 1)[0];
        newImages.splice(dropIndex, 0, draggedItem);
        
        setImages(newImages);
        setDraggedIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    return (
        <div>
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDraggingOver ? 'border-admin-accent bg-admin-accent/10' : 'border-gray-300'}`}
            >
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                    <ArrowUpTrayIcon className="w-12 h-12 mx-auto text-gray-400" />
                    <p className="mt-2 font-semibold text-admin-accent">انقر للتحميل أو قم بالسحب والإفلات</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </label>
            </div>

            {images.length > 0 && (
                <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">اسحب الصور لإعادة ترتيبها. الصورة الأولى هي الصورة الرئيسية.</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {images.map((file, index) => (
                            <div
                                key={typeof file === 'string' ? file : `${file.name}-${index}`}
                                className={`relative group aspect-square cursor-grab transition-opacity ${draggedIndex === index ? 'opacity-30' : 'opacity-100'}`}
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={handleDragOverItem}
                                onDrop={() => handleDropItem(index)}
                                onDragEnd={handleDragEnd}
                            >
                                <ImagePreview file={file} />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                {index === 0 && <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">الرئيسية</div>}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        removeImage(index);
                                    }}
                                    className="absolute -top-2 -right-2 bg-white rounded-full text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    aria-label={`Remove image ${index + 1}`}
                                >
                                    <XCircleIcon />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
