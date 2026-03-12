import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    const resend = new Resend(process.env.RESEND_API_KEY || '');
    
    try {
        const { userId, parentEmail, studentName } = await req.json();

        // Create the approval link pointing to our API
        const approvalLink = `${new URL(req.url).origin}/api/auth/approve-consent?userId=${userId}`;

        const { data, error } = await resend.emails.send({
            from: 'Linguaenlinea <onboarding@resend.dev>', // Should be a verified domain later
            to: parentEmail,
            subject: 'Toestemming gevraagd — Linguaenlinea',
            html: `
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #0D0D0D; color: #FFFFFF; border-radius: 24px; border: 1px solid #333;">
                    <h1 style="color: #FF6B6B; font-size: 24px; border-bottom: 2px solid #333; padding-bottom: 20px;">Toestemming voor Linguaenlinea</h1>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: #CCCCCC; margin-top: 30px;">
                        Beste ouder of voogd,
                    </p>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: #CCCCCC;">
                        <strong>${studentName}</strong> heeft zich aangemeld voor <strong>Linguaenlinea</strong>, een adaptief platform om Spaans te leren. 
                        Omdat ${studentName} jonger is dan 16 jaar, hebben we uw toestemming nodig om het account te activeren en de voortgang op te slaan.
                    </p>

                    <div style="margin: 40px 0; text-align: center;">
                        <a href="${approvalLink}" style="background-color: #FF6B6B; color: #FFFFFF; padding: 16px 32px; border-radius: 12px; font-weight: bold; text-decoration: none; display: inline-block; box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);">
                            Ik geef toestemming
                        </a>
                    </div>

                    <p style="font-size: 14px; color: #666666; font-style: italic;">
                        Indien u geen toestemming geeft of deze aanvraag niet herkent, kunt u dit bericht negeren. Het account zal zonder toestemming niet volledig geactiveerd worden.
                    </p>

                    <hr style="border: 0; border-top: 1px solid #333; margin: 40px 0;" />
                    
                    <p style="font-size: 12px; color: #555555; text-align: center;">
                        Linguaenlinea 2026 — Aprende Aprendiendo
                    </p>
                </div>
            `,
        });

        if (error) {
            return NextResponse.json({ success: false, error }, { status: 400 });
        }

        return NextResponse.json({ success: true, data });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
