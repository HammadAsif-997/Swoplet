import { MessageSquare } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-white text-center overflow-hidden">
      <div className="bg-blue-100/50 p-8 rounded-full mb-6">
        <MessageSquare size={48} className="text-blue-500" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-3">
        Your Messages
      </h2>
      <p className="text-gray-600 mb-6">
        Select a conversation from the sidebar to start chatting<br />
        or search for a specific contact.
      </p>
      <p className="text-sm text-gray-500 max-w-md">
        If you don't have any conversations yet,<br />
        browse the marketplace and contact a seller about their item.
      </p>
    </div>
  );
};

export default EmptyState;