import { Search } from 'lucide-react';
import { useContacts } from '../../context/ContactContext';

const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useContacts();
  
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full rounded-lg bg-gray-100 text-gray-800 
            placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default SearchBar;