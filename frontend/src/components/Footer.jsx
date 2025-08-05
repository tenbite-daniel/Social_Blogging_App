import React from "react";
import { useTheme } from "../context/ThemeContext";

const socialLinks = [
    {
        href: "https://twitter.com/",
        label: "Twitter",
        svg: (isDark) => (
           <svg width="37" height="27" viewBox="0 0 37 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M35.4584 2.625C33.982 3.44121 32.3474 4.06547 30.6175 4.47375C29.689 3.637 28.4551 3.04392 27.0825 2.77475C25.71 2.50557 24.2651 2.57328 22.9432 2.96872C21.6214 3.36416 20.4864 4.06824 19.6917 4.98575C18.897 5.90325 18.4811 6.98991 18.5 8.09875V9.30709C15.7907 9.36215 13.1062 8.8912 10.6853 7.93617C8.2645 6.98114 6.18259 5.57169 4.62502 3.83334C4.62502 3.83334 -1.54165 14.7083 12.3334 19.5417C9.15833 21.2309 5.37605 22.0779 1.54169 21.9583C15.4167 28 32.375 21.9583 32.375 8.0625C32.3736 7.72593 32.3323 7.39018 32.2517 7.05959C33.8251 5.84339 34.9355 4.30787 35.4584 2.625Z" stroke={isDark ? "#FFFFFF" : "#00272B"} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
        ),
    },
    {
        href: "https://facebook.com/",
        label: "Facebook",
        svg: (isDark) => (
           <svg width="25" height="35" viewBox="0 0 25 35" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22.75 2.91669H17.125C14.6386 2.91669 12.254 3.68491 10.4959 5.05237C8.73772 6.41982 7.75 8.27448 7.75 10.2084V14.5834H2.125V20.4167H7.75V32.0834H15.25V20.4167H20.875L22.75 14.5834H15.25V10.2084C15.25 9.82158 15.4475 9.45065 15.7992 9.17716C16.1508 8.90367 16.6277 8.75002 17.125 8.75002H22.75V2.91669Z" stroke={isDark ? "#FFFFFF" : "#00272B"} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
        ),
    },
    {
        href: "https://instagram.com/",
        label: "Instagram",
        svg: (isDark) => (
            <svg width="40" height="34" viewBox="0 0 40 34" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M29.625 9.20831H29.6425M11.25 2.83331H28.75C33.5825 2.83331 37.5 6.00463 37.5 9.91665V24.0833C37.5 27.9953 33.5825 31.1666 28.75 31.1666H11.25C6.41751 31.1666 2.5 27.9953 2.5 24.0833V9.91665C2.5 6.00463 6.41751 2.83331 11.25 2.83331ZM27 16.1075C27.216 17.2865 26.9672 18.4906 26.2891 19.5486C25.611 20.6065 24.538 21.4645 23.2228 22.0004C21.9077 22.5362 20.4173 22.7227 18.9636 22.5334C17.51 22.344 16.1671 21.7884 15.126 20.9456C14.0849 20.1028 13.3985 19.0157 13.1646 17.8389C12.9307 16.6622 13.1611 15.4557 13.8231 14.391C14.485 13.3264 15.5448 12.4578 16.8517 11.9088C18.1586 11.3599 19.6461 11.1585 21.1025 11.3333C22.5881 11.5116 23.9635 12.0721 25.0255 12.9317C26.0874 13.7914 26.7797 14.9048 27 16.1075Z" stroke={isDark ? "#FFFFFF" : "#00272B"} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
        ),
    },
];

const Footer = () => {
    const { isDark } = useTheme();
    
    return (
        <footer className="w-full flex flex-col items-center justify-center py-8 bg-cyan-100 dark:bg-gray-800 transition-colors duration-200">
            <div className="font-serif font-bold text-base text-black dark:text-white text-center mb-4 transition-colors duration-200">
                &copy; 2024 Blog EASE. All rights reserved
            </div>
            
            <div className="flex flex-row items-center justify-center gap-4">
                <span className="font-serif font-bold text-base text-black dark:text-white transition-colors duration-200">
                    Follow us on
                </span>
                {socialLinks.map(({ href, label, svg }) => (
                    <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="text-black dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200"
                    >
                        {svg(isDark)}
                    </a>
                ))}
            </div>
        </footer>
    );
};

export default Footer;