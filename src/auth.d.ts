declare module "@/auth" {
  import { ClerkProvider, useAuth } from "@clerk/clerk-react";

  export { ClerkProvider, useAuth as useClerkAuth };
}
