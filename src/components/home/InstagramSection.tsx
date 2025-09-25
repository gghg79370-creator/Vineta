import React from 'react';

const InstagramImage = ({ src }: { src: string }) => (
    <div className="group relative overflow-hidden rounded-lg aspect-square">
        <img src={src} alt="Instagram post" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
            <a href="#" className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-label="View on Instagram">
                <i className="fa-brands fa-instagram text-2xl"></i>
            </a>
        </div>
    </div>
);

export const InstagramSection = () => (
    <section className="py-20 bg-brand-subtle">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-extrabold text-brand-dark mb-2">تابعينا على إنستغرام</h2>
            <p className="text-lg text-brand-primary font-semibold mb-10">@vineta_fashion</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-10">
                <InstagramImage src="https://images.unsplash.com/photo-1581404917852-2e5356230887?q=80&w=1964&auto=format&fit=crop" />
                <InstagramImage src="https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?q=80&w=1974&auto=format&fit=crop" />
                <InstagramImage src="https://images.unsplash.com/photo-1603217041433-415594d45544?q=80&w=1965&auto=format&fit=crop" />
                <InstagramImage src="https://images.unsplash.com/photo-1520006436768-61845c47a61a?q=80&w=1974&auto=format&fit=crop" />
                <InstagramImage src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2124&auto=format&fit=crop" />
            </div>
            <button className="bg-brand-dark text-white font-bold py-4 px-10 rounded-full hover:bg-opacity-90 transition-all hover:scale-105 flex items-center gap-2 mx-auto">
                <i className="fa-brands fa-instagram text-xl"></i>
                <span>تابعينا على إنستغرام</span>
            </button>
        </div>
    </section>
);