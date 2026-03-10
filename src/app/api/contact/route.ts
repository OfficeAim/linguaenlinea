import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { name, email, message, subject } = await req.json();

        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'linguaenlinea2@gmail.com',
            subject: `[Linguaenlinea] ${subject}`,
            replyTo: email,
            html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #0D0D0D; color: #FFFFFF;">
          <h2 style="color: #FF6B6B;">Nieuw bericht van ${name}</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Onderwerp:</strong> ${subject}</p>
          <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;" />
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
        });

        if (error) {
            return NextResponse.json({ success: false, error }, { status: 400 });
        }

        return NextResponse.json({ success: true, data });
    } catch (err) {
        return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
    }
}
