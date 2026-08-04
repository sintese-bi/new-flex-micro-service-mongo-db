"use server";
export async function handleRegister(register_fields: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_EXTERN_API}/register`,
    {
      method: "POST",
      body: JSON.stringify(register_fields),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const json_response = await response.json();
  const message = json_response.message || "Error";
  return { succeed: response.ok, message };
}
