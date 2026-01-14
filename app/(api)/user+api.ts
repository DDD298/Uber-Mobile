import { neon } from '@neondatabase/serverless';

export async function GET(request: Request) {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const { searchParams } = new URL(request.url);
        const clerkId = searchParams.get('clerkId');

        if (!clerkId) {
            return Response.json(
                { success: false, error: 'Missing clerkId parameter' },
                { status: 400 }
            );
        }

        const users = await sql`
            SELECT * FROM users 
            WHERE clerk_id = ${clerkId}
            LIMIT 1
        `;

        if (users.length === 0) {
            return Response.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        return Response.json(
            { success: true, data: users[0] },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error fetching user:', error);
        return Response.json(
            { success: false, error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const {name, email, clerkId} = await request.json();

    if (!name || !email || !clerkId) {
        return Response.json(
            {error: 'Missing required fields'},
            {status: 400}
        )
    }

    const  response = await sql`
        INSERT INTO users (
        name, email, clerk_id
        )
        VALUES (${name}, ${email}, ${clerkId})
    `;

    return new Response(JSON.stringify({data: response}), {status: 200});
    }
    catch (error) {
        return Response.json({error: error}, {status: 500});
    }
}