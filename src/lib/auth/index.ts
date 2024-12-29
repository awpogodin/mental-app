import { apolloClient, GET_USER, ME } from "@/lib/gql";
import { useQuery, useReactiveVar } from "@apollo/client";
import { clearToken, setToken } from "./tokenStorage";
import { logger } from "./logger";
import { currentUserIdVar } from "./variables";

export const getUser = async ({
  skipError = true,
}: { skipError?: boolean } = {}) => {
  try {
    const { data } = await apolloClient.query({
      query: ME,
      fetchPolicy: "no-cache",
    });
    if (data?.me) {
      currentUserIdVar(data.me.id);
      return data.me;
    }
    clearToken();
    currentUserIdVar(null);
    return null;
  } catch (error) {
    clearToken();
    currentUserIdVar(null);
    logger.warn('Error fetching user', error);
    if (skipError) {
      return null;
    }
    throw error;
  }
};

export const useAuth = () => {
  const currentUserId = useReactiveVar(currentUserIdVar);

  // #region Разлогин пользователя, если пользователь не авторизован
  useQuery(ME, {
    skip: !currentUserId,
    onCompleted: ({ me }) => {
      if (!me) {
        logout();
      }
    },
    pollInterval: 1 * 60 * 1000,
  })
  // #endregion

  const { data } = useQuery(GET_USER, {
    variables: { id: currentUserId ?? ''},
    skip: !currentUserId,
    fetchPolicy: 'cache-first',
  })

  const login = async (token: string) => {
    logger.debug(`Received authorization token: '${token}'`)
    await setToken(token);
    return getUser();
  };

  const logout = () => {
    logger.info('logout')
    clearToken();
    currentUserIdVar(null);
  };

  return {
    isLoggedIn: !!currentUserId,
    currentUser: data?.user,
    login,
    logout,
  };
};
