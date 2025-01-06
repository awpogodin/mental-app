import React, { useEffect, useMemo } from "react";
import {
  Badge,
  getPressedStyle,
  isValidColorKey,
  SectionList,
  Surface,
  Text,
  useTheme,
} from "@/lib/ui";
import { Image } from "expo-image";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  SectionListData,
  SectionListRenderItem,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { NetworkStatus, useQuery } from "@apollo/client";
import { GET_HOME } from "@/lib/gql";
import { Assistant, Post } from "@/lib/gql/__generated__/graphql";

const stories = [
  "https://yaart-web-alice-images.s3.yandex.net/bb9f9cecab6e11efaa0e42b9565a8039:1",
  "https://yaart-web-alice-images.s3.yandex.net/e1386878ab6e11ef9dfeb68657b41bea:1",
  "https://yaart-web-alice-images.s3.yandex.net/104be6bea60711ef809096bdc64e4803:1",
  "https://yaart-web-alice-images.s3.yandex.net/9a01ac54a68e11efb75e42b9565a8039:1",
  "https://yaart-web-alice-images.s3.yandex.net/99514efda60711efb75e42b9565a8039:1",
  "https://yaart-web-alice-images.s3.yandex.net/cbcaad40a60611efaa6442315e171248:1",
];

type Section = {
  title: string;
  data: Item[];
};

type Item = Pick<
  Assistant,
  "__typename" | "id" | "name" | "description" | "tags"
> | Pick<Post, "__typename" |"id" | "name" | "tags">

export default function Tab() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const router = useRouter();

  const { colors, iconSizes, spacings } = useTheme();

  const { data, networkStatus, refetch } = useQuery(GET_HOME, {
    notifyOnNetworkStatusChange: true,
  });

  const sections = useMemo(() => {
    return [
      {
        title: t("home.bots"),
        data: data?.assistants ?? [],
      },
      {
        title: t("home.posts"),
        data: data?.posts ?? [],
      },
    ];
  }, [data, t]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Surface mr="md">
          <Pressable hitSlop={12}>
            {({ pressed }) => (
              <Ionicons
                name="notifications-outline"
                color={colors.iconDefault}
                size={iconSizes.m}
                style={{ opacity: pressed ? 0.5 : 1 }}
              />
            )}
          </Pressable>
        </Surface>
      ),
    });
  }, [colors.iconDefault, iconSizes.m, navigation]);

  const handleCreateChat = async (assistantId: string) => {
    router.navigate(`/(tabs)/chats?assistantId=${assistantId}`);
  };

  const renderItem: SectionListRenderItem<Item> = ({
    item,
  }) => {
    const handlePress = () => {
      if (item.__typename === "Assistant") {
        handleCreateChat(item.id);
      }
      if (item.__typename === "Post") {
        router.navigate(`/post/${item.id}`);
      }
    };

    return (
      <Pressable onPress={handlePress}>
        {({ pressed }) => (
          <Surface
            bg="surfaceSecondary"
            p="md"
            br="l"
            style={getPressedStyle(pressed)}
            gap="xs"
          >
            {!!item.name && <Text type="headline" text={item.name} />}
            {item.__typename === 'Assistant' && !!item?.description && (
              <Text
                type="callout"
                color="textSecondary"
                text={item.description}
                numberOfLines={3}
              />
            )}
            {!!item.tags?.length && (
              <Surface flexDirection="row" gap="xs">
                {item.tags?.map((tag) => (
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

  const renderItemSeparator = () => {
    return <Surface mt="md" />;
  };

  const renderSectionHeader = ({
    section: { title, data },
  }: {
    section: SectionListData<Item, Section>;
  }) => {
    if (!data.length || !title) {
      return null;
    }

    return <Text type="title2" text={title} mv="md" />;
  };

  const listHeader = (
    <Surface gap="md">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -spacings.md }}
      >
        {stories.map((uri) => (
          <Surface
            key={uri}
            bg="surfaceSecondary"
            height={100}
            width={100}
            br="l"
            ml="md"
          >
            <Image
              style={{
                width: 100,
                height: 100,
                overflow: "hidden",
                borderRadius: 16,
              }}
              source={{ uri }}
            />
          </Surface>
        ))}
      </ScrollView>
    </Surface>
  );

  return (
    <SectionList<Item, Section>
      sections={sections}
      renderItem={renderItem}
      ListHeaderComponent={listHeader}
      renderSectionHeader={renderSectionHeader}
      ItemSeparatorComponent={renderItemSeparator}
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
