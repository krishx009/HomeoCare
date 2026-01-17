import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Patient from '@/models/Patient';
import { getUserIdOrError } from '@/lib/auth-middleware';

// PUT /api/consultations/[consultationId]/followup - Add follow-up to consultation
export async function PUT(
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

    // Parse request body
    const body = await request.json();
    const {
      responseToTreatment,
      improvementsNoted,
      remainingSymptoms,
      newSymptoms,
      followUpNotes,
      decision,
      nextFollowUpDate,
      newPrescription,
    } = body;

    // Validate required fields
    if (!responseToTreatment || !decision) {
      return NextResponse.json(
        { error: 'Response to treatment and decision are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find patient with this consultation and verify ownership
    const patient = await Patient.findOne({
      'consultations.consultationId': consultationId,
      doctorId: userId,
    });

    if (!patient) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      );
    }

    // Find and update the consultation
    const consultation: any = patient.consultations.find(
      (c: any) => c.consultationId === consultationId
    );

    if (!consultation) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      );
    }

    // Update follow-up fields
    consultation.responseToTreatment = responseToTreatment;
    consultation.improvementsNoted = improvementsNoted || '';
    consultation.remainingSymptoms = remainingSymptoms || '';
    consultation.newSymptoms = newSymptoms || '';
    consultation.followUpNotes = followUpNotes || '';
    consultation.decision = decision;

    if (nextFollowUpDate) {
      consultation.followUpDate = new Date(nextFollowUpDate);
    }

    // If changing remedy, create a new consultation entry
    if (decision === 'change' && newPrescription) {
      const newConsultationId = `CONS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const newConsultation = {
        consultationId: newConsultationId,
        consultationDate: new Date(),
        chiefComplaint: `Follow-up to ${consultationId}`,
        physicalSymptoms: consultation.physicalSymptoms,
        mentalEmotionalState: consultation.mentalEmotionalState,
        generalCharacteristics: consultation.generalCharacteristics,
        prescribedRemedy: newPrescription,
        doctorNotes: `Changed remedy from ${consultation.prescribedRemedy.remedyName} to ${newPrescription.remedyName}`,
        diagnosisApproach: consultation.diagnosisApproach,
        followUpDate: nextFollowUpDate ? new Date(nextFollowUpDate) : undefined,
      };

      patient.consultations.push(newConsultation as any);
    }

    // Save patient (triggers pre-save hook to update summary fields)
    await patient.save();

    return NextResponse.json({
      message: 'Follow-up added successfully',
      consultation,
    });
  } catch (error: any) {
    console.error('Error adding follow-up:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add follow-up' },
      { status: 500 }
    );
  }
}
