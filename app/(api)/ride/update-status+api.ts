import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL chưa được thiết lập");
}

// PATCH: Update ride status
export async function PATCH(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { ride_id, new_status } = await request.json();

    if (!ride_id || !new_status) {
      return Response.json(
        { error: "Thiếu ride_id hoặc new_status" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['confirmed', 'driver_arrived', 'in_progress', 'completed', 'cancelled', 'no_show'];
    if (!validStatuses.includes(new_status)) {
      return Response.json(
        { error: "Status không hợp lệ" },
        { status: 400 }
      );
    }

    // Update ride status
    const result = await sql`
      UPDATE rides
      SET ride_status = ${new_status}
      WHERE ride_id = ${ride_id}
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json(
        { error: "Không tìm thấy chuyến đi" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        data: result[0],
        message: `Đã cập nhật trạng thái thành ${new_status}`,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        error: "Lỗi máy chủ nội bộ",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET: Get rides that need status update
export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const now = new Date();

    // 1. confirmed -> driver_arrived (sau 1 phút)
    const toDriverArrived = await sql`
      SELECT ride_id, created_at, ride_status, ride_time
      FROM rides
      WHERE ride_status = 'confirmed'
      AND created_at + INTERVAL '1 minute' <= ${now.toISOString()}
    `;

    // 2. driver_arrived -> in_progress (sau 1 phút từ khi confirmed + 1 phút)
    const toInProgress = await sql`
      SELECT ride_id, created_at, ride_status, ride_time
      FROM rides
      WHERE ride_status = 'driver_arrived'
      AND created_at + INTERVAL '2 minutes' <= ${now.toISOString()}
    `;

    // 3. in_progress -> completed (sau ride_time phút từ khi in_progress)
    // in_progress bắt đầu sau 2 phút, nên completed = created_at + 2 phút + ride_time
    const toCompleted = await sql`
      SELECT ride_id, created_at, ride_status, ride_time
      FROM rides
      WHERE ride_status = 'in_progress'
      AND created_at + INTERVAL '2 minutes' + (ride_time || ' minutes')::INTERVAL <= ${now.toISOString()}
    `;

    return Response.json(
      {
        success: true,
        data: {
          toDriverArrived: toDriverArrived.length,
          toInProgress: toInProgress.length,
          toCompleted: toCompleted.length,
          rides: {
            toDriverArrived,
            toInProgress,
            toCompleted,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        error: "Lỗi máy chủ nội bộ",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
