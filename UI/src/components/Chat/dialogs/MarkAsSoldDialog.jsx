import { X, CheckCircle } from "lucide-react";
import { useState } from "react";
import { callApi } from "../../../../utils/apiHandler";
import { BASE_URL } from "../../../constants/config";
import {
  PRODUCT_SOLD_SUCCESS,
  PRODUCT_SOLD_ERROR,
  PRODUCT_MISSING,
} from "../constants/productConstants";

const MarkAsSoldDialog = ({
  isOpen,
  onClose,
  contact,
  productId,
  productTitle,
}) => {
  const [isMarkingSold, setIsMarkingSold] = useState(false);
  const [soldMessage, setSoldMessage] = useState("");

  const markProductAsSoldAPI = async (productId, buyerId) => {
    const soldData = {
      product_id: productId,
      buyer_id: buyerId,
    };
    console.log("Marking product as sold with data:", soldData);
    return await callApi({
      url: `${BASE_URL}product-sold`,
      method: "PUT",
      body: soldData,
    });
  };

  const handleConfirmSold = async () => {
    if (!productId || !contact.id) {
      setSoldMessage(PRODUCT_MISSING);
      return;
    }

    setIsMarkingSold(true);
    setSoldMessage("");

    try {
      const response = await markProductAsSoldAPI(
        productId,
        contact._originalChat.other_person_id
      );

      if (response.success) {
        setSoldMessage(PRODUCT_SOLD_SUCCESS);
        setTimeout(() => {
          handleCloseDialog();
          window.location.reload();
        }, 2000);
      } else {
        setSoldMessage(response.error || PRODUCT_SOLD_ERROR);
      }
    } catch (error) {
      setSoldMessage(PRODUCT_SOLD_ERROR);
    } finally {
      setIsMarkingSold(false);
    }
  };

  const handleCloseDialog = () => {
    setSoldMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Mark Product as Sold
          </h3>
          <button
            onClick={handleCloseDialog}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="text-green-600" size={24} />
            <div>
              <p className="font-medium text-gray-900">Confirm Sale</p>
              <p className="text-sm text-gray-600">{productTitle}</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-2">
            You are about to mark this product as sold to{" "}
            <span className="font-medium">{contact.name}</span>
          </p>
          <p className="text-sm text-gray-500">This action will:</p>
          <ul className="text-sm text-gray-500 mt-2 ml-4 space-y-1">
            <li>• Update the product status to "SOLD"</li>
            <li>• Create a review opportunity for the buyer</li>
            <li>
              • Notify other interested users that the item is no longer
              available
            </li>
            <li>• This action cannot be undone</li>
          </ul>
        </div>

        {soldMessage && (
          <div
            className={`mb-4 p-3 rounded-md text-sm ${
              soldMessage.includes("successfully")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {soldMessage}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleCloseDialog}
            disabled={isMarkingSold}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmSold}
            disabled={isMarkingSold}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMarkingSold ? "Marking as Sold..." : "Confirm Sale"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkAsSoldDialog;