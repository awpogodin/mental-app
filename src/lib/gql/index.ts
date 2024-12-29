import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";

export { apolloClient } from './apolloClient';

if (__DEV__) {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

export * from './documents'
