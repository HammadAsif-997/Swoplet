import { Trash2 } from "lucide-react";
import { useState } from "react";
import { callApi } from "../../../../utils/apiHandler";
import { BASE_URL } from "../../../constants/config";

const DeleteChatDialog = ({ isOpen, onClose, contact, currentUserId }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  const deleteChatAPI = async (userId, chatId) => {
    const deleteData = {
      user_id: userId,
      chat_id: chatId,
    };

    return await callApi({
      url: `${BASE_URL}chats`,
      method: "DELETE",
      body: deleteData,
    });
  };

  const handleConfirmDelete = async () => {
    if (!contact.id) {
      setDeleteMessage("Error: Missing chat information.");
      return;
    }

    setIsDeleting(true);
    setDeleteMessage("");

    try {
      const response = await deleteChatAPI(currentUserId, parseInt(contact.id));

      if (response.success) {
        setDeleteMessage("Chat deleted successfully.");
        setTimeout(() => {
          handleCloseDialog();
          // Navigate back or refresh chat list
          window.location.reload();
        }, 1500);
      } else {
        setDeleteMessage(
          response.error || "Failed to delete chat. Please try again."
        );
      }
    } catch (error) {
      setDeleteMessage(
        "An error occurred while deleting the chat. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDialog = () => {
    setDeleteMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Trash2 className="h-5 w-5 text-red-600 mr-2" />
            <div>
              <p className="font-medium text-gray-900">Delete Chat</p>
              <p className="text-sm text-gray-600">with {contact.name}</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-2">
          Are you sure you want to delete this chat conversation?
        </p>
        <p className="text-sm text-gray-500">This action will:</p>
        <ul className="text-sm text-gray-500 mt-2 ml-4 space-y-1">
          <li>• Permanently delete all messages in this chat</li>
          <li>• Remove the chat from your conversation list</li>
          <li>• This action cannot be undone</li>
        </ul>

        {deleteMessage && (
          <div
            className={`mt-4 p-3 rounded-md text-sm ${
              deleteMessage.includes("successfully")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {deleteMessage}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCloseDialog}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete Chat"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteChatDialog;