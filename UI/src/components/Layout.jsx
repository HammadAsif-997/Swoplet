import Sidebar from './Sidebar/Sidebar';
import ChatPanel from './Chat/ChatPanel';
import { useContacts } from '../context/ContactContext';
import EmptyState from './Chat/EmptyState';

const Layout = () => {
  const { activeContactId } = useContacts();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[350px] border-r border-gray-200 flex-shrink-0 hidden sm:block">
          <Sidebar />
        </div>
        <div className="flex-1 w-full">
          {activeContactId ? (
            <ChatPanel />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;