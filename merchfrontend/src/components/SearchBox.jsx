import React from "react";
import { Search } from "lucide-react";

const SearchBox = () => {
  return (
    <div className="flex items-center gap-2 border-[1.6] border-black rounded-xl h-10 px-3 w-90 bg-white">
      <Search size={20} strokeWidth={1.5} className="text-gray-600" />
      <input
        type="text"
        placeholder="Search..."
        className="w-full focus:outline-none bg-transparent text-sm"
      />
    </div>
  )
};

export default SearchBox;
