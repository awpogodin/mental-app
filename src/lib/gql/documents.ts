import { gql } from "./__generated__";

export const IMAGE_FIELD_FRAGMENT = gql(`
  fragment ImageFieldFragment on ImageFieldOutput {
    id
    url
    extension
    width
    height
    filesize
  }
`);

export const REQUEST_CODE = gql(`
  mutation RequestCode ($email: String!) {
    requestCode(email: $email) {
      expiresIn
      codeLength
    }
  }
`);

export const SEND_CODE = gql(`
  mutation Login ($email: String!, $code: String!) {
    login(email: $email, code: $code) {
      accessToken
    }
  }
`);

export const ME = gql(`
  query Me {
    me {
      id
      email
      name
      avatar {
        ...ImageFieldFragment
      }
      createdAt
      updatedAt
    }
  }
  `);

export const GET_USER = gql(`
  query GetUser ($id: ID!) {
    user(where: { id: $id }) {
      id
      email
      name
      avatar {
        ...ImageFieldFragment
      }
      email
    }
  }
`);

export const GET_PROFILE = gql(`
  query GetProfile ($id: ID!) {
    user(where: { id: $id }) {
      id
      email
      name
      avatar {
        ...ImageFieldFragment
      }
    }
  }
`);

export const UPDATE_PROFILE = gql(`
  mutation UpdateProfile($id: ID!, $data: UserUpdateInput!) {
    updateUser(where: { id: $id}, data: $data) {
      id
      name
      avatar {
        ...ImageFieldFragment
      }
    }
  }
`);
