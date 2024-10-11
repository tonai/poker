export function getPlayerOrder(
  players: string[],
  dealerIndex: number,
  skipPlayers: string[] = []
) {
  return players
    .slice(dealerIndex + 1)
    .concat(players.slice(0, dealerIndex + 1))
    .filter((id) => !skipPlayers.includes(id))
}
