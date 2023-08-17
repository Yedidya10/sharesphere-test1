import mongoose from 'mongoose'

interface CardIds {
  isbn?: string
  danacode?: string
  barcode?: string
}

interface Location {
  city: string
  streetName: string
  streetNumber: string
  zipCode: string
  coordinates?: {
    lat: number
    lng: number
  }
  country?: string
}

interface BorrowingDates {
  startDate: Date
  endDate: Date
}

interface CurrentBorrower {
  borrowerId: string
  startDate: Date | null
  endDate: Date | null
  loanPeriod: number
}

interface Request {
  borrowerId: mongoose.Schema.Types.ObjectId
  requestStartDate: Date
  requestEndDate: Date
  loanPeriod: number
  message: string
}

interface AlertSubscriber {
  subscriberId: mongoose.Schema.Types.ObjectId
  alertsRequested: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ItemCore {
  cardIds: CardIds
  details: {
    category: string
    name: string
    author: string
    brand: string
    description: string
    imageUrl: string
  }
  condition: number
  maxLoanPeriod: number
  location: Location
  owner: string
  status: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ItemCoreWithLoanDetails extends ItemCore {
  allBorrowers?: Array<{
    borrowerId: string
    borrowingDates: BorrowingDates[]
    loanPeriod: number
  }>
  currentBorrower?: CurrentBorrower
  pendingRequests?: Request[]
  approvedRequests?: Array<{
    borrowerId: mongoose.Schema.Types.ObjectId
    startDate: Date
    endDate: Date
    loanPeriod: number
  }>
  rejectedRequests?: Array<{
    borrowerId: mongoose.Schema.Types.ObjectId
    requestExplanation: string
  }>
  alertSubscribers?: AlertSubscriber[]
}
