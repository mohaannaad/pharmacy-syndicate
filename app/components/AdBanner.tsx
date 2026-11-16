import Image from "next/image";
import Link from "next/link";

// مساحة إعلانية: بتشجّع الزائر يضيف إعلانه من خدمة «إضافة إعلان»
export default function AdBanner() {
  return (
    <div className="relative overflow-hidden rounded-[32px] bg-mint flex items-center justify-between gap-6 px-7 md:px-14 min-h-[240px] flex-wrap">
      <span className="absolute -left-20 -top-20 w-72 h-72 rounded-full border-[48px] border-white/40" />
      <div className="relative flex flex-col gap-3 py-9 max-w-xl text-right">
        <span className="text-[#3F8F2A] font-bold text-sm">مساحة إعلانية</span>
        <p className="text-2xl md:text-3xl font-extrabold text-primary-dark leading-snug">أعلن عن صيدليتك أو خدماتك على بوابة النقابة</p>
        <Link href="/services/ad" className="self-start bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-pill transition-colors">أضف إعلانك</Link>
      </div>
      <Image src="/doctor.png" alt="" width={420} height={560} className="relative hidden md:block h-[270px] w-auto self-end" />
    </div>
  );
}
