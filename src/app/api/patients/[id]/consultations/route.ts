import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Patient from '@/models/Patient';
import { getUserIdOrError } from '@/lib/auth-middleware';
import { Types } from 'mongoose';

// POST /api/patients/[id]/consultations - Add new consultation
export async function POST(
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

    // Validate patient ID
    const patientId = params.id;
    if (!Types.ObjectId.isValid(patientId)) {
      return NextResponse.json(
        { error: 'Invalid patient ID' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      chiefComplaint,
      physicalSymptoms,
      mentalEmotionalState,
      generalCharacteristics,
      prescribedRemedy,
      doctorNotes,
      diagnosisApproach,
      followUpDate,
    } = body;

    // Validate required fields
    if (!chiefComplaint || !prescribedRemedy?.remedyName) {
      return NextResponse.json(
        { error: 'Chief complaint and remedy are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find patient and verify ownership
    const patient = await Patient.findOne({
      _id: patientId,
      doctorId: userId,
    });

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    // Generate consultation ID
    const consultationId = `CONS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create consultation object
    const newConsultation = {
      consultationId,
      consultationDate: new Date(),
      chiefComplaint,
      physicalSymptoms: physicalSymptoms || {
        location: '',
        sensation: '',
        timing: '',
        modalities: { betterBy: [], worseBy: [] },
      },
      mentalEmotionalState: mentalEmotionalState || {
        primaryEmotion: '',
        personality: '',
        stressResponse: '',
      },
      generalCharacteristics: generalCharacteristics || {
        thermalState: '',
        appetite: '',
        thirst: '',
        foodCravings: [],
        sleepPattern: '',
        energyLevel: '',
      },
      prescribedRemedy: {
        remedyName: prescribedRemedy.remedyName,
        potency: prescribedRemedy.potency || '',
        dosage: prescribedRemedy.dosage || '',
        frequency: prescribedRemedy.frequency || '',
        duration: prescribedRemedy.duration || '',
        instructions: prescribedRemedy.instructions || '',
        reasonForSelection: prescribedRemedy.reasonForSelection || '',
      },
      doctorNotes: doctorNotes || '',
      diagnosisApproach: diagnosisApproach || 'constitutional',
      followUpDate: followUpDate ? new Date(followUpDate) : undefined,
    };

    // Add consultation to patient
    patient.consultations.push(newConsultation as any);
    await patient.save();

    return NextResponse.json({
      message: 'Consultation added successfully',
      consultation: newConsultation,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding consultation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add consultation' },
      { status: 500 }
    );
  }
}

// GET /api/patients/[id]/consultations - Get all consultations for patient
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

    // Validate patient ID
    const patientId = params.id;
    if (!Types.ObjectId.isValid(patientId)) {
      return NextResponse.json(
        { error: 'Invalid patient ID' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find patient and verify ownership
    const patient = await Patient.findOne({
      _id: patientId,
      doctorId: userId,
    }).select('consultations').lean();

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    // Return consultations sorted by date (newest first)
    const consultations = (patient.consultations || []).sort((a: any, b: any) => 
      new Date(b.consultationDate).getTime() - new Date(a.consultationDate).getTime()
    );

    return NextResponse.json({
      consultations,
    });
  } catch (error: any) {
    console.error('Error fetching consultations:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch consultations' },
      { status: 500 }
    );
  }
}
