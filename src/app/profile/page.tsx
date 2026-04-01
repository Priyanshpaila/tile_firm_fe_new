"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User2,
} from "lucide-react";
import { AuthGuard } from "@/components/layout/auth-guard";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { api, resolveUploadUrl } from "@/lib/api";

type ProfileFormState = {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
};

type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const refreshMe = useAuthStore((s) => s.refreshMe);

  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [avatarMessage, setAvatarMessage] = useState<string | null>(null);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  useEffect(() => {
    if (!user) return;

    setProfileForm({
      name: user.name || "",
      phone: user.phone || "",
      street: user.address?.street || "",
      city: user.address?.city || "",
      state: user.address?.state || "",
      pincode: user.address?.pincode || "",
    });
  }, [user]);

  const initials = useMemo(() => {
    const name = user?.name?.trim() || "U";
    const parts = name.split(/\s+/).filter(Boolean);
    return parts
      .slice(0, 2)
      .map((item) => item[0]?.toUpperCase())
      .join("");
  }, [user?.name]);

  const handleProfileSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setProfileMessage(null);

    try {
      setSavingProfile(true);

      await api.users.updateProfile({
        name: profileForm.name.trim(),
        phone: profileForm.phone.trim() || undefined,
        address: {
          street: profileForm.street.trim(),
          city: profileForm.city.trim(),
          state: profileForm.state.trim(),
          pincode: profileForm.pincode.trim(),
          country: "India",
        },
      });

      await refreshMe();
      setProfileMessage("Profile updated successfully.");
    } catch (error) {
      setProfileMessage(
        error instanceof Error ? error.message : "Profile update failed.",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setPasswordMessage(null);

    if (!passwordForm.currentPassword.trim()) {
      setPasswordMessage("Current password is required.");
      return;
    }

    if (passwordForm.newPassword.trim().length < 6) {
      setPasswordMessage("New password must be at least 6 characters.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage("New password and confirm password do not match.");
      return;
    }

    try {
      setSavingPassword(true);

      await api.users.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordMessage("Password changed successfully.");
    } catch (error) {
      setPasswordMessage(
        error instanceof Error ? error.message : "Password update failed.",
      );
    } finally {
      setSavingPassword(false);
    }
  };

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarMessage(null);

    try {
      setUploadingAvatar(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("uploadType", "avatar");

      const uploadRes = await api.uploads.single(formData);

      const rawAvatarUrl =
        uploadRes.data.upload?.url || uploadRes.data.fileUrl || "";

      if (!rawAvatarUrl) {
        throw new Error(
          "Avatar upload succeeded but no file URL was returned.",
        );
      }

      const fullAvatarUrl = resolveUploadUrl(rawAvatarUrl);

      await api.users.updateProfile({ avatar: fullAvatarUrl });
      await refreshMe();

      setAvatarMessage("Profile photo updated successfully.");
    } catch (error) {
      setAvatarMessage(
        error instanceof Error ? error.message : "Avatar upload failed.",
      );
    } finally {
      setUploadingAvatar(false);
      event.target.value = "";
    }
  };

  const messageBox = (
    message: string | null,
    positiveCheck: (text: string) => boolean = (text) =>
      text.toLowerCase().includes("success"),
  ) => {
    if (!message) return null;

    const success = positiveCheck(message);

    return (
      <div
        className={`flex items-start gap-3 rounded-[1rem] px-4 py-3 text-sm ${
          success
            ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border border-red-200 bg-red-50 text-red-700"
        }`}
      >
        {success ? (
          <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0" />
        ) : (
          <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0" />
        )}
        <p>{message}</p>
      </div>
    );
  };

  return (
    <AuthGuard roles={["user", "staff", "admin"]}>
      <PageShell
        title="Profile"
        description="Manage your account details, address, avatar, and password from one place."
      >
        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <section className="grid gap-6">
            <div className="overflow-hidden rounded-[1.8rem] border border-[var(--border-soft)] bg-[linear-gradient(145deg,#171411_0%,#2b231c_55%,#463122_100%)] p-5 text-white shadow-[0_24px_60px_rgba(20,16,10,0.16)] sm:p-6">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/55">
                Account Overview
              </p>

              <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="relative">
                  {user?.avatar ? (
                    <img
                      src={resolveUploadUrl(user.avatar)}
                      alt={user.name || "Profile"}
                      className="h-24 w-24 rounded-full border border-white/10 object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/8 text-2xl font-semibold">
                      {initials}
                    </div>
                  )}

                  <label className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-[#d7a36b] text-[#171411] shadow-lg">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </label>
                </div>

                <div className="min-w-0">
                  <h2 className="text-2xl font-semibold tracking-[-0.04em]">
                    {user?.name || "User"}
                  </h2>
                  <p className="mt-1 break-all text-sm text-white/70">
                    {user?.email || "No email available"}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-medium text-white/85">
                      Role: {user?.role || "user"}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-medium text-white/85">
                      {user?.isActive === false ? "Inactive" : "Active"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.1rem] border border-white/10 bg-white/6 p-4">
                  <div className="flex items-center gap-2 text-white/75">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">Email</span>
                  </div>
                  <p className="mt-2 break-all text-sm font-medium text-white">
                    {user?.email || "Not available"}
                  </p>
                </div>

                <div className="rounded-[1.1rem] border border-white/10 bg-white/6 p-4">
                  <div className="flex items-center gap-2 text-white/75">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">Phone</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-white">
                    {user?.phone || "Not added"}
                  </p>
                </div>

                <div className="rounded-[1.1rem] border border-white/10 bg-white/6 p-4 sm:col-span-2">
                  <div className="flex items-center gap-2 text-white/75">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Address</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-white">
                    {[
                      user?.address?.street,
                      user?.address?.city,
                      user?.address?.state,
                      user?.address?.pincode,
                      user?.address?.country || "India",
                    ]
                      .filter(Boolean)
                      .join(", ") || "No address added"}
                  </p>
                </div>
              </div>

              <div className="mt-5">{messageBox(avatarMessage)}</div>
            </div>

            <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white p-5 shadow-[0_12px_30px_rgba(20,16,10,0.05)]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4.5 w-4.5 text-[#8a6037]" />
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Security Notes
                </h3>
              </div>

              <div className="mt-4 grid gap-3">
                {[
                  "Use a strong password with at least 6 characters.",
                  "Update your phone and address details so bookings and staff visits stay accurate.",
                  "Upload a clear profile photo for a more polished account identity.",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[1rem] bg-[#faf7f2] px-4 py-3 text-sm leading-6 text-[var(--text-secondary)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6">
            <form
              onSubmit={handleProfileSubmit}
              className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white p-5 shadow-[0_12px_30px_rgba(20,16,10,0.05)]"
            >
              <div className="flex items-center gap-2">
                <User2 className="h-4.5 w-4.5 text-[#8a6037]" />
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Personal Details
                </h3>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    Full name
                  </span>
                  <input
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Enter your name"
                    className="h-12 rounded-[1rem] border border-[var(--border-soft)] bg-[#fcfbf8] px-4 text-sm outline-none transition focus:border-[#b88a5b] focus:bg-white focus:ring-4 focus:ring-[#b88a5b]/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    Email address
                  </span>
                  <input
                    value={user?.email || ""}
                    disabled
                    placeholder="Email"
                    className="h-12 rounded-[1rem] border border-[var(--border-soft)] bg-[#f3efe9] px-4 text-sm text-[var(--text-secondary)] outline-none"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    Phone
                  </span>
                  <input
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="Enter phone number"
                    className="h-12 rounded-[1rem] border border-[var(--border-soft)] bg-[#fcfbf8] px-4 text-sm outline-none transition focus:border-[#b88a5b] focus:bg-white focus:ring-4 focus:ring-[#b88a5b]/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    Role
                  </span>
                  <input
                    value={user?.role || ""}
                    disabled
                    className="h-12 rounded-[1rem] border border-[var(--border-soft)] bg-[#f3efe9] px-4 text-sm text-[var(--text-secondary)] capitalize outline-none"
                  />
                </label>

                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    Street
                  </span>
                  <input
                    value={profileForm.street}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        street: e.target.value,
                      }))
                    }
                    placeholder="Street address"
                    className="h-12 rounded-[1rem] border border-[var(--border-soft)] bg-[#fcfbf8] px-4 text-sm outline-none transition focus:border-[#b88a5b] focus:bg-white focus:ring-4 focus:ring-[#b88a5b]/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    City
                  </span>
                  <input
                    value={profileForm.city}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                    placeholder="City"
                    className="h-12 rounded-[1rem] border border-[var(--border-soft)] bg-[#fcfbf8] px-4 text-sm outline-none transition focus:border-[#b88a5b] focus:bg-white focus:ring-4 focus:ring-[#b88a5b]/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    State
                  </span>
                  <input
                    value={profileForm.state}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                    placeholder="State"
                    className="h-12 rounded-[1rem] border border-[var(--border-soft)] bg-[#fcfbf8] px-4 text-sm outline-none transition focus:border-[#b88a5b] focus:bg-white focus:ring-4 focus:ring-[#b88a5b]/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    Pincode
                  </span>
                  <input
                    value={profileForm.pincode}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        pincode: e.target.value,
                      }))
                    }
                    placeholder="Pincode"
                    className="h-12 rounded-[1rem] border border-[var(--border-soft)] bg-[#fcfbf8] px-4 text-sm outline-none transition focus:border-[#b88a5b] focus:bg-white focus:ring-4 focus:ring-[#b88a5b]/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    Country
                  </span>
                  <input
                    value="India"
                    disabled
                    className="h-12 rounded-[1rem] border border-[var(--border-soft)] bg-[#f3efe9] px-4 text-sm text-[var(--text-secondary)] outline-none"
                  />
                </label>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-h-[24px]">{messageBox(profileMessage)}</div>

                <Button
                  type="submit"
                  disabled={savingProfile}
                  className="h-11 rounded-full px-6"
                >
                  {savingProfile ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </form>

            <form
              onSubmit={handlePasswordSubmit}
              className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white p-5 shadow-[0_12px_30px_rgba(20,16,10,0.05)]"
            >
              <div className="flex items-center gap-2">
                <LockKeyhole className="h-4.5 w-4.5 text-[#8a6037]" />
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Change Password
                </h3>
              </div>

              <div className="mt-5 grid gap-4">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    Current password
                  </span>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      placeholder="Enter current password"
                      className="h-12 w-full rounded-[1rem] border border-[var(--border-soft)] bg-[#fcfbf8] px-4 pr-12 text-sm outline-none transition focus:border-[#b88a5b] focus:bg-white focus:ring-4 focus:ring-[#b88a5b]/10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          current: !prev.current,
                        }))
                      }
                      className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[var(--text-secondary)]"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-4.5 w-4.5" />
                      ) : (
                        <Eye className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      New password
                    </span>
                    <div className="relative">
                      <input
                        type={showPasswords.next ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }))
                        }
                        placeholder="Enter new password"
                        className="h-12 w-full rounded-[1rem] border border-[var(--border-soft)] bg-[#fcfbf8] px-4 pr-12 text-sm outline-none transition focus:border-[#b88a5b] focus:bg-white focus:ring-4 focus:ring-[#b88a5b]/10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            next: !prev.next,
                          }))
                        }
                        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[var(--text-secondary)]"
                      >
                        {showPasswords.next ? (
                          <EyeOff className="h-4.5 w-4.5" />
                        ) : (
                          <Eye className="h-4.5 w-4.5" />
                        )}
                      </button>
                    </div>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      Confirm password
                    </span>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        placeholder="Confirm new password"
                        className="h-12 w-full rounded-[1rem] border border-[var(--border-soft)] bg-[#fcfbf8] px-4 pr-12 text-sm outline-none transition focus:border-[#b88a5b] focus:bg-white focus:ring-4 focus:ring-[#b88a5b]/10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            confirm: !prev.confirm,
                          }))
                        }
                        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[var(--text-secondary)]"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-4.5 w-4.5" />
                        ) : (
                          <Eye className="h-4.5 w-4.5" />
                        )}
                      </button>
                    </div>
                  </label>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-h-[24px]">
                  {messageBox(passwordMessage)}
                </div>

                <Button
                  type="submit"
                  disabled={savingPassword}
                  className="h-11 rounded-full px-6"
                >
                  {savingPassword ? "Updating..." : "Change Password"}
                </Button>
              </div>
            </form>
          </section>
        </div>
      </PageShell>
    </AuthGuard>
  );
}