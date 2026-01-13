// Route permissions mapping - matches Sidebar.tsx menuItems
const routePermissions: Record<string, string[]> = {
  "/salon-dashboard": ["salon_owner"],
  "/booking-management": ["salon_owner", "staff"],
  "/customer-database": ["salon_owner"],
  "/service-management": ["salon_owner"],
  "/staff-management": ["salon_owner"],
  "/combo-offers-management": ["salon_owner"],
  "/owner-manager": ["super_admin"],
  // Profile pages are restricted to salon owners only
  "/profile": ["salon_owner"],
  "/profile/create": ["salon_owner"],
};

// Default routes for each role
const defaultRoutes: Record<string, string> = {
  super_admin: "/owner-manager",
  salon_owner: "/salon-dashboard",
  staff: "/booking-management",
};

/**
 * Normalizes role to match the format used in route permissions
 */
const normalizeRoleForRoutes = (role: unknown): string => {
  if (!role) return "salon_owner";

  if (Array.isArray(role)) {
    return normalizeRoleForRoutes(role[0]);
  }

  if (typeof role === "object") {
    const extractedRole =
      (role as any).role ??
      (role as any).name ??
      (role as any).type ??
      (role as any).value;
    return normalizeRoleForRoutes(extractedRole);
  }

  if (typeof role !== "string") {
    return "salon_owner";
  }

  const normalized = role.toLowerCase().trim();

  if (["superadmin", "super_admin", "admin"].includes(normalized)) {
    return "super_admin";
  }

  if (["owner", "salon_owner"].includes(normalized)) {
    return "salon_owner";
  }

  if (["staff", "employee"].includes(normalized)) {
    return "staff";
  }

  return "salon_owner";
};

/**
 * Checks if a user with the given role has access to a route
 */
export const hasRouteAccess = (route: string, userRole: unknown): boolean => {
  const normalizedRole = normalizeRoleForRoutes(userRole);
  const allowedRoles = routePermissions[route];
  
  if (!allowedRoles) {
    // If route is not in our permissions list, allow access (for unknown routes)
    return true;
  }
  
  return allowedRoles.includes(normalizedRole);
};

/**
 * Gets the default route for a user role
 */
export const getDefaultRouteForRole = (userRole: unknown): string => {
  const normalizedRole = normalizeRoleForRoutes(userRole);
  return defaultRoutes[normalizedRole] || "/salon-dashboard";
};

/**
 * Validates and returns a safe redirect path for a user
 * If the user doesn't have access to the requested route, returns their default route
 */
export const getSafeRedirectPath = (
  requestedPath: string | null,
  userRole: unknown
): string => {
  if (!requestedPath) {
    return getDefaultRouteForRole(userRole);
  }

  // Check if user has access to the requested route
  if (hasRouteAccess(requestedPath, userRole)) {
    return requestedPath;
  }

  // User doesn't have access, return default route for their role
  return getDefaultRouteForRole(userRole);
};

/**
 * Checks if a user is a staff member
 */
export const isStaff = (userRole: unknown): boolean => {
  const normalizedRole = normalizeRoleForRoutes(userRole);
  return normalizedRole === "staff";
};

