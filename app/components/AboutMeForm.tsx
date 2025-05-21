import { useState, useEffect } from "react";

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

interface AboutMeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AboutMeData) => void;
  initialData: AboutMeData | null;
}

export default function AboutMeForm({ isOpen, onClose, onSave, initialData }: AboutMeFormProps) {
  const [formData, setFormData] = useState<AboutMeData>({
    name: "",
    title: "",
    bio: "",
    image_url: "",
    email: "",
    phone: "",
    school: "",
    education: [],
    experience: [],
    skills: [],
    achievements: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        title: initialData.title || "",
        bio: initialData.bio || "",
        image_url: initialData.image_url || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        school: initialData.school || "",
        education: initialData.education || [],
        experience: initialData.experience || [],
        skills: initialData.skills || [],
        achievements: initialData.achievements || []
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-[#E6A0B0] mb-6">تعديل نبذة عني</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-[#FDD5E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6A0B0]"
              placeholder="مثال: نوال الغامدي"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المسمى الوظيفي</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-[#FDD5E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6A0B0]"
              placeholder="مثال: معلمة متميزة - مادة العلوم"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نبذة تعريفية</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-[#FDD5E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6A0B0]"
              placeholder="مثال: معلمة متميزة بخبرة 12 عامًا في تدريس مادة العلوم للمرحلة المتوسطة..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رابط الصورة</label>
            <input
              type="text"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2 border border-[#FDD5E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6A0B0]"
              placeholder="مثال: https://example.com/image.jpg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-[#FDD5E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6A0B0]"
              placeholder="مثال: teacher@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-[#FDD5E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6A0B0]"
              placeholder="مثال: +966 5x xxx xxxx"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المدرسة</label>
            <input
              type="text"
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              className="w-full px-4 py-2 border border-[#FDD5E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6A0B0]"
              placeholder="مثال: مدرسة التميز المتوسطة - الرياض"
            />
          </div>
          
          {/* المؤهلات العلمية */}
          <div>
            <h3 className="text-lg font-semibold text-[#E6A0B0] mb-4">المؤهلات العلمية</h3>
            {formData.education.map((edu, index) => (
              <div key={index} className="mb-4 p-4 border border-[#FDD5E9] rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الدرجة العلمية</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const newEducation = [...formData.education];
                        newEducation[index] = { ...edu, degree: e.target.value };
                        setFormData({ ...formData, education: newEducation });
                      }}
                      className="w-full px-4 py-2 border border-[#FDD5E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6A0B0]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الجامعة</label>
                    <input
                      type="text"
                      value={edu.university}
                      onChange={(e) => {
                        const newEducation = [...formData.education];
                        newEducation[index] = { ...edu, university: e.target.value };
                        setFormData({ ...formData, education: newEducation });
                      }}
                      className="w-full px-4 py-2 border border-[#FDD5E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6A0B0]"
                      placeholder="مثال: جامعة الملك سعود"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">السنة</label>
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => {
                        const newEducation = [...formData.education];
                        newEducation[index] = { ...edu, year: e.target.value };
                        setFormData({ ...formData, education: newEducation });
                      }}
                      className="w-full px-4 py-2 border border-[#FDD5E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6A0B0]"
                      placeholder="مثال: 2018"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                    <textarea
                      value={edu.description}
                      onChange={(e) => {
                        const newEducation = [...formData.education];
                        newEducation[index] = { ...edu, description: e.target.value };
                        setFormData({ ...formData, education: newEducation });
                      }}
                      className="w-full px-4 py-2 border border-[#FDD5E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6A0B0]"
                      rows={2}
                      placeholder="مثال: أكملت رسالة ماجستير عن أثر استخدام استراتيجيات التعلم النشط في تدريس العلوم"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newEducation = formData.education.filter((_, i) => i !== index);
                    setFormData({ ...formData, education: newEducation });
                  }}
                  className="mt-2 text-red-600 hover:text-red-800"
                >
                  حذف
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  education: [
                    ...formData.education,
                    { degree: '', university: '', year: '', description: '' }
                  ]
                });
              }}
              className="text-[#E6A0B0] hover:text-[#FFD1D9]"
            >
              + إضافة مؤهل علمي
            </button>
          </div>

          {/* الخبرات المهنية */}
          <div>
            <h3 className="text-lg font-semibold text-[#E6A0B0] mb-4">الخبرات المهنية</h3>
            {formData.experience.map((exp, index) => (
              <div key={index} className="mb-4 p-4 border border-[#FDD5E9] rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">المسمى الوظيفي</label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => {
                        const newExperience = [...formData.experience];
                        newExperience[index] = { ...exp, title: e.target.value };
                        setFormData({ ...formData, experience: newExperience });
                      }}
                      className="w-full px-4 py-2 border border-[#FDD5E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6A0B0]"
                      placeholder="مثال: معلمة أولى لمادة العلوم"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">المدرسة</label>
                    <input
                      type="text"
                      value={exp.school}
                      onChange={(e) => {
                        const newExperience = [...formData.experience];
                        newExperience[index] = { ...exp, school: e.target.value };
                        setFormData({ ...formData, experience: newExperience });
                      }}
                      className="w-full px-4 py-2 border border-[#FDD5E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6A0B0]"
                      placeholder="مثال: مدرسة التميز المتوسطة"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الفترة</label>
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => {
                        const newExperience = [...formData.experience];
                        newExperience[index] = { ...exp, period: e.target.value };
                        setFormData({ ...formData, experience: newExperience });
                      }}
                      className="w-full px-4 py-2 border border-[#FDD5E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6A0B0]"
                      placeholder="مثال: 2018 حتى الآن"
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">المسؤوليات</label>
                  {exp.responsibilities?.map((resp: string, respIndex: number) => (
                    <div key={respIndex} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={resp}
                        onChange={(e) => {
                          const newExperience = [...formData.experience];
                          const newResponsibilities = [...exp.responsibilities];
                          newResponsibilities[respIndex] = e.target.value;
                          newExperience[index] = { ...exp, responsibilities: newResponsibilities };
                          setFormData({ ...formData, experience: newExperience });
                        }}
                        className="flex-1 px-4 py-2 border border-[#FDD5E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6A0B0]"
                        placeholder="مثال: قيادة فريق معلمات العلوم وتنسيق المناهج الدراسية"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newExperience = [...formData.experience];
                          const newResponsibilities = exp.responsibilities.filter((_: string, i: number) => i !== respIndex);
                          newExperience[index] = { ...exp, responsibilities: newResponsibilities };
                          setFormData({ ...formData, experience: newExperience });
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newExperience = [...formData.experience];
                      newExperience[index] = {
                        ...exp,
                        responsibilities: [...(exp.responsibilities || []), '']
                      };
                      setFormData({ ...formData, experience: newExperience });
                    }}
                    className="text-[#E6A0B0] hover:text-[#FFD1D9]"
                  >
                    + إضافة مسؤولية
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newExperience = formData.experience.filter((_, i) => i !== index);
                    setFormData({ ...formData, experience: newExperience });
                  }}
                  className="mt-2 text-red-600 hover:text-red-800"
                >
                  حذف الخبرة
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  experience: [
                    ...formData.experience,
                    { title: '', school: '', period: '', responsibilities: [] }
                  ]
                });
              }}
              className="text-[#E6A0B0] hover:text-[#FFD1D9]"
            >
              + إضافة خبرة مهنية
            </button>
          </div>

          {/* المهارات */}
          <div>
            <h3 className="text-lg font-semibold text-[#E6A0B0] mb-4">المهارات</h3>
            {formData.skills.map((skill, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => {
                    const newSkills = [...formData.skills];
                    newSkills[index] = { name: e.target.value };
                    setFormData({ ...formData, skills: newSkills });
                  }}
                  className="flex-1 px-4 py-2 border border-[#FDD5E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6A0B0]"
                  placeholder="مثال: التعلم النشط"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newSkills = formData.skills.filter((_, i) => i !== index);
                    setFormData({ ...formData, skills: newSkills });
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  حذف
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  skills: [...formData.skills, { name: '' }]
                });
              }}
              className="text-[#E6A0B0] hover:text-[#FFD1D9]"
            >
              + إضافة مهارة
            </button>
          </div>

          {/* الإنجازات */}
          <div>
            <h3 className="text-lg font-semibold text-[#E6A0B0] mb-4">الإنجازات</h3>
            {formData.achievements.map((achievement, index) => (
              <div key={index} className="mb-4 p-4 border border-[#FDD5E9] rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الإنجاز</label>
                    <input
                      type="text"
                      value={achievement.title}
                      onChange={(e) => {
                        const newAchievements = [...formData.achievements];
                        newAchievements[index] = { ...achievement, title: e.target.value };
                        setFormData({ ...formData, achievements: newAchievements });
                      }}
                      className="w-full px-4 py-2 border border-[#FDD5E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6A0B0]"
                      placeholder="مثال: جائزة المعلم المتميز"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">السنة</label>
                    <input
                      type="text"
                      value={achievement.year}
                      onChange={(e) => {
                        const newAchievements = [...formData.achievements];
                        newAchievements[index] = { ...achievement, year: e.target.value };
                        setFormData({ ...formData, achievements: newAchievements });
                      }}
                      className="w-full px-4 py-2 border border-[#FDD5E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6A0B0]"
                      placeholder="مثال: 2021"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">الجهة المانحة</label>
                    <input
                      type="text"
                      value={achievement.issuer}
                      onChange={(e) => {
                        const newAchievements = [...formData.achievements];
                        newAchievements[index] = { ...achievement, issuer: e.target.value };
                        setFormData({ ...formData, achievements: newAchievements });
                      }}
                      className="w-full px-4 py-2 border border-[#FDD5E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6A0B0]"
                      placeholder="مثال: على مستوى الإدارة التعليمية"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newAchievements = formData.achievements.filter((_, i) => i !== index);
                    setFormData({ ...formData, achievements: newAchievements });
                  }}
                  className="mt-2 text-red-600 hover:text-red-800"
                >
                  حذف
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  achievements: [
                    ...formData.achievements,
                    { title: '', year: '', issuer: '' }
                  ]
                });
              }}
              className="text-[#E6A0B0] hover:text-[#FFD1D9]"
            >
              + إضافة إنجاز
            </button>
          </div>
          
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#E6A0B0] hover:bg-[#FFD1D9] text-white rounded-md"
            >
              حفظ التغييرات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 