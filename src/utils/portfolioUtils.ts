// Utility function to sort portfolio items by status priority
export const sortByStatusPriority = (items: any[]) => {
  const statusPriority = {
    'NEW!': 1,
    'IN PROGRESS': 2,
    '': 3, // blank/null status
    null: 3,
    undefined: 3,
    'UNDER CONSTRUCTION': 4
  };

  return items.sort((a, b) => {
    const aStatus = a.status || '';
    const bStatus = b.status || '';
    
    const aPriority = statusPriority[aStatus] || 5; // default to 5 for unknown statuses
    const bPriority = statusPriority[bStatus] || 5;
    
    return aPriority - bPriority;
  });
};