import { User as FirebaseUser } from 'firebase/auth';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface SignUpData {
  email: string;
  password: string;
  displayName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface PhoneAuthData {
  phoneNumber: string;
  verificationCode?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  medicalHistory: string;
  documents: PatientDocument[];
  createdAt: Date;
  updatedAt: Date;
  doctorId: string;
}

export interface PatientDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export type PatientFormData = Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'doctorId' | 'documents'>;
