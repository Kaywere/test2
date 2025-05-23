import React, { useState } from 'react';
import { Evidence as EvidenceType } from '../types/evidence';
import { FaEye, FaTrash, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface EvidenceProps {
    evidence: EvidenceType;
    onDelete: (id: number) => void;
    onUpdate: (evidence: EvidenceType) => void;
}

export const Evidence: React.FC<EvidenceProps> = ({ evidence, onDelete, onUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedEvidence, setEditedEvidence] = useState<EvidenceType>(evidence);

    const handleEdit = () => {
        setIsEditMode(true);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/evidences/${evidence.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedEvidence),
            });

            if (!response.ok) {
                throw new Error('Failed to update evidence');
            }

            const updatedEvidence = await response.json();
            onUpdate(updatedEvidence);
            setIsEditMode(false);
            toast.success('تم تحديث الشاهد بنجاح');
        } catch (error) {
            console.error('Error updating evidence:', error);
            toast.error('حدث خطأ أثناء تحديث الشاهد');
        }
    };

    const handleCancel = () => {
        setEditedEvidence(evidence);
        setIsEditMode(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 relative">
            <button
                onClick={handleEdit}
                className="absolute top-2 right-2 text-gray-600 hover:text-blue-600"
            >
                <FaEdit />
            </button>
            
            {isEditMode ? (
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">رقم الشاهد</label>
                        <input
                            type="text"
                            value={editedEvidence.evidence_number}
                            onChange={(e) => setEditedEvidence({ ...editedEvidence, evidence_number: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">العنوان</label>
                        <input
                            type="text"
                            value={editedEvidence.title}
                            onChange={(e) => setEditedEvidence({ ...editedEvidence, title: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">الوصف</label>
                        <textarea
                            value={editedEvidence.description || ''}
                            onChange={(e) => setEditedEvidence({ ...editedEvidence, description: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            rows={3}
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={handleCancel}
                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            حفظ
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <h3 className="text-lg font-semibold mb-2">{evidence.title}</h3>
                    <p className="text-gray-600 mb-2">رقم الشاهد: {evidence.evidence_number}</p>
                    {evidence.description && (
                        <p className="text-gray-600 mb-4">{evidence.description}</p>
                    )}
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            <FaEye />
                        </button>
                        <button
                            onClick={() => onDelete(evidence.id)}
                            className="text-red-600 hover:text-red-800"
                        >
                            <FaTrash />
                        </button>
                    </div>
                </>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{evidence.title}</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>
                        <div className="space-y-4">
                            <p className="text-gray-600">رقم الشاهد: {evidence.evidence_number}</p>
                            {evidence.description && (
                                <p className="text-gray-600">{evidence.description}</p>
                            )}
                            {evidence.files && evidence.files.length > 0 ? (
                                <div className="space-y-2">
                                    <h3 className="font-semibold">الملفات المرفقة:</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {evidence.files.map((file) => (
                                            <div
                                                key={file.id}
                                                className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    {file.file_type === 'pdf' ? (
                                                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                                        </svg>
                                                    )}
                                                    <span className="text-sm">{file.file_name}</span>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <a
                                                        href={`http://localhost:3001/api/evidences/file/${file.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        <FaEye />
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500">لا توجد ملفات مرفقة</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}; 