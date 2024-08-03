// Import the mongoose library to interact with MongoDB
import mongoose from 'mongoose'

// Step 1: Define the Mongoose schema for the card model
const cardSchema = new mongoose.Schema(
  {
    cardIds: {
      isbn: { type: String },
      danacode: { type: String },
      barcode: { type: String },
    },
    mainCategory: { type: String },
    secondaryCategory: { type: String },
    name: { type: String },
    author: { type: String },
    brand: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    condition: { type: String },
    maxLoanPeriod: { type: Number },
    location: {
      city: { type: String },
      streetName: { type: String },
      streetNumber: { type: String },
      zipCode: { type: String },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
    },
    // lender: {
    //   type: mongoose.Schema.Types.ObjectId,
    // },
    postingStatus: {
      type: String,
      enum: ['inReview', 'published', 'inactive', 'deleted'],
      default: 'inReview',
    },
    allBorrowers: {
      currentBorrower: {
        borrowerId: { type: mongoose.Schema.Types.ObjectId },
        pickupDate: { type: Date },
        returnDate: { type: Date },
        loanPeriod: { type: Number },
        createdAt: { type: Date },
        updatedAt: { type: Date },
      },
      previousBorrowers: [
        {
          borrowerId: { type: mongoose.Schema.Types.ObjectId },
          pickupDate: { type: Date },
          returnDate: { type: Date },
          loanPeriod: { type: Number },
        },
      ],
    },
    requests: [
      {
        borrowerId: { type: mongoose.Schema.Types.ObjectId },
        pickupDate: { type: Date },
        returnDate: { type: Date },
        loanPeriod: { type: Number },
        status: {
          currentStatus: {
            type: String,
            enum: ['pending', 'accepted', 'rejected', 'removed'],
          },
          borrowerMessage: { type: String },
          lenderMessage: { type: String },
          createdAt: { type: Date, default: Date.now },
          updatedAt: { type: Date },
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date },
      },
    ],
    alertSubscribers: [
      {
        subscriberId: { type: mongoose.Schema.Types.ObjectId },
        alertsRequested: { type: Boolean, default: true },
        createdAt: { type: Date },
        updatedAt: { type: Date },
      },
    ],
  },
  {
    timestamps: true, // Enable timestamps option, which creates "createdAt" and "updatedAt" fields
    selectPopulatedPaths: false, // Prevents versioning issues with populated fields
  }
)

// Step 2: Create and return the Mongoose model for the Card collection.
// If the model already exists, return the existing model; otherwise, create a new one.
export const Card =
  mongoose.models.Card || mongoose.model<mongoose.Document>('Card', cardSchema)
