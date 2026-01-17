// Consultation Type Definitions

export interface PhysicalSymptoms {
  location: string;
  sensation: string;
  timing: string;
  modalities: {
    betterBy: string[];
    worseBy: string[];
  };
}

export interface MentalEmotionalState {
  primaryEmotion: string;
  personality: string;
  stressResponse: string;
}

export interface GeneralCharacteristics {
  thermalState: string;
  appetite: string;
  thirst: string;
  foodCravings: string[];
  sleepPattern: string;
  energyLevel: string;
}

export interface PrescribedRemedy {
  remedyName: string;
  potency: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  reasonForSelection: string;
}

export interface Consultation {
  _id?: string;
  consultationId: string;
  consultationDate: Date | string;
  chiefComplaint: string;
  physicalSymptoms: PhysicalSymptoms;
  mentalEmotionalState: MentalEmotionalState;
  generalCharacteristics: GeneralCharacteristics;
  prescribedRemedy: PrescribedRemedy;
  doctorNotes?: string;
  diagnosisApproach: 'constitutional' | 'acute' | 'chronic' | 'miasmatic';
  followUpDate?: Date | string;
  followUpNotes?: string;
  responseToTreatment?: 'improved' | 'same' | 'worsened' | 'partially_improved';
  nextSteps?: string;
  // Follow-up specific fields
  improvementsNoted?: string;
  remainingSymptoms?: string;
  newSymptoms?: string;
  decision?: 'repeat' | 'change' | 'observe';
  newPrescription?: PrescribedRemedy;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateConsultationData {
  chiefComplaint: string;
  physicalSymptoms: PhysicalSymptoms;
  mentalEmotionalState: MentalEmotionalState;
  generalCharacteristics: GeneralCharacteristics;
  prescribedRemedy: PrescribedRemedy;
  doctorNotes?: string;
  diagnosisApproach: 'constitutional' | 'acute' | 'chronic' | 'miasmatic';
  followUpDate?: Date | string | null;
  nextSteps?: string;
}

export interface FollowUpData {
  responseToTreatment: 'improved' | 'same' | 'worsened' | 'partially_improved';
  improvementsNoted?: string;
  remainingSymptoms?: string;
  newSymptoms?: string;
  followUpNotes?: string;
  decision: 'repeat' | 'change' | 'observe';
  nextFollowUpDate?: Date | string | null;
  newPrescription?: PrescribedRemedy;
}

export interface PatientWithFollowup {
  _id: string;
  name: string;
  age: number;
  currentRemedy?: string;
  lastConsultationDate?: Date;
  followUpDate?: Date;
  daysUntilFollowup: number;
  isOverdue: boolean;
  consultationId?: string;
}

// Common remedy list for autocomplete
export const COMMON_REMEDIES = [
  'Aconite',
  'Apis Mellifica',
  'Arnica Montana',
  'Arsenicum Album',
  'Belladonna',
  'Bryonia Alba',
  'Calcarea Carbonica',
  'Carbo Vegetabilis',
  'Chamomilla',
  'Gelsemium',
  'Hepar Sulph',
  'Ignatia Amara',
  'Lachesis',
  'Lycopodium',
  'Mercurius Solubilis',
  'Natrum Muriaticum',
  'Nux Vomica',
  'Phosphorus',
  'Pulsatilla',
  'Rhus Toxicodendron',
  'Sepia',
  'Silicea',
  'Sulphur',
  'Thuja Occidentalis',
];

export const POTENCIES = [
  '6C',
  '12C',
  '30C',
  '200C',
  '1M',
  '10M',
  '50M',
  'CM',
  'LM1',
  'LM2',
  'LM3',
];

export const SENSATIONS = [
  'burning',
  'throbbing',
  'stitching',
  'cramping',
  'shooting',
  'pressing',
  'dull',
  'sharp',
  'tearing',
  'boring',
];

export const TIMINGS = [
  'morning',
  'afternoon',
  'evening',
  'night',
  'periodic',
  'constant',
  'intermittent',
];

export const MODALITY_OPTIONS = [
  'warmth',
  'cold',
  'rest',
  'motion',
  'pressure',
  'eating',
  'fasting',
  'lying down',
  'standing',
  'sitting',
  'weather change',
  'humidity',
  'dry weather',
];
