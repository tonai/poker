import {
  Cards,
  Combination,
  Hand,
  HandCategory,
  Rank,
  SortedCard,
  SortedCards,
  SortedRank,
  Suit,
  Values,
} from "../types"

interface CombinationN {
  n: number
  cards: SortedCards
}

type Ranks = Record<number, CombinationN>
type Suits = { [key in Suit]?: CombinationN }

export function getRank(rank: SortedRank): Rank {
  switch (rank) {
    case 11:
      return "J"
    case 12:
      return "Q"
    case 13:
      return "K"
    case 14:
      return 1
    default:
      return rank
  }
}

export function getSortedRank(rank: Rank): SortedRank {
  switch (rank) {
    case "J":
      return 11
    case "Q":
      return 12
    case "K":
      return 13
    case 1:
      return 14
    default:
      return rank
  }
}

export function getSortedCards(cards: Cards): SortedCards {
  return cards.map((card) => ({ ...card, rank: getSortedRank(card.rank) }))
}

function isHand(hand: Hand | Combination): hand is Hand {
  return "category" in hand
}

/**
 * Returns:
 * - 0 if ranks are equals
 * - <0 if rankA is greater than rankB
 * - >0 if rankB is greater than rankA
 *
 * @param rankA
 * @param rankB
 * @returns
 */
export function compareRanks(rankA: SortedRank, rankB: SortedRank): number {
  return rankB - rankA
}

/**
 * Returns:
 * - 0 if hands are equals
 * - <0 if handA is greater than handB
 * - >0 if handB is greater than handA
 *
 * @param handA
 * @param handB
 * @returns number
 */
export function compareHands<T extends Hand | Combination>(
  handA: T,
  handB: T
): number {
  if (isHand(handA) && isHand(handB) && handA.category !== handB.category) {
    return handA.category - handB.category
  } else if (handA.value1 !== handB.value1) {
    return compareRanks(handA.value1, handB.value1)
  } else if (
    handA.value2 !== undefined &&
    handB.value2 !== undefined &&
    handA.value2 !== handB.value2
  ) {
    return compareRanks(handA.value2, handB.value2)
  } else if (
    handA.value3 !== undefined &&
    handB.value3 !== undefined &&
    handA.value3 !== handB.value3
  ) {
    return compareRanks(handA.value3, handB.value3)
  } else if (
    handA.value4 !== undefined &&
    handB.value4 !== undefined &&
    handA.value4 !== handB.value4
  ) {
    return compareRanks(handA.value4, handB.value4)
  } else if (handA.value5 !== undefined && handB.value5 !== undefined) {
    return compareRanks(handA.value5, handB.value5)
  }
  return 0
}

function getNOfAKind(ranks: Ranks, n: number): Combination[] {
  const nOfAKind: Combination[] = []
  const entries = Object.entries(ranks)
  for (const [rank, combination] of entries) {
    if (combination.n === n) {
      nOfAKind.push({
        value1: Number(rank) as SortedRank,
        cards: combination.cards,
      })
    }
  }
  return nOfAKind.sort((a, b) => compareRanks(a.value1, b.value1))
}

function getFlush(suits: Suits) {
  const flushes: Combination[] = []
  const entries = Object.entries(suits)
  for (const [, combination] of entries) {
    if (combination.n === 5) {
      flushes.push({
        ...(getHighRankValues(combination.cards) as Combination),
        cards: combination.cards,
      })
    }
  }
  return flushes.sort((a, b) => compareHands(a, b))
}

interface Straight extends Combination {
  suit?: Suit
}

function getStraights(ranks: Ranks): Straight[] {
  const straights: Record<number, { [key in Suit]?: SortedCard }[]> = {}
  const entries = Object.entries(ranks)
  for (const [stringRank, combination] of entries) {
    const rank = Number(stringRank)
    const cardMap = Object.fromEntries(
      combination.cards.map((card) => [card.suit, card])
    )
    straights[rank] = [cardMap]
    let i = 1
    while (
      straights[rank - i] !== undefined &&
      straights[rank - i].length < 5
    ) {
      straights[rank - i].push(cardMap)
      i++
    }
  }
  return Object.entries(straights)
    .filter(([, cards]) => cards.length === 5)
    .map(([rank, cards]) => ({
      cards,
      value1: (Number(rank) + 4) as SortedRank,
    }))
    .map((combination) => {
      let i = 0
      let suits = Object.keys(combination.cards[i]) as Suit[]
      while (suits.length > 0 && i < 4) {
        i++
        const nextSuits = Object.keys(combination.cards[i]) as Suit[]
        suits = suits.filter((suit) => nextSuits.includes(suit))
      }
      const flushSuit = suits[0]
      return {
        ...combination,
        cards: combination.cards.map(
          (rankCards) =>
            (flushSuit
              ? rankCards[flushSuit]
              : Object.values(rankCards)[0]) as SortedCard
        ),
        suit: flushSuit,
      }
    })
    .sort((a, b) => compareHands(a, b))
}

