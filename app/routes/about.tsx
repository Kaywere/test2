import type { Route } from "./+types/about";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import AboutMeForm from "../components/AboutMeForm";
import { getApiUrl } from '../config/api';

interface AboutMeData {
  name: string;
  title: string;
  bio: string;
  image_url: string;
  email: string;
  phone: string;
  school: string;
  education: any[];
  experience: any[];
  skills: any[];
  achievements: any[];
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "نبذة عني - بورتفوليو المعلمة" },
    { name: "description", content: "نبذة تعريفية عن المعلمة المتميزة ومسيرتها المهنية وإنجازاتها" },
  ];
}

export default function About() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [aboutData, setAboutData] = useState<AboutMeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch(getApiUrl('api/about-me'));
      const data = await response.json();
      setAboutData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching about data:', error);
      setLoading(false);
    }
  };

  const handleSave = async (formData: AboutMeData) => {
    try {
      // Create a clean copy of the data and ensure arrays are properly formatted
      const cleanData = {
        ...formData,
        education: Array.isArray(formData.education) ? formData.education : [],
        experience: Array.isArray(formData.experience) ? formData.experience.map(exp => ({
          ...exp,
          responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : []
        })) : [],
        skills: Array.isArray(formData.skills) ? formData.skills : [],
        achievements: Array.isArray(formData.achievements) ? formData.achievements : []
      };

      console.log('Sending data to server:', cleanData);
      
      const response = await fetch(getApiUrl('api/about-me'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(cleanData)
      });

      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || 'Unknown error occurred';
        } catch {
          errorMessage = `Server returned ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const updatedData = await response.json();
      console.log('Received updated data:', updatedData);
      
      setAboutData(updatedData);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating about data:', error);
      alert(`Failed to save changes: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  };

  if (loading || !aboutData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E6A0B0]"></div>
      </div>
    );
  }

  return (
    <div className="font-sans text-right" dir="rtl">
      {/* Edit Button */}
      <button
        onClick={() => setIsEditModalOpen(true)}
        className="fixed bottom-4 left-4 bg-[#E6A0B0] hover:bg-[#FFD1D9] text-white p-3 rounded-full shadow-lg z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>

      {/* Edit Modal */}
      <AboutMeForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        initialData={aboutData}
      />

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
                <Link to="/" className="text-[#E6A0B0] hover:text-[#D48A9A] px-3 py-2 rounded-md text-sm font-medium nav-link">
                  الرئيسية
                </Link>
                <Link to="/#performance-elements" className="text-[#E6A0B0] hover:text-[#D48A9A] px-3 py-2 rounded-md text-sm font-medium nav-link">
                  عناصر التقييم
                </Link>
                <Link to="/about" className="text-[#E6A0B0] hover:text-[#D48A9A] px-3 py-2 rounded-md text-sm font-medium border-b-2 border-[#FFD1D9] nav-link">
                  نبذة عني
                </Link>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                className="bg-[#FEF5FB] inline-flex items-center justify-center p-2 rounded-md text-[#FCCFE6] hover:text-[#F4C4E0] hover:bg-[#FDF0F8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FCCFE6]"
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
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t border-[#FDD5E9]`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-[#E6A0B0] hover:text-[#D48A9A] block px-3 py-2 rounded-md text-base font-medium">
              الرئيسية
            </Link>
            <Link to="/#performance-elements" className="text-[#E6A0B0] hover:text-[#D48A9A] block px-3 py-2 rounded-md text-base font-medium" onClick={() => setMobileMenuOpen(false)}>
              عناصر التقييم
            </Link>
            <Link to="/about" className="text-[#E6A0B0] hover:text-[#D48A9A] block px-3 py-2 rounded-md text-base font-medium" onClick={() => setMobileMenuOpen(false)}>
              نبذة عني
            </Link>
          </div>
        </div>
      </nav>

      {/* Header Section with added textures */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-b from-[#FEF5FB] to-white relative">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='%23FCCFE6' stroke-opacity='0.2' stroke-width='1'/%3E%3Cpath d='M28 0L56 16L56 50L28 66L0 50L0 16L28 0Z' fill='%23FCCFE6' fill-opacity='0.1'/%3E%3C/svg%3E")`
        }}></div>
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-[#E6A0B0] mb-6 relative inline-block">
            نبذة عني
            <span className="absolute -top-6 -right-6 text-[#FFD1D9] opacity-50 text-4xl">✿</span>
            <span className="absolute -bottom-6 -left-6 text-[#FFD1D9] opacity-50 text-4xl">❀</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#D48A9A] mb-8">
            تعرف على مسيرتي التعليمية وخبراتي
          </p>
        </div>
      </section>

      {/* Teacher Profile Section */}
      <section className="py-12 px-4 bg-white relative">
        {/* Subtle lace pattern */}
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23FCCFE6' fill-opacity='0.1'/%3E%3C/svg%3E")`
        }}></div>
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="bg-[#FEF5FB] p-8 rounded-lg shadow-sm relative overflow-hidden mb-12">
            <div className="floral-corner floral-corner-top-right"></div>
            <div className="floral-corner floral-corner-bottom-left"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-md flex-shrink-0">
                <img 
                  src={aboutData.image_url || "https://placehold.co/400x400/pink/white?text=صورة+المعلمة"} 
                  alt="صورة المعلمة" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[#E6A0B0] mb-2">{aboutData.name}</h2>
                <p className="text-lg text-[#D48A9A] mb-4">{aboutData.title}</p>
                <p className="text-gray-700 mb-4">{aboutData.bio}</p>
                
                <div className="flex flex-wrap gap-3 mt-4">
                  {aboutData.skills && aboutData.skills.map((skill, idx) => (
                    <span key={idx} className="bg-[#FEF5FB] text-[#E6A0B0] px-3 py-1 rounded-full text-sm">{skill.name}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Education & Qualifications */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[#E6A0B0] mb-6">المؤهلات العلمية</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aboutData.education && aboutData.education.map((edu, idx) => (
                <div key={idx} className="bg-white p-5 rounded-lg shadow-sm border border-[#FDD5E9] hover:shadow-md transition-all duration-300">
                  <h3 className="text-lg font-semibold text-[#E6A0B0] mb-2">{edu.degree}</h3>
                  <p className="text-gray-600 mb-2">{edu.university} - {edu.year}</p>
                  <p className="text-gray-700 text-sm">{edu.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Professional Experience */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[#E6A0B0] mb-6">الخبرات المهنية</h2>
            
            <div className="relative border-r-2 border-[#FDD5E9] pr-6 space-y-8">
              {aboutData.experience && aboutData.experience.map((exp, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -right-9 top-0 w-4 h-4 bg-[#FCCFE6] rounded-full border-2 border-white shadow"></div>
                  <div className="bg-white p-5 rounded-lg shadow-sm border border-[#FDD5E9] hover:shadow-md transition-all duration-300">
                    <h3 className="text-lg font-semibold text-[#E6A0B0] mb-2">{exp.title}</h3>
                    <p className="text-gray-600 mb-2">{exp.school} - {exp.period}</p>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    {exp.responsibilities && exp.responsibilities.map((resp: string, i: number) => (
  <li key={i}>{resp}</li>
))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Skills */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[#E6A0B0] mb-6">المهارات</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {aboutData.skills && aboutData.skills.map((skill, idx) => (
                <div key={idx} className="bg-white p-5 rounded-lg shadow-sm border border-[#FDD5E9] hover:shadow-md transition-all duration-300">
                  <h3 className="text-lg font-semibold text-[#E6A0B0] mb-2">{skill.name}</h3>
                  {skill.institution && <p className="text-gray-600 mb-2">{skill.institution} - {skill.year}</p>}
                  {skill.description && <p className="text-gray-700 text-sm">{skill.description}</p>}
                </div>
              ))}
            </div>
          </div>
          
          {/* Awards & Achievements */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[#E6A0B0] mb-6">الإنجازات والجوائز</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aboutData.achievements && aboutData.achievements.map((achievement, idx) => (
                <div key={idx} className="bg-white p-5 rounded-lg shadow-sm border border-[#FDD5E9] hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#FEF5FB] text-[#E6A0B0] rounded-full flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#E6A0B0] mb-1">{achievement.title}</h3>
                      <p className="text-gray-600 text-sm">{achievement.year} - {achievement.issuer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4 bg-white relative">
        <div className="container mx-auto max-w-5xl relative z-10">
          <h2 className="text-2xl font-bold text-[#E6A0B0] mb-6">تواصل معي</h2>
          
          <div className="bg-[#FEF5FB] p-6 rounded-lg shadow-sm relative overflow-hidden">
            <div className="floral-corner floral-corner-top-right"></div>
            <div className="floral-corner floral-corner-bottom-left"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div>
                <h3 className="text-xl font-semibold text-[#E6A0B0] mb-4">معلومات الاتصال</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FEF5FB] rounded-full flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E6A0B0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">البريد الإلكتروني</p>
                      <p className="text-gray-700">{aboutData.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FEF5FB] rounded-full flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E6A0B0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">رقم الهاتف</p>
                      <p className="text-gray-700">{aboutData.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FEF5FB] rounded-full flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E6A0B0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">المدرسة</p>
                      <p className="text-gray-700">{aboutData.school}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-[#E6A0B0] mb-4">أرسل رسالة</h3>
                
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-[#FDD5E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6A0B0] focus:border-transparent"
                      placeholder="أدخل اسمك"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-[#FDD5E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6A0B0] focus:border-transparent"
                      placeholder="أدخل بريدك الإلكتروني"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      الرسالة
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-2 border border-[#FDD5E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6A0B0] focus:border-transparent"
                      placeholder="اكتب رسالتك هنا"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-[#E6A0B0] hover:bg-[#FFD1D9] text-white py-2 px-4 rounded-md transition-colors shadow-sm hover:shadow-md"
                  >
                    إرسال الرسالة
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer section */}
      <footer className="py-10 px-4 bg-white border-t border-[#FDD5E9] relative overflow-hidden">
        {/* Enhanced pattern with multiple layers for depth */}
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FCCFE6' fill-opacity='0.4'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
        }}></div>
        
        {/* Additional geometric pattern for enhanced texture */}
        <div className="absolute inset-0 opacity-3" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%23FCCFE6' fill-opacity='0.15'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20zm10-10h20v20H10V10z'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center">
            <h3 className="text-[#E6A0B0] font-bold text-lg mb-2">بورتفوليو المعلمة المتميزة</h3>
            <p className="text-gray-600 text-sm flex items-center justify-center gap-1">
              <span>جميع الحقوق محفوظة ©</span> 
              <span>{new Date().getFullYear()}</span>
              <span className="text-[#FDD5E9] mx-1">✿</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 