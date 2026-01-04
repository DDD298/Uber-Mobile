import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const body = await request.json();

    const { driver_id, document_type, document_url } = body;

    // Validate required fields
    if (!driver_id || !document_type || !document_url) {
      return Response.json(
        {
          success: false,
          error: "Thiếu thông tin bắt buộc",
        },
        { status: 400 }
      );
    }

    // Validate document type
    const validDocumentTypes = [
      "license",
      "registration",
      "insurance",
      "profile_photo",
      "vehicle_photo",
    ];

    if (!validDocumentTypes.includes(document_type)) {
      return Response.json(
        {
          success: false,
          error: "Loại giấy tờ không hợp lệ",
        },
        { status: 400 }
      );
    }

    // Check if driver exists
    const driver = await sql`
      SELECT id FROM drivers WHERE id = ${driver_id} LIMIT 1
    `;

    if (driver.length === 0) {
      return Response.json(
        {
          success: false,
          error: "Tài xế không tồn tại",
        },
        { status: 404 }
      );
    }

    // Check if document already exists for this driver and type
    const existingDoc = await sql`
      SELECT id FROM driver_documents 
      WHERE driver_id = ${driver_id} AND document_type = ${document_type}
      LIMIT 1
    `;

    let result;

    if (existingDoc.length > 0) {
      // Update existing document
      result = await sql`
        UPDATE driver_documents 
        SET 
          document_url = ${document_url},
          status = 'pending',
          uploaded_at = NOW(),
          reviewed_at = NULL,
          reviewed_by = NULL,
          rejection_reason = NULL
        WHERE id = ${existingDoc[0].id}
        RETURNING id, status
      `;
    } else {
      // Insert new document
      result = await sql`
        INSERT INTO driver_documents (
          driver_id,
          document_type,
          document_url,
          status,
          uploaded_at
        ) VALUES (
          ${driver_id},
          ${document_type},
          ${document_url},
          'pending',
          NOW()
        )
        RETURNING id, status
      `;
    }

    // Update corresponding field in drivers table based on document type
    switch (document_type) {
      case "license":
        await sql`UPDATE drivers SET license_image_url = ${document_url}, updated_at = NOW() WHERE id = ${driver_id}`;
        break;
      case "registration":
        await sql`UPDATE drivers SET vehicle_registration_url = ${document_url}, updated_at = NOW() WHERE id = ${driver_id}`;
        break;
      case "insurance":
        await sql`UPDATE drivers SET insurance_url = ${document_url}, updated_at = NOW() WHERE id = ${driver_id}`;
        break;
      case "profile_photo":
        await sql`UPDATE drivers SET profile_image_url = ${document_url}, updated_at = NOW() WHERE id = ${driver_id}`;
        break;
      case "vehicle_photo":
        await sql`UPDATE drivers SET car_image_url = ${document_url}, updated_at = NOW() WHERE id = ${driver_id}`;
        break;
    }

    return Response.json(
      {
        success: true,
        data: {
          document_id: result[0].id,
          status: result[0].status,
        },
        message: "Upload giấy tờ thành công",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error uploading document:", error);
    return Response.json(
      {
        success: false,
        error: "Lỗi khi upload giấy tờ",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