function getHighRankValues(
  sortedCards: SortedCards,
  n: number = 5,
  start = 1
): typeof start extends 1 ? Combination : Values {
  const cards = sortedCards.slice(0, n)
  return cards.reduce<Values>(
    (acc, { rank }, i) => {
      const key = `value${start + i}` as keyof Omit<Values, "card">
      // @ts-expect-error ignore type error
      acc[key] = rank
      return acc
    },
    { cards }
  )
}

function getRemainingCards(
  cards: SortedCards,
  sortedCards: SortedCards,
  n: number = 5,
  start = 1
) {
  const remainingCards: SortedCards = sortedCards.filter(
    (card) => !cards.includes(card)
  )
  const highRank = getHighRankValues(remainingCards, n, start)
  return {
    ...highRank,
    cards: cards.concat(highRank.cards),
  }
}

export function getHand(cards: SortedCards): Hand {
  const ranks: Ranks = {}
  const suits: Suits = {}
  const sortedCards = [...cards].sort((a, b) => compareRanks(a.rank, b.rank))

  for (const card of sortedCards) {
    const { rank, suit } = card
    ranks[rank] ||= { n: 0, cards: [] }
    ranks[rank].n++
    ranks[rank].cards.push(card)
    suits[suit] ||= { n: 0, cards: [] }
    suits[suit]!.n++
    suits[suit]!.cards.push(card)
  }

  const fourOfAKind = getNOfAKind(ranks, 4)
  const threeOfAKind = getNOfAKind(ranks, 3)
  const pairs = getNOfAKind(ranks, 2)
  const flushes = getFlush(suits)
  const straights = getStraights(ranks)
  const straightFlushes = straights.filter(({ suit }) => suit)

  if (straightFlushes.length > 0) {
    return {
      cards: straightFlushes[0].cards,
      category: HandCategory.StraightFlush,
      value1: straightFlushes[0].value1,
    }
  } else if (fourOfAKind.length > 0) {
    return {
      ...fourOfAKind[0],
      ...getRemainingCards(fourOfAKind[0].cards, sortedCards, 1, 2),
      category: HandCategory.FourOfAKind,
    }
  } else if (threeOfAKind.length > 0 && pairs.length > 0) {
    return {
      cards: threeOfAKind[0].cards.concat(pairs[0].cards),
      category: HandCategory.FullHouse,
      value1: threeOfAKind[0].value1,
      value2: pairs[0].value1,
    }
  } else if (flushes.length > 0) {
    return { ...flushes[0], category: HandCategory.Flush }
  } else if (straights.length > 0) {
    return {
      cards: straights[0].cards,
      category: HandCategory.Straight,
      value1: straights[0].value1,
    }
  } else if (threeOfAKind.length > 0) {
    return {
      ...threeOfAKind[0],
      ...getRemainingCards(threeOfAKind[0].cards, sortedCards, 2, 2),
      category: HandCategory.ThreeOfAKind,
    }
  } else if (pairs.length > 1) {
    return {
      ...getRemainingCards(
        pairs[0].cards.concat(pairs[1].cards),
        sortedCards,
        1,
        3
      ),
      category: HandCategory.TwoPair,
      value1: pairs[0].value1,
      value2: pairs[1].value1,
    }
  } else if (pairs.length > 0) {
    return {
      ...pairs[0],
      ...getRemainingCards(pairs[0].cards, sortedCards, 3, 2),
      category: HandCategory.OnePair,
    }
  }
  return {
    ...(getHighRankValues(sortedCards) as Combination),
    category: HandCategory.HighCard,
  }
}
