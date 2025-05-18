// detectLineupOffenders.js
// Returns an array of players who are on bye or have OUT/IR/D status

export function detectLineupOffenders(players = [], currentWeek = 6) {
  const offenders = [];

  for (const player of players) {
    const name = player?.name?.full;
    const byeWeek = parseInt(player?.bye_weeks?.week, 10);
    const status = player?.status;
    const selectedPosition = player?.selected_position?.[1]?.position;

    if (!name || !selectedPosition) continue;

    // Flag players on bye
    if (byeWeek === currentWeek) {
      offenders.push({ name, reason: `on a bye (week ${currentWeek})` });
      continue;
    }

    // Flag players with OUT/IR/D
    if (["O", "IR", "D"].includes(status)) {
      offenders.push({ name, reason: `status: ${status}` });
    }
  }

  return offenders;
}
