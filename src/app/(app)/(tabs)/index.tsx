import React, { useEffect } from "react";
import {
  SectionList,
  Surface,
  Text,
  useTheme,
} from "@/lib/ui";
import { Image } from "expo-image";
import {
  Pressable,
  ScrollView,
} from "react-native";
import { useNavigation } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";

const stories = [
  "https://yaart-web-alice-images.s3.yandex.net/bb9f9cecab6e11efaa0e42b9565a8039:1",
  "https://yaart-web-alice-images.s3.yandex.net/e1386878ab6e11ef9dfeb68657b41bea:1",
  "https://yaart-web-alice-images.s3.yandex.net/104be6bea60711ef809096bdc64e4803:1",
  "https://yaart-web-alice-images.s3.yandex.net/9a01ac54a68e11efb75e42b9565a8039:1",
  "https://yaart-web-alice-images.s3.yandex.net/99514efda60711efb75e42b9565a8039:1",
  "https://yaart-web-alice-images.s3.yandex.net/cbcaad40a60611efaa6442315e171248:1",
];

export default function Tab() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { colors, iconSizes, spacings } = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Surface mr="md">
          <Pressable hitSlop={12}>
            {({ pressed }) => (
              <Ionicons
                name="notifications-outline"
                color={colors.iconDefault}
                size={iconSizes.m}
                style={{ opacity: pressed ? 0.5 : 1 }}
              />
            )}
          </Pressable>
        </Surface>
      ),
    });
  }, [colors.iconDefault, iconSizes.m, navigation]);

  const listHeader = (
    <Surface gap="md">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -spacings.md }}
      >
        {stories.map((uri) => (
          <Surface
            key={uri}
            bg="surfaceSecondary"
            height={100}
            width={100}
            br="l"
            ml="md"
          >
            <Image
              style={{
                width: 100,
                height: 100,
                overflow: "hidden",
                borderRadius: 16,
              }}
              source={{ uri }}
            />
          </Surface>
        ))}
      </ScrollView>
      <Text type="title2" text={t('home.newChat')} mt="md" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -spacings.md, marginTop: spacings.xxs }}
      >
        <Surface p="md" br="l" bg="surfacePrimary" ml="md" height={150} width={150}>
          <Text type="body" color="textPrimary" text="Just chat" />
        </Surface>
        <Surface p="md" br="l" bg="surfaceSecondary" ml="md" height={150} width={150}>
          <Text type="body" text="Personal growth" />
        </Surface>
        <Surface p="md" br="l" bg="surfaceSecondary" ml="md" height={150} width={150}>
          <Text type="body" text="Learning" />
        </Surface>
      </ScrollView>
    </Surface>
  );

  return (
    <SectionList
      sections={[]}
      ListHeaderComponent={listHeader}
      p="md"
    />
  );
}
