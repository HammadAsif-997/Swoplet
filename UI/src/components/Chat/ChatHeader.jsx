import { MoreVertical, Flag, Trash2, CheckCircle, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { useContacts } from "../../context/ContactContext";
import { useNavigate } from "react-router-dom";
import { userId } from "../../constants/config";
import { hasReportedUser } from "../../utils/useReportUtils";
import ReportUserDialog from "./dialogs/ReportUserDialog";
import MarkAsSoldDialog from "./dialogs/MarkAsSoldDialog";
import DeleteChatDialog from "./dialogs/DeleteChatDialog";
const PRODUCT_SOLD_STATUS = 3;
const ChatHeader = ({ contact }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [hasReported, setHasReported] = useState(false);
  const [isSoldDialogOpen, setIsSoldDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { contacts } = useContacts();
  const navigate = useNavigate();

  const currentUserId = parseInt(userId);

  // Check if user has already been reported on component mount
  useEffect(() => {
    if (currentUserId && contact?.id) {
      setHasReported(hasReportedUser(currentUserId, contact.id));
    }
  }, [currentUserId, contact?.id]);

  // Get the full contact data including original chat info
  const fullChatContext = contacts.find((c) => c.id === contact.id);
  const originalChat = fullChatContext?._originalChat;
  const productImage = originalChat?.product?.image_url;
  const productTitle = originalChat?.product?.title;
  const productId = originalChat?.product?.id;
  const productOwnerId = originalChat?.product?.created_by_id;
  const productStatus = originalChat?.product?.status;

  const isProductOwner = currentUserId === productOwnerId;
  const isProductSold = productStatus === PRODUCT_SOLD_STATUS;

  const handleReportUser = () => {
    setIsMenuOpen(false);
    setIsReportDialogOpen(true);
  };

  const handleMarkAsSold = () => {
    setIsMenuOpen(false);
    setIsSoldDialogOpen(true);
  };

  const handleDeleteChat = () => {
    setIsMenuOpen(false);
    setIsDeleteDialogOpen(true);
  };

  const handleProductClick = () => {
    if (originalChat?.product?.id) {
      navigate(`/product/${originalChat.product.id}`);
    }
  };

  return (
    <div className="py-3 px-4 flex items-center justify-between border-b border-gray-200 bg-white">
      <div className="flex items-center">
        <div className="flex items-center gap-3">
          {/* User Avatar */}
          <div className="relative">
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>

          {/* Product Image or fallback icon if there's a product */}
          {(productImage || productTitle) && (
            <div className="w-8 h-8 rounded-full overflow-hidden shadow-md border-2 border-white">
              {productImage ? (
                <img
                  src={productImage}
                  alt={productTitle || "Product"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <Package size={14} className="text-gray-600" />
                </div>
              )}
            </div>
          )}
        </div>
        <div className="ml-3">
          <h2 className="font-medium text-gray-900">{contact.name}</h2>
          {productTitle && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleProductClick}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline text-left"
              >
                {productTitle}
              </button>
              {isProductSold && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  SOLD
                </span>
              )}
            </div>
          )}
          {isProductSold && (
            <p className="text-xs text-gray-500 mt-1">
              This product has been sold. Chat is no longer active.
            </p>
          )}
        </div>
      </div>
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
        >
          <MoreVertical size={20} />
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
            {/* Mark as Sold button - only for product owner and if product is not sold */}
            {isProductOwner && !isProductSold && productId && (
              <button
                onClick={handleMarkAsSold}
                className="w-full px-4 py-2 text-left flex items-center gap-2 text-green-700 hover:bg-gray-100"
              >
                <CheckCircle size={16} />
                Mark as Sold
              </button>
            )}

            <button
              onClick={handleReportUser}
              disabled={hasReported}
              className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 ${
                hasReported
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700"
              }`}
            >
              <Flag size={16} />
              {hasReported ? "Already Reported" : "Report User"}
            </button>
            <button
              onClick={handleDeleteChat}
              className="w-full px-4 py-2 text-left flex items-center gap-2 text-red-600 hover:bg-gray-100"
            >
              <Trash2 size={16} />
              Delete Chat
            </button>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <ReportUserDialog
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        contact={contact}
        currentUserId={currentUserId}
        hasReported={hasReported}
        setHasReported={setHasReported}
      />

      <MarkAsSoldDialog
        isOpen={isSoldDialogOpen}
        onClose={() => setIsSoldDialogOpen(false)}
        contact={contact}
        productId={productId}
        productTitle={productTitle}
      />

      <DeleteChatDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        contact={contact}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default ChatHeader;