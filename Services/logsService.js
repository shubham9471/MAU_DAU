// logService.js
const LoginLog = require("../Model/logs");
const User = require("../Model/user");

const NodeCache = require("node-cache");
const cache = new NodeCache();

const createLoginLog = async (userId) => {
  try {
    // Fetch user to get creation time
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }

    // Create login log with user's creation time
    const log = new LoginLog({
      userId,
      createdAt: user.createdAt, // Set createdAt to user's creation time
    });

    return await log.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const getUniqueUsersCounts = async ({ startTime, endTime, time }) => {
  try {
    // Check if the result is cached
    const cacheKey = JSON.stringify({ startTime, endTime, time });
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    let aggregationPipeline = [
      {
        $match: {
          loginTime: { $gte: startTime, $lte: endTime },
        },
      },
    ];

    if (time === "daily") {
      // Generate an array of dates for the last 30 days
      const dates = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date(endTime);
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split("T")[0]);
      }

      aggregationPipeline.push(
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$loginTime" }, // Group by day
            },
            users: { $addToSet: "$userId" }, // Add unique users to an array
          },
        },
        {
          $project: {
            _id: 1,
            count: { $size: "$users" }, // Count the number of unique users for each day
          },
        }
      );

      // Create an object with default counts set to 0 for all dates
      const defaultCounts = {};
      dates.forEach((date) => {
        defaultCounts[date] = 0;
      });

      // Replace missing counts with default values
      aggregationPipeline.push(
        {
          $group: {
            _id: null,
            counts: { $push: { k: "$_id", v: "$count" } },
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $arrayToObject: {
                $map: {
                  input: dates,
                  as: "date",
                  in: {
                    k: "$$date",
                    v: {
                      $cond: [
                        { $in: ["$$date", "$counts.k"] },
                        {
                          $arrayElemAt: [
                            "$counts.v",
                            { $indexOfArray: ["$counts.k", "$$date"] },
                          ],
                        },
                        0,
                      ],
                    },
                  },
                },
              },
            },
          },
        }
      );
    } else if (time === "monthly") {
      aggregationPipeline.push(
        {
          $group: {
            _id: {
              year: { $year: "$loginTime" },
              month: { $month: "$loginTime" },
            },
            users: { $addToSet: "$userId" }, // Add unique users to an array
          },
        },
        {
          $project: {
            _id: 0,
            month: {
              $dateToString: {
                format: "%Y-%m", // Format year and month as YYYY-MM
                date: {
                  $dateFromParts: {
                    year: "$_id.year",
                    month: "$_id.month",
                  },
                },
              },
            },
            count: { $size: "$users" }, // Count the number of unique users for each month
          },
        },
        {
          $sort: { month: 1 }, // Sort by month
        }
      );
    } else {
      // For "today" and "last_30_minutes", count unique users
      aggregationPipeline.push(
        {
          $match: {
            loginTime: { $gte: startTime, $lte: endTime },
          },
        },
        {
          $group: {
            _id: null,
            userIds: { $addToSet: "$userId" }, // Add distinct user IDs to an array
          },
        },
        {
          $project: {
            _id: 0,
            count: { $size: "$userIds" }, // Count the number of distinct user IDs
          },
        }
      );
    }

    const res = await LoginLog.aggregate(aggregationPipeline);
    // console.log("RES_______", res);
    let result = null;
    if (time == "last_30_minutes" || time == "today") {
      result = (res.length && res[0].count) || 0;
    } else {
      result = res;
    }
    // Cache the result for future use
    cache.set(cacheKey, result, 60); // Cache for 60 seconds

    // Return the result
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createLoginLog,
  getUniqueUsersCounts,
};
