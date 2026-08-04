"use server";
export async function handleSendEmail(values: { use_email: string }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_EXTERN_API}/sendEmail`,
    {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const json_response = await response.json();
  const message = json_response.message || "Error";
  return { succeed: response.ok, message };
}
