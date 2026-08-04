"use server";

import { revalidateTag } from "next/cache";

export async function handlePasswordRecovery({
  use_email,
  use_password,
  use_token,
}: {
  use_email: string;
  use_token: string;
  use_password: string;
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_EXTERN_API}/password_recovery?use_token=${use_token}&use_email=${use_email}`,
    {
      method: "POST",
      body: JSON.stringify({ use_password }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const json_response = await response.json();
  const message = json_response.message || "Error";
  revalidateTag("logged_user");
  return { succeed: response.ok, message };
}
