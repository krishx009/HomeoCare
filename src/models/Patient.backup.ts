import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IPatient extends Document {
  name: string;
  age: number;
  weight: number;
  height: number;
  medicalHistory: string;
  doctorId: string;
  fileUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema = new Schema<IPatient>(
  {
    name: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [0, 'Age cannot be negative'],
      max: [150, 'Age cannot exceed 150'],
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
      min: [0, 'Weight cannot be negative'],
      max: [500, 'Weight cannot exceed 500 kg'],
    },
    height: {
      type: Number,
      required: [true, 'Height is required'],
      min: [0, 'Height cannot be negative'],
      max: [300, 'Height cannot exceed 300 cm'],
    },
    medicalHistory: {
      type: String,
      default: '',
      maxlength: [5000, 'Medical history cannot exceed 5000 characters'],
    },
    doctorId: {
      type: String,
      required: [true, 'Doctor ID is required'],
      index: true, // Index for faster queries by doctorId
    },
    fileUrls: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create compound index for efficient queries
PatientSchema.index({ doctorId: 1, createdAt: -1 });
PatientSchema.index({ doctorId: 1, name: 1 }); // For search functionality

// Prevent model recompilation in development
const Patient: Model<IPatient> = 
  mongoose.models.Patient || mongoose.model<IPatient>('Patient', PatientSchema);

export default Patient;
