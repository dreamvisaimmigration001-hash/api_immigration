import Visa from '../models/Visa.js';
import mongoose from 'mongoose';

// Whitelist of allowed fields to prevent mass assignment
const ALLOWED_VISA_FIELDS = [
  'userId', 'familyName', 'givenNames', 'documentNumber',
  'visaClassSubclass', 'visaApplicant', 'visaGrantDate',
  'visaExpiryDate', 'location', 'visaStatus', 'visaGrantNumber',
  'entriesAllowed', 'mustNotArriveAfter', 'enterBeforeDate',
  'periodOfStay', 'visaType', 'dateOfBirth', 'nationality',
  'applicationType', 'status', 'fullName', 'employer', 'jobTitle', 'type', 'trn', 'visaorigin'
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
}

// Helper to validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Helper to get origin
const getOrigin = (req) => req.query.origin || req.body.origin;

export const createVisa = async (req, res) => {
  try {
    const origin = getOrigin(req);
    if (!origin) return res.status(400).json({ message: 'Origin is required' });

    const sanitizedData = sanitizeBody(req.body);
    sanitizedData.visaorigin = origin; // Force the origin

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
    const origin = getOrigin(req);
    if (!origin) return res.status(400).json({ message: 'Origin is required' });

    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid visa ID format' });
    }

    const sanitizedData = sanitizeBody(req.body);

    // Prevent changing visaGrantNumber and visaorigin via update to avoid confusion
    delete sanitizedData.visaGrantNumber;
    delete sanitizedData.visaorigin;

    const updatedVisa = await Visa.findOneAndUpdate({ _id: id, visaorigin: origin }, sanitizedData, { returnDocument: 'after', runValidators: true });
    
    if (!updatedVisa) {
      return res.status(404).json({ message: 'Visa not found or does not belong to this origin' });
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
    const origin = getOrigin(req);
    if (!origin) return res.status(400).json({ message: 'Origin is required' });

    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid visa ID format' });
    }

    const deletedVisa = await Visa.findOneAndDelete({ _id: id, visaorigin: origin });
    
    if (!deletedVisa) {
      return res.status(404).json({ message: 'Visa not found or does not belong to this origin' });
    }
    
    res.status(200).json({ message: 'Visa deleted successfully' });
  } catch (error) {
    console.error('Delete visa error:', error);
    res.status(500).json({ message: 'Server error while deleting visa' });
  }
};

export const getVisasByUser = async (req, res) => {
  try {
    const origin = getOrigin(req);
    if (!origin) return res.status(400).json({ message: 'Origin is required' });

    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    // Only allow users to query their own visas unless they are admin/employe
    if (req.user.role === 'user' && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden. You can only access your own visas.' });
    }

    const visas = await Visa.find({ userId, visaorigin: origin });
    res.status(200).json({ visas });
  } catch (error) {
    console.error('Get visas by user error:', error);
    res.status(500).json({ message: 'Server error while fetching visas' });
  }
};

export const getAllVisas = async (req, res) => {
  try {
    const origin = getOrigin(req);
    if (!origin) return res.status(400).json({ message: 'Origin is required' });

    // Only admin and employe can access this
    if (req.user.role === 'user') {
      return res.status(403).json({ message: 'Forbidden.' });
    }
    const visas = await Visa.find({ visaorigin: origin }).populate('userId', 'username email');
    res.status(200).json({ visas });
  } catch (error) {
    console.error('Get all visas error:', error);
    res.status(500).json({ message: 'Server error while fetching all visas' });
  }
};

export const getVisaByGrantNumber = async (req, res) => {
  try {
    const origin = getOrigin(req);
    if (!origin) return res.status(400).json({ message: 'Origin is required' });

    const { grantNumber } = req.params;
    const visa = await Visa.findOne({ visaGrantNumber: grantNumber, visaorigin: origin });
    
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

export const searchVisa = async (req, res) => {
  try {
    const origin = getOrigin(req);
    if (!origin) return res.status(400).json({ message: 'Origin is required' });

    const { searchType, referenceNumber } = req.body;
    
    if (!searchType || !referenceNumber) {
      return res.status(400).json({ message: 'Search type and reference number are required' });
    }

    let query = { visaorigin: origin };
    if (searchType === 'passport') {
      query.documentNumber = referenceNumber;
    } else if (searchType === 'visaGrantNumber') {
      query.visaGrantNumber = referenceNumber;
    } else if (searchType === 'trn') {
      query.trn = referenceNumber;
    } else {
      return res.status(400).json({ message: 'Invalid search type. Supported types are passport, visaGrantNumber, and trn' });
    }

    const visa = await Visa.findOne(query);
    
    if (!visa) {
      return res.status(404).json({ message: 'Visa not found' });
    }

    res.status(200).json(visa);
  } catch (error) {
    console.error('Search visa error:', error);
    res.status(500).json({ message: 'Server error while searching visa' });
  }
};
