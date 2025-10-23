import * as React from "react";
import { useUser as useClerkUser } from "@clerk/clerk-react";

const useUser = () => {
  const { isLoaded, isSignedIn, user } = useClerkUser();

  const formattedUser = React.useMemo(() => {
    if (!user) return null;

    return {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      name: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
    };
  }, [user]);

  return {
    user: formattedUser,
    data: formattedUser,
    loading: !isLoaded,
    isSignedIn,
  };
};

export { useUser };
export default useUser;
