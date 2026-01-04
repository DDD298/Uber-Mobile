import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { searchParams } = new URL(request.url);
    const driverId = searchParams.get("driver_id");
    const clerkId = searchParams.get("clerk_id");

    if (!driverId && !clerkId) {
      return Response.json(
        {
          success: false,
          error: "Thiếu driver_id hoặc clerk_id",
        },
        { status: 400 }
      );
    }

    // Get driver profile
    const driverQuery = driverId
      ? sql`SELECT * FROM drivers WHERE id = ${driverId} LIMIT 1`
      : sql`SELECT * FROM drivers WHERE clerk_id = ${clerkId} LIMIT 1`;

    const driver = await driverQuery;

    if (driver.length === 0) {
      return Response.json(
        {
          success: false,
          error: "Tài xế không tồn tại",
        },
        { status: 404 }
      );
    }

    const driverData = driver[0];

    // Get driver documents
    const documents = await sql`
      SELECT 
        id,
        document_type,
        document_url,
        status,
        uploaded_at,
        reviewed_at,
        rejection_reason
      FROM driver_documents
      WHERE driver_id = ${driverData.id}
      ORDER BY uploaded_at DESC
    `;

    // Get driver warnings
    const warnings = await sql`
      SELECT 
        id,
        warning_type,
        description,
        created_at,
        resolved_at
      FROM driver_warnings
      WHERE driver_id = ${driverData.id}
      ORDER BY created_at DESC
      LIMIT 10
    `;

    // Get recent earnings
    const recentEarnings = await sql`
      SELECT 
        SUM(net_earning) as total_earnings,
        COUNT(*) as total_rides
      FROM driver_earnings
      WHERE driver_id = ${driverData.id}
        AND earned_at >= NOW() - INTERVAL '30 days'
    `;

    return Response.json(
      {
        success: true,
        data: {
          driver: {
            id: driverData.id,
            clerk_id: driverData.clerk_id,
            email: driverData.email,
            first_name: driverData.first_name,
            last_name: driverData.last_name,
            phone: driverData.phone,
            profile_image_url: driverData.profile_image_url,
            car_image_url: driverData.car_image_url,
            vehicle_type: driverData.vehicle_type,
            car_seats: driverData.car_seats,
            license_number: driverData.license_number,
            approval_status: driverData.approval_status,
            status: driverData.status,
            rating: parseFloat(driverData.rating || 5.0),
            average_rating: parseFloat(driverData.average_rating || 5.0),
            rating_count: driverData.rating_count || 0,
            total_rides: driverData.total_rides || 0,
            completed_rides: driverData.completed_rides || 0,
            cancelled_rides: driverData.cancelled_rides || 0,
            total_earnings: parseFloat(driverData.total_earnings || 0),
            warning_count: driverData.warning_count || 0,
            current_latitude: driverData.current_latitude,
            current_longitude: driverData.current_longitude,
            last_location_update: driverData.last_location_update,
            created_at: driverData.created_at,
            updated_at: driverData.updated_at,
          },
          documents: documents.map((doc: any) => ({
            id: doc.id,
            document_type: doc.document_type,
            document_url: doc.document_url,
            status: doc.status,
            uploaded_at: doc.uploaded_at,
            reviewed_at: doc.reviewed_at,
            rejection_reason: doc.rejection_reason,
          })),
          warnings: warnings.map((warning: any) => ({
            id: warning.id,
            warning_type: warning.warning_type,
            description: warning.description,
            created_at: warning.created_at,
            resolved_at: warning.resolved_at,
          })),
          stats: {
            recent_earnings: parseFloat(
              recentEarnings[0]?.total_earnings || 0
            ),
            recent_rides: recentEarnings[0]?.total_rides || 0,
          },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching driver profile:", error);
    return Response.json(
      {
        success: false,
        error: "Lỗi khi lấy thông tin tài xế",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
