// =====================================================================
// كل "القواعد" الخاصة بطلب قيد الخريج في مكان واحد:
// القوائم (محافظات، جامعات...)، المستندات المطلوبة، والرسوم.
// الملف ده بيستخدمه الفورم (في المتصفح) والـ API (في السيرفر) مع بعض،
// عشان القاعدة تبقى مكتوبة مرة واحدة بس.
// =====================================================================

export type UniversityType = "GOVERNMENT" | "PRIVATE" | "FOREIGN";
export type Gender = "MALE" | "FEMALE";

export const GOVERNORATES = [
  "القاهرة", "الجيزة", "الإسكندرية", "القليوبية", "الشرقية", "الدقهلية", "الغربية",
  "المنوفية", "البحيرة", "كفر الشيخ", "دمياط", "بورسعيد", "الإسماعيلية", "السويس",
  "الفيوم", "بني سويف", "المنيا", "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان",
  "البحر الأحمر", "الوادي الجديد", "مطروح", "شمال سيناء", "جنوب سيناء",
];

export const UNIVERSITY_TYPES: { value: UniversityType; label: string }[] = [
  { value: "GOVERNMENT", label: "جامعة حكومية" },
  { value: "PRIVATE", label: "جامعة خاصة" },
  { value: "FOREIGN", label: "جامعة خارج مصر" },
];

// ⚠️ قوائم مبدئية — لازم تتبدل بالقائمة الرسمية من النقابة
export const GOVERNMENT_UNIVERSITIES = [
  "جامعة القاهرة", "جامعة عين شمس", "جامعة الإسكندرية", "جامعة المنصورة", "جامعة طنطا",
  "جامعة الزقازيق", "جامعة أسيوط", "جامعة المنوفية", "جامعة بني سويف", "جامعة المنيا",
  "جامعة حلوان", "جامعة كفر الشيخ", "جامعة دمنهور", "جامعة مدينة السادات",
  "جامعة جنوب الوادي", "جامعة قناة السويس", "جامعة بورسعيد", "جامعة الفيوم", "جامعة سوهاج",
  "جامعة الأزهر",
];

export const PRIVATE_UNIVERSITIES = [
  "جامعة مصر الدولية", "جامعة مصر للعلوم والتكنولوجيا", "جامعة 6 أكتوبر", "جامعة المستقبل",
  "الجامعة البريطانية في مصر", "جامعة فاروس", "جامعة سيناء", "جامعة الدلتا",
  "جامعة النهضة", "جامعة دراية", "جامعة بدر", "جامعة الأهرام الكندية",
  "الجامعة المصرية الروسية", "جامعة حورس", "الجامعة الحديثة للتكنولوجيا والمعلومات",
];

export const HIGH_SCHOOL_TYPES = [
  "ثانوية عامة مصرية",
  "ثانوية أزهرية",
  "دبلومة أمريكية",
  "شهادة إنجليزية (IGCSE)",
  "ثانوية من خارج مصر",
  "أخرى",
];

export const GRADES = ["امتياز", "جيد جدًا", "جيد", "مقبول"];

// ---------------------------------------------------------------------
// المستندات المطلوبة
// ---------------------------------------------------------------------
export interface RequiredDocument {
  key: string;
  label: string;
  original: boolean; // true = لازم يسلّم "الأصل" لما يحضر النقابة
}

// الإجابات اللي بتحدد المستندات
export interface DocumentAnswers {
  universityType: UniversityType;
  universityName: string;
  gender: Gender | "";
  nationality: string;
  studyYears: number;
  highSchoolType: string;
  hasPreviousQualification: boolean;
  previousRejection: boolean;
}

function isEgyptian(nationality: string) {
  return nationality.trim() === "" || nationality.includes("مصر");
}

// ثانوية أزهرية أو أمريكية أو إنجليزية (داخل مصر) → محتاج إفادة بالنسبة
function needsHighSchoolStatement(highSchoolType: string) {
  return ["ثانوية أزهرية", "دبلومة أمريكية", "شهادة إنجليزية (IGCSE)"].includes(highSchoolType);
}

