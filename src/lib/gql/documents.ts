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
    entries(where: { createdBy: { id: { equals: $id }}}, orderBy: [{ date: desc }], take: 15) {
      id
      emotion
      situation
      thoughts
      date
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

export const GET_POSTS = gql(`
  query GetPosts ($where: PostWhereInput, $take: Int, $skip: Int) {
    posts(where: $where, take: $take, skip: $skip) {
      id
      name
      category {
        id
        name
        color
      }
      publishedAt
    }
  }
`);

export const GET_POST = gql(`
  query GetPost ($where: PostWhereUniqueInput!) {
    post(where: $where) {
      id
      name
      category {
        id
        name
        color
      }
      content {
        document
      }
      publishedAt
    }
  }
`);

export const GET_ENTRIES = gql(`
  query GetEntries ($where: EntryWhereInput, $take: Int, $skip: Int) {
    entries(where: $where, take: $take, skip: $skip) {
      id
      emotion
      situation
      thoughts
      date
    }
  }
`);

export const GET_ENTRY = gql(`
  query GetEntry ($where: EntryWhereUniqueInput!) {
    entry(where: $where) {
      id
      emotion
      situation
      thoughts
      date
    }
  }
`);

export const CREATE_ENTRY = gql(`
  mutation CreateEntry ($data: EntryCreateInput!) {
    createEntry(data: $data) {
      id
      emotion
      situation
      thoughts
      date
    }
  }
`);

export const UPDATE_ENTRY = gql(`
  mutation UpdateEntry ($where: EntryWhereUniqueInput!, $data: EntryUpdateInput!) {
    updateEntry(where: $where, data: $data) {
      id
      emotion
      situation
      thoughts
      date
    }
  }
`);

export const DELETE_ENTRY = gql(`
  mutation DeleteEntry ($where: EntryWhereUniqueInput!) {
    deleteEntry(where: $where) {
      id
      emotion
      situation
      thoughts
      date
    }
  }
`);
