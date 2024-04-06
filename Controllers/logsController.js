// logController.js
const logService = require("../Services/logsService");

const createUserLog = async (userId) => {
  try {
    // Create login log
    await logService.createLoginLog(userId);
    return { success: true, message: "Login logged successfully" };
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// const getDauAndMau = async (req, res) => {
//   try {
//     const { time } = req.body;

//     let startTime, endTime;

//     switch (time) {
//       case "last_30_minutes":
//         endTime = new Date();
//         startTime = new Date(endTime - 30 * 60 * 1000);
//         break;
//       case "today":
//         endTime = new Date();
//         endTime.setHours(23, 59, 59, 999); // End of the current day
//         startTime = new Date(endTime);
//         startTime.setHours(0, 0, 0, 0); // Start of the current day
//         break;
//       case "daily":
//         endTime = new Date();
//         startTime = new Date(endTime - 30 * 24 * 60 * 60 * 1000); // Last 30 days
//         break;
//       case "monthly":
//         endTime = new Date();
//         endTime.setMonth(endTime.getMonth() + 1); // Move to next month
//         endTime.setDate(0); // Last day of the current month
//         startTime = new Date(endTime);
//         startTime.setMonth(startTime.getMonth() - 12); // 12 months ago
//         startTime.setDate(1); // First day of the month
//         break;
//       default:
//         return res.status(400).json({ message: "Invalid time range" });
//     }

//     const count = await logService.getUniqueUsersCount({ startTime, endTime });

//     return res.status(200).send(`No of active user in ${time} are ${count}`);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

const getDauAndMau = async (req, res) => {
  try {
    console.log("TIME========>", req.query);

    const { time } = req.query;

    let startTime, endTime;

    switch (time) {
      case "last_30_minutes":
        endTime = new Date();
        startTime = new Date(endTime - 30 * 60 * 1000);
        break;
      case "today":
        endTime = new Date();
        endTime.setHours(23, 59, 59, 999); // End of the current day
        startTime = new Date(endTime);
        startTime.setHours(0, 0, 0, 0); // Start of the current day
        break;
      case "daily":
        endTime = new Date();
        startTime = new Date(endTime - 30 * 24 * 60 * 60 * 1000); // Last 30 days
        break;
      case "monthly":
        endTime = new Date();
        startTime = new Date(endTime);
        startTime.setMonth(startTime.getMonth() - 12); // 12 months ago
        startTime.setDate(1); // First day of the month
        break;
      default:
        return res.status(400).json({ message: "Invalid time range" });
    }

    const counts = await logService.getUniqueUsersCounts({
      startTime,
      endTime,
      time,
    });

    return res.status(200).json(counts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDauAndMau,
  createUserLog,
};