export function getRequiredDocuments(a: DocumentAnswers): RequiredDocument[] {
  const docs: RequiredDocument[] = [];
  const add = (key: string, label: string, original: boolean) => docs.push({ key, label, original });

  const foreigner = !isEgyptian(a.nationality);
  const male = a.gender === "MALE";

  if (a.universityType === "GOVERNMENT") {
    const azhar = a.universityName.includes("الأزهر");
    add("graduation", "شهادة التخرج", true);
    add("excellence", "شهادة الامتياز", azhar);
    add("nationalId", "بطاقة الرقم القومي (وجه وظهر)", false);
    add("birth", "شهادة الميلاد", false);
    if (male) add("military", "موقف التجنيد", false);
    add("highSchool", "شهادة الثانوية العامة", false);
    add("criminal", "صحيفة الحالة الجنائية", true);
    add("photos", "صورتين شخصيتين مختومتين من الجامعة", false);
    if (foreigner) add("nationality", "شهادة اكتساب الجنسية", true);
    if (a.studyYears > 6) add("transcript", "بيان الدرجات", true);
    if (a.hasPreviousQualification) add("previous", "مستندات المؤهل السابق وإلغاء الترخيص العلمي السابق", false);
  }

  if (a.universityType === "PRIVATE") {
    add("graduation", "شهادة التخرج", true);
    add("excellence", "شهادة الامتياز", false);
    add("equivalency", "شهادة المعادلة الجامعية", false);
    add("nationalId", "بطاقة الرقم القومي (وجه وظهر)", false);
    add("birth", "شهادة الميلاد", false);
    if (male) add("military", "موقف التجنيد", false);
    add("highSchool", "شهادة الثانوية العامة أو ما يعادلها", false);
    add("criminal", "صحيفة الحالة الجنائية", true);
    add("photos", "صورتين شخصيتين مختومتين من الجامعة", false);
    if (foreigner) add("nationality", "شهادة اكتساب الجنسية", true);
    if (a.studyYears > 5) add("transcript", "بيان الدرجات", true);
    if (needsHighSchoolStatement(a.highSchoolType)) add("hsStatement", "إفادة من الجامعة بنسبة الثانوية العامة", false);
    if (a.hasPreviousQualification) add("previous", "مستندات المؤهل السابق وإلغاء الترخيص العلمي السابق", false);
  }

  if (a.universityType === "FOREIGN") {
    add("graduation", "شهادة التخرج موثقة من وزارة الخارجية المصرية", true);
    add("transcript", "بيان الدرجات موضحًا عدد سنوات ومواد الدراسة", true);
    add("equivalency", "شهادة المعادلة من المجلس الأعلى للجامعات", true);
    add("legislation", "شهادة التشريعات من جامعة حكومية", true);
    add("movements", "شهادة التحركات المفصلة", true);
    add("passport", "جواز السفر", true);
    add("nationalId", foreigner ? "جواز السفر (بدل البطاقة)" : "بطاقة الرقم القومي", false);
    add("birth", "شهادة الميلاد", false);
    add("highSchool", "شهادة الثانوية العامة", false);
    if (male) add("military", "موقف التجنيد", false);
    add("criminal", "صحيفة الحالة الجنائية موجهة إلى نقابة الصيادلة", true);
    add("photos", "صورتين شخصيتين", false);
    if (foreigner) add("nationality", "مستند اكتساب الجنسية المصرية", false);
    if (a.hasPreviousQualification) add("previous", "مستندات المؤهل السابق", false);
    if (needsHighSchoolStatement(a.highSchoolType)) add("hsStatement", "إفادة بنسبة الثانوية", false);
    if (a.previousRejection) add("courtRuling", "الحكم النهائي من مجلس الدولة", true);
  }

  return docs;
}

// ---------------------------------------------------------------------
// الرسوم (دفعة 2026)
// ---------------------------------------------------------------------
// الجامعات الخاصة والخارجية ليها 3 فئات، والفئة بتحددها النقابة وقت المراجعة،
// عشان كده الرسوم بتظهر فورًا للحكومي بس، والباقي بعد تحديد الفئة.
export const PRIVATE_CATEGORY_FEES: Record<1 | 2 | 3, number> = { 1: 3800, 2: 11800, 3: 23800 };
export const GOVERNMENT_FEE = 1300;

export function lateFee(graduationYear: number, currentYear = new Date().getFullYear()) {
  const lateYears = currentYear - graduationYear;
  if (lateYears <= 0) return 0;
  if (lateYears <= 2) return lateYears * 100;
  return lateYears * 250;
}

// بترجع null لو الرسوم لسه مش معروفة (خاص/خارجي قبل تحديد الفئة)
export function calculateFee(universityType: UniversityType, graduationYear: number, category?: 1 | 2 | 3) {
  const late = lateFee(graduationYear);
  if (universityType === "GOVERNMENT") return GOVERNMENT_FEE + late;
  if (category) return PRIVATE_CATEGORY_FEES[category] + late;
  return null;
}

