import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL chưa được thiết lập");
}

// GET: Lấy danh sách warnings của driver hoặc tất cả warnings
export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { searchParams } = new URL(request.url);
    const driver_id = searchParams.get("driver_id");
    const status = searchParams.get("status"); // 'unresolved', 'resolved', 'all'
    const severity = searchParams.get("severity"); // 'low', 'medium', 'high', 'critical'

    let result;

    if (driver_id) {
      // Lấy warnings của một driver cụ thể
      if (status === "unresolved" && severity) {
        result = await sql`
          SELECT 
            dw.*,
            d.first_name,
            d.last_name,
            d.status as driver_status,
            d.average_rating,
            d.warning_count,
            r.stars as rating_stars,
            r.comment as rating_comment
          FROM driver_warnings dw
          JOIN drivers d ON dw.driver_id = d.id
          LEFT JOIN ratings r ON dw.rating_id = r.id
          WHERE dw.driver_id = ${driver_id}
            AND dw.resolved_at IS NULL
            AND dw.severity = ${severity}
          ORDER BY dw.created_at DESC
        `;
      } else if (status === "unresolved") {
        result = await sql`
          SELECT 
            dw.*,
            d.first_name,
            d.last_name,
            d.status as driver_status,
            d.average_rating,
            d.warning_count,
            r.stars as rating_stars,
            r.comment as rating_comment
          FROM driver_warnings dw
          JOIN drivers d ON dw.driver_id = d.id
          LEFT JOIN ratings r ON dw.rating_id = r.id
          WHERE dw.driver_id = ${driver_id}
            AND dw.resolved_at IS NULL
          ORDER BY dw.created_at DESC
        `;
      } else if (status === "resolved" && severity) {
        result = await sql`
          SELECT 
            dw.*,
            d.first_name,
            d.last_name,
            d.status as driver_status,
            d.average_rating,
            d.warning_count,
            r.stars as rating_stars,
            r.comment as rating_comment
          FROM driver_warnings dw
          JOIN drivers d ON dw.driver_id = d.id
          LEFT JOIN ratings r ON dw.rating_id = r.id
          WHERE dw.driver_id = ${driver_id}
            AND dw.resolved_at IS NOT NULL
            AND dw.severity = ${severity}
          ORDER BY dw.created_at DESC
        `;
      } else if (status === "resolved") {
        result = await sql`
          SELECT 
            dw.*,
            d.first_name,
            d.last_name,
            d.status as driver_status,
            d.average_rating,
            d.warning_count,
            r.stars as rating_stars,
            r.comment as rating_comment
          FROM driver_warnings dw
          JOIN drivers d ON dw.driver_id = d.id
          LEFT JOIN ratings r ON dw.rating_id = r.id
          WHERE dw.driver_id = ${driver_id}
            AND dw.resolved_at IS NOT NULL
          ORDER BY dw.created_at DESC
        `;
      } else if (severity) {
        result = await sql`
          SELECT 
            dw.*,
            d.first_name,
            d.last_name,
            d.status as driver_status,
            d.average_rating,
            d.warning_count,
            r.stars as rating_stars,
            r.comment as rating_comment
          FROM driver_warnings dw
          JOIN drivers d ON dw.driver_id = d.id
          LEFT JOIN ratings r ON dw.rating_id = r.id
          WHERE dw.driver_id = ${driver_id}
            AND dw.severity = ${severity}
          ORDER BY dw.created_at DESC
        `;
      } else {
        result = await sql`
          SELECT 
            dw.*,
            d.first_name,
            d.last_name,
            d.status as driver_status,
            d.average_rating,
            d.warning_count,
            r.stars as rating_stars,
            r.comment as rating_comment
          FROM driver_warnings dw
          JOIN drivers d ON dw.driver_id = d.id
          LEFT JOIN ratings r ON dw.rating_id = r.id
          WHERE dw.driver_id = ${driver_id}
          ORDER BY dw.created_at DESC
        `;
      }
    } else {
      // Lấy tất cả warnings (cho admin)
      if (status === "unresolved" && severity) {
        result = await sql`
          SELECT 
            dw.*,
            d.first_name,
            d.last_name,
            d.status as driver_status,
            d.average_rating,
            d.warning_count,
            d.bad_ratings_count
          FROM driver_warnings dw
          JOIN drivers d ON dw.driver_id = d.id
          WHERE dw.resolved_at IS NULL
            AND dw.severity = ${severity}
          ORDER BY dw.created_at DESC LIMIT 100
        `;
      } else if (status === "unresolved") {
        result = await sql`
          SELECT 
            dw.*,
            d.first_name,
            d.last_name,
            d.status as driver_status,
            d.average_rating,
            d.warning_count,
            d.bad_ratings_count
          FROM driver_warnings dw
          JOIN drivers d ON dw.driver_id = d.id
          WHERE dw.resolved_at IS NULL
          ORDER BY dw.created_at DESC LIMIT 100
        `;
      } else if (status === "resolved" && severity) {
        result = await sql`
          SELECT 
            dw.*,
            d.first_name,
            d.last_name,
            d.status as driver_status,
            d.average_rating,
            d.warning_count,
            d.bad_ratings_count
          FROM driver_warnings dw
          JOIN drivers d ON dw.driver_id = d.id
          WHERE dw.resolved_at IS NOT NULL
            AND dw.severity = ${severity}
          ORDER BY dw.created_at DESC LIMIT 100
        `;
      } else if (status === "resolved") {
        result = await sql`
          SELECT 
            dw.*,
            d.first_name,
            d.last_name,
            d.status as driver_status,
            d.average_rating,
            d.warning_count,
            d.bad_ratings_count
          FROM driver_warnings dw
          JOIN drivers d ON dw.driver_id = d.id
          WHERE dw.resolved_at IS NOT NULL
          ORDER BY dw.created_at DESC LIMIT 100
        `;
      } else if (severity) {
        result = await sql`
          SELECT 
            dw.*,
            d.first_name,
            d.last_name,
            d.status as driver_status,
            d.average_rating,
            d.warning_count,
            d.bad_ratings_count
          FROM driver_warnings dw
          JOIN drivers d ON dw.driver_id = d.id
          WHERE dw.severity = ${severity}
          ORDER BY dw.created_at DESC LIMIT 100
        `;
      } else {
        result = await sql`
          SELECT 
            dw.*,
            d.first_name,
            d.last_name,
            d.status as driver_status,
            d.average_rating,
            d.warning_count,
            d.bad_ratings_count
          FROM driver_warnings dw
          JOIN drivers d ON dw.driver_id = d.id
          ORDER BY dw.created_at DESC LIMIT 100
        `;
      }
    }

    return Response.json(
      {
        success: true,
        data: result,
        count: result.length,
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

// POST: Resolve warning (cho admin)
export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { warning_id, admin_id, notes, action } = await request.json();

    if (!warning_id || !admin_id) {
      return Response.json(
        { error: "Thiếu warning_id hoặc admin_id" },
        { status: 400 }
      );
    }

    // Lấy thông tin warning
    const warning = await sql`
      SELECT * FROM driver_warnings WHERE id = ${warning_id}
    `;

    if (warning.length === 0) {
      return Response.json(
        { error: "Không tìm thấy warning" },
        { status: 404 }
      );
    }

    // Resolve warning
    await sql`
      UPDATE driver_warnings 
      SET 
        resolved_at = CURRENT_TIMESTAMP,
        resolved_by = ${admin_id},
        notes = ${notes || null}
      WHERE id = ${warning_id}
    `;

    // Nếu action là 'reactivate', reset driver status
    if (action === "reactivate") {
      await sql`
        UPDATE drivers 
        SET 
          status = 'active',
          suspended_at = NULL,
          suspension_reason = NULL
        WHERE id = ${warning[0].driver_id}
      `;
    }

    return Response.json(
      {
        success: true,
        message: "Warning đã được xử lý",
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

// PUT: Update driver status manually (cho admin)
export async function PUT(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { driver_id, status, reason, admin_id } = await request.json();

    if (!driver_id || !status || !admin_id) {
      return Response.json(
        { error: "Thiếu thông tin bắt buộc" },
        { status: 400 }
      );
    }

    const validStatuses = ["active", "warned", "suspended", "under_review", "banned"];
    if (!validStatuses.includes(status)) {
      return Response.json(
        { error: "Status không hợp lệ" },
        { status: 400 }
      );
    }

    // Update driver status
    if (status === "suspended" || status === "banned") {
      await sql`
        UPDATE drivers 
        SET 
          status = ${status},
          suspended_at = CURRENT_TIMESTAMP,
          suspension_reason = ${reason || "Manual action by admin"}
        WHERE id = ${driver_id}
      `;
    } else {
      await sql`
        UPDATE drivers 
        SET 
          status = ${status},
          suspended_at = NULL,
          suspension_reason = NULL
        WHERE id = ${driver_id}
      `;
    }

    // Tạo warning record
    await sql`
      INSERT INTO driver_warnings (
        driver_id,
        warning_type,
        severity,
        reason,
        action_taken
      ) VALUES (
        ${driver_id},
        'manual_action',
        'medium',
        ${reason || `Status changed to ${status} by admin`},
        ${status}
      )
    `;

    return Response.json(
      {
        success: true,
        message: "Driver status đã được cập nhật",
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
