export function prioritizeCurrentRoom(rooms, currentChannel) {
  const rows = Array.isArray(rooms) ? rooms : [];
  const index = rows.findIndex(room => room.channel === currentChannel);
  if (index <= 0) return rows;
  return [rows[index], ...rows.slice(0, index), ...rows.slice(index + 1)];
}