// ---------------------------------------------------------------------
// رقم المتابعة وحالات الطلب
// ---------------------------------------------------------------------
export function trackingNumber(serial: number, createdAt: string | Date) {
  const year = new Date(createdAt).getFullYear();
  return `GRD-${year}-${String(serial).padStart(5, "0")}`;
}

export const GRADUATE_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  AWAITING_PAYMENT: { label: "في انتظار الدفع", color: "bg-yellow-100 text-yellow-700" },
  UNDER_REVIEW: { label: "قيد المراجعة", color: "bg-orange-100 text-orange-700" },
  NEEDS_COMPLETION: { label: "مطلوب استكمال", color: "bg-red-100 text-red-700" },
  AWAITING_ORIGINALS: { label: "في انتظار تسليم الأصول", color: "bg-blue-100 text-blue-700" },
  LICENSING: { label: "لدى إدارة التراخيص", color: "bg-teal-100 text-teal-700" },
  REGISTERED: { label: "تم القيد", color: "bg-green-100 text-green-700" },
  REJECTED: { label: "مرفوض", color: "bg-gray-200 text-gray-700" },
};

// ---------------------------------------------------------------------
// الجنسيات المسموح بقيدها
// ---------------------------------------------------------------------
// لا يتم قيد الجنسيات الأجنبية باستثناء الفلسطينية والسودانية
export const NATIONALITIES = ["مصري", "فلسطيني", "سوداني", "أخرى"];

export function isNationalityAllowed(nationality: string) {
  return ["مصري", "فلسطيني", "سوداني"].includes(nationality);
}

// ---------------------------------------------------------------------
// نسب قبول الجامعات الخاصة (حسب سنة الثانوية العامة)
// ---------------------------------------------------------------------
// privateMin  = تنسيق الجامعات الخاصة (المجلس الأعلى للجامعات)
// fivePercent = قرار الجمعية العمومية (5% أقل من التنسيق الحكومي)
// النسب مكتوبة كنسبة مئوية (85 = 85%)
interface AdmissionThreshold {
  privateMin: number;
  fivePercent: number;
}

const PRIVATE_THRESHOLDS: Record<number, AdmissionThreshold> = {
  2014: { privateMin: 85, fivePercent: 91.5 },
  2015: { privateMin: 85, fivePercent: 91.5 },
  2016: { privateMin: 90, fivePercent: 92.2 },
  2017: { privateMin: 90, fivePercent: 90.9 },
  2018: { privateMin: 89.5, fivePercent: 91.8 },
  2019: { privateMin: 89.5, fivePercent: 92.8 },
  2020: { privateMin: 90, fivePercent: 93.05 },
};

// جامعة سيناء ليها نسب خاصة بيها
const SINAI_THRESHOLDS: Record<number, AdmissionThreshold> = {
  2014: { privateMin: 80, fivePercent: 86.4 },
  2015: { privateMin: 80, fivePercent: 86.4 },
  2016: { privateMin: 85, fivePercent: 87 },
  2017: { privateMin: 85, fivePercent: 85.9 },
  2018: { privateMin: 85, fivePercent: 86.8 },
  2019: { privateMin: 85, fivePercent: 87.8 },
  2020: { privateMin: 85, fivePercent: 88.05 },
};

// المجموع الكلي للثانوية العامة المصرية
export const HIGH_SCHOOL_TOTAL = 410;

export function getAdmissionThreshold(universityName: string, highSchoolYear: number) {
  const table = universityName.includes("سيناء") ? SINAI_THRESHOLDS : PRIVATE_THRESHOLDS;
  return table[highSchoolYear] ?? null;
}

// بتحدد فئة الخريج (1 أو 2 أو 3) من نسبة الثانوية
// بترجع null لو سنة الثانوية مش موجودة في الجدول → الموظف يحددها يدويًا
export function determinePrivateCategory(universityName: string, highSchoolYear: number, percent: number): 1 | 2 | 3 | null {
  const threshold = getAdmissionThreshold(universityName, highSchoolYear);
  if (!threshold || !percent) return null;
  if (percent >= threshold.fivePercent) return 1; // خاص عادي
  if (percent >= threshold.privateMin) return 2; // خاص
  return 3; // المجموع الأقل
}

export const CATEGORY_LABELS: Record<number, string> = {
  1: "فئة أولى — خاص عادي",
  2: "فئة ثانية — خاص",
  3: "فئة ثالثة — المجموع الأقل",
};