import { getVietnamTimeAsUTC } from "@/lib/utils";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("Biến môi trường DATABASE_URL chưa được thiết lập");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      origin_address,
      destination_address,
      origin_latitude,
      origin_longitude,
      destination_latitude,
      destination_longitude,
      ride_time,
      fare_price,
      driver_id,
      user_id,
      payment_intent_id,
    } = body;


    if (
      !origin_address ||
      !destination_address ||
      !origin_latitude ||
      !origin_longitude ||
      !destination_latitude ||
      !destination_longitude ||
      !ride_time ||
      !fare_price ||
      !driver_id ||
      !user_id ||
      !payment_intent_id
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    // Sử dụng thời gian Việt Nam (GMT+7) cho created_at
    const vietnamTime = getVietnamTimeAsUTC();

    // Tạo chuyến với trạng thái "booked"
    const response = await sql`
      INSERT INTO rides ( 
          origin_address, 
          destination_address, 
          origin_latitude, 
          origin_longitude, 
          destination_latitude, 
          destination_longitude, 
          ride_time, 
          fare_price, 
          payment_status, 
          driver_id, 
          user_id,
          payment_intent_id,
          created_at
      ) VALUES (
          ${origin_address},
          ${destination_address},
          ${origin_latitude},
          ${origin_longitude},
          ${destination_latitude},
          ${destination_longitude},
          ${ride_time},
          ${fare_price},
          'paid',
          ${driver_id},
          ${user_id},
          ${payment_intent_id},
          ${vietnamTime}
      )
      RETURNING *;
    `;
    const successResponse = { 
      success: true,
      data: response[0],
      message: "Chuyến đã được đặt thành công"
    };
    return new Response(
      JSON.stringify(successResponse), 
      { 
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    
    return new Response(
      JSON.stringify({ 
        error: "Lỗi máy chủ nội bộ",
        details: error instanceof Error ? error.message : "Lỗi không xác định"
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
