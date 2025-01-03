import { useAuth } from "@/lib/auth";
import { dayjs } from "@/lib/dayjs";
import { GET_CHATS } from "@/lib/gql";
import { Chat } from "@/lib/gql/__generated__/graphql";
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
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ListRenderItem, Pressable, RefreshControl } from "react-native";

type Item = Pick<Chat, "id" | "thread" | "tags" | "latestMessage">;

export default function Tab() {
  const router = useRouter();
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  const { colors, iconSizes } = useTheme();

  const handleNewChat = useCallback(() => {
    router.navigate("/chat");
  }, [router]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Surface mr="md">
          <Pressable hitSlop={12} onPress={handleNewChat}>
            {({ pressed }) => (
              <Ionicons
                name="add"
                color={colors.iconDefault}
                size={iconSizes.m}
                style={{ opacity: pressed ? 0.5 : 1 }}
              />
            )}
          </Pressable>
        </Surface>
      ),
    });
  }, [colors.iconDefault, handleNewChat, iconSizes.m, navigation]);

  const { data, refetch, networkStatus } = useQuery(GET_CHATS, {
    variables: {
      where: {
        createdBy: { id: { equals: currentUser?.id } },
      },
    },
    pollInterval: 500,
    skip: !currentUser?.id,
    notifyOnNetworkStatusChange: true,
  });

  const handlePressChat = (id?: string) => {
    router.navigate({
      pathname: "/chat",
      params: { id },
    });
  };

  const renderItem: ListRenderItem<Item> = ({
    item: { id, thread, tags, latestMessage },
    index,
  }) => {
    const handlePress = () => {
      handlePressChat(id);
    };
    return (
      <Pressable onPress={handlePress}>
        {({ pressed }) => (
          <Surface
            bg="surfaceSecondary"
            mt={index === 0 ? undefined : "md"}
            p="md"
            br="l"
            style={getPressedStyle(pressed)}
          >
            {!!thread && (
              <Text type="headline" text={thread} numberOfLines={2} />
            )}
            {!thread && !!latestMessage?.text && (
              <Text
                type="headline"
                text={latestMessage.text}
                numberOfLines={2}
              />
            )}
            {(!!tags?.length || !!latestMessage) && (
              <Surface mt="md" flexDirection="row" gap="xs">
                {tags?.map((tag) => (
                  <Badge
                    key={tag.id}
                    text={tag.name ?? ""}
                    color={isValidColorKey(tag?.color) ? tag.color : undefined}
                  />
                ))}
                {!!latestMessage?.createdAt && (
                  <Text
                    color="textSecondary"
                    text={dayjs(latestMessage.createdAt).calendar(null, {
                      sameDay: t("common.calendar.sameDay"),
                      lastDay: t("common.calendar.lastDay"),
                      nextDay: t("common.calendar.nextDay"),
                      lastWeek: t("common.calendar.lastWeek"),
                      nextWeek: t("common.calendar.nextWeek"),
                      sameElse: t("common.calendar.sameElse"),
                    })}
                  />
                )}
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
      data={data?.chats}
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
