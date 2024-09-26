import { Action, FullActionType } from "../types"

export function getAction(
  checkAmount: number,
  raiseAmount: number,
  playerChips: number,
  type?: FullActionType
): Action {
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
    raise: amount - checkAmount,
  }
}
