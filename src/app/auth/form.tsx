import {
  Avatar,
  Button,
  Layout,
  showToast,
  Skeleton,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "@/lib/ui";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  GET_USER,
  UPDATE_PROFILE,
} from "@/lib/gql";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { useImagePicker } from "@/hooks/useImagePicker";
import { Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getImageAsset, ImageAsset } from "@/lib/imagePicker";

const schema = yup
  .object({
    avatar: yup.string(),
    name: yup.string().max(20, i18n.t("common.validation.max")),
  })
  .required();

type FormValues = {
  avatar?: string;
  name?: string;
};

export default function Screen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id, operation = "update" } = useLocalSearchParams<{
    id: string;
    operation: "create" | "update";
  }>();

  const { t } = useTranslation();
  const { colors, iconSizes } = useTheme();
  const [getUser, { data: userData, loading: loadingProfile }] =
    useLazyQuery(GET_USER, { fetchPolicy: 'cache-first' });

  const { pick } = useImagePicker();

  const {
    control,
    handleSubmit,
    formState: { errors, isLoading, isDirty },
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: async () => {
      const { data } = await getUser({
        variables: { id },
      });
      if (data?.user?.__typename === "User") {
        return {
          avatar: data?.user?.avatar?.url,
          name: data.user.name ?? "",
        };
      }
      return {
        name: "",
      };
    },
  });

  const name = watch("name");

  const handleImagePick = async () => {
    const res = await pick({
      allowsEditing: true,
      aspect: [1, 1],
      selectionLimit: 1,
    });
    if (res) {
      setValue("avatar", res[0].uri, { shouldDirty: true });
    }
  };

  const [update, { loading: isUpdating }] = useMutation(UPDATE_PROFILE, {
    errorPolicy: "ignore",
  });

  useEffect(() => {
    navigation.setOptions({
      title:
        operation === "create"
          ? t("auth.form.createProfile")
          : t("auth.form.updateProfile"),
    });
  }, [navigation, operation, t]);

  const handleNext = async (data: FormValues) => {
    let upload: ImageAsset | null = null
    if (data.avatar) {
      upload = getImageAsset(data.avatar)
    }
    const { data: updatedData } = await update({
      variables: {
        id,
        data: {
          name: data.name,
          avatar: upload ? { upload } : null,
        },
      },
    });
    if (!updatedData?.updateUser) {
      showToast({
        title: t("auth.form.toasts.failed.title"),
        preset: "error",
        haptic: "error",
      });
      return;
    }
    router.dismissAll();
    if (operation === "create") {
      showToast({
        title: t("auth.form.toasts.created.title"),
        preset: "none",
        haptic: "success",
      });
      return;
    }
    showToast({
      title: t("auth.form.toasts.updated.title"),
      preset: "none",
      haptic: "success",
    });
  };

  if (loadingProfile || isLoading) {
    return (
      <Layout
        scrollable
        p="md"
        minHeight="100%"
        bg="background"
        stickyFooter={
          <Button
            text={
              operation === "create"
                ? t("auth.form.continue")
                : t("auth.form.save")
            }
            disabled
          />
        }
      >
        <Skeleton>
          <Surface alignItems="center">
            <Skeleton.Block width={100} height={100} rounded />
          </Surface>
          <Skeleton.Block height={42} br="l" mt="xl" />
          <Skeleton.Block height={16} width={100} br="l" mt="xs" />
          <Skeleton.Block height={42} br="l" mt="md" />
          <Skeleton.Block height={16} width={100} br="l" mt="xs" />
          <Skeleton.Block height={112} br="l" mt="md" />
        </Skeleton>
      </Layout>
    );
  }

  if (!id || !userData?.user) {
    return null;
  }

  return (
    <Layout
      scrollable
      p="md"
      bounces={false}
      bg="background"
      stickyFooter={
        <Button
          text={
            operation === "create"
              ? t("auth.form.continue")
              : t("auth.form.save")
          }
          onPress={handleSubmit(handleNext)}
          loading={isUpdating}
          disabled={!isDirty}
        />
      }
    >
      <Controller
        name="avatar"
        control={control}
        render={({ field: { value } }) => (
          <Surface alignItems="center">
            <Surface>
              <Avatar
                size="l"
                name={name}
                source={value ? { uri: value } : undefined}
                onPress={handleImagePick}
              />
              {!!value && (
                <Surface position="absolute" top={0} right={0}>
                  <Pressable
                    onPress={() =>
                      setValue("avatar", undefined, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    hitSlop={16}
                  >
                    {({ pressed }) => (
                      <Surface
                        style={{ opacity: pressed ? 0.5 : 1 }}
                        bg="surfaceSecondary"
                        br="l"
                        p="xxs"
                      >
                        <Ionicons
                          name="close-outline"
                          color={colors.iconSecondary}
                          size={iconSizes.s}
                        />
                      </Surface>
                    )}
                  </Pressable>
                </Surface>
              )}
            </Surface>
            <Text
              align="center"
              type="callout"
              mt="xs"
              color={errors.avatar?.message ? "textError" : "textSecondary"}
              text={errors.avatar?.message ?? t("auth.form.avatarCaption")}
            />
          </Surface>
        )}
      />
      <Controller
        name="name"
        control={control}
        render={({ field: { ref, value, onChange, onBlur } }) => (
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={t("auth.form.nameInputPlaceholder")}
            caption={errors.name?.message ?? t("auth.form.nameInputCaption")}
            error={!!errors.name?.message}
            mt="md"
          />
        )}
      />
    </Layout>
  );
}
