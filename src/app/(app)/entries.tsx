import { useAuth } from "@/lib/auth";
import { DELETE_ENTRY, GET_ENTRIES } from "@/lib/gql";
import { Entry } from "@/lib/gql/__generated__/graphql";
import { Image } from "expo-image";
import {
  BottomSheet,
  BottomSheetRef,
  Button,
  getPressedStyle,
  IconButton,
  SectionList,
  Surface,
  Text,
} from "@/lib/ui";
import { NetworkStatus, useMutation, useQuery } from "@apollo/client";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, RefreshControl, SectionListData, SectionListRenderItem } from "react-native";
import { dayjs } from "@/lib/dayjs";
import { emotions } from "@/core/constants";
import { useRouter } from "expo-router";
import { entryFeature } from "@/features/entry";

type Section = {
  title: string;
  data: Item[];
};

type Item = Pick<Entry, "id" | "emotion" | "situation" | "thoughts" | "date">;

const EMOJI_SIZE = 30;

export default function Screen() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  const [selectedEntryId, setSelectedEntryId] = useState<string | undefined>();

  const entrySheetRef = useRef<BottomSheetRef>(null);

  const [removeEntry, { loading: isRemovingEntry }] = useMutation(DELETE_ENTRY);

  const { data, refetch, networkStatus } = useQuery(GET_ENTRIES, {
    variables: { where: { createdBy: { id: { equals: currentUser?.id } } } },
    skip: !currentUser?.id,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  const sections = useMemo(() => {
    return [
      {
        title: "",
        data: data?.entries ?? [],
      },
    ];
  }, [data]);

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

  const renderItemSeparator = () => {
      return (
        <Surface mt="md" />
      )
    }

  const renderSectionHeader = ({
      section: { title, data },
    }: {
      section: SectionListData<Item, Section>;
    }) => {
      if (!data.length || !title) {
        return null;
      }
  
      return (
        <Text type="subheadline" color="textSecondary" text={title} mv="md" />
      );
    };

  const renderItem: SectionListRenderItem<Item> = ({
    item: { id, emotion, situation, thoughts, date },
  }) => {
    const handlePress = () => {
      handleEntryPress(id);
    };

    const handleEntryPress = (id: string) => {
      setSelectedEntryId(id);
      entrySheetRef.current?.present();
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

  return (
    <>
      <SectionList<Item, Section>
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
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
}
