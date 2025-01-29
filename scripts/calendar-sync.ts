import cron from 'node-cron';
import fetch from 'node-fetch';

// Run at midnight every day
cron.schedule('0 0 * * *', async () => {
  console.log('Running calendar sync...', new Date().toISOString());
  
  try {
    const response = await fetch('http://localhost:3000/api/calendar/process', {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Calendar sync completed:', result);
  } catch (error) {
    console.error('Calendar sync failed:', error);
  }
});

console.log('Calendar sync scheduler started');
