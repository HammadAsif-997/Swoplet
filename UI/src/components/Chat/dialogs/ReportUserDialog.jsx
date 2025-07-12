import { X } from "lucide-react";
import { useState } from "react";
import { callApi } from "../../../../utils/apiHandler";
import { BASE_URL } from "../../../constants/config";
import { commonReasons } from "../constants/commonReportReasons";
import { addReportedUser } from "../../../utils/useReportUtils";
import { validateReportReason } from "../../../utils/validationUtils";

const ReportUserDialog = ({
  isOpen,
  onClose,
  contact,
  currentUserId,
  setHasReported,
}) => {
  const [reportReason, setReportReason] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  const [reportMessage, setReportMessage] = useState("");

  const reportUserAPI = async (reportedById, reportedUserId, reason) => {
    const reportData = {
      reported_by_id: reportedById,
      reported_user_id: reportedUserId,
      reason: reason.trim(),
    };
    console.log("Reporting user with data:", reportData);
    return await callApi({
      url: `${BASE_URL}report-user`,
      method: "POST",
      body: reportData,
    });
  };

  const handleSubmitReport = async () => {
    const validation = validateReportReason(reportReason);
    if (!validation.isValid) {
      setReportMessage(validation.message);
      return;
    }

    setIsReporting(true);
    setReportMessage("");

    try {
      // find the contact's ID to report and make sure its not the current user
      let toReportUserId =
        currentUserId === contact._originalChat.product_owner_id
          ? contact._originalChat.other_person_id
          : contact._originalChat.product_owner_id;

      const response = await reportUserAPI(
        currentUserId,
        toReportUserId,
        reportReason
      );

      if (response.success) {
        // Add to local storage for persistence
        addReportedUser(currentUserId, toReportUserId);
        setHasReported(true);
        setReportMessage(
          "User reported successfully. Thank you for helping keep our community safe."
        );
        setReportReason("");
        // Auto close dialog after 2 seconds
        setTimeout(() => {
          handleCloseDialog();
        }, 2000);
      } else {
        setReportMessage(
          response.error || "Failed to report user. Please try again."
        );
      }
    } catch (error) {
      setReportMessage(
        "An error occurred while reporting the user. Please try again."
      );
    } finally {
      setIsReporting(false);
    }
  };

  const handleCloseDialog = () => {
    setReportReason("");
    setReportMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Report User</h3>
          <button
            onClick={handleCloseDialog}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            You are about to report{" "}
            <span className="font-medium">{contact.name}</span>
          </p>
          <p className="text-sm text-gray-500">
            Please provide a reason for reporting this user. This will help our
            moderation team review the case.
          </p>
        </div>

        <div className="mb-4">
          <label
            htmlFor="reportReason"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Reason for reporting *
          </label>

          {/* Quick selection buttons */}
          <div className="mb-3">
            <p className="text-xs text-gray-600 mb-2">Quick select a reason:</p>
            <div className="flex flex-wrap gap-2">
              {commonReasons.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setReportReason(reason)}
                  disabled={isReporting}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          <textarea
            id="reportReason"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            placeholder="Please describe why you are reporting this user (minimum 5 characters)..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            disabled={isReporting}
          />
          <p className="text-xs text-gray-500 mt-1">
            {reportReason.length}/5 minimum characters
          </p>
        </div>

        {reportMessage && (
          <div
            className={`mb-4 p-3 rounded-md text-sm ${
              reportMessage.includes("successfully")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {reportMessage}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleCloseDialog}
            disabled={isReporting}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitReport}
            disabled={isReporting || reportReason.length < 5}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isReporting ? "Reporting..." : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportUserDialog;