import { makeVar } from "@apollo/client";

export const currentUserIdVar = makeVar<string | null>(null);