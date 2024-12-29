import i18n from "@/lib/i18n";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { getToken } from "@/lib/auth/tokenStorage";
import {
  ApolloClient,
  ApolloLink,
  from,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { showToast } from "@/lib/ui";
import { logger as defaultLogger } from "@/lib/logger";
import { isExtractableFile } from "../imagePicker";

const logger = defaultLogger.extend('apollo')

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((error) => {
      // TODO: подумать, как разлогинивать пользователя при ошибке аутентификации
      // if (error.extensions?.code === "KS_ACCESS_DENIED") {
      //   clearToken();
      //   currentUserVar(null);
      // }
      logger.error(error);
      // TODO: подумать, как лучше отображать ошибки юзеру
      showToast({
        title: i18n.t("common.errors.graphql.title"),
        preset: "error",
        haptic: "error",
      });
    });
  }
  if (networkError) {
    logger.error(networkError);
    // TODO: подумать, как лучше отображать ошибки юзеру
    showToast({
      title: i18n.t("common.errors.network.title"),
      message: i18n.t("common.errors.network.message"),
      preset: "error",
      haptic: "error",
    });
    // showToast({ title: networkError.name, message: networkError.message, preset: 'error', haptic: 'error' })
  }
});

const uploadLink = createUploadLink({
  uri: process.env.EXPO_PUBLIC_GRAPHQL_API,
  credentials: 'same-origin',
  headers: {'Apollo-Require-Preflight': 'true'},
  isExtractableFile: isExtractableFile
});

const authLink = setContext(async (_, { headers }) => {
  const token = await getToken();
  if (token) {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      },
    };
  }
  return {
    headers: {
      ...headers,
    },
  };
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([authLink, errorLink, uploadLink as unknown as ApolloLink]),
});
