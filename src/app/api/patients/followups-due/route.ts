import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Patient from '@/models/Patient';
import { getUserIdOrError } from '@/lib/auth-middleware';

// GET /api/patients/followups-due - Get patients with upcoming/overdue follow-ups
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all patients for this doctor
    const patients = await Patient.find({ doctorId: userId }).lean();

    const patientsWithFollowups = patients
      .map((patient: any) => {
        if (!patient.consultations || patient.consultations.length === 0) {
          return null;
        }

        // Find latest consultation with follow-up date
        const consultationsWithFollowup = patient.consultations
          .filter((c: any) => c.followUpDate)
          .sort((a: any, b: any) => 
            new Date(b.consultationDate).getTime() - new Date(a.consultationDate).getTime()
          );

        if (consultationsWithFollowup.length === 0) {
          return null;
        }

        const latestConsultation = consultationsWithFollowup[0];
        const followUpDate = new Date(latestConsultation.followUpDate);
        
        const daysUntilFollowup = Math.ceil(
          (followUpDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Include if overdue or due within next 7 days
        if (daysUntilFollowup <= 7) {
          return {
            _id: patient._id,
            name: patient.name,
            age: patient.age,
            currentRemedy: patient.currentRemedy || latestConsultation.prescribedRemedy?.remedyName,
            lastConsultationDate: patient.lastConsultationDate || latestConsultation.consultationDate,
            followUpDate: latestConsultation.followUpDate,
            consultationId: latestConsultation.consultationId,
            daysUntilFollowup,
            isOverdue: daysUntilFollowup < 0,
          };
        }

        return null;
      })
      .filter(Boolean)
      .sort((a: any, b: any) => a.daysUntilFollowup - b.daysUntilFollowup);

    return NextResponse.json({ patients: patientsWithFollowups });
  } catch (error: any) {
    console.error('Error fetching follow-ups:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch follow-ups' },
      { status: 500 }
    );
  }
}
