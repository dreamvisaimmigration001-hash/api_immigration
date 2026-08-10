import Visa from '../models/Visa.js';
import mongoose from 'mongoose';

// Whitelist of allowed fields to prevent mass assignment
const ALLOWED_VISA_FIELDS = [
  'userId', 'familyName', 'givenNames', 'documentNumber',
  'visaClassSubclass', 'visaApplicant', 'visaGrantDate',
  'visaExpiryDate', 'location', 'visaStatus', 'visaGrantNumber',
  'entriesAllowed', 'mustNotArriveAfter', 'enterBeforeDate',
  'periodOfStay', 'visaType', 'dateOfBirth', 'nationality',
  'applicationType', 'status', 'fullName', 'employer', 'jobTitle', 'type'
];

// Helper to pick only allowed fields from request body
const sanitizeBody = (body) => {
  const sanitized = {};
  for (const key of ALLOWED_VISA_FIELDS) {
    if (body[key] !== undefined) {
      sanitized[key] = body[key];
    }
  }
  return sanitized;
};

// Helper to validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createVisa = async (req, res) => {
  try {
    const sanitizedData = sanitizeBody(req.body);
    const newVisa = new Visa(sanitizedData);
    await newVisa.save();
    res.status(201).json({ message: 'Visa created successfully', visa: newVisa });
  } catch (error) {
    console.error('Create visa error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Visa grant number already exists' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while creating visa' });
  }
};

export const updateVisa = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid visa ID format' });
    }

    const sanitizedData = sanitizeBody(req.body);

    // Prevent changing visaGrantNumber via update to avoid confusion
    delete sanitizedData.visaGrantNumber;

    const updatedVisa = await Visa.findByIdAndUpdate(id, sanitizedData, { returnDocument: 'after', runValidators: true });
    
    if (!updatedVisa) {
      return res.status(404).json({ message: 'Visa not found' });
    }
    
    res.status(200).json({ message: 'Visa updated successfully', visa: updatedVisa });
  } catch (error) {
    console.error('Update visa error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Visa grant number already exists' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while updating visa' });
  }
};

export const deleteVisa = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid visa ID format' });
    }

    const deletedVisa = await Visa.findByIdAndDelete(id);
    
    if (!deletedVisa) {
      return res.status(404).json({ message: 'Visa not found' });
    }
    
    res.status(200).json({ message: 'Visa deleted successfully' });
  } catch (error) {
    console.error('Delete visa error:', error);
    res.status(500).json({ message: 'Server error while deleting visa' });
  }
};

export const getVisasByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    // Only allow users to query their own visas unless they are admin/employe
    if (req.user.role === 'user' && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden. You can only access your own visas.' });
    }

    const visas = await Visa.find({ userId });
    res.status(200).json({ visas });
  } catch (error) {
    console.error('Get visas by user error:', error);
    res.status(500).json({ message: 'Server error while fetching visas' });
  }
};

export const getAllVisas = async (req, res) => {
  try {
    // Only admin and employe can access this
    if (req.user.role === 'user') {
      return res.status(403).json({ message: 'Forbidden.' });
    }
    const visas = await Visa.find().populate('userId', 'username email');
    res.status(200).json({ visas });
  } catch (error) {
    console.error('Get all visas error:', error);
    res.status(500).json({ message: 'Server error while fetching all visas' });
  }
};

export const getVisaByGrantNumber = async (req, res) => {
  try {
    const { grantNumber } = req.params;
    const visa = await Visa.findOne({ visaGrantNumber: grantNumber });
    
    if (!visa) {
      return res.status(404).json({ message: 'Visa not found' });
    }

    // Route is now public, so we don't check req.user
    res.status(200).json(visa);
  } catch (error) {
    console.error('Get visa by grant number error:', error);
    res.status(500).json({ message: 'Server error while fetching visa' });
  }
};
