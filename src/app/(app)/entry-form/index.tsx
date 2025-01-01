import DatePicker from "react-native-date-picker";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Image } from "expo-image";
import {
  Button,
  getPressedStyle,
  Layout,
  showToast,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "@/lib/ui";
import React, { useEffect, useMemo, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CREATE_ENTRY, GET_ENTRY, UPDATE_ENTRY } from "@/lib/gql";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { dayjs } from "@/lib/dayjs";
import { emotions } from "@/core/constants";

const schema = yup
  .object({
    emotion: yup.string().required(i18n.t("common.validation.required")),
    situation: yup.string().max(50, i18n.t("common.validation.max")),
    thoughts: yup.string().max(150, i18n.t("common.validation.max")),
    date: yup.date().required(i18n.t("common.validation.required")),
  })
  .required();

type FormValues = {
  emotion: string;
  situation?: string;
  thoughts?: string;
  date: Date;
};

const now = dayjs();

const defaultValues = {
  emotion: "",
  situation: "",
  thoughts: "",
  date: now.toDate(),
};

const EMOJI_SIZE = 30;

export default function Screen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const [getEntry] = useLazyQuery(GET_ENTRY);

  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();
  const { colors, iconSizes } = useTheme();

  const { currentUser } = useAuth();

  const [createEntry, { loading: isCreatingEntry }] = useMutation(CREATE_ENTRY);
  const [updateEntry, { loading: isUpdatingEntry }] = useMutation(UPDATE_ENTRY);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: async () => {
      if (!id) {
        return defaultValues;
      }
      const { data } = await getEntry({
        variables: { where: { id } },
      });
      if (!data?.entry) {
        return defaultValues;
      }
      return {
        emotion: data.entry.emotion ?? "",
        situation: data.entry.situation ?? "",
        thoughts: data.entry.thoughts ?? "",
        date: data.entry.date,
      };
    },
  });

  const emotion = watch("emotion");
  const date = watch("date");

  const currentEmotion = useMemo(() => {
    if (!emotion) {
      return null;
    }
    return emotions.find(({ id }) => id === emotion)?.description ?? null;
  }, [emotion]);

  useEffect(() => {
    navigation.setOptions({
      title: id ? t("entry.update.title") : t("entry.create.title"),
    });
  }, [id, navigation, t]);

  const [isDateModalOpened, setIsDateModalOpened] = useState(false);

  const handleNext = async (data: FormValues) => {
    if (id) {
      const res = await updateEntry({
        variables: {
          where: { id },
          data,
        },
      });
      if (res.data?.updateEntry?.__typename === "Entry") {
        router.dismiss();
        showToast({
          title: t("entry.form.toasts.updated"),
          preset: "none",
          haptic: "success",
        });
        return;
      }
      showToast({
        title: t("entry.form.toasts.failed"),
        preset: "error",
        haptic: "error",
      });
      return;
    }
    const res = await createEntry({
      variables: {
        data: {
          ...data,
          createdBy: { connect: { id: currentUser?.id } },
        },
      },
    });
    if (res.data?.createEntry?.__typename === "Entry") {
      router.dismiss();
      showToast({
        title: t("entry.form.toasts.created"),
        preset: "none",
        haptic: "success",
      });
      return;
    }
    showToast({
      title: t("entry.form.toasts.failed"),
      preset: "error",
      haptic: "error",
    });
  };

  const handleSetDate = () => {
    setIsDateModalOpened(true);
  };

  return (
    <Layout
      scrollable
      p="md"
      bg="background"
      stickyFooter={
        <Button
          text={id ? t("entry.update.next") : t("entry.create.next")}
          onPress={handleSubmit(handleNext)}
          disabled={!isDirty}
          loading={isCreatingEntry || isUpdatingEntry}
        />
      }
    >
      <Text type="headline" text={t("entry.form.emotion.title")} />
      <Surface flexDirection="row" flexWrap="wrap">
        {emotions.map(({ id, title, source }) => {
          const handlePress = () => {
            setValue("emotion", id, {
              shouldDirty: true,
              shouldValidate: true,
            });
          };
          const isSelected = emotion === id;
          return (
            <Surface width="33.33%" mt="xs" key={id}>
              <Pressable onPress={handlePress}>
                {({ pressed }) => (
                  <Surface
                    alignItems="center"
                    p="xs"
                    br="l"
                    bg={isSelected ? "surfacePrimary" : undefined}
                    style={getPressedStyle(pressed)}
                  >
                    <Image
                      contentFit="cover"
                      style={{
                        width: EMOJI_SIZE,
                        height: EMOJI_SIZE,
                      }}
                      source={source}
                    />
                    <Text
                      color={isSelected ? "textPrimary" : "textDefault"}
                      mt="xs"
                      type="caption1"
                      text={title}
                      align="center"
                    />
                  </Surface>
                )}
              </Pressable>
            </Surface>
          );
        })}
      </Surface>
      <Text
        color={
          errors.emotion?.message
            ? "textError"
            : currentEmotion
              ? "textDefault"
              : "textSecondary"
        }
        type="caption1"
        text={
          errors.emotion?.message ??
          currentEmotion ??
          t("entry.form.emotion.caption")
        }
        align="center"
        mt="xs"
      />
      <Text type="headline" text={t("entry.form.situation.title")} mt="lg" />
      <Controller
        name="situation"
        control={control}
        render={({ field: { ref, value, onChange, onBlur } }) => (
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={t("entry.form.situation.placeholder")}
            caption={
              errors.situation?.message ?? t("entry.form.situation.caption")
            }
            error={!!errors.situation?.message}
            mt="xs"
          />
        )}
      />
      <Text type="headline" text={t("entry.form.thoughts.title")} mt="lg" />
      <Controller
        name="thoughts"
        control={control}
        render={({ field: { ref, value, onChange, onBlur } }) => (
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={t("entry.form.thoughts.placeholder")}
            caption={
              errors.situation?.message ?? t("entry.form.thoughts.caption")
            }
            error={!!errors.situation?.message}
            multiline
            mt="xs"
          />
        )}
      />

      <Controller
        name="date"
        control={control}
        render={({ field: { value } }) => (
          <Pressable onPress={handleSetDate}>
            {({ pressed }) => (
              <Surface
                style={getPressedStyle(pressed)}
                mt="lg"
                flexDirection="row"
                alignItems="center"
                bg="surfaceSecondary"
                br="l"
                p="md"
                gap="md"
              >
                <Ionicons
                  name="time-outline"
                  color={colors.iconSecondary}
                  size={iconSizes.m}
                />
                <Text
                  flex={1}
                  color={value ? "textDefault" : "textSecondary"}
                  text={dayjs(value).format("DD.MM.YYYY HH:mm")}
                />
              </Surface>
            )}
          </Pressable>
        )}
      />

      <DatePicker
        modal
        title={null}
        open={isDateModalOpened}
        locale={i18n.language}
        maximumDate={now.toDate()}
        date={date ? dayjs(date).toDate() : now.toDate()}
        onConfirm={(date) => {
          setIsDateModalOpened(false);
          setValue("date", date, { shouldDirty: true });
        }}
        onCancel={() => {
          setIsDateModalOpened(false);
        }}
      />
    </Layout>
  );
}
