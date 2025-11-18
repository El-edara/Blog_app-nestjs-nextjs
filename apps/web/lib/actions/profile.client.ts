"use server";

import { updateProfile } from "./profile.actions";

export async function updateProfileClient(formData: FormData) {
  return await updateProfile(formData);
}
