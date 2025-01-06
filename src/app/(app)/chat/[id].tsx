import { useAuth } from "@/lib/auth";
import { dayjs } from "@/lib/dayjs";
import { GET_CHAT, SEND_MESSAGE } from "@/lib/gql";
import { Message } from "@/lib/gql/__generated__/graphql";
import {
  FlatList,
  IconButton,
  Surface,
  Text,
  TextInput,
  useSafeAreaInsets,
  useTheme,
} from "@/lib/ui";
import { useMutation, useQuery } from "@apollo/client";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, ListRenderItem, Platform } from "react-native";

type Item = Pick<Message, "id" | "content" | "createdBy" | "createdAt">;

export default function Screen() {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const insets = useSafeAreaInsets();
  const { spacings } = useTheme();

  const [text, setText] = useState<string | undefined>();

  const { data, refetch } = useQuery(GET_CHAT, {
    variables: {
      id,
    },
    skip: !id,
    pollInterval: 500,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    navigation.setOptions({
      title: data?.chat?.assistant?.name ?? '',
    });
  }, [data, id, navigation]);

  const [sendMessage, { loading: isSendingMessage }] =
    useMutation(SEND_MESSAGE);

  const handleSendMessage = () => {
    if (!text || isSendingMessage) {
      return;
    }
    sendMessage({
      variables: {
        data: {
          content: text,
          chat: { connect: { id } },
          createdBy: { connect: { id: currentUser?.id } },
        },
      },
      onCompleted: () => {
        refetch();
      },
    });
    setText(undefined);
  };

  const renderItem: ListRenderItem<Item> = ({
    item: { content, createdBy, createdAt },
  }) => {
    if (createdBy?.id === currentUser?.id) {
      return (
        <Surface
          bg="surfacePrimary"
          mt="md"
          p="md"
          br="l"
          maxWidth="80%"
          alignSelf="flex-end"
          style={{ borderBottomRightRadius: 0 }}
        >
          <Text color="textPrimary" text={content ?? ""} />
          <Text
            type="caption2"
            color="textPrimary"
            text={dayjs(createdAt).format("HH:mm")}
            mt="xs"
            align="right"
          />
        </Surface>
      );
    }
    return (
      <Surface
        bg="surfaceSecondary"
        mt="md"
        p="md"
        br="l"
        maxWidth="80%"
        alignSelf="flex-start"
        style={{ borderBottomRightRadius: 0 }}
      >
        <Text color="textDefault" text={content ?? ""} />
        <Text
          type="caption2"
          color="textSecondary"
          text={dayjs(createdAt).format("HH:mm")}
          mt="xs"
          align="left"
        />
      </Surface>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "height" : "height"}
      enabled={Platform.OS === "ios"}
      keyboardVerticalOffset={insets.bottom + spacings.xl + spacings.md}
      style={{ flex: 1 }}
    >
      <FlatList<Item>
        p="md"
        data={data?.messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        inverted
        bg="background"
        stickyFooter={
          <Surface flexDirection="row" gap="xs" pointerEvents="auto">
            <TextInput
              value={text}
              onChangeText={setText}
              onSubmitEditing={handleSendMessage}
              placeholder={t("chat.inputPlaceholder")}
              blurOnSubmit={false}
              autoFocus
            />
            <IconButton
              type="secondary"
              icon="send-outline"
              loading={isSendingMessage}
              onPress={handleSendMessage}
            />
          </Surface>
        }
      />
    </KeyboardAvoidingView>
  );
}
