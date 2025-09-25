import React from 'react';

export const BrandLogos = () => (
    <div className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-brand-dark mb-3">شركاؤنا الموثوق بهم</h2>
            <p className="text-brand-text-light mb-10">نحن نفخر بالعمل مع أفضل العلامات التجارية في عالم الموضة.</p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg" alt="Zara" className="h-6 grayscale hover:grayscale-0 transition-all duration-300"/>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Pull%26Bear_logo.svg/1280px-Pull%26Bear_logo.svg.png" alt="Pull&Bear" className="h-6 grayscale hover:grayscale-0 transition-all duration-300"/>
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" alt="Nike" className="h-9 grayscale hover:grayscale-0 transition-all duration-300"/>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/ASOS_Logo.svg/1280px-ASOS_Logo.svg.png" alt="ASOS" className="h-6 grayscale hover:grayscale-0 transition-all duration-300"/>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Burberry_logo.svg/1280px-Burberry_logo.svg.png" alt="Burberry" className="h-5 grayscale hover:grayscale-0 transition-all duration-300"/>
            </div>
        </div>
    </div>
);