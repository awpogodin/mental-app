import 'dotenv/config'

export default {
  schema: process.env.EXPO_PUBLIC_GRAPHQL_API,
  documents: '**/*.{gql,graphql,js,ts,jsx,tsx}',
};