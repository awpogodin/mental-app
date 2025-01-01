import { GET_POST } from "@/lib/gql";
import { DocumentRenderer } from "@keystone-6/document-renderer";
import {
  Badge,
  isValidColorKey,
  Layout,
  Skeleton,
  Surface,
  Text,
  useDocumentRenderer,
} from "@/lib/ui";
import { NetworkStatus, useQuery } from "@apollo/client";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function Screen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const renderers = useDocumentRenderer();

  const { data, networkStatus } = useQuery(GET_POST, {
    variables: {
      where: {
        id,
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  if (networkStatus === NetworkStatus.loading) {
    return (
      <Layout p="md">
        <Skeleton>
          <Skeleton.Block height={41} br="l" />
          <Skeleton.Block mt="md" width={100} height={18} br="l" />
          <Surface mt="xl">
          {[...Array(15).keys()].map((i, index) => (
            <Skeleton.Block key={i} height={22} br="l" mt={index === 0 ? undefined : 'md'} />
          ))}
          </Surface>
        </Skeleton>
      </Layout>
    );
  }

  if (!data?.post) {
    return null;
  }

  const { name, category, content } = data?.post;

  return (
    <Layout scrollable p="md">
      {!!name && <Text type="largeTitle" text={name} />}
      <Surface mt="md" flexDirection="row">
        {!!category?.name && (
          <Badge
            text={category.name}
            color={
              isValidColorKey(category?.color) ? category.color : undefined
            }
          />
        )}
      </Surface>
      <Surface mt="xl">
        {!!content?.document && (
          <DocumentRenderer document={content.document} renderers={renderers} />
        )}
      </Surface>
    </Layout>
  );
}
