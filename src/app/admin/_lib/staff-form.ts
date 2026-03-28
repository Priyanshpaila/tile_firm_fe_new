import type { Staff } from "@/types";

type LooseStaff = Staff & {
  email?: string;
  phone?: string;
  isAvailable?: boolean;
  notes?: string;
};

export type StaffFormState = {
  name: string;
  email: string;
  phone: string;
  isAvailable: boolean;
  notes: string;
};

export const initialStaffForm: StaffFormState = {
  name: "",
  email: "",
  phone: "",
  isAvailable: true,
  notes: "",
};

export function staffToForm(staff: Staff): StaffFormState {
  const item = staff as LooseStaff;

  return {
    name: item.name || "",
    email: item.email || "",
    phone: item.phone || "",
    isAvailable:
      typeof item.isAvailable === "boolean" ? item.isAvailable : true,
    notes: item.notes || "",
  };
}

export function validateStaffForm(form: StaffFormState) {
  if (!form.name.trim()) return "Staff name is required.";
  if (!form.phone.trim()) return "Phone is required.";
  return "";
}

export function buildStaffPayload(form: StaffFormState) {
  return {
    name: form.name.trim(),
    email: form.email.trim() || undefined,
    phone: form.phone.trim(),
    isAvailable: form.isAvailable,
    notes: form.notes.trim() || undefined,
  };
}