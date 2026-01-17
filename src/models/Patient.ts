import mongoose, { Schema, Model, Document } from 'mongoose';

// Consultation sub-document interfaces
export interface IPhysicalSymptoms {
  location: string;
  sensation: string;
  timing: string;
  modalities: {
    betterBy: string[];
    worseBy: string[];
  };
}

export interface IMentalEmotionalState {
  primaryEmotion: string;
  personality: string;
  stressResponse: string;
}

export interface IGeneralCharacteristics {
  thermalState: string; // 'chilly' | 'hot'
  appetite: string;
  thirst: string;
  foodCravings: string[];
  sleepPattern: string;
  energyLevel: string;
}

export interface IPrescribedRemedy {
  remedyName: string;
  potency: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  reasonForSelection: string;
}

export interface IConsultation extends Document {
  consultationId: string;
  consultationDate: Date;
  chiefComplaint: string;
  physicalSymptoms: IPhysicalSymptoms;
  mentalEmotionalState: IMentalEmotionalState;
  generalCharacteristics: IGeneralCharacteristics;
  prescribedRemedy: IPrescribedRemedy;
  doctorNotes: string;
  diagnosisApproach: string; // 'constitutional' | 'acute' | 'chronic'
  followUpDate?: Date;
  followUpNotes?: string;
  responseToTreatment?: string; // 'improved' | 'same' | 'worsened' | 'partially_improved'
  nextSteps?: string;
}

export interface IPatient extends Document {
  name: string;
  age: number;
  weight: number;
  height: number;
  medicalHistory: string;
  doctorId: string;
  fileUrls: string[];
  consultations: IConsultation[];
  currentRemedy?: string;
  lastConsultationDate?: Date;
  totalConsultations: number;
  createdAt: Date;
  updatedAt: Date;
}

// Physical Symptoms Schema
const PhysicalSymptomsSchema = new Schema<IPhysicalSymptoms>({
  location: { type: String, default: '' },
  sensation: { type: String, default: '' },
  timing: { type: String, default: '' },
  modalities: {
    betterBy: { type: [String], default: [] },
    worseBy: { type: [String], default: [] },
  },
}, { _id: false });

// Mental Emotional State Schema
const MentalEmotionalStateSchema = new Schema<IMentalEmotionalState>({
  primaryEmotion: { type: String, default: '' },
  personality: { type: String, default: '' },
  stressResponse: { type: String, default: '' },
}, { _id: false });

// General Characteristics Schema
const GeneralCharacteristicsSchema = new Schema<IGeneralCharacteristics>({
  thermalState: { type: String, default: '' },
  appetite: { type: String, default: '' },
  thirst: { type: String, default: '' },
  foodCravings: { type: [String], default: [] },
  sleepPattern: { type: String, default: '' },
  energyLevel: { type: String, default: '' },
}, { _id: false });

// Prescribed Remedy Schema
const PrescribedRemedySchema = new Schema<IPrescribedRemedy>({
  remedyName: {
    type: String,
    required: [true, 'Remedy name is required'],
    trim: true,
  },
  potency: {
    type: String,
    required: [true, 'Potency is required'],
  },
  dosage: {
    type: String,
    required: [true, 'Dosage is required'],
  },
  frequency: {
    type: String,
    required: [true, 'Frequency is required'],
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
  },
  instructions: { type: String, default: '' },
  reasonForSelection: {
    type: String,
    required: false,
    maxlength: [1000, 'Reason cannot exceed 1000 characters'],
    default: '',
  },
}, { _id: false });

// Consultation Schema
const ConsultationSchema = new Schema<IConsultation>({
  consultationId: {
    type: String,
    required: true,
  },
  consultationDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  chiefComplaint: {
    type: String,
    required: [true, 'Chief complaint is required'],
    maxlength: [2000, 'Chief complaint cannot exceed 2000 characters'],
  },
  physicalSymptoms: {
    type: PhysicalSymptomsSchema,
    required: true,
  },
  mentalEmotionalState: {
    type: MentalEmotionalStateSchema,
    required: true,
  },
  generalCharacteristics: {
    type: GeneralCharacteristicsSchema,
    required: true,
  },
  prescribedRemedy: {
    type: PrescribedRemedySchema,
    required: true,
  },
  doctorNotes: {
    type: String,
    default: '',
    maxlength: [3000, 'Doctor notes cannot exceed 3000 characters'],
  },
  diagnosisApproach: {
    type: String,
    required: true,
    enum: ['constitutional', 'acute', 'chronic'],
    default: 'constitutional',
  },
  followUpDate: Date,
  followUpNotes: {
    type: String,
    default: '',
    maxlength: [2000, 'Follow-up notes cannot exceed 2000 characters'],
  },
  responseToTreatment: {
    type: String,
    enum: ['improved', 'same', 'worsened', 'partially_improved', ''],
    default: '',
  },
  nextSteps: {
    type: String,
    default: '',
    maxlength: [1000, 'Next steps cannot exceed 1000 characters'],
  },
}, { timestamps: true });

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
      required: false,
      min: [0, 'Age cannot be negative'],
      max: [150, 'Age cannot exceed 150'],
    },
    weight: {
      type: Number,
      required: false,
      min: [0, 'Weight cannot be negative'],
      max: [500, 'Weight cannot exceed 500 kg'],
    },
    height: {
      type: Number,
      required: false,
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
    consultations: {
      type: [ConsultationSchema],
      default: [],
    },
    currentRemedy: {
      type: String,
      default: '',
    },
    lastConsultationDate: Date,
    totalConsultations: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create compound index for efficient queries
PatientSchema.index({ doctorId: 1, createdAt: -1 });
PatientSchema.index({ doctorId: 1, name: 1 }); // For search functionality
PatientSchema.index({ 'consultations.consultationId': 1 }); // For consultation lookup

// Pre-save hook to update consultation summary fields
PatientSchema.pre('save', function(next) {
  if (this.consultations && this.consultations.length > 0) {
    this.totalConsultations = this.consultations.length;
    const latestConsultation = this.consultations[this.consultations.length - 1];
    this.lastConsultationDate = latestConsultation.consultationDate;
    this.currentRemedy = latestConsultation.prescribedRemedy.remedyName;
  }
  next();
});

// Prevent model recompilation in development
// Delete the model if it exists to force recompilation with updated schema
if (mongoose.models.Patient) {
  delete mongoose.models.Patient;
}

const Patient: Model<IPatient> = mongoose.model<IPatient>('Patient', PatientSchema);

export default Patient;
