import mongoose from 'mongoose';

const visaSchema = new mongoose.Schema({
  applicationType: {
    type: String,
    enum: ['visa', 'sponsorship', 'aewv'],
    default: 'visa'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Can be unassigned
  },
  familyName: {
    type: String,
    required: false
  },
  givenNames: {
    type: String,
    required: false
  },
  trn: {
    type: String,
    required: false
  },
  visaorigin: {
    type: String,
    enum: ['nz', 'au', 'ca'],
    required: true
  },
  documentNumber: {
    type: String,
    required: false
  },
  visaClassSubclass: {
    type: String,
    required: false
  },
  visaApplicant: {
    type: String,
    required: false
  },
  visaGrantDate: {
    type: String,
    required: false
  },
  visaExpiryDate: {
    type: String,
    required: false
  },
  location: {
    type: String,
    required: false
  },
  visaStatus: {
    type: String,
    required: false
  },
  visaGrantNumber: {
    type: String,
    required: false,
    unique: true,
    sparse: true
  },
  entriesAllowed: {
    type: String,
    required: false
  },
  mustNotArriveAfter: {
    type: String,
    required: false
  },
  enterBeforeDate: {
    type: String,
    required: false
  },
  periodOfStay: {
    type: String,
    required: false
  },
  visaType: {
    type: String,
    required: false
  },
  dateOfBirth: {
    type: String,
    required: false
  },
  nationality: {
    type: String,
    required: false
  },
  documentUrl: {
    type: String,
    required: false
  },
  // Extra fields for sponsorships and aewv can go here dynamically
  employer: String,
  type: String, // e.g. for sponsorship type
  status: String, // generic status for non-visa types
  fullName: String, // generic full name
  jobTitle: String
}, {
  timestamps: true,
  strict: false // allow adding extra fields dynamically without defining them
});

const Visa = mongoose.model('Visa', visaSchema);
export default Visa;
