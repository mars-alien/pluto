const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/developer-simulator');

const WatchHistory = require('../models/WatchHistory');

async function cleanupDuplicateWatchHistory() {
  try {
    console.log('Starting cleanup of duplicate watch history records...');
    
    // Find all duplicate records
    const duplicates = await WatchHistory.aggregate([
      {
        $group: {
          _id: { user: "$user", videoId: "$videoId" },
          count: { $sum: 1 },
          docs: { $push: "$_id" }
        }
      },
      {
        $match: { count: { $gt: 1 } }
      }
    ]);

    console.log(`Found ${duplicates.length} sets of duplicate records`);

    let deletedCount = 0;
    for (const duplicate of duplicates) {
      // Keep the first record, delete the rest
      const docsToDelete = duplicate.docs.slice(1);
      await WatchHistory.deleteMany({ _id: { $in: docsToDelete } });
      deletedCount += docsToDelete.length;
      console.log(`Deleted ${docsToDelete.length} duplicate records for user ${duplicate._id.user}, video ${duplicate._id.videoId}`);
    }

    console.log(`Cleanup complete. Deleted ${deletedCount} duplicate records.`);
    
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the cleanup
cleanupDuplicateWatchHistory();
