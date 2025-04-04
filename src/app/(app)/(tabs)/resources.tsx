import { GET_POSTS } from "@/lib/gql";
import { Post } from "@/lib/gql/__generated__/graphql";
import {
  Badge,
  FlatList,
  getPressedStyle,
  isValidColorKey,
  Layout,
  Skeleton,
  Surface,
  Text,
  useTheme,
} from "@/lib/ui";
import { NetworkStatus, useQuery } from "@apollo/client";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ListRenderItem,
  Pressable,
  RefreshControl,
  ScrollView,
} from "react-native";

type Item = Pick<Post, "id" | "name" | "tags">;

export default function Tab() {
  const { t } = useTranslation();
  const { spacings } = useTheme();
  const router = useRouter();

  const { data, refetch, networkStatus } = useQuery(GET_POSTS, {
    variables: {
      where: {
        published: { equals: true },
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  const listHeader = data?.tags?.length ? (
    <Surface mb="xl">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -spacings.md }}
      >
        {data?.tags?.map((tag) => (
          <Pressable
            key={tag.id}
            hitSlop={spacings.xs}
            onPress={() => router.navigate(`/post/list?tagId=${tag.id}`)}
          >
            {({ pressed }) => (
              <Surface style={getPressedStyle(pressed)}>
                <Badge
                  ml="md"
                  text={tag.name ?? ""}
                  color={isValidColorKey(tag?.color) ? tag.color : undefined}
                />
              </Surface>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </Surface>
  ) : undefined;

  const handlePressArticle = (id: string) => {
    router.navigate(`/post/${id}`);
  };

  const renderItemSeparator = () => {
    return <Surface mt="md" />;
  };

  const renderItem: ListRenderItem<Item> = ({ item: { id, name, tags } }) => {
    const handlePress = () => {
      handlePressArticle(id);
    };
    return (
      <Pressable onPress={handlePress}>
        {({ pressed }) => (
          <Surface
            bg="surfaceSecondary"
            p="md"
            br="l"
            style={getPressedStyle(pressed)}
          >
            {!!name && <Text type="headline" text={name} />}
            {!!tags?.length && (
              <Surface mt="md" flexDirection="row" gap="xs">
                {tags?.map((tag) => (
                  <Badge
                    key={tag.id}
                    text={tag.name ?? ""}
                    color={isValidColorKey(tag?.color) ? tag.color : undefined}
                  />
                ))}
              </Surface>
            )}
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
            <Surface
              key={i}
              bg="surfaceSecondary"
              mt={index === 0 ? undefined : "md"}
              p="md"
              br="l"
            >
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
      ListHeaderComponent={listHeader}
      ItemSeparatorComponent={renderItemSeparator}
      ListEmptyComponent={
        <Text
          mt="xxl"
          color="textSecondary"
          type="callout"
          text={t("posts.noPosts.title")}
          align="center"
        />
      }
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
