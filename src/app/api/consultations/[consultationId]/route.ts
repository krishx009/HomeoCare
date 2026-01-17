import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Patient from '@/models/Patient';
import { getUserIdOrError } from '@/lib/auth-middleware';

// GET /api/consultations/[consultationId] - Get single consultation
export async function GET(
  request: NextRequest,
  { params }: { params: { consultationId: string } }
) {
  try {
    // Verify authentication
    const userIdOrError = await getUserIdOrError(request);
    if (userIdOrError instanceof NextResponse) {
      return userIdOrError;
    }
    const userId = userIdOrError;

    const consultationId = params.consultationId;

    // Connect to database
    await dbConnect();

    // Find patient with this consultation and verify ownership
    const patient = await Patient.findOne({
      'consultations.consultationId': consultationId,
      doctorId: userId,
    }).lean();

    if (!patient) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      );
    }

    // Find the specific consultation
    const consultation = patient.consultations?.find(
      (c: any) => c.consultationId === consultationId
    );

    if (!consultation) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      consultation,
      patient: {
        _id: patient._id,
        name: patient.name,
        age: patient.age,
      },
    });
  } catch (error: any) {
    console.error('Error fetching consultation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch consultation' },
      { status: 500 }
    );
  }
}
