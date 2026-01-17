import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Patient from '@/models/Patient';
import { getUserIdOrError } from '@/lib/auth-middleware';

/**
 * GET /api/patients
 * Get all patients for the authenticated doctor
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const userIdOrError = await getUserIdOrError(request);
    if (userIdOrError instanceof NextResponse) {
      return userIdOrError;
    }
    const userId = userIdOrError;

    // Connect to MongoDB
    await connectDB();

    // Get all patients for this doctor, sorted by most recent first
    const patients = await Patient.find({ doctorId: userId })
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();

    return NextResponse.json({
      success: true,
      data: patients,
      count: patients.length,
    });
  } catch (error: any) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/patients
 * Create a new patient
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const userIdOrError = await getUserIdOrError(request);
    if (userIdOrError instanceof NextResponse) {
      return userIdOrError;
    }
    const userId = userIdOrError;

    // Parse request body
    const body = await request.json();
    const { name, age, weight, height, medicalHistory } = body;

    // Validate required fields
    if (!name || age === undefined || weight === undefined || height === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Create new patient
    const patient = await Patient.create({
      name: name.trim(),
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
      medicalHistory: medicalHistory || '',
      doctorId: userId,
      fileUrls: [],
    });

    return NextResponse.json({
      success: true,
      data: patient,
      message: 'Patient created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating patient:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create patient' },
      { status: 500 }
    );
  }
}
