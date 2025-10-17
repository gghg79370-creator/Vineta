import React from 'react';

const logos = [
    { src: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg", alt: "Nike", className: "h-8" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg", alt: "Zara", className: "h-6" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/ASOS_Logo.svg/1280px-ASOS_Logo.svg.png", alt: "ASOS", className: "h-6" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg", alt: "Adidas", className: "h-8" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/1280px-H%26M-Logo.svg.png", alt: "H&M", className: "h-6" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Burberry_logo.svg/1280px-Burberry_logo.svg.png", alt: "Burberry", className: "h-5" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Gucci_logo.svg/1280px-Gucci_logo.svg.png", alt: "Gucci", className: "h-6" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Calvin_Klein_logo.svg/1280px-Calvin_Klein_logo.svg.png", alt: "Calvin Klein", className: "h-8" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Forever_21_logo.svg/1280px-Forever_21_logo.svg.png", alt: "Forever 21", className: "h-6" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Pull%26Bear_logo.svg/1280px-Pull%26Bear_logo.svg.png", alt: "Pull&Bear", className: "h-6" },
];

const MarqueeContent = () => (
    <div className="flex items-center justify-around flex-shrink-0" aria-hidden="true">
        {logos.map((logo, index) => (
             <img key={index} src={logo.src} alt={logo.alt} className={`${logo.className} mx-10 grayscale transition-all duration-300 opacity-60 hover:opacity-100 hover:grayscale-0`} />
        ))}
    </div>
);

export const BrandLogos = () => (
    <div className="py-16 bg-brand-subtle">
        <div className="container mx-auto px-4">
            <h2 className="text-center text-sm font-bold uppercase tracking-widest text-brand-text-light mb-12">
                العلامات التجارية المميزة
            </h2>
            <div className="relative overflow-hidden group">
                 <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap">
                    <MarqueeContent />
                    <MarqueeContent />
                </div>
            </div>
        </div>
    </div>
);