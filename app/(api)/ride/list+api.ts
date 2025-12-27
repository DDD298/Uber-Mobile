import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("Biến môi trường DATABASE_URL chưa được thiết lập");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const status = searchParams.get('status'); // 'all', 'active', 'completed', 'cancelled'
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';


    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "Missing user_id parameter" }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);


    // Build query with template literals for proper parameterization
    let response;
    if (status && status !== 'all') {
      switch (status) {
        case 'active':
          response = await sql`
            SELECT
                rides.ride_id,
                rides.origin_address,
                rides.destination_address,
                rides.origin_latitude,
                rides.origin_longitude,
                rides.destination_latitude,
                rides.destination_longitude,
                rides.ride_time,
                rides.fare_price,
                rides.payment_status,
                rides.ride_status,
                rides.created_at,
                rides.cancelled_at,
                rides.cancel_reason,
                json_build_object(
                    'driver_id', drivers.id,
                    'first_name', drivers.first_name,
                    'last_name', drivers.last_name,
                    'profile_image_url', drivers.profile_image_url,
                    'car_image_url', drivers.car_image_url,
                    'car_seats', drivers.car_seats,
                    'rating', drivers.rating,
                    'vehicle_type', drivers.vehicle_type
                ) AS driver 
            FROM 
                rides
            INNER JOIN
                drivers ON rides.driver_id = drivers.id
            WHERE rides.user_id = ${user_id} AND rides.ride_status IN ('confirmed', 'driver_arrived', 'in_progress')
            ORDER BY rides.created_at DESC
            LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
          `;
          break;
        case 'completed':
          response = await sql`
            SELECT
                rides.ride_id,
                rides.origin_address,
                rides.destination_address,
                rides.origin_latitude,
                rides.origin_longitude,
                rides.destination_latitude,
                rides.destination_longitude,
                rides.ride_time,
                rides.fare_price,
                rides.payment_status,
                rides.ride_status,
                rides.created_at,
                rides.cancelled_at,
                rides.cancel_reason,
                json_build_object(
                    'driver_id', drivers.id,
                    'first_name', drivers.first_name,
                    'last_name', drivers.last_name,
                    'profile_image_url', drivers.profile_image_url,
                    'car_image_url', drivers.car_image_url,
                    'car_seats', drivers.car_seats,
                    'rating', drivers.rating,
                    'vehicle_type', drivers.vehicle_type
                ) AS driver,
                CASE 
                    WHEN ratings.id IS NOT NULL THEN json_build_object(
                        'id', ratings.id,
                        'stars', ratings.stars,
                        'comment', ratings.comment,
                        'created_at', ratings.created_at
                    )
                    ELSE NULL
                END AS rating
            FROM 
                rides
            INNER JOIN
                drivers ON rides.driver_id = drivers.id
            LEFT JOIN
                ratings ON rides.ride_id = ratings.ride_id
            WHERE rides.user_id = ${user_id} AND rides.ride_status = 'completed'
            ORDER BY rides.created_at DESC
            LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
          `;
          break;
        case 'cancelled':
          response = await sql`
            SELECT
                rides.ride_id,
                rides.origin_address,
                rides.destination_address,
                rides.origin_latitude,
                rides.origin_longitude,
                rides.destination_latitude,
                rides.destination_longitude,
                rides.ride_time,
                rides.fare_price,
                rides.payment_status,
                rides.ride_status,
                rides.created_at,
                rides.cancelled_at,
                rides.cancel_reason,
                json_build_object(
                    'driver_id', drivers.id,
                    'first_name', drivers.first_name,
                    'last_name', drivers.last_name,
                    'profile_image_url', drivers.profile_image_url,
                    'car_image_url', drivers.car_image_url,
                    'car_seats', drivers.car_seats,
                    'rating', drivers.rating,
                    'vehicle_type', drivers.vehicle_type
                ) AS driver 
            FROM 
                rides
            INNER JOIN
                drivers ON rides.driver_id = drivers.id
            WHERE rides.user_id = ${user_id} AND rides.ride_status IN ('cancelled', 'no_show')
            ORDER BY rides.created_at DESC
            LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
          `;
          break;
        default:
          response = await sql`
            SELECT
                rides.ride_id,
                rides.origin_address,
                rides.destination_address,
                rides.origin_latitude,
                rides.origin_longitude,
                rides.destination_latitude,
                rides.destination_longitude,
                rides.ride_time,
                rides.fare_price,
                rides.payment_status,
                rides.ride_status,
                rides.created_at,
                rides.cancelled_at,
                rides.cancel_reason,
                json_build_object(
                    'driver_id', drivers.id,
                    'first_name', drivers.first_name,
                    'last_name', drivers.last_name,
                    'profile_image_url', drivers.profile_image_url,
                    'car_image_url', drivers.car_image_url,
                    'car_seats', drivers.car_seats,
                    'rating', drivers.rating,
                    'vehicle_type', drivers.vehicle_type
                ) AS driver 
            FROM 
                rides
            INNER JOIN
                drivers ON rides.driver_id = drivers.id
            WHERE rides.user_id = ${user_id}
            ORDER BY rides.created_at DESC
            LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
          `;
      }
    } else {
      response = await sql`
        SELECT
            rides.ride_id,
            rides.origin_address,
            rides.destination_address,
            rides.origin_latitude,
            rides.origin_longitude,
            rides.destination_latitude,
            rides.destination_longitude,
            rides.ride_time,
            rides.fare_price,
            rides.payment_status,
            rides.ride_status,
            rides.created_at,
            rides.cancelled_at,
            rides.cancel_reason,
            json_build_object(
                'driver_id', drivers.id,
                'first_name', drivers.first_name,
                'last_name', drivers.last_name,
                'profile_image_url', drivers.profile_image_url,
                'car_image_url', drivers.car_image_url,
                'car_seats', drivers.car_seats,
                'rating', drivers.rating,
                'vehicle_type', drivers.vehicle_type
            ) AS driver,
            CASE 
                WHEN ratings.id IS NOT NULL THEN json_build_object(
                    'id', ratings.id,
                    'stars', ratings.stars,
                    'comment', ratings.comment,
                    'created_at', ratings.created_at
                )
                ELSE NULL
            END AS rating
        FROM 
            rides
        INNER JOIN
            drivers ON rides.driver_id = drivers.id
        LEFT JOIN
            ratings ON rides.ride_id = ratings.ride_id
        WHERE rides.user_id = ${user_id}
        ORDER BY rides.created_at DESC
        LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
      `;
    }


    // Đếm tổng số records
    let countResponse;
    if (status && status !== 'all') {
      switch (status) {
        case 'active':
          countResponse = await sql`
            SELECT COUNT(*) as total FROM rides WHERE rides.user_id = ${user_id} AND rides.ride_status IN ('confirmed', 'driver_arrived', 'in_progress')
          `;
          break;
        case 'completed':
          countResponse = await sql`
            SELECT COUNT(*) as total FROM rides WHERE rides.user_id = ${user_id} AND rides.ride_status = 'completed'
          `;
          break;
        case 'cancelled':
          countResponse = await sql`
            SELECT COUNT(*) as total FROM rides WHERE rides.user_id = ${user_id} AND rides.ride_status IN ('cancelled', 'no_show')
          `;
          break;
        default:
          countResponse = await sql`
            SELECT COUNT(*) as total FROM rides WHERE rides.user_id = ${user_id}
          `;
      }
    } else {
      countResponse = await sql`
        SELECT COUNT(*) as total FROM rides WHERE rides.user_id = ${user_id}
      `;
    }

    const totalCount = parseInt(countResponse[0].total);

    return new Response(
      JSON.stringify({ 
        success: true,
        data: response,
        pagination: {
          total: totalCount,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: response.length === parseInt(limit)
        }
      }),
      { 
        status: 200,
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
