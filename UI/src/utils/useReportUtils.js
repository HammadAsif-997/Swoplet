const getReportedUsers = (currentUserId) => {
  try {
    const reportedUsers = localStorage.getItem(
      `reportedUsers_${currentUserId}`
    );
    return reportedUsers ? JSON.parse(reportedUsers) : [];
  } catch (error) {
    console.error("Error getting reported users:", error);
    return [];
  }
};

const addReportedUser = (currentUserId, reportedUserId) => {
  try {
    const reportedUsers = getReportedUsers(currentUserId);
    if (!reportedUsers.includes(reportedUserId)) {
      reportedUsers.push(reportedUserId);
      localStorage.setItem(
        `reportedUsers_${currentUserId}`,
        JSON.stringify(reportedUsers)
      );
    }
  } catch (error) {
    console.error("Error adding reported user:", error);
  }
};

const hasReportedUser = (currentUserId, userIdToCheck) => {
  const reportedUsers = getReportedUsers(currentUserId);
  return reportedUsers.includes(userIdToCheck);
};

export { addReportedUser, hasReportedUser };
