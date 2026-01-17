import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Patient from '@/models/Patient';
import { getUserIdOrError } from '@/lib/auth-middleware';

/**
 * GET /api/patients/search
 * Search and filter patients with advanced options
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

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const dateRange = searchParams.get('dateRange');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build filter query
    const filter: any = { doctorId: userId };

    // Search by name (case-insensitive, partial match)
    if (query) {
      filter.name = { $regex: query, $options: 'i' };
    }

    // Date filtering
    if (dateRange || startDate || endDate || month || year) {
      filter.createdAt = {};

      if (dateRange === 'today') {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        filter.createdAt = { $gte: startOfDay, $lte: endOfDay };
      } else if (dateRange === 'week') {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        filter.createdAt.$gte = startOfWeek;
      } else if (dateRange === 'month') {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        filter.createdAt.$gte = startOfMonth;
      } else if (dateRange === 'year') {
        const startOfYear = new Date();
        startOfYear.setMonth(0, 1);
        startOfYear.setHours(0, 0, 0, 0);
        filter.createdAt.$gte = startOfYear;
      } else if (startDate || endDate) {
        // Custom date range
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          filter.createdAt.$gte = start;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          filter.createdAt.$lte = end;
        }
      } else if (month) {
        // Filter by specific month
        const monthNum = parseInt(month);
        const yearNum = year ? parseInt(year) : new Date().getFullYear();
        const startOfMonth = new Date(yearNum, monthNum - 1, 1);
        startOfMonth.setHours(0, 0, 0, 0);
        const endOfMonth = new Date(yearNum, monthNum, 0);
        endOfMonth.setHours(23, 59, 59, 999);
        filter.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
      } else if (year) {
        // Filter by specific year
        const yearNum = parseInt(year);
        const startOfYear = new Date(yearNum, 0, 1);
        startOfYear.setHours(0, 0, 0, 0);
        const endOfYear = new Date(yearNum, 11, 31);
        endOfYear.setHours(23, 59, 59, 999);
        filter.createdAt = { $gte: startOfYear, $lte: endOfYear };
      }
    }

    // Build sort object
    const sortObject: any = {};
    sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [patients, total] = await Promise.all([
      Patient.find(filter)
        .select('name age weight height medicalHistory createdAt updatedAt')
        .sort(sortObject)
        .skip(skip)
        .limit(limit)
        .lean(),
      Patient.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      patients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      query: query || undefined,
    });
  } catch (error: any) {
    console.error('Search patients error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to search patients' },
      { status: 500 }
    );
  }
}
