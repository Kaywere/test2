import type { Route } from "./+types/home";
import { Link } from "react-router";
import { elements } from "../data/elements";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "بورتفوليو المعلمة" },
    { name: "description", content: "بورتفوليو المعلمة - عناصر تقييم الأداء الوظيفي والشواهد" },
  ];
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="font-sans text-right" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex-1 flex items-center">
              <div className="flex-shrink-0">
                <Link to="/" className="flex items-center">
                  <span className="text-[#E6A0B0] text-2xl font-bold">بورتفوليو المعلمة</span>
                  <span className="text-[#FFD1D9] ml-1">✿</span>
                </Link>
              </div>
              
              {/* Desktop Menu - moved to right after logo */}
              <div className="hidden md:flex items-center space-x-4 space-x-reverse mr-8">
                <Link to="/" className="text-[#E6A0B0] hover:text-[#D48A9A] px-3 py-2 rounded-md text-sm font-medium border-b-2 border-[#FFD1D9] nav-link">
                  الرئيسية
                </Link>
                <a href="#performance-elements" className="text-[#E6A0B0] hover:text-[#D48A9A] px-3 py-2 rounded-md text-sm font-medium nav-link">
                  عناصر التقييم
                </a>
                <Link to="/about" className="text-[#E6A0B0] hover:text-[#D48A9A] px-3 py-2 rounded-md text-sm font-medium nav-link">
                  نبذة عني
                </Link>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                className="bg-[#FFF5F6] inline-flex items-center justify-center p-2 rounded-md text-[#FFC0CB] hover:text-[#F5B6C1] hover:bg-[#FFE6E9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFC0CB]"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">فتح القائمة</span>
                {/* Icon when menu is closed */}
                {!mobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t border-[#FFD1D9]`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-[#E6A0B0] hover:text-[#D48A9A] block px-3 py-2 rounded-md text-base font-medium">
              الرئيسية
            </Link>
            <a href="#performance-elements" className="text-[#E6A0B0] hover:text-[#D48A9A] block px-3 py-2 rounded-md text-base font-medium" onClick={() => setMobileMenuOpen(false)}>
              عناصر التقييم
            </a>
            <Link to="/about" className="text-[#E6A0B0] hover:text-[#D48A9A] block px-3 py-2 rounded-md text-base font-medium" onClick={() => setMobileMenuOpen(false)}>
              نبذة عني
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with enhanced background */}
      <section className="min-h-screen pt-16 bg-gradient-to-b from-[#FFF5F6] to-white flex flex-col justify-center items-center px-4 relative overflow-hidden">
        {/* Floral background elements */}
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23FFC0CB' fill-opacity='0.4'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
        }}></div>
        
        {/* Background texture patterns */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFC0CB' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
        }}></div>
        
        {/* New subtle honeycomb pattern for added texture */}
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='%23FFC0CB' stroke-opacity='0.2' stroke-width='1'/%3E%3Cpath d='M28 0L56 16L56 50L28 66L0 50L0 16L28 0Z' fill='%23FFC0CB' fill-opacity='0.1'/%3E%3C/svg%3E")`
        }}></div>
        
        {/* New lace pattern overlay */}
        <div className="absolute inset-0 opacity-3" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23FFC0CB' fill-opacity='0.1'/%3E%3C/svg%3E")`
        }}></div>
        
        {/* Decorative elements */}
        <div className="absolute top-32 right-1/4 w-24 h-24 bg-[#FFD1D9] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-32 left-1/4 w-32 h-32 bg-[#F5B6C1] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-[#FFF5F6] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Hearts and flowers decorations */}
        <div className="absolute top-20 right-10 text-[#FFD1D9] text-4xl opacity-20">❤</div>
        <div className="absolute top-40 right-20 text-[#F5B6C1] text-2xl opacity-20">❀</div>
        <div className="absolute bottom-20 right-40 text-[#FFD1D9] text-3xl opacity-20">✿</div>
        <div className="absolute top-60 left-10 text-[#F5B6C1] text-3xl opacity-20">✿</div>
        <div className="absolute bottom-40 left-20 text-[#FFD1D9] text-2xl opacity-30">❀</div>
        
        {/* Dotted overlay pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,192,203,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        
        <div className="container mx-auto max-w-5xl text-center z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-[#E6A0B0] mb-6 relative inline-block">
            بورتفوليو المعلمة المتميزة
            <span className="absolute -top-6 -right-6 text-[#FFD1D9] opacity-50 text-4xl">✿</span>
            <span className="absolute -bottom-6 -left-6 text-[#FFD1D9] opacity-50 text-4xl">❀</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#D48A9A] mb-8">
            توثيق رحلة التميز والإبداع في مسيرة التعليم
          </p>
          <div className="flex justify-center">
            <a href="#performance-elements" className="bg-[#FFC0CB] hover:bg-[#F5B6C1] text-white font-medium py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg">
              عناصر التقييم
            </a>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FFC0CB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Performance Elements Section */}
      <section id="performance-elements" className="py-20 px-4 bg-white relative overflow-hidden">
        {/* Floral section background */}
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23FFC0CB' fill-opacity='0.25'%3E%3Cpath d='M0 0h80v80H0V0zm20 20v40h40V20H20zm20 35a15 15 0 1 1 0-30 15 15 0 0 1 0 30z' opacity='0.5'%3E%3C/path%3E%3C/g%3E%3C/svg%3E")` 
        }}></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <h2 className="text-4xl font-bold text-center text-[#E6A0B0] mb-16 relative inline-block">
            عناصر تقييم الأداء الوظيفي
            <span className="absolute top-0 -right-8 text-[#FFD1D9] opacity-30 text-3xl">❀</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {elements.map((element) => (
              <Link 
                key={element.id} 
                to={`/element/${element.id}`}
                className="group bg-gradient-to-br from-[#FFF5F6] to-white p-6 rounded-xl border border-[#FFD1D9] shadow-sm hover:shadow-md transition-all duration-300 card-hover-effect relative overflow-hidden"
              >
                <div className="floral-corner floral-corner-top-right"></div>
                <div className="floral-corner floral-corner-bottom-left"></div>
                <div className="h-36 flex flex-col justify-center items-center relative z-10">
                  <div className="w-16 h-16 bg-[#FFF5F6] text-[#E6A0B0] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                    <span className="text-2xl font-bold">{element.id}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#D48A9A] text-center">
                    {element.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer section with pink theme */}
      <footer className="py-10 px-4 bg-white border-t border-[#FFD1D9] relative overflow-hidden">
        {/* Enhanced pattern with multiple layers for depth */}
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFC0CB' fill-opacity='0.4'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
        }}></div>
        
        {/* Additional geometric pattern for enhanced texture */}
        <div className="absolute inset-0 opacity-3" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%23FFC0CB' fill-opacity='0.15'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20zm10-10h20v20H10V10z'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center">
            <h3 className="text-[#E6A0B0] font-bold text-lg mb-2">بورتفوليو المعلمة المتميزة</h3>
            <p className="text-gray-600 text-sm flex items-center justify-center gap-1">
              <span>جميع الحقوق محفوظة ©</span> 
              <span>{new Date().getFullYear()}</span>
              <span className="text-[#FFD1D9] mx-1">✿</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
