import type { Route } from "./+types/element";
import { Link, useParams } from "react-router";
import { useState, useEffect, useRef } from "react";
import PDFViewer from "../pdfViewer";
import { pdfjs } from 'react-pdf';
import { Document, Page } from 'react-pdf';

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
  file_type: 'pdf' | 'image';
  file_name: string;
  mime_type: string;
  created_at: string;
  updated_at: string;
}

export function meta({ params }: Route.MetaArgs) {
  const elementId = params.id;
  
  return [
    { title: "عنصر التقييم - بورتفوليو المعلمة" },
    { name: "description", content: "صفحة عنصر التقييم" },
  ];
}

// Add PDF preview component
const PDFPreview = ({ pdfUrl }: { pdfUrl: string }) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
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
          
          setPreviewUrl(canvas.toDataURL());
        }
      } catch (error) {
        console.error('Error generating PDF preview:', error);
      }
    };

    loadPdfPreview();
  }, [pdfUrl]);

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

      const response = await fetch(`http://localhost:5000/api/evidences/${selectedEvidence.id}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      // تحديث قائمة الشواهد بعد الرفع
      const updatedEvidences = await fetch(`http://localhost:5000/api/evidences/element/${id}`);
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

  useEffect(() => {
    const fetchElementAndEvidences = async () => {
      try {
        setLoading(true);
        // جلب بيانات العنصر
        const elementResponse = await fetch(`http://localhost:5000/api/elements/${id}`);
        if (!elementResponse.ok) {
          throw new Error('Failed to fetch element');
        }
        const elementData = await elementResponse.json();
        setElement(elementData);

        // جلب الشواهد
        const evidencesResponse = await fetch(`http://localhost:5000/api/evidences/element/${id}`);
        if (!evidencesResponse.ok) {
          throw new Error('Failed to fetch evidences');
        }
        const evidencesData = await evidencesResponse.json();
        setEvidences(evidencesData);

        // جلب العناصر المرتبطة
        const relatedResponse = await fetch(`http://localhost:5000/api/elements/related/${id}`);
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
                  className="bg-white p-5 rounded-lg shadow-sm border border-[#FDD5E9] hover:shadow-md transition-all duration-300 relative overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedEvidence(evidence)}
                >
                  <div className="h-32 mb-4 overflow-hidden rounded-md">
                    {evidence.file_type === 'image' ? (
                      <img 
                        src={`http://localhost:5000/api/evidences/${evidence.id}/file`}
                        alt={evidence.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <PDFPreview pdfUrl={`http://localhost:5000/api/evidences/${evidence.id}/file`} />
                    )}
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-[#E6A0B0]">{evidence.title}</h3>
                    <span className="text-sm text-gray-500">{evidence.evidence_number}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{evidence.description}</p>
                </div>
              ))}
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

              <div className="flex-1 text-center mx-4">
                <h3 className="text-xl font-semibold text-[#E6A0B0] mb-1">{selectedEvidence.title}</h3>
                {selectedEvidence.description && (
                  <p className="text-gray-600 text-lg">{selectedEvidence.description}</p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingFile}
                  className="bg-[#E6A0B0] hover:bg-[#D48A9A] text-white py-2 px-4 rounded-lg flex items-center transition-colors"
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
              </div>
            </div>
            
            {selectedEvidence.file_type === 'pdf' ? (
              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <EnhancedPDFViewer 
                  key={selectedEvidence.updated_at}
                  pdfUrl={`http://localhost:5000/api/evidences/${selectedEvidence.id}/file`}
                />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto overflow-x-hidden flex items-start justify-center py-4">
                <img
                  key={selectedEvidence.updated_at}
                  src={`http://localhost:5000/api/evidences/${selectedEvidence.id}/file`}
                  alt={selectedEvidence.title}
                  className="max-w-full rounded-lg shadow-lg"
                />
              </div>
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