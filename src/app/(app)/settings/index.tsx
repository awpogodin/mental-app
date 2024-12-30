import { Avatar, Layout, MenuItem, Surface, Text } from "@/lib/ui";
import { useRouter } from "expo-router";
import React from "react";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "react-i18next";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.dismissAll();
  };

  return (
    <Layout scrollable p="md">
      {!!currentUser && (
        <Surface
          bg="surfaceSecondary"
          br="l"
          p="sm"
          alignItems="center"
          flexDirection="row"
          gap="xs"
          mb="md"
        >
          <Avatar
            name={currentUser.name}
            source={
              currentUser.avatar ? { uri: currentUser.avatar.url } : undefined
            }
          />
          <Surface gap="xs">
            <Text text={currentUser.email ?? ""} />
            <Text
              type="callout"
              color="textSecondary"
              text={currentUser.name ?? ""}
            />
          </Surface>
        </Surface>
      )}
      <Surface mt="md" gap="md">
        <MenuItem title="Title" description="Description" />
        <MenuItem title="Title" description="Description" />
        <MenuItem title="Title" description="Description" />
      </Surface>
      <MenuItem title={t("settings.logout")} onPress={handleLogout} mt="xl" />
    </Layout>
  );
}
