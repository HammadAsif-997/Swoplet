export const validateReportReason = (reason) => {
  const trimmedReason = reason?.trim() || "";

  if (trimmedReason.length < 5) {
    return {
      isValid: false,
      message: "Reason must be at least 5 characters long",
    };
  }

  if (trimmedReason.length > 500) {
    return {
      isValid: false,
      message: "Reason must be less than 500 characters",
    };
  }

  return {
    isValid: true,
    message: "Valid reason",
  };
};
