// "use client";

// import { ReactNode, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAppSelector } from "../store/hooks";

// interface AuthGuardProps {
//   children: ReactNode;
// }

// const AuthGuard = ({ children }: AuthGuardProps) => {
//   const router = useRouter();
//   const token = useAppSelector((state) => state.auth.token);
//   const [checked, setChecked] = useState(false);

//   useEffect(() => {
//     // Only run on client
//     if (typeof window === "undefined") return;

//     const storedToken = token || localStorage.getItem("authToken");

//     if (!storedToken) {
//       router.replace("/salon-login");
//       return;
//     }

//     setChecked(true);
//   }, [token, router]);

//   if (!checked) {
//     return null;
//   }

//   return <>{children}</>;
// };

// export default AuthGuard;


"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter ,usePathname} from "next/navigation";
import { useAppSelector } from "../store/hooks";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);
  const [checked, setChecked] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // localStorage.setItem("lastProtectedRoute", pathname); // REMOVED: Managed by layout or specific logic

    const storedToken = token || localStorage.getItem("authToken");

    if (!storedToken) {
      localStorage.setItem("redirectAfterLogin", pathname);
      router.replace("/salon-login");
      return;
    }

    setChecked(true);
  }, [token, router, pathname]);

  if (!checked) return null;

  return <>{children}</>;
}






