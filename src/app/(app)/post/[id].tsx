import { GET_POST } from "@/lib/gql";
import { DocumentRenderer } from "@keystone-6/document-renderer";
import {
  Badge,
  isValidColorKey,
  Layout,
  Surface,
  Text,
  useDocumentRenderer,
} from "@/lib/ui";
import { useQuery } from "@apollo/client";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";

export default function Screen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const { t } = useTranslation();
  const renderers = useDocumentRenderer();

  const { data, networkStatus } = useQuery(GET_POST, {
    variables: {
      where: {
        id,
      },
    },
    notifyOnNetworkStatusChange: true,
  });

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
