import { MapPin, LocateFixed, User, Users } from "lucide-react";

interface BranchCardProps {
  name: string;
  address: string;
  phone: string;
  hours: string;
  representative: string;
  council: string;
}

export default function BranchCard({ name, address, phone, hours, representative, council }: BranchCardProps) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-gray-900">{name}</span>
        </div>

        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
          <LocateFixed className="w-5 h-5 text-white" />
        </a>
      </div>

      <div className="text-xs text-gray-400 mt-2 text-right">{address}</div>

      <div className="mt-4 pt-4 border-t border-gray-100 text-right space-y-1.5">
        <div className="text-sm font-bold text-gray-900" dir="ltr" style={{ textAlign: "right" }}>
          {phone}
        </div>
        <div className="text-xs text-gray-500">{hours}</div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
        <div dir="rtl" className="flex items-center gap-2 text-xs text-gray-600">
          <User className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="text-gray-400">ممثل عن النقابة:</span>
          <span className="text-gray-900 font-medium">{representative}</span>
        </div>
        <div dir="rtl" className="flex items-center gap-2 text-xs text-gray-600">
          <Users className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="text-gray-400">مجلس النقابة:</span>
          <span className="text-gray-900 font-medium">{council}</span>
        </div>
      </div>
    </div>
  );
}