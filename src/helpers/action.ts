import { Action, FullActionType } from "../types"

export function getAction(
  checkAmount: number,
  raiseAmount: number,
  playerChips: number,
  type?: FullActionType
): Action {
  if (type === "fold") {
    return { type, amount: 0, raise: 0 }
  }
  const amount = Math.min(raiseAmount + checkAmount, playerChips)
  if (amount === playerChips) {
    type = "allIn"
  } else if (raiseAmount > 0) {
    type = "raise"
  } else if (checkAmount > 0 && !type) {
    type = "call"
  } else if (!type) {
    type = "check"
  }
  return {
    type,
    amount,
    raise: Math.max(amount - checkAmount, 0),
  }
}
