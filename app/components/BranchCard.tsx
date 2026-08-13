import { MapPin, LocateFixed } from "lucide-react";

interface BranchCardProps {
  name: string;
  address: string;
  phone: string;
  hours: string;
}

export default function BranchCard({ name, address, phone, hours }: BranchCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
          <LocateFixed className="w-5 h-5 text-white" />
        </div>
        <div className="text-right flex-1 mx-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">{name}</span>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-1">{address}</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 text-right space-y-1.5">
        <div className="text-sm font-bold text-gray-900">{phone}</div>
        <div className="text-xs text-gray-500">{hours}</div>
      </div>
    </div>
  );
}