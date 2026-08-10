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
    required: function() { return this.applicationType === 'visa'; }
  },
  givenNames: {
    type: String,
    required: function() { return this.applicationType === 'visa'; }
  },
  documentNumber: {
    type: String,
    required: function() { return this.applicationType === 'visa'; }
  },
  visaClassSubclass: {
    type: String,
    required: function() { return this.applicationType === 'visa'; }
  },
  visaApplicant: {
    type: String,
    required: function() { return this.applicationType === 'visa'; }
  },
  visaGrantDate: {
    type: String,
    required: function() { return this.applicationType === 'visa'; }
  },
  visaExpiryDate: {
    type: String,
    required: function() { return this.applicationType === 'visa'; }
  },
  location: {
    type: String,
    required: function() { return this.applicationType === 'visa'; }
  },
  visaStatus: {
    type: String,
    required: function() { return this.applicationType === 'visa'; }
  },
  visaGrantNumber: {
    type: String,
    required: function() { return this.applicationType === 'visa'; },
    unique: true,
    sparse: true
  },
  entriesAllowed: {
    type: String,
    required: function() { return this.applicationType === 'visa'; }
  },
  mustNotArriveAfter: {
    type: String,
    required: function() { return this.applicationType === 'visa'; }
  },
  enterBeforeDate: {
    type: String,
    required: function() { return this.applicationType === 'visa'; }
  },
  periodOfStay: {
    type: String,
    required: function() { return this.applicationType === 'visa'; }
  },
  visaType: {
    type: String,
    required: function() { return this.applicationType === 'visa'; }
  },
  dateOfBirth: {
    type: String,
    required: function() { return this.applicationType === 'visa'; }
  },
  nationality: {
    type: String,
    required: function() { return this.applicationType === 'visa'; }
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
