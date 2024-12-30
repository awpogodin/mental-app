import React, { useMemo } from "react";
import { NetworkStatus, useQuery } from "@apollo/client";
import {
  Avatar,
  Button,
  getPressedStyle,
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
import { GET_PROFILE } from "@/lib/gql";
import { Entry } from "@/lib/gql/__generated__/graphql";
import { emotions } from "@/core/constants";
import { dayjs } from "@/lib/dayjs";
import { useTranslation } from "react-i18next";

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
  }, [data]);

  console.log(`sections=${JSON.stringify(sections)}`);

  const router = useRouter();

  const handleEdit = () => {
    if (!currentUser) {
      return;
    }
    router.navigate(`/auth/form?id=${currentUser.id}`);
  };

  // Id is not provided
  if (!id) {
    return null;
  }

  if (networkStatus === NetworkStatus.loading) {
    return (
      <Layout p="md">
        <Skeleton>
          <Surface flexDirection="row" gap="md" alignItems="center">
            <Skeleton.Block width={100} height={100} rounded />
            <Surface
              flex={1}
              flexDirection="row"
              justifyContent="space-between"
              gap="xxs"
            >
              {[...Array(3).keys()].map((i) => (
                <Surface alignItems="center" key={i}>
                  <Skeleton.Block width={30} height={24} br="l" />
                  <Skeleton.Block mt="xxs" width={60} height={16} br="l" />
                </Surface>
              ))}
            </Surface>
          </Surface>
          <Skeleton.Block mt="md" height={24} width={150} br="l" />
          <Skeleton.Block mt="md" height={20} width={250} br="l" />
          <Skeleton.Block mt="md" height={48} br="l" />
          <Surface
            mt="md"
            height={1}
            bg="surfaceTertiary"
            style={{ opacity: 0.3 }}
          />
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

  const renderSectionHeader = ({
    section: { title, data },
  }: {
    section: SectionListData<Item, Section>;
  }) => {
    if (!data.length || !title) {
      return null;
    }

    return <Surface flexDirection="row" alignItems="center" justifyContent="space-between" mt="md">
      <Text type="subheadline" color="textSecondary" text={title} />
      <Pressable hitSlop={12}>
        {({ pressed }) => (
          <Text style={getPressedStyle(pressed)} type="subheadline" text={t('profile.seeAll')} />
        )}
      </Pressable>
    </Surface>;
  };

  const renderItem: SectionListRenderItem<Item> = ({
    item: { id, emotion, situation, thoughts, date },
  }) => {
    const handlePress = () => {};
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
            mt="md"
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
                <Text type="subheadline" text={situation} numberOfLines={2} mt="xs" />
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
    <SectionList<Item, Section>
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      ListHeaderComponent={listHeader}
      p="md"
      refreshControl={
        <RefreshControl
          refreshing={networkStatus === NetworkStatus.refetch}
          onRefresh={refetch}
        />
      }
    />
  );
};
