module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message = "" } = request.body || {};

  if (!name || !email) {
    return response.status(400).json({ error: "Name and email are required" });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || "contact@sealedware.ca";
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "SealedWare <onboarding@resend.dev>";

  if (!resendApiKey) {
    return response.status(500).json({ error: "Email service is not configured" });
  }

  try {
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmail,
        reply_to: email,
        subject: `Website enquiry from ${name}`,
        text: [`Name: ${name}`, `Email: ${email}`, "", "Message:", message || "No message provided."].join("\n"),
      }),
    });

    const emailResult = await emailResponse.json().catch(() => ({}));

    if (!emailResponse.ok) {
      return response.status(502).json({
        error: emailResult.message || emailResult.error || "Email service rejected the request",
      });
    }
  } catch (error) {
    return response.status(502).json({ error: "Email service could not be reached" });
  }

  return response.status(200).json({ ok: true });
};
