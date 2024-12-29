import React from "react";
import { NetworkStatus, useQuery } from "@apollo/client";
import {
  Avatar,
  Button,
  Layout,
  SectionList,
  Skeleton,
  Surface,
  Text,
} from "@/lib/ui";
import { RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import i18n from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { GET_PROFILE } from "@/lib/gql";

type Props = { id: string };

export const Details: React.FC<Props> = ({ id }) => {
  const { currentUser } = useAuth();

  const isCurrentUser = id === currentUser?.id;

  const { data, refetch, networkStatus } = useQuery(GET_PROFILE, {
    variables: { id },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

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

  const renderButtons = () => {
    if (isCurrentUser) {
      return <Button text={i18n.t("profile.edit")} onPress={handleEdit} />;
    }
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
      {!!title && (
        <Text type="titleMedium" mt="md" text={title} align="center" />
      )}
      <Surface mt="md">{renderButtons()}</Surface>
      <Surface
        mt="md"
        height={1}
        bg="surfaceTertiary"
        style={{ opacity: 0.3 }}
      />
    </Surface>
  );

  return (
    <SectionList
      sections={[]}
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
