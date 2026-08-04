import { format } from "date-fns";
import { cookies } from "next/headers";

export function microServiceRequestConfig() {
  const headers = {
    Authorization: `Bearer 34i2oj4o2md9mczxmcmzx0-2i2393u1lsdmmsdaiji3ji1j4jdajspok1209lmxclvx`,
    "Content-Type": "application/json",
  };
  return headers;
}
export function apiRequestConfig() {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  const headers = {
    Authorization: `Bearer ${access_token?.value}`,
    "Content-Type": "application/json",
  };
  return headers;
}

export function getUserUUID() {
  const cookieStore = cookies();
  const use_uuid = cookieStore.get("use_uuid");
  return use_uuid?.value;
}

export function getAccessToken() {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  return access_token?.value;
}

export function defaultDateFilter(): { init: string; end: string } {
  const init = format(new Date(), "yyyy-MM-dd");
  const end = format(new Date(), "yyyy-MM-dd");
  return { init, end };
}
