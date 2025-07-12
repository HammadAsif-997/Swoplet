import { formatDistanceToNow } from '../../../utils/dateUtils';
import { useNavigate } from 'react-router-dom';

const ContactItem = ({ contact, isActive, onClick }) => {
  // Use product image from the original chat data if available
  const productImage = contact._originalChat?.product?.image_url;
  const navigate = useNavigate();
  
  const handleProductClick = (e) => {
    e.stopPropagation();
    if (contact._originalChat?.product?.id) {
      navigate(`/product/${contact._originalChat.product.id}`);
    }
  };
  
  return (
    <div
      className={`px-4 py-3 flex items-center cursor-pointer transition-colors
        ${isActive 
          ? 'bg-blue-50 border-l-4 border-blue-500' 
          : 'hover:bg-gray-100'
        }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {/* User Avatar */}
        <div className="relative">
          <img
            src={contact.avatar}
            alt={contact.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>
        
        {/* Product Image if available */}
        {productImage && (
          <div className="w-10 h-10 rounded-full overflow-hidden shadow-md border-2 border-white">
            <img 
              src={productImage} 
              alt={contact._originalChat?.product?.title || 'Product'} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
      
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="font-medium text-gray-900 truncate">{contact.name}</h3>
          {contact.lastMessageTime && (
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {formatDistanceToNow(contact.lastMessageTime)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 truncate">
            {contact.lastMessage || 'No messages yet'}
          </p>
          {contact.unreadCount && contact.unreadCount > 0 && (
            <span className="ml-2 bg-blue-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
              {contact.unreadCount}
            </span>
          )}
        </div>        {/* Show product title if available */}
        {contact._originalChat?.product?.title && (
          <button 
            onClick={handleProductClick}
            className="text-xs text-blue-600 truncate mt-1 hover:text-blue-800 hover:underline text-left"
          >
            {contact._originalChat.product.title}
          </button>
        )}
      </div>
    </div>
  );
};

export default ContactItem;