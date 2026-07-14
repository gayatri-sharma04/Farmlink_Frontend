// export const formatDateInNepalTime = (dateString) => {
//   if (!dateString) return 'N/A';
  
//   const date = new Date(dateString);
  
//   // Nepal is UTC+5:45 (5 hours 45 minutes = 345 minutes)
//   const nepalOffset = 5 * 60 + 45; // 345 minutes
  
//   // Get UTC time in milliseconds
//   const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000);
  
//   // Add Nepal offset
//   const nepalTime = new Date(utcTime + (nepalOffset * 60000));
  
//   // Format the date
//   const options = {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true
//   };
  
//   return nepalTime.toLocaleString('en-US', options);
// };

// export const formatDateInNepalTime = (dateString) => {
//   if (!dateString) return 'N/A';
  
//   try {
//     // Parse the date
//     const date = new Date(dateString);
    
//     // Nepal is UTC+5:45
//     // Add 5 hours 45 minutes to the UTC time
//     const nepalTime = new Date(date.getTime() + (5.75 * 60 * 60 * 1000));
    
//     // Format the date
//     const options = {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true
//     };
    
//     return nepalTime.toLocaleString('en-US', options);
//   } catch (error) {
//     console.error('Date formatting error:', error);
//     return dateString;
//   }
// };

// export const formatDateShort = (dateString) => {
//   if (!dateString) return 'N/A';
  
//   try {
//     const date = new Date(dateString);
//     const nepalTime = new Date(date.getTime() + (5.75 * 60 * 60 * 1000));
    
//     const options = {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     };
    
//     return nepalTime.toLocaleString('en-US', options);
//   } catch (error) {
//     console.error('Date formatting error:', error);
//     return dateString;
//   }
// };

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    
    // Backend already sends Nepal time, just format it
    return date.toLocaleString('en-US', options);
    
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
};

export const formatDateInUserTimezone = formatDate;