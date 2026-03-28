import type { Staff } from "@/types";

type LooseStaff = Staff & {
  email?: string;
  phone?: string;
  isAvailable?: boolean;
  notes?: string;
  serviceAreas?: string[];
  userAccount?: {
    _id?: string;
    email?: string;
    role?: string;
    isActive?: boolean;
  } | null;
};

export type StaffFormState = {
  name: string;
  email: string;
  phone: string;
  password: string;
  isAvailable: boolean;
  notes: string;
  serviceAreasText: string;
};

export const initialStaffForm: StaffFormState = {
  name: "",
  email: "",
  phone: "",
  password: "",
  isAvailable: true,
  notes: "",
  serviceAreasText: "",
};

function splitLines(value: string) {
  return value
    .split(/\n|,/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinLines(values?: string[]) {
  return (values || []).join("\n");
}

export function staffToForm(staff: Staff): StaffFormState {
  const item = staff as LooseStaff;

  return {
    name: item.name || "",
    email: item.email || "",
    phone: item.phone || "",
    password: "",
    isAvailable:
      typeof item.isAvailable === "boolean" ? item.isAvailable : true,
    notes: item.notes || "",
    serviceAreasText: joinLines(item.serviceAreas),
  };
}

export function validateStaffForm(form: StaffFormState) {
  if (!form.name.trim()) return "Staff name is required.";
  if (!form.phone.trim()) return "Phone is required.";
  if (!form.email.trim()) return "Email is required for login.";
  return "";
}

export function buildStaffPayload(form: StaffFormState) {
  const serviceAreas = splitLines(form.serviceAreasText);

  return {
    name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    phone: form.phone.trim(),
    password: form.password.trim() || undefined,
    isAvailable: form.isAvailable,
    notes: form.notes.trim() || undefined,
    serviceAreas: serviceAreas.length ? serviceAreas : undefined,
  };
}