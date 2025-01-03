import { Button, Layout, showToast, Text, TextInput } from "@/lib/ui";
import { useRouter } from "expo-router";
import * as yup from "yup";
import React from "react";
import { useMutation } from "@apollo/client";
import { REQUEST_CODE } from "@/lib/gql";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";

const schema = yup
  .object({
    email: yup.string().email(i18n.t("common.validation.email")).required(i18n.t("common.validation.required")).transform((v: string) => v.toLocaleLowerCase()),
  })
  .required();

type FormValues = {
  email: string;
};

export default function Screen() {
  const { t } = useTranslation();
  const {
      control,
      handleSubmit,
      formState: { errors, isDirty },
    } = useForm<FormValues>({
      resolver: yupResolver(schema),
      mode: "onChange",
      defaultValues: {
        email: '',
      },
    });
  const router = useRouter();

  const [getCode, { loading }] = useMutation(REQUEST_CODE);

  const handleNext = async ({ email }: FormValues) => {
    const { data } = await getCode({ variables: { email } });
    if (data?.requestCode) {
      showToast({
        title: t("auth.index.codeSendedToast"),
        preset: "none",
        haptic: "success",
      });
      router.navigate(
        `/auth/oneTimeCode?email=${email}&expiresIn=${data?.requestCode.expiresIn}&codeLength=${data.requestCode.codeLength}`
      );
      return;
    }
    showToast({
      title: t("auth.index.codeSendFailed"),
      preset: "error",
      haptic: "error",
    });
  };

  return (
    <Layout
      scrollable
      p="md"
      bg="background"
      bounces={false}
      stickyFooter={
        <Button
          text={t("auth.index.continue")}
          onPress={handleSubmit(handleNext)}
          loading={loading}
          disabled={!isDirty}
        />
      }
    >
      <Text type="largeTitle" text={t("auth.index.title")} />
      <Text
        color="textSecondary"
        text={t("auth.index.description")}
        mt="md"
      />
      <Controller
        name="email"
        control={control}
        render={({ field: { ref, value, onChange, onBlur } }) => (
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={t('auth.index.placeholder')}
            caption={errors.email?.message}
            error={!!errors.email?.message}
            onSubmitEditing={handleSubmit(handleNext)}
            inputMode="email"
            mt="md"
          />
        )}
      />
    </Layout>
  );
}
