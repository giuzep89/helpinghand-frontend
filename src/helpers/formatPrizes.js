export function formatPrizes(prizes) {
  const counts = {};

  for (const prize of prizes) {
    if (!counts[prize]) {
      counts[prize] = 1;
    } else {
      counts[prize]++;
    }
  }

  const result = [];
  for (const [prize, count] of Object.entries(counts)) {
    result.push(count > 1 ? `${prize} x${count}` : prize);
  }

  return result.join(', ');
}
