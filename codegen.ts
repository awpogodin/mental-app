import { CodegenConfig } from "@graphql-codegen/cli";
import "dotenv/config";

const config: CodegenConfig = {
  schema: process.env.EXPO_PUBLIC_GRAPHQL_API,
  documents: ["./src/lib/gql/documents.ts"],
  generates: {
    "./src/lib/gql/__generated__/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
        fragmentMasking: false,
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
