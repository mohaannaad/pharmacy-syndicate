import { MapPin, Clock } from "lucide-react";

interface PharmacyCardProps {
  name: string;
  address: string;
  hours: string;
}

export default function PharmacyCard({ name, address, hours }: PharmacyCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 text-right">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <MapPin className="w-4 h-4 text-primary" />
        </div>
        <span className="font-bold text-gray-900">{name}</span>
      </div>
      <div className="text-xs text-gray-400 mt-2">{address}</div>
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
        <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
        <span>{hours}</span>
      </div>
    </div>
  );
}