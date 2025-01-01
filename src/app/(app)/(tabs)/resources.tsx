import { GET_POSTS } from "@/lib/gql";
import { Category, Post } from "@/lib/gql/__generated__/graphql";
import {
  Badge,
  FlatList,
  getPressedStyle,
  isValidColorKey,
  Layout,
  Skeleton,
  Surface,
  Text,
} from "@/lib/ui";
import { NetworkStatus, useQuery } from "@apollo/client";
import { useRouter } from "expo-router";
import React from "react";
import { ListRenderItem, Pressable, RefreshControl } from "react-native";

type Item = {
  category?: Pick<Category, "id" | "name" | "color"> | null;
} & Pick<Post, "id" | "name">;

export default function Screen() {
  const router = useRouter();

  const { data, refetch, networkStatus } = useQuery(GET_POSTS, {
    variables: {
      where: {
        published: { equals: true },
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  const handlePressArticle = (id: string) => {
    router.navigate(`/post/${id}`);
  };

  const renderItem: ListRenderItem<Item> = ({
    item: { id, name, category }, index
  }) => {
    const handlePress = () => {
      handlePressArticle(id);
    };
    return (
      <Pressable onPress={handlePress}>
        {({ pressed }) => (
          <Surface
            bg="surfaceSecondary"
            mt={index === 0 ? undefined : 'md'}
            p="md"
            br="l"
            style={getPressedStyle(pressed)}
          >
            {!!name && <Text type="headline" text={name} />}
            <Surface mt="md" flexDirection="row">
              {!!category?.name && (
                <Badge
                  text={category.name}
                  color={
                    isValidColorKey(category?.color)
                      ? category.color
                      : undefined
                  }
                />
              )}
            </Surface>
          </Surface>
        )}
      </Pressable>
    );
  };

  if (networkStatus === NetworkStatus.loading) {
    return (
      <Layout p="md">
        <Skeleton>
          {[...Array(10).keys()].map((i, index) => (
            <Surface key={i} bg="surfaceSecondary" mt={index === 0 ? undefined : 'md'} p="md" br="l">
              <Skeleton.Block height={22} br="l" />
              <Skeleton.Block mt="md" width={100} height={18} br="l" />
            </Surface>
          ))}
        </Skeleton>
      </Layout>
    );
  }

  return (
    <FlatList<Item>
      data={data?.posts}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl
          refreshing={networkStatus === NetworkStatus.refetch}
          onRefresh={refetch}
        />
      }
      p="md"
    />
  );
}
