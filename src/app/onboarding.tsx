import React from "react";
import { Button, Layout, Text, useTheme } from "@/lib/ui";
import { Redirect, useRouter } from "expo-router";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth";

const LOGO_SIZE = 60;

export default function Screen() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const handleLogin = () => {
    router.navigate("/auth");
  };

  if (currentUser) {
    return <Redirect href="/" />;
  }

  return (
    <Layout
      scrollable
      bg="background"
      minHeight="100%"
      p="md"
      stickyFooter={
        <>
          <Image
            contentFit="cover"
            style={{
              width: LOGO_SIZE,
              height: LOGO_SIZE,
              borderRadius: LOGO_SIZE,
              backgroundColor: colors.surfaceCardPurple,
            }}
            // TODO: use expo-asset?
            source={require("../../assets/images/logo-transparent.png")}
          />
          <Text mt="xxl" type="largeTitle" text={t("onboarding.title")} />
          <Text mt="md" type="title3" color="textSecondary" text={t("onboarding.subtitle")} />
          <Button
            type="primary"
            mt="xl"
            text={t("onboarding.next")}
            onPress={handleLogin}
          />
        </>
      }
    />
  );
}
