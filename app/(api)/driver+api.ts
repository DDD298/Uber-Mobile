import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const response = await sql`
      SELECT 
        id,
        first_name,
        last_name,
        profile_image_url,
        car_image_url,
        car_seats,
        rating,
        vehicle_type
      FROM drivers
    `;

    return Response.json({ data: response });
  } catch (error) {
    return Response.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}