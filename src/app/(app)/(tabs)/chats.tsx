import { useAuth } from "@/lib/auth";
import { dayjs } from "@/lib/dayjs";
import { CREATE_CHAT, GET_CHATS } from "@/lib/gql";
import { Assistant, Chat } from "@/lib/gql/__generated__/graphql";
import {
  Badge,
  BottomSheet,
  BottomSheetRef,
  FlatList,
  getPressedStyle,
  hexToRgba,
  isValidColorKey,
  Layout,
  LoaderSpinner,
  Skeleton,
  Surface,
  Text,
  useTheme,
} from "@/lib/ui";
import { NetworkStatus, useMutation, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ListRenderItem, Pressable, RefreshControl } from "react-native";

type Item = Pick<Chat, "id" | "assistant" | "latestMessage" | "messagesCount">;
type BotItem = Pick<Assistant, "id" | "name" | "description" | "tags">;

export default function Tab() {
  const router = useRouter();
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  const { assistantId } = useLocalSearchParams<{
    assistantId?: string;
  }>();

  const assistantsSheetRef = useRef<BottomSheetRef>(null);

  const { data, refetch, networkStatus, stopPolling, error } = useQuery(
    GET_CHATS,
    {
      variables: {
        where: {
          createdBy: { id: { equals: currentUser?.id } },
        },
      },
      pollInterval: 500,
      skip: !currentUser?.id,
      notifyOnNetworkStatusChange: true,
    }
  );

  const [createChat, { loading: isCreatingChat }] = useMutation(CREATE_CHAT);

  const handleCreateChat = useCallback(
    async (assistantId: string) => {
      const res = await createChat({
        variables: {
          data: {
            createdBy: { connect: { id: currentUser?.id } },
            assistant: { connect: { id: assistantId } },
          },
        },
      });
      if (res.data?.createChat?.__typename === "Chat") {
        router.navigate(`/chat/${res.data.createChat.id}`);
        refetch();
      }
    },
    [createChat, currentUser?.id, refetch, router]
  );

  useEffect(() => {
    if (!assistantId) {
      return;
    }
    handleCreateChat(assistantId);
    router.setParams({ assistantId: "" });
  }, [assistantId, handleCreateChat, router]);

  const { colors, iconSizes } = useTheme();

  useEffect(() => {
    if (!data?.assistants?.length) {
      return;
    }
    navigation.setOptions({
      headerRight: () => (
        <Surface mr="md">
          <Pressable hitSlop={12} onPress={assistantsSheetRef.current?.present}>
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
  }, [colors.iconDefault, data, iconSizes.m, navigation]);

  useEffect(() => {
    if (error) {
      stopPolling();
    }
  }, [error, stopPolling]);

  const handlePressChat = (id?: string) => {
    router.navigate(`/chat/${id}`);
  };

  const renderItem: ListRenderItem<Item> = ({
    item: { id, assistant, latestMessage, messagesCount },
    index,
  }) => {
    if ((messagesCount ?? 0) <= 1) {
      return null;
    }
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
            {!!assistant?.name && (
              <Text type="headline" text={assistant.name} />
            )}
            {!!latestMessage?.content && (
              <Text
                type="subheadline"
                color="textSecondary"
                text={latestMessage.content}
                numberOfLines={2}
              />
            )}
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
            {!!assistant?.tags?.length && (
              <Surface flexDirection="row" alignItems="center" gap="xs">
                {assistant?.tags?.map((tag) => (
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

  const renderBotItem: ListRenderItem<BotItem> = ({
    item: { id, name, description, tags },
    index,
  }) => {
    const handlePress = () => {
      handleCreateChat(id);
      assistantsSheetRef.current?.dismiss();
    };
    return (
      <Pressable onPress={handlePress}>
        {({ pressed }) => (
          <Surface
            bg="surfaceSecondary"
            p="md"
            br="l"
            mt={index === 0 ? undefined : "md"}
            style={getPressedStyle(pressed)}
            gap="xs"
          >
            {!!name && <Text type="headline" text={name} />}
            {!!description && (
              <Text
                type="callout"
                color="textSecondary"
                text={description}
                numberOfLines={3}
              />
            )}
            {!!tags?.length && (
              <Surface flexDirection="row" gap="xs">
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
    <>
      <FlatList<Item>
        bg="background"
        data={data?.chats?.filter((chat) => (chat?.messagesCount ?? 0) > 1)}
        renderItem={renderItem}
        ListEmptyComponent={
          <Surface
            minHeight="100%"
            justifyContent="center"
            alignItems="center"
            gap="xs"
          >
            <Text type="headline" text={t("chats.noChats.title")} />
            <Text
              color="textSecondary"
              type="callout"
              text={t("chats.noChats.description")}
            />
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
      <BottomSheet<BotItem>
        data={data?.assistants}
        renderItem={renderBotItem}
        sheetRef={assistantsSheetRef}
        enablePanDownToClose
      >
        <Text type="headline" text={t('chats.selectAssistant')} align="center" mb="md" />
      </BottomSheet>
      {isCreatingChat && (
        <Surface
          position="absolute"
          height="100%"
          width="100%"
          alignItems="center"
          justifyContent="center"
          style={{ backgroundColor: hexToRgba(colors.background, 0.5) }}
        >
          <LoaderSpinner />
        </Surface>
      )}
    </>
  );
}
