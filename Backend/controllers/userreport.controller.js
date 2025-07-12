const db = require('../models');
exports.getAllReports = async (req, res) => {
  try {
    const reports = await db.user_report.findAll({
      attributes: {
        exclude: ['reported_by_id', 'reported_user_id'] 
      },
      include: [
        { model: db.user, as: 'reporter', attributes: ['id', 'username'] },
        { model: db.user, as: 'reportedUser', attributes: ['id', 'username', 'report_count'] }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({ message: 'Reports fetched', data: reports });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

exports.reportUser = async (req, res) => {
  try {
    const { reported_by_id, reported_user_id, reason } = req.body;

    if (reported_by_id === reported_user_id) {
      return res.status(400).json({ message: "You can't report yourself." });
    }

    const report = await db.user_report.create({ reported_by_id, reported_user_id, reason });

    const user = await db.user.findByPk(reported_user_id);
    if (user) {
      user.report_count = (user.report_count || 0) + 1;
      await user.save();
    }

    return res.status(201).json({ message: 'Report submitted successfully', data: report });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
