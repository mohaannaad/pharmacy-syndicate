import { Search } from "lucide-react";

export default function SearchInput({ placeholder }: { placeholder: string }) {
  return (
<div className="flex items-center bg-white rounded-pill shadow-sm px-5 py-3 gap-3 max-w-md ml-auto">
      <input type="text" placeholder={placeholder} className="bg-transparent outline-none text-sm w-full text-right" />
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
        <Search className="w-4 h-4 text-white" />
      </div>
    </div>
  );
}