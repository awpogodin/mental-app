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
} from "@/lib/ui";
import { NetworkStatus, useQuery } from "@apollo/client";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ListRenderItem, Pressable, RefreshControl } from "react-native";

type Item = Pick<Post, "id" | "name" | "tags">;

export default function Screen() {
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();

  const { tagId } = useLocalSearchParams<{
    tagId: string;
  }>();

  const { data, refetch, networkStatus } = useQuery(GET_POSTS, {
    variables: {
      where: {
        AND: [
          {
            published: { equals: true },
          },
          { tags: { some: { id: { equals: tagId } } } },
        ],
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  const selectedTag = useMemo(() => {
    if (!tagId) {
      return null;
    }
    return data?.tags?.find((tag) => tag.id === tagId) ?? null;
  }, [data, tagId]);

  useEffect(() => {
    if (!selectedTag) {
      return;
    }
    navigation.setOptions({
      title: selectedTag.name,
    });
  }, [navigation, selectedTag]);

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
