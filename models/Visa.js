import mongoose from 'mongoose';

const visaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Can be unassigned
  },
  familyName: {
    type: String,
    required: true
  },
  givenNames: {
    type: String,
    required: true
  },
  documentNumber: {
    type: String,
    required: true
  },
  visaClassSubclass: {
    type: String,
    required: true
  },
  visaApplicant: {
    type: String,
    required: true
  },
  visaGrantDate: {
    type: String,
    required: true
  },
  visaExpiryDate: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  visaStatus: {
    type: String,
    required: true
  },
  visaGrantNumber: {
    type: String,
    required: true,
    unique: true
  },
  entriesAllowed: {
    type: String,
    required: true
  },
  mustNotArriveAfter: {
    type: String,
    required: true
  },
  enterBeforeDate: {
    type: String,
    required: true
  },
  periodOfStay: {
    type: String,
    required: true
  },
  visaType: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: String,
    required: true
  },
  nationality: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Visa = mongoose.model('Visa', visaSchema);
export default Visa;
