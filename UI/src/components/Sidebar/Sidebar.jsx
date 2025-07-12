import { useContacts } from '../../context/ContactContext';
import SearchBar from './SearchBar';
import ContactList from './ContactList';
import ProfileHeader from './ProfileHeader';

const Sidebar = () => {
  const { filteredContacts, activeContactId, setActiveContactId, loading, error } = useContacts();
  
  if (loading) {
    return (
      <div className="h-full flex flex-col bg-white">
        <ProfileHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading chats...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col bg-white">
        <ProfileHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-500 text-center p-4">
            <p>Error loading chats:</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col bg-white">
      <ProfileHeader />
      <SearchBar />
      <div className="flex-1 overflow-y-auto">
        <ContactList 
          contacts={filteredContacts}
          activeContactId={activeContactId}
          onSelectContact={setActiveContactId}
        />
      </div>
    </div>
  );
};

export default Sidebar;