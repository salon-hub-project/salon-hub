export type NormalizedRole = "SUPERADMIN" | "OWNER" | "STAFF";

export const normalizeRole = (role: unknown): NormalizedRole => {
  if (!role) return "STAFF"; 

  // Handle array: ["OWNER"]
  if (Array.isArray(role)) {
    return normalizeRole(role[0]);
  }

  // Handle object: { role: "OWNER" } or { name: "OWNER" }
  if (typeof role === "object") {
    const extractedRole =
      (role as any).role ??
      (role as any).name ??
      (role as any).type ??
      (role as any).value;

    return normalizeRole(extractedRole);
  }

  if (typeof role !== "string") {
    return "STAFF";
  }

  const normalized = role.toLowerCase().trim();

  if (["superadmin", "super_admin", "admin"].includes(normalized)) {
    return "SUPERADMIN";
  }

  if (["owner", "salon_owner"].includes(normalized)) {
    return "OWNER";
  }

  if (["staff", "employee"].includes(normalized)) {
    return "STAFF";
  }

  return "STAFF";
};
