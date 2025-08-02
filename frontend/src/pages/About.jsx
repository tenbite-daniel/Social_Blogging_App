import React from "react";
import Header from "../components/Header";

export default function About() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#fdf7f7] to-[#c6f7f7]">
            <Header />
            <div>
                <div className="font-martel font-extrabold text-[48px] leading-none text-center text-[#36c5d1] mt-10 mb-6">
                    About Blog Ease
                </div>
                <div className="max-w-3xl mx-auto font-martel font-normal text-[32px] leading-[48px] text-center text-[#222]">
                    Blog Ease is a blogging social app where users can freely post about different topics and share their ideas without restrictions. It aims to create a safe space where users can gather and discuss topics they like or explore new topics across their feed.
                </div>
            </div>
        </div>
    );
}
