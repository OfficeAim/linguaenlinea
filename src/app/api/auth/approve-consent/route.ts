import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return new Response('Missing userId', { status: 400 });
    }

    // Use service role key if available to bypass RLS, or ensure RLS allows system updates
    // For now, since I'm just an agent implementing, I'll use the regular client but
    // ideally this should be a service role operation.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    // NOTE: Using service role key is safer for backend operations.
    // If not set, it might fail RLS if configured strictly.
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    try {
        const { error } = await supabase
            .from('profiles')
            .update({ parental_consent_status: 'approved' })
            .eq('id', userId);

        if (error) throw error;

        // Redirect to a success page
        return NextResponse.redirect(new URL('/consent-success', req.url));
    } catch (err: any) {
        console.error('Error approving consent:', err);
        return new Response(`Er is een fout opgetreden: ${err.message}`, { status: 500 });
    }
}
