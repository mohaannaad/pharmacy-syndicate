import { FileEdit, Ban, Download, History } from "lucide-react";

type Status = "pending" | "rejected" | "approved";

interface CertificateCardProps {
  title: string;
  date: string;
  number: string;
  price: string;
  status: Status;
}

const statusConfig: Record<Status, { icon: typeof History; bg: string; text: string }> = {
  pending: { icon: History, bg: "bg-yellow-100", text: "text-yellow-600" },
  rejected: { icon: Ban, bg: "bg-red-100", text: "text-red-500" },
  approved: { icon: Download, bg: "bg-primary", text: "text-white" },
};

export default function CertificateCard({ title, date, number, price, status }: CertificateCardProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-full ${config.bg} flex items-center justify-center shrink-0`}>
          <StatusIcon className={`w-4 h-4 ${config.text}`} />
        </div>
        <div className="text-right flex-1 mx-3">
          <div className="font-bold text-gray-900">{title}</div>
          <div className="text-xs text-gray-400 mt-1">{date}</div>
        </div>
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <FileEdit className="w-4 h-4 text-primary" />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
        <span className="text-gray-500">السعر: <span className="font-bold text-gray-900">{price}</span></span>
        <span className="text-gray-500">رقم: <span className="font-bold text-gray-900">{number}</span></span>
      </div>
    </div>
  );
}