import Image from "next/image";
import { Phone, Mail } from "lucide-react";

const quickLinks = ["الرئيسية", "عن النقابة", "التسجيل في النقابة", "اللوائح والقوانين", "الأخبار"];
const services = ["خدمة تجديد العضوية", "إصدار كارنيه نقابة", "تسجيل الخريجين", "خدمة الشكاوى والاستفسارات", "إصدار شهادات رسمية"];
const resources = ["دليل الصيدلي", "الأسئلة الشائعة", "نماذج وملفات", "اللوائح والقوانين", "دليل الصيدليات"];

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z" />
    </svg>
  );
}

const socials = [LinkedinIcon, InstagramIcon, TwitterIcon, FacebookIcon];

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="text-right">
      <h4 className="font-bold text-white mb-4">{title}</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">{link}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="text-right col-span-2 md:col-span-1 flex flex-col items-start">
            <Image src="/logo-white.png" alt="النقابة العامة لصيادلة مصر" width={405} height={180} className="h-14 w-auto" />
            <p className="mt-4 text-sm text-white/60 leading-relaxed w-full">
              نقابة الصيادلة جمعية مهنية تهدف إلى دعم الصيادلة، تطوير القطاع الدوائي، تقديم خدمات مهنية ومالية وصحية، وتمثيل الصيادلة أمام الجهات الرسمية.
            </p>
            <div className="mt-5 flex gap-3 justify-end">
              {socials.map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-light transition-colors">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="روابط سريعة" links={quickLinks} />
          <FooterColumn title="الخدمات" links={services} />
          <FooterColumn title="المصادر" links={resources} />

          <div className="text-right col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Phone className="w-4 h-4 text-primary-light" />
              اتصل بنا على
            </div>
            <div className="mt-1 font-bold">800 2656</div>

            <div className="mt-6 flex items-center gap-2 text-sm text-white/60">
              <Mail className="w-4 h-4 text-primary-light" />
              هل لديك سؤال؟
            </div>
            <div className="mt-1 font-bold text-sm">Info@Ph-Syndicate.Org</div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 text-center text-xs text-white/40">
          © 2026 جميع الحقوق محفوظة - نقابة الصيادلة
        </div>
      </div>
    </footer>
  );
}