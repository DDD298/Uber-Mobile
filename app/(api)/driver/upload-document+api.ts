import { neon } from "@neondatabase/serverless";
import { uploadFileToCloudinary, uploadImageToCloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const contentType = request.headers.get("content-type") || "";
    
    let driver_id, document_type, document_url;

    if (contentType.includes("multipart/form-data")) {
      // Handle file upload from FormData
      const formData = await request.formData() as any;
      driver_id = formData.get("driver_id");
      document_type = formData.get("document_type");
      const file = formData.get("file");

      if (!file) {
        return Response.json(
          {
            success: false,
            error: "Không tìm thấy file để upload",
          },
          { status: 400 }
        );
      }

      console.log(`📤 [API:Upload] Uploading ${document_type} for driver ${driver_id}`);
      console.log(`   File size: ${file.size} bytes, Type: ${file.type}`);
      
      try {
        // Upload to Cloudinary
        const cloudinaryResult = await uploadFileToCloudinary(
          file,
          `uber-clone/driver-documents/${document_type}`,
          `driver_${driver_id}_${document_type}_${Date.now()}`
        );
        
        document_url = cloudinaryResult.secure_url;
        console.log(`✅ [API:Upload] Success! URL: ${document_url}`);
        console.log(`   Cloudinary ID: ${cloudinaryResult.public_id}`);
      } catch (uploadError: any) {
        console.error(`❌ [API:Upload] Cloudinary upload failed:`, uploadError);
        return Response.json(
          {
            success: false,
            error: "Lỗi khi upload ảnh lên Cloudinary",
            details: uploadError.message,
          },
          { status: 500 }
        );
      }
      
    } else {
      // Handle base64 data from JSON
      const body = await request.json();
      driver_id = body.driver_id;
      document_type = body.document_type;
      const base64Data = body.base64 || body.document_url;

      if (!base64Data) {
        return Response.json(
          {
            success: false,
            error: "Không tìm thấy dữ liệu ảnh để upload",
          },
          { status: 400 }
        );
      }

      // If it's already a URL (starts with http), use it directly
      if (base64Data.startsWith("http")) {
        document_url = base64Data;
        console.log(`🔗 [API:Upload] Using existing URL for ${document_type}`);
      } else {
        // Upload base64 to Cloudinary
        console.log(`📤 [API:Upload] Uploading ${document_type} (base64) for driver ${driver_id}`);
        
        try {
          const cloudinaryResult = await uploadImageToCloudinary(
            base64Data,
            `uber-clone/driver-documents/${document_type}`,
            `driver_${driver_id}_${document_type}_${Date.now()}`
          );
          
          document_url = cloudinaryResult.secure_url;
          console.log(`✅ [API:Upload] Success! URL: ${document_url}`);
          console.log(`   Cloudinary ID: ${cloudinaryResult.public_id}`);
        } catch (uploadError: any) {
          console.error(`❌ [API:Upload] Cloudinary upload failed:`, uploadError);
          return Response.json(
            {
              success: false,
              error: "Lỗi khi upload ảnh lên Cloudinary",
              details: uploadError.message,
            },
            { status: 500 }
          );
        }
      }
    }

    if (!driver_id || !document_type || !document_url) {
      return Response.json(
        {
          success: false,
          error: "Thiếu thông tin bắt buộc",
        },
        { status: 400 }
      );
    }

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

    const existingDoc = await sql`
      SELECT id FROM driver_documents 
      WHERE driver_id = ${driver_id} AND document_type = ${document_type}
      LIMIT 1
    `;

    let result;

    if (existingDoc.length > 0) {
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
        console.log(`📄 [Upload] Bằng lái xe (License): ${document_url}`);
        await sql`UPDATE drivers SET license_image_url = ${document_url}, updated_at = NOW() WHERE id = ${driver_id}`;
        break;
      case "registration":
        console.log(`📄 [Upload] Giấy đăng ký xe (Registration): ${document_url}`);
        // Registration is stored in driver_documents table only
        break;
      case "insurance":
        console.log(`📄 [Upload] Bảo hiểm xe (Insurance): ${document_url}`);
        // Insurance is stored in driver_documents table only
        break;
      case "profile_photo":
        console.log(`👤 [Upload] Ảnh đại diện (Profile Photo): ${document_url}`);
        await sql`UPDATE drivers SET profile_image_url = ${document_url}, updated_at = NOW() WHERE id = ${driver_id}`;
        break;
      case "vehicle_photo":
        console.log(`🚗 [Upload] Ảnh xe (Vehicle Photo): ${document_url}`);
        await sql`UPDATE drivers SET car_image_url = ${document_url}, updated_at = NOW() WHERE id = ${driver_id}`;
        break;
    }

    console.log(`\n✅ [Upload Summary] Document uploaded successfully!`);
    console.log(`   Driver ID: ${driver_id}`);
    console.log(`   Document Type: ${document_type}`);
    console.log(`   Cloudinary URL: ${document_url}`);
    console.log(`   Status: pending review\n`);

    return Response.json(
      {
        success: true,
        data: {
          document_id: result[0].id,
          status: result[0].status,
          document_url: document_url,
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
