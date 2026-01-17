import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Patient from '@/models/Patient';
import { getUserIdOrError } from '@/lib/auth-middleware';
import mongoose from 'mongoose';

/**
 * GET /api/patients/[id]
 * Get a specific patient by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const userIdOrError = await getUserIdOrError(request);
    if (userIdOrError instanceof NextResponse) {
      return userIdOrError;
    }
    const userId = userIdOrError;

    const { id } = params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid patient ID' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Find patient by ID and verify ownership
    const patient = await Patient.findOne({
      _id: id,
      doctorId: userId, // Ensure doctor can only access their own patients
    }).select('-__v').lean();

    if (!patient) {
      return NextResponse.json(
        { success: false, error: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: patient,
    });
  } catch (error: any) {
    console.error('Error fetching patient:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch patient' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/patients/[id]
 * Update a patient's information
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const userIdOrError = await getUserIdOrError(request);
    if (userIdOrError instanceof NextResponse) {
      return userIdOrError;
    }
    const userId = userIdOrError;

    const { id } = params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid patient ID' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, age, weight, height, medicalHistory } = body;

    // Connect to MongoDB
    await connectDB();

    // Update patient and verify ownership
    const patient = await Patient.findOneAndUpdate(
      {
        _id: id,
        doctorId: userId, // Ensure doctor can only update their own patients
      },
      {
        ...(name && { name: name.trim() }),
        ...(age !== undefined && { age: Number(age) }),
        ...(weight !== undefined && { weight: Number(weight) }),
        ...(height !== undefined && { height: Number(height) }),
        ...(medicalHistory !== undefined && { medicalHistory }),
      },
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validators
      }
    ).select('-__v');

    if (!patient) {
      return NextResponse.json(
        { success: false, error: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: patient,
      message: 'Patient updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating patient:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update patient' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/patients/[id]
 * Delete a patient
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const userIdOrError = await getUserIdOrError(request);
    if (userIdOrError instanceof NextResponse) {
      return userIdOrError;
    }
    const userId = userIdOrError;

    const { id } = params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid patient ID' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Delete patient and verify ownership
    const patient = await Patient.findOneAndDelete({
      _id: id,
      doctorId: userId, // Ensure doctor can only delete their own patients
    });

    if (!patient) {
      return NextResponse.json(
        { success: false, error: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Patient deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting patient:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete patient' },
      { status: 500 }
    );
  }
}
