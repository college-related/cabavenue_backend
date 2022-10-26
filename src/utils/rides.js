
const calculateDistance = (l1, l2, ln1, ln2) => {
  const R = 6371; // Radius of the earth in km

  const lat1 = l1 * Math.PI / 180;
  const lat2 = l2 * Math.PI / 180;
  const lng1 = ln1 * Math.PI / 180;
  const lng2 = ln2 * Math.PI / 180;

  const dLat = lat2 - lat1;
  const dLon = lng2 - lng1;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

module.exports = {
  calculateDistance,
}
