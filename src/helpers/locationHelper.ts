function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
  
  function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = R * c;
    return {
        km: distance.toFixed(2),
        mi: (distance * 0.621371).toFixed(2),
        distance
    };
  }

  function estimateTravelTime(distanceKm: number, speedKmPerHr: number=30): string {
    // Calculate travel time in hours
    const hours = distanceKm / speedKmPerHr;
  
    // Calculate days and hours
    const days = Math.floor(hours / 24); // Number of days
    const remainingHours = Math.floor(hours % 24); // Remaining hours after full days
  
    // Calculate minutes (from remaining hours)
    const minutes = Math.round((hours - Math.floor(hours)) * 60);
  
    // Constructing the output string
    let result = "";
    if (days > 0) result += `${days}d `;
    if (remainingHours > 0) result += `${remainingHours}h `;
    if (minutes > 0) result += `${minutes}m`;
  
    return result.trim(); // Clean up any extra spaces
  }



export const locationHelper = {
    deg2rad,
    getDistanceFromLatLonInKm,
    estimateTravelTime
}