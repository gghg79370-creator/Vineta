import React from 'react';
import { ShoppingBagIcon } from '../icons';

const InstagramImage = ({ src }: { src: string }) => (
    <div className="group relative overflow-hidden rounded-lg aspect-square">
        <img src={src} alt="منشور انستغرام" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/50 transition-all duration-300 flex items-center justify-center p-4">
            <a href="#" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-brand-dark text-brand-bg text-sm font-bold py-2 px-4 rounded-full flex items-center gap-2" aria-label="عرض المنتج">
                <ShoppingBagIcon size="sm" />
                <span>عرض المنتج</span>
            </a>
        </div>
    </div>
);

export const InstagramSection = () => (
    <section className="py-12 md:py-20 bg-brand-subtle">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-2">Shop Our Instagram</h2>
            <p className="text-lg text-brand-primary font-semibold mb-8">@vinetafashion</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                <InstagramImage src="https://images.unsplash.com/photo-1581404917852-2e5356230887?q=80&w=1964&auto.format&fit=crop" />
                <InstagramImage src="https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?q=80&w=1974&auto.format&fit=crop" />
                <InstagramImage src="https://images.unsplash.com/photo-1603217041433-415594d45544?q=80&w=1965&auto.format&fit=crop" />
                <InstagramImage src="https://images.unsplash.com/photo-1520006436768-61845c47a61a?q=80&w=1974&auto.format&fit=crop" />
                <InstagramImage src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2124&auto.format&fit=crop" />
            </div>

            <div className="mt-12">
                <a href="#" className="bg-brand-dark text-brand-bg font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-all active:scale-95 inline-flex items-center gap-2">
                    <i className="fa-brands fa-instagram"></i>
                    تابعنا على انستغرام
                </a>
            </div>
        </div>
    </section>
);