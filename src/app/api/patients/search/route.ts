import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Patient from '@/models/Patient';
import { getUserIdOrError } from '@/lib/auth-middleware';

/**
 * GET /api/patients/search?q=searchTerm
 * Search patients by name
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const userIdOrError = await getUserIdOrError(request);
    if (userIdOrError instanceof NextResponse) {
      return userIdOrError;
    }
    const userId = userIdOrError;

    // Get search query from URL
    const searchParams = request.nextUrl.searchParams;
    const searchTerm = searchParams.get('q');

    if (!searchTerm || searchTerm.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Search patients by name (case-insensitive) for this doctor
    const patients = await Patient.find({
      doctorId: userId,
      name: { $regex: searchTerm.trim(), $options: 'i' }, // Case-insensitive search
    })
      .sort({ name: 1 }) // Sort by name alphabetically
      .select('-__v')
      .lean();

    return NextResponse.json({
      success: true,
      data: patients,
      count: patients.length,
      query: searchTerm,
    });
  } catch (error: any) {
    console.error('Error searching patients:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search patients' },
      { status: 500 }
    );
  }
}
