import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Patient from '@/models/Patient';
import { getUserIdOrError } from '@/lib/auth-middleware';

// GET /api/patients/today - Get all patients registered today
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const userIdOrError = await getUserIdOrError(request);
    if (userIdOrError instanceof NextResponse) {
      return userIdOrError;
    }
    const userId = userIdOrError;

    // Connect to database
    await dbConnect();

    // Get start and end of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Find all patients created today for this doctor
    const patients = await Patient.find({
      doctorId: userId,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .select('name age height weight medicalHistory createdAt updatedAt')
      .sort({ createdAt: -1 }) // Newest first
      .lean();

    return NextResponse.json({
      patients,
      count: patients.length,
      date: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error fetching today\'s patients:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch today\'s patients' },
      { status: 500 }
    );
  }
}
