import nodemailer from "nodemailer";
import escapeHtml from "escape-html";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	if (!body) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid request payload. Body is required.",
		});
	}

	const { name, email, subject, message, } = body;

	// Validation
	if (!name || typeof name !== "string" || !name.trim()) {
		throw createError({
			statusCode: 400,
			statusMessage: "Name is required and must be a valid text.",
		});
	}

	if (!email || typeof email !== "string" || !email.trim()) {
		throw createError({
			statusCode: 400,
			statusMessage: "Email address is required.",
		});
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email.trim())) {
		throw createError({
			statusCode: 400,
			statusMessage: "Please provide a valid email address.",
		});
	}

	if (!message || typeof message !== "string" || !message.trim()) {
		throw createError({
			statusCode: 400,
			statusMessage: "Message is required and must be a valid text.",
		});
	}

    if (message.length > 5000) {
        throw createError({
            statusCode: 400,
            statusMessage: "Message too long",
        });
    }

	const trimmedName = escapeHtml(name.trim());
	const trimmedEmail = escapeHtml(email.trim());
    const trimmedSubject = escapeHtml(subject.trim());
	const trimmedMessage = escapeHtml(message.trim());


	// Dispatching
	const user = process.env.SMTP_USER;
	const receiver = process.env.CONTACT_EMAIL_RECEIVER ?? user;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;


	if (user && clientId && clientSecret && refreshToken) {
		try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: user,
                    clientId: clientId,
                    clientSecret: clientSecret,
                    refreshToken: refreshToken,
                }
            })

			await transporter.sendMail({
				from: `"Portfolio Contact" <${user}>`,
                replyTo: trimmedEmail,
				to: receiver,
				subject: `${trimmedSubject ?? `Portfolio Message from ${trimmedName}`}`,
				text: `Name: ${trimmedName}\nEmail: ${trimmedEmail}\n\nMessage:\n${trimmedMessage}`,
				html: `
                    <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px;">
                        <h2 style="color: #235347; border-bottom: 2px solid #235347; padding-bottom: 8px;">New Contact Form Message</h2>
                        <p><strong>Name:</strong> ${trimmedName}</p>
                        <p><strong>Email:</strong> <a href="mailto:${trimmedEmail}">${trimmedEmail}</a></p>
                        <p><strong>Message:</strong></p>
                        <blockquote style="background: #f7fafc; padding: 15px; border-left: 4px solid #235347; margin: 0; white-space: pre-wrap;">${trimmedMessage}</blockquote>
                        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                        <p style="font-size: 0.875rem; color: #718096;">Sent from your Portfolio contact form.</p>
                    </div>
                `,
			});

			return {
				success: true,
				message: "Message sent successfully via SMTP!",
			};
		} catch (error: any) {
			console.error("SMTP sending error:", error);
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to send email. Error: ${error.message || "SMTP Configuration Issue"}`,
			});
		}
	} else {
		// Fallback simulation: Log to console in a beautiful, structured format.
		console.log(
			"\n\x1b[36m%s\x1b[0m",
			"==================================================",
		);
		console.log(
			"\x1b[36m%s\x1b[0m",
			"  [SIMULATED EMAIL SERVICE - NO SMTP SETUP] ",
		);
		console.log(
			"\x1b[36m%s\x1b[0m",
			"==================================================",
		);
		console.log(`👤 \x1b[1mName:\x1b[0m    ${trimmedName}`);
		console.log(`✉️ \x1b[1mEmail:\x1b[0m   ${trimmedEmail}`);
		console.log(`💬 \x1b[1mMessage:\x1b[0m\n${trimmedMessage}`);
		console.log(
			"\x1b[36m%s\x1b[0m",
			"==================================================",
		);
		console.log(
			"\x1b[33m%s\x1b[0m",
			"💡 Tip: To send real emails, define SMTP_HOST, SMTP_PORT,",
		);
		console.log(
			"\x1b[33m%s\x1b[0m",
			"   SMTP_USER, and SMTP_PASS in your environment.\n",
		);

		return {
			success: true,
			simulated: true,
			message: "Message processed and logged (Simulation Mode).",
		};
	}
});
