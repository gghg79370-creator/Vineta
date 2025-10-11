import React, { useState } from 'react';
import { AdminAnnouncement } from '../../types';
import { ChevronDownIcon } from '../icons';

interface AnnouncementBarProps {
    announcements: AdminAnnouncement[];
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ announcements }) => {
    const activeAnnouncements = announcements.filter(a => a.status === 'Active');
    
    if (activeAnnouncements.length === 0) {
        return null;
    }

    const MarqueeItems = () => (
        <div className="flex items-center flex-shrink-0">
            {activeAnnouncements.map((ann, index) => (
                <React.Fragment key={index}>
                    <div className="marquee-child-item"><p>{ann.content}</p></div>
                    <div className="marquee-child-item"><span className="dot"></span></div>
                </React.Fragment>
            ))}
        </div>
    );

    return (
        <div className="tf-topbar">
            <div className="container mx-auto px-4">
                <div className="topbar-wraper">
                    <div className="hidden xl:flex flex-shrink-0">
                        <ul className="tf-social-icon">
                            <li><a href="#" className="social-item"><i className="fab fa-facebook-f"></i></a></li>
                            <li><a href="#" className="social-item"><i className="fab fa-instagram"></i></a></li>
                            <li><a href="#" className="social-item"><i className="fab fa-x-twitter"></i></a></li>
                            <li><a href="#" className="social-item"><i className="fab fa-snapchat"></i></a></li>
                        </ul>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex animate-marquee whitespace-nowrap">
                             <MarqueeItems />
                             <MarqueeItems />
                        </div>
                    </div>
                    <div className="hidden xl:flex flex-shrink-0">
                        <div className="topbar-right">
                             <div className="topbar-dropdown">
                                <button className="topbar-dropdown-button">
                                    <span>العربية</span>
                                    <ChevronDownIcon size="sm" />
                                </button>
                                <div className="topbar-dropdown-menu">
                                    <button className="topbar-dropdown-item">العربية</button>
                                    <button className="topbar-dropdown-item">English</button>
                                </div>
                            </div>
                            <div className="topbar-dropdown">
                                <button className="topbar-dropdown-button">
                                    <span>مصر (ج.م)</span>
                                    <ChevronDownIcon size="sm" />
                                </button>
                                <div className="topbar-dropdown-menu">
                                    <button className="topbar-dropdown-item">مصر (ج.م)</button>
                                    <button className="topbar-dropdown-item">United States (USD $)</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};