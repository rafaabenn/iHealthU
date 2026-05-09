const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/sleep_logs.json');

if (!fs.existsSync(filePath)) {
  console.log('File not found');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const cleanedData = {};

Object.keys(data).forEach(userId => {
  const userLogs = data[userId];
  if (!Array.isArray(userLogs)) {
    cleanedData[userId] = userLogs;
    return;
  }

  // Use a map to keep only the latest log per date
  const dateMap = {};
  
  // Sort by ID (timestamp) descending to keep the most recent one if duplicates exist
  userLogs.sort((a, b) => b.id.localeCompare(a.id));

  userLogs.forEach(log => {
    if (!dateMap[log.date]) {
      dateMap[log.date] = log;
    }
  });

  // Convert back to array and sort by date descending
  cleanedData[userId] = Object.values(dateMap).sort((a, b) => b.date.localeCompare(a.date));
});

fs.writeFileSync(filePath, JSON.stringify(cleanedData, null, 2));
console.log('Cleanup complete');
