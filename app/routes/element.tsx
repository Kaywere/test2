import type { Route } from "./+types/element";
import { Link, useParams } from "react-router";
import { useState, useEffect, useRef } from "react";
import PDFViewer from "../pdfViewer";
import { pdfjs } from 'react-pdf';
import { Document, Page } from 'react-pdf';
import { getApiUrl } from '../config/api';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface Element {
  id: string;
  title: string;
  description: string;
  content: string;
}

interface Evidence {
  id: string;
  element_id: string;
  evidence_number: string;
  title: string;
  description: string;
  file_type: 'pdf' | 'image' | 'video' | 'none';
  file_name: string;
  mime_type: string;
  created_at: string;
  updated_at: string;
  isEditing?: boolean;
  isNew?: boolean;
}

export function meta({ params }: Route.MetaArgs) {
  const elementId = params.id;
  
  return [
    { title: "عنصر التقييم - بورتفوليو المعلمة" },
    { name: "description", content: "صفحة عنصر التقييم" },
  ];
}

// Add Video Player component
const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#FEF5FB]">
      <video 
        controls 
        className="w-full h-full object-contain"
        src={videoUrl}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

// Update PDFPreview component to handle videos
const PDFPreview = ({ pdfUrl, fileType }: { pdfUrl: string, fileType: string }) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    if (fileType === 'pdf') {
      const loadPdfPreview = async () => {
        try {
          const pdf = await pdfjs.getDocument(pdfUrl).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 1 });
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (context) {
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            await page.render({
              canvasContext: context,
              viewport: viewport
            }).promise;
            
            if (!cancelled) setPreviewUrl(canvas.toDataURL());
          }
        } catch (error) {
          console.error('Error generating PDF preview:', error);
        }
      };
      loadPdfPreview();
    } else if (fileType === 'video') {
      const loadVideoPreview = async () => {
        try {
          const video = document.createElement('video');
          video.src = pdfUrl;
          video.crossOrigin = 'anonymous';
          video.preload = 'metadata';

          await new Promise((resolve, reject) => {
            video.onloadedmetadata = () => resolve(null);
            video.onerror = (e) => reject(new Error('Video metadata load error'));
          });

          // Seek to 0.1s to avoid black frames
          await new Promise((resolve, reject) => {
            video.currentTime = 0.1;
            video.onseeked = () => resolve(null);
            video.onerror = (e) => reject(new Error('Video seek error'));
          });

          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const context = canvas.getContext('2d');

          if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            if (!cancelled) setPreviewUrl(canvas.toDataURL());
          }
        } catch (error) {
          console.error('Error generating video preview:', error);
          if (!cancelled) setPreviewUrl('');
        }
      };
      loadVideoPreview();
    }
    return () => { cancelled = true; };
  }, [pdfUrl, fileType]);

  if (fileType === 'video') {
    return previewUrl ? (
      <div className="relative w-full h-full">
        <img 
          src={previewUrl} 
          alt="Video Preview" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    ) : (
      <div className="w-full h-full bg-[#FEF5FB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E6A0B0]"></div>
      </div>
    );
  }

  return previewUrl ? (
    <img 
      src={previewUrl} 
      alt="PDF Preview" 
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  ) : (
    <div className="w-full h-full bg-[#FEF5FB] flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#E6A0B0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    </div>
  );
};

// Add enhanced PDF viewer component with top controls
const EnhancedPDFViewer = ({ pdfUrl }: { pdfUrl: string }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center items-center bg-[#FEF5FB] p-3 rounded-t-lg border-b border-[#FFD1D9] sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
            className="bg-[#E6A0B0] text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-[#D48A9A] transition-colors"
          >
            السابق
          </button>
          <span className="text-[#E6A0B0] mx-4 text-lg">
            الصفحة {pageNumber} من {numPages || '--'}
          </span>
          <button
            onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || prev))}
            disabled={numPages !== null && pageNumber >= numPages}
            className="bg-[#E6A0B0] text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-[#D48A9A] transition-colors"
          >
            التالي
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex justify-center">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex justify-center py-4"
        >
          <Page 
            pageNumber={pageNumber} 
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="shadow-lg"
          />
        </Document>
      </div>
    </div>
  );
};

