import React, { useMemo, useRef, useState } from "react";
import { NetworkStatus, useMutation, useQuery } from "@apollo/client";
import {
  Avatar,
  BottomSheet,
  BottomSheetRef,
  Button,
  getPressedStyle,
  IconButton,
  Layout,
  SectionList,
  Skeleton,
  Surface,
  Text,
} from "@/lib/ui";
import { Image } from "expo-image";
import {
  Pressable,
  RefreshControl,
  SectionListData,
  SectionListRenderItem,
} from "react-native";
import { useRouter } from "expo-router";
import i18n from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { DELETE_ENTRY, GET_PROFILE } from "@/lib/gql";
import { Entry } from "@/lib/gql/__generated__/graphql";
import { emotions } from "@/core/constants";
import { dayjs } from "@/lib/dayjs";
import { useTranslation } from "react-i18next";
// TODO: подумать как разрешить импорты между фичами
// eslint-disable-next-line import/no-restricted-paths
import { entryFeature } from "../../entry";

type Section = {
  title: string;
  data: Item[];
};

type Item = Pick<Entry, "id" | "emotion" | "situation" | "thoughts" | "date">;

type Props = { id: string };

const EMOJI_SIZE = 30;

export const Details: React.FC<Props> = ({ id }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const [selectedEntryId, setSelectedEntryId] = useState<string | undefined>();

  const entrySheetRef = useRef<BottomSheetRef>(null);

  const [removeEntry, { loading: isRemovingEntry }] = useMutation(DELETE_ENTRY);

  const { data, refetch, networkStatus } = useQuery(GET_PROFILE, {
    variables: { id },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  const sections = useMemo(() => {
    return [
      {
        title: t("profile.entries"),
        data: data?.entries ?? [],
      },
    ];
  }, [data?.entries, t]);

  const router = useRouter();

  const handleEdit = () => {
    if (!currentUser) {
      return;
    }
    router.navigate(`/auth/form?id=${currentUser.id}`);
  };

  const handleEntriesPress = () => {
    router.navigate("/entries");
  };

  const handleEntryPress = (id: string) => {
    setSelectedEntryId(id);
    entrySheetRef.current?.present();
  };

  const handleEntryEdit = () => {
    if (!selectedEntryId) {
      return;
    }
    entrySheetRef.current?.dismiss();
    router.navigate(`/entry-form?id=${selectedEntryId}`);
  };

  const handleEntryRemove = () => {
    if (!selectedEntryId) {
      return;
    }
    entrySheetRef.current?.dismiss();
    removeEntry({
      variables: { where: { id: selectedEntryId } },
      onCompleted: () => {
        entrySheetRef.current?.dismiss();
        setSelectedEntryId(undefined);
        refetch();
      },
    });
  };

  // Id is not provided
  if (!id) {
    return null;
  }

  if (networkStatus === NetworkStatus.loading) {
    return (
      <Layout p="md">
        <Skeleton>
          <Surface
            alignItems="center"
          >
            <Skeleton.Block width={100} height={100} rounded />
            <Skeleton.Block mt="md" height={25} width={250} br="l" />
          </Surface>
          <Skeleton.Block mt="md" height={48} br="l" />
          <Surface
            mt="md"
            height={1}
            bg="surfaceTertiary"
            style={{ opacity: 0.3 }}
          />
          <Surface mt="md" flexDirection="row" alignItems="center" justifyContent="space-between">
          <Skeleton.Block height={20} width={100} br="l" />
          <Skeleton.Block height={20} width={50} br="l" />
          </Surface>
          {[...Array(5).keys()].map((i) => (
            <Skeleton.Block key={i} height={120} br="l" mt="md" />
          ))}
        </Skeleton>
      </Layout>
    );
  }

  if (!data?.user) {
    return null;
  }

  const { name, avatar } = data.user;

  let title;

  if (name) {
    title = name;
  }

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

    return (
      <Surface
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        mv="md"
      >
        <Text type="subheadline" color="textSecondary" text={title} />
        <Pressable onPress={handleEntriesPress} hitSlop={12}>
          {({ pressed }) => (
            <Text
              style={getPressedStyle(pressed)}
              type="subheadline"
              text={t("profile.seeAll")}
            />
          )}
        </Pressable>
      </Surface>
    );
  };

  const renderItem: SectionListRenderItem<Item> = ({
    item: { id, emotion, situation, thoughts, date },
  }) => {
    const handlePress = () => {
      handleEntryPress(id);
    };
    const currentEmotion = emotions.find((e) => e.id === emotion);
    if (!currentEmotion) {
      return null;
    }
    return (
      <Pressable onPress={handlePress} key={id}>
        {({ pressed }) => (
          <Surface
            p="md"
            br="l"
            bg="surfaceSecondary"
            style={getPressedStyle(pressed)}
            flexDirection="row"
            gap="md"
          >
            <Surface>
              <Image
                contentFit="cover"
                style={{
                  width: EMOJI_SIZE,
                  height: EMOJI_SIZE,
                }}
                source={currentEmotion.source}
              />
            </Surface>
            <Surface flex={1}>
              <Text type="headline" text={currentEmotion.title} />
              <Text
                type="caption1"
                color="textSecondary"
                text={dayjs(date).calendar(null, {
                  sameDay: t("common.calendar.sameDay"),
                  lastDay: t("common.calendar.lastDay"),
                  nextDay: t("common.calendar.nextDay"),
                  lastWeek: t("common.calendar.lastWeek"),
                  nextWeek: t("common.calendar.nextWeek"),
                  sameElse: t("common.calendar.sameElse"),
                })}
              />
              {!!situation && (
                <Text
                  type="subheadline"
                  text={situation}
                  numberOfLines={2}
                  mt="xs"
                />
              )}
              {!!thoughts && (
                <Text
                  type="footnote"
                  color="textSecondary"
                  text={thoughts}
                  mt="xs"
                  numberOfLines={3}
                />
              )}
            </Surface>
          </Surface>
        )}
      </Pressable>
    );
  };

  const listHeader = (
    <Surface>
      <Surface alignItems="center">
        <Avatar
          size="l"
          name={name}
          source={avatar ? { uri: avatar.url } : undefined}
        />
      </Surface>
      {!!title && <Text type="title3" mt="md" text={title} align="center" />}
      <Button mt="md" text={i18n.t("profile.edit")} onPress={handleEdit} />
      <Surface
        mt="md"
        height={1}
        bg="surfaceTertiary"
        style={{ opacity: 0.3 }}
      />
    </Surface>
  );

  return (
    <>
      <SectionList<Item, Section>
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={listHeader}
        ItemSeparatorComponent={renderItemSeparator}
        p="md"
        refreshControl={
          <RefreshControl
            refreshing={networkStatus === NetworkStatus.refetch}
            onRefresh={refetch}
          />
        }
      />
      <BottomSheet
        sheetRef={entrySheetRef}
        enablePanDownToClose
        buttons={
          <Surface flexDirection="row" gap="xs">
            <Button text={t("profile.entry.chat")} disabled={isRemovingEntry} />
            <IconButton
              type="secondary"
              icon="pencil-outline"
              disabled={isRemovingEntry}
              onPress={handleEntryEdit}
            />
            <IconButton
              type="negative"
              icon="trash-bin-outline"
              loading={isRemovingEntry}
              onPress={handleEntryRemove}
            />
          </Surface>
        }
      >
        <entryFeature.components.Details id={selectedEntryId} />
      </BottomSheet>
    </>
  );
};
