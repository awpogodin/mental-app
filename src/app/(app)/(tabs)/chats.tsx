import { useAuth } from "@/lib/auth";
import { dayjs } from "@/lib/dayjs";
import { CREATE_CHAT, GET_CHATS } from "@/lib/gql";
import { Chat, ChatAssistantTypeType } from "@/lib/gql/__generated__/graphql";
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
import { NetworkStatus, useMutation, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ListRenderItem, Pressable, RefreshControl } from "react-native";

type Item = Pick<
  Chat,
  "id" | "assistantType" | "thread" | "tags" | "latestMessage"
>;

export default function Tab() {
  const router = useRouter();
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  const { colors, iconSizes } = useTheme();

  const [createChat, { loading: isCreatingChat }] = useMutation(CREATE_CHAT);

  const handleNewChat = useCallback(async () => {
    const res = await createChat({
      variables: {
        data: {
          createdBy: { connect: { id: currentUser?.id } },
          assistantType: ChatAssistantTypeType.Psychologist,
        },
      },
    });
    if (res.data?.createChat?.__typename === "Chat") {
      router.navigate(`/chat/${res.data.createChat.id}`);
    }
  }, [createChat, currentUser?.id, router]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Surface mr="md">
          <Pressable
            hitSlop={12}
            onPress={handleNewChat}
            disabled={isCreatingChat}
          >
            {({ pressed }) => (
              <Ionicons
                name="add"
                color={colors.iconDefault}
                size={iconSizes.m}
                style={{ opacity: pressed || isCreatingChat ? 0.5 : 1 }}
              />
            )}
          </Pressable>
        </Surface>
      ),
    });
  }, [
    colors.iconDefault,
    handleNewChat,
    iconSizes.m,
    isCreatingChat,
    navigation,
  ]);

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
    router.navigate(`/chat/${id}`);
  };

  const renderItem: ListRenderItem<Item> = ({
    item: { id, assistantType, thread, tags, latestMessage },
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
            gap="xs"
          >
            {!!assistantType && (
              <Text
                type="headline"
                text={t(`chats.assistantType.${assistantType}`)}
              />
            )}
            {!!latestMessage?.content && (
              <Text
                type="subheadline"
                color="textSecondary"
                text={latestMessage.content}
                numberOfLines={2}
              />
            )}
            {(!!tags?.length || !!latestMessage) && (
              <Surface flexDirection="row" gap="xs">
                {tags?.map((tag) => (
                  <Badge
                    key={tag.id}
                    text={tag.name ?? ""}
                    color={isValidColorKey(tag?.color) ? tag.color : undefined}
                  />
                ))}
                {!!latestMessage?.createdAt && (
                  <Text
                    type="footnote"
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
      ListEmptyComponent={
        <Surface minHeight="100%" justifyContent="center" alignItems="center" gap="xs">
          <Text type="headline" text={t("chats.noChats.title")} />
          <Text color="textSecondary" type="callout" text={t("chats.noChats.description")} />
        </Surface>
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
