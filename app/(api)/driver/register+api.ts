import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const body = await request.json();

    const {
      clerk_id,
      email,
      first_name,
      last_name,
      phone,
      license_number,
      vehicle_type,
      car_seats,
    } = body;

    // Validate required fields
    if (
      !clerk_id ||
      !email ||
      !first_name ||
      !last_name ||
      !phone ||
      !license_number ||
      !vehicle_type ||
      !car_seats
    ) {
      return Response.json(
        {
          success: false,
          error: "Thiếu thông tin bắt buộc",
        },
        { status: 400 }
      );
    }

    // Check if driver already exists
    const existingDriver = await sql`
      SELECT id, approval_status FROM drivers 
      WHERE clerk_id = ${clerk_id} OR email = ${email}
      LIMIT 1
    `;

    if (existingDriver.length > 0) {
      return Response.json(
        {
          success: false,
          error: "Tài xế đã tồn tại",
          data: {
            driver_id: existingDriver[0].id,
            approval_status: existingDriver[0].approval_status,
          },
        },
        { status: 409 }
      );
    }

    // Insert new driver
    const result = await sql`
      INSERT INTO drivers (
        clerk_id,
        email,
        first_name,
        last_name,
        phone,
        license_number,
        vehicle_type,
        car_seats,
        approval_status,
        status,
        rating,
        average_rating,
        created_at,
        updated_at
      ) VALUES (
        ${clerk_id},
        ${email},
        ${first_name},
        ${last_name},
        ${phone},
        ${license_number},
        ${vehicle_type},
        ${car_seats},
        'pending',
        'offline',
        5.0,
        5.0,
        NOW(),
        NOW()
      )
      RETURNING id, approval_status
    `;

    return Response.json(
      {
        success: true,
        data: {
          driver_id: result[0].id,
          approval_status: result[0].approval_status,
        },
        message: "Đăng ký tài xế thành công. Vui lòng upload giấy tờ.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error registering driver:", error);
    return Response.json(
      {
        success: false,
        error: "Lỗi khi đăng ký tài xế",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
