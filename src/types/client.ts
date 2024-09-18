export interface Position {
  left?: string
  top?: string
}

export interface PilePosition extends Position {
  display?: string
}

export interface CardPosition extends Position {
  rotate?: string
  scale?: number
  translate?: string
}

export interface CommunityCardPosition extends Position {
  flipped: boolean
  scale?: number
}