export default function Element() {
  const { id } = useParams();
  const [element, setElement] = useState<Element | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedElements, setRelatedElements] = useState<Element[]>([]);
  
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [deletingFile, setDeletingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const closeModal = () => {
    setSelectedEvidence(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedEvidence) return;

    try {
      setUploadingFile(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(getApiUrl(`api/evidences/${selectedEvidence.id}/upload`), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      // تحديث قائمة الشواهد بعد الرفع
      const updatedEvidences = await fetch(getApiUrl(`api/evidences/element/${id}`));
      const updatedData = await updatedEvidences.json();
      setEvidences(updatedData);

      // تحديث الشاهد المحدد
      const updatedEvidence = updatedData.find((e: Evidence) => e.id === selectedEvidence.id);
      if (updatedEvidence) {
        setSelectedEvidence(updatedEvidence);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('حدث خطأ أثناء رفع الملف');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDeleteFile = async () => {
    if (!selectedEvidence) return;

    try {
      setDeletingFile(true);
      const response = await fetch(getApiUrl(`api/evidences/${selectedEvidence.id}/file`), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      // تحديث قائمة الشواهد بعد الحذف
      const updatedEvidences = await fetch(getApiUrl(`api/evidences/element/${id}`));
      const updatedData = await updatedEvidences.json();
      setEvidences(updatedData);

      // تحديث الشاهد المحدد
      const updatedEvidence = updatedData.find((e: Evidence) => e.id === selectedEvidence.id);
      if (updatedEvidence) {
        setSelectedEvidence(updatedEvidence);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('حدث خطأ أثناء حذف الملف');
    } finally {
      setDeletingFile(false);
    }
  };

  const handleDeleteEvidence = async (evidenceId: string) => {
    try {
      const response = await fetch(getApiUrl(`api/evidences/${evidenceId}`), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete evidence');
      }

      // Remove the deleted evidence from the state
      setEvidences(evidences.filter(e => e.id !== evidenceId));
    } catch (error) {
      console.error('Error deleting evidence:', error);
      alert('حدث خطأ أثناء حذف الشاهد');
    }
  };

  useEffect(() => {
    const fetchElementAndEvidences = async () => {
      try {
        setLoading(true);
        // جلب بيانات العنصر
        const elementResponse = await fetch(getApiUrl(`api/elements/${id}`));
        if (!elementResponse.ok) {
          throw new Error('Failed to fetch element');
        }
        const elementData = await elementResponse.json();
        setElement(elementData);

        // جلب الشواهد
        const evidencesResponse = await fetch(getApiUrl(`api/evidences/element/${id}`));
        if (!evidencesResponse.ok) {
          throw new Error('Failed to fetch evidences');
        }
        const evidencesData = await evidencesResponse.json();
        setEvidences(evidencesData);

        // جلب العناصر المرتبطة
        const relatedResponse = await fetch(getApiUrl(`api/elements/related/${id}`));
        if (!relatedResponse.ok) {
          throw new Error('Failed to fetch related elements');
        }
        const relatedData = await relatedResponse.json();
        setRelatedElements(relatedData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ أثناء جلب البيانات');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchElementAndEvidences();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-[#FEF5FB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E6A0B0] mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error || !element) {
    return (
      <div className="min-h-screen pt-16 bg-[#FEF5FB] flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-[#E6A0B0] mb-4">خطأ</h1>
          <p className="text-gray-600 mb-6">{error || "لم يتم العثور على العنصر المطلوب"}</p>
          <Link to="/" className="bg-[#E6A0B0] hover:bg-[#D48A9A] text-white py-2 px-4 rounded-lg">
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    );
  }

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
              
              <div className="hidden md:flex items-center space-x-4 space-x-reverse mr-8">
                <Link to="/" className="text-[#E6A0B0] hover:text-[#D48A9A] px-3 py-2 rounded-md text-sm font-medium nav-link">
                  الرئيسية
                </Link>
                <Link to="/#performance-elements" className="text-[#E6A0B0] hover:text-[#D48A9A] px-3 py-2 rounded-md text-sm font-medium border-b-2 border-[#FFD1D9] nav-link">
                  عناصر التقييم
                </Link>
                <Link to="/about" className="text-[#E6A0B0] hover:text-[#D48A9A] px-3 py-2 rounded-md text-sm font-medium nav-link">
                  نبذة عني
                </Link>
              </div>
            </div>
            
            <div className="md:hidden flex items-center">
              <button
                type="button"
                className="bg-[#FEF5FB] inline-flex items-center justify-center p-2 rounded-md text-[#E6A0B0] hover:text-[#D48A9A] hover:bg-[#FDF0F8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E6A0B0]"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">فتح القائمة</span>
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
        
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t border-[#f0c8c9]`}>
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

      <section className="pt-24 pb-12 px-4 bg-gradient-to-b from-[#FEF5FB] to-white relative">
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='%23FCCFE6' stroke-opacity='0.2' stroke-width='1'/%3E%3Cpath d='M28 0L56 16L56 50L28 66L0 50L0 16L28 0Z' fill='%23FCCFE6' fill-opacity='0.1'/%3E%3C/svg%3E")`
        }}></div>
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="mb-6">
            <Link to="/" className="text-[#E6A0B0] hover:text-[#D48A9A] inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-180" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="mr-1">العودة للرئيسية</span>
            </Link>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-[#E6A0B0] mb-6 relative inline-block">
            {element.title}
            <span className="absolute -top-6 -right-6 text-[#FFD1D9] opacity-50 text-4xl">✿</span>
            <span className="absolute -bottom-6 -left-6 text-[#FFD1D9] opacity-50 text-4xl">❀</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#D48A9A] mb-8">
            {element.description}
          </p>
        </div>
      </section>

      <section className="py-12 px-4 bg-white relative">
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23FCCFE6' fill-opacity='0.1'/%3E%3C/svg%3E")`
        }}></div>
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="bg-[#FEF5FB] p-6 rounded-lg shadow-sm relative overflow-hidden mb-12">
            <div className="floral-corner floral-corner-top-right"></div>
            <div className="floral-corner floral-corner-bottom-left"></div>
            <div className="relative z-10" dangerouslySetInnerHTML={{ __html: element.content }}></div>
          </div>
          
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[#E6A0B0] mb-6">الشواهد</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {evidences.map((evidence) => (
                <div 
                  key={evidence.id} 
                  className="bg-white p-5 rounded-lg shadow-sm border border-[#FDD5E9] hover:shadow-md transition-all duration-300 relative overflow-hidden group"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvidence({ ...evidence, isEditing: true });
                    }}
                    className="absolute top-3 left-3 text-[#E6A0B0] hover:text-[#D48A9A] z-10 bg-white/50 backdrop-blur-sm p-1.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white hover:scale-110 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('هل أنت متأكد من حذف هذا الشاهد؟')) {
                        handleDeleteEvidence(evidence.id);
                      }
                    }}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-600 z-10 bg-white/50 backdrop-blur-sm p-1.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white hover:scale-110 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div 
                    className="h-32 mb-4 overflow-hidden rounded-md cursor-pointer"
                    onClick={() => setSelectedEvidence(evidence)}
                  >
                    {evidence.file_type === 'image' ? (
                      <img 
                        src={getApiUrl(`api/evidences/${evidence.id}/file`)}
                        alt={evidence.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : evidence.file_type === 'video' ? (
                      <PDFPreview pdfUrl={getApiUrl(`api/evidences/${evidence.id}/file`)} fileType="video" />
                    ) : (
                      <PDFPreview pdfUrl={getApiUrl(`api/evidences/${evidence.id}/file`)} fileType="pdf" />
                    )}
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-[#E6A0B0]">{evidence.title}</h3>
                    <span className="text-sm text-gray-500">{evidence.evidence_number}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{evidence.description}</p>
                </div>
              ))}

              {/* Add New Evidence Card */}
              <div 
                className="bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-[#FDD5E9] hover:shadow-md transition-all duration-300 relative overflow-hidden group cursor-pointer h-[200px] flex flex-col justify-center"
                onClick={() => {
                  // Get the element number from the current element's ID
                  const elementNumber = element?.id || '1';
                  const nextEvidenceNumber = `${elementNumber}.${evidences.length + 1}`;
                  
                  setSelectedEvidence({ 
                    id: '', 
                    element_id: id || '', 
                    evidence_number: nextEvidenceNumber,
                    title: '',
                    description: '',
                    file_type: 'none',
                    file_name: '',
                    mime_type: '',
                    created_at: '',
                    updated_at: '',
                    isEditing: true,
                    isNew: true
                  });
                }}
              >
                <div className="h-24 mb-3 overflow-hidden rounded-md flex items-center justify-center bg-[#FEF5FB]/50">
                  <svg className="w-10 h-10 text-[#E6A0B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-semibold text-[#E6A0B0]">إضافة شاهد جديد</h3>
                  <span className="text-sm text-gray-500">{element?.id || '1'}.{evidences.length + 1}</span>
                </div>
                <p className="text-gray-600 text-xs">انقر لإضافة شاهد جديد</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedEvidence && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-[2px] flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="bg-white rounded-lg p-6 max-w-5xl w-full max-h-[95vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {selectedEvidence.isEditing ? (
                <div className="flex-1 mx-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رقم الشاهد</label>
                    <input
                      type="text"
                      value={selectedEvidence.evidence_number}
                      onChange={(e) => setSelectedEvidence({ ...selectedEvidence, evidence_number: e.target.value })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#E6A0B0] focus:ring-[#E6A0B0]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                    <input
                      type="text"
                      value={selectedEvidence.title}
                      onChange={(e) => setSelectedEvidence({ ...selectedEvidence, title: e.target.value })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#E6A0B0] focus:ring-[#E6A0B0]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                    <textarea
                      value={selectedEvidence.description || ''}
                      onChange={(e) => setSelectedEvidence({ ...selectedEvidence, description: e.target.value })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#E6A0B0] focus:ring-[#E6A0B0]"
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1 text-center mx-4">
                  <h3 className="text-xl font-semibold text-[#E6A0B0] mb-1">{selectedEvidence.title}</h3>
                  {selectedEvidence.description && (
                    <p className="text-gray-600 text-lg">{selectedEvidence.description}</p>
                  )}
                </div>
              )}

              <div className="flex items-center gap-4">
                {selectedEvidence.isEditing ? (
                  <>
                    <button
                      onClick={async () => {
                        try {
                          if (selectedEvidence.isNew) {
                            // Create new evidence
                            const response = await fetch(getApiUrl(`api/evidences/element/${id}`), {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                title: selectedEvidence.title,
                                description: selectedEvidence.description,
                                evidence_number: selectedEvidence.evidence_number,
                              }),
                            });

                            if (!response.ok) {
                              throw new Error('Failed to create evidence');
                            }

                            const newEvidence = await response.json();
                            setEvidences([...evidences, newEvidence]);
                            setSelectedEvidence(newEvidence);
                          } else {
                            // Update existing evidence
                            const response = await fetch(getApiUrl(`api/evidences/${selectedEvidence.id}/update`), {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                title: selectedEvidence.title,
                                description: selectedEvidence.description,
                                evidence_number: selectedEvidence.evidence_number,
                              }),
                            });

                            if (!response.ok) {
                              throw new Error('Failed to update evidence');
                            }

                            const updatedEvidence = await response.json();
                            setEvidences(evidences.map(e => 
                              e.id === updatedEvidence.id ? updatedEvidence : e
                            ));
                            setSelectedEvidence(null);
                          }
                        } catch (error) {
                          console.error('Error saving evidence:', error);
                          alert('حدث خطأ أثناء حفظ الشاهد');
                        }
                      }}
                      className="bg-[#E6A0B0] hover:bg-[#D48A9A] text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      {selectedEvidence.isNew ? 'إنشاء الشاهد' : 'حفظ التغييرات'}
                    </button>
                    <button
                      onClick={() => setSelectedEvidence(null)}
                      className="text-gray-600 hover:text-gray-800 py-2 px-4 rounded-lg transition-colors"
                    >
                      إلغاء
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".pdf,image/*,video/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingFile || deletingFile}
                      className="bg-[#E6A0B0] hover:bg-[#D48A9A] text-white py-2 px-4 rounded-lg flex items-center transition-colors disabled:opacity-50"
                    >
                      {uploadingFile ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          جاري الرفع...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          رفع ملف
                        </>
                      )}
                    </button>
                    {selectedEvidence.file_type && (
                      <button
                        onClick={handleDeleteFile}
                        disabled={uploadingFile || deletingFile}
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center transition-colors disabled:opacity-50"
                      >
                        {deletingFile ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            جاري الحذف...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            حذف الملف
                          </>
                        )}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
            
            {!selectedEvidence.isEditing && (
              selectedEvidence.file_type === 'pdf' ? (
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                  <EnhancedPDFViewer 
                    key={selectedEvidence.updated_at}
                    pdfUrl={getApiUrl(`api/evidences/${selectedEvidence.id}/file`)}
                  />
                </div>
              ) : selectedEvidence.file_type === 'video' ? (
                <div className="flex-1 overflow-y-auto overflow-x-hidden flex items-start justify-center py-4">
                  <video
                    key={selectedEvidence.updated_at}
                    src={getApiUrl(`api/evidences/${selectedEvidence.id}/file`)}
                    controls
                    autoPlay
                    className="max-w-full rounded-lg shadow-lg"
                    style={{ maxHeight: '70vh' }}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto overflow-x-hidden flex items-start justify-center py-4">
                  <img
                    key={selectedEvidence.updated_at}
                    src={getApiUrl(`api/evidences/${selectedEvidence.id}/file`)}
                    alt={selectedEvidence.title}
                    className="max-w-full rounded-lg shadow-lg"
                  />
                </div>
              )
            )}
          </div>
        </div>
      )}

      <section className="py-12 px-4 bg-gradient-to-b from-white to-[#FEF5FB] relative">
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='88' height='24' viewBox='0 0 88 24'%3E%3Cg fill='%23FCCFE6' fill-opacity='0.2'%3E%3Cpath d='M10 0l12 6v12l-12 6L0 18V6L10 0zm56 0l12 6v12l-12 6-12-6V6l12-6z'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <h2 className="text-2xl font-bold text-[#E6A0B0] mb-8 relative inline-block">
            عناصر أخرى
            <span className="absolute top-0 -right-6 text-[#FFD1D9] opacity-30 text-xl">❀</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedElements.map((elem) => (
              <Link 
                key={elem.id}
                to={`/element/${elem.id}`}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-[#FDD5E9] flex flex-col group"
              >
                <div className="w-12 h-12 bg-[#FEF5FB] text-[#E6A0B0] rounded-full flex items-center justify-center mb-3 shrink-0 group-hover:bg-[#FDF0F8] transition-colors">
                  <span className="text-lg font-bold">{elem.id}</span>
                </div>
                <h3 className="text-lg font-semibold text-[#E6A0B0] group-hover:text-[#D48A9A] transition-colors">{elem.title}</h3>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link 
              to="/"
              className="inline-block bg-[#E6A0B0] hover:bg-[#D48A9A] text-white py-2 px-6 rounded-lg transition-all shadow-sm hover:shadow-md"
            >
              العودة إلى جميع العناصر
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-10 px-4 bg-white border-t border-[#FDD5E9] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FCCFE6' fill-opacity='0.4'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
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