const db = require('../models');
const Sequelize = db.Sequelize;
const UserReport = db.user_report;
const User = db.user;

// ✅ Grouped report query
exports.getAllReports = async (req, res) => {
  try {
    const reports = await UserReport.findAll({
      attributes: [
        'reported_user_id',
        [Sequelize.fn('COUNT', Sequelize.col('reported_user_id')), 'report_count']
      ],
      include: [
        {
          model: User,
          as: 'reportedUser',
          attributes: ['id', 'username', 'email']
        }
      ],
      group: ['reported_user_id', 'reportedUser.id'],
      order: [[Sequelize.fn('COUNT', Sequelize.col('reported_user_id')), 'DESC']]
    });

    return res.status(200).json({
      message: 'Reported users with report counts',
      data: reports
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};


// report an user
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