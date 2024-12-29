import { useLocalSearchParams } from "expo-router";
import { Button, Layout, OtpInput, OtpInputRef, showToast, Text } from "@/lib/ui";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import i18n from "@/lib/i18n";
import { useMutation } from "@apollo/client";
import { REQUEST_CODE, SEND_CODE } from "@/lib/gql";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { useAuth } from "@/lib/auth";

export default function Screen() {
  const { email, expiresIn, codeLength } = useLocalSearchParams<{
    email: string;
    expiresIn: string;
    codeLength: string;
  }>();

  const [sendCode, { loading }] = useMutation(SEND_CODE);
  const [getCode, { loading: resendLoading }] = useMutation(REQUEST_CODE);
  const ref = useRef<OtpInputRef>(null);
  const { login } = useAuth();

  const router = useRouter();

  const [endTime, setEndTime] = useState(+expiresIn);
  const elapsedSeconds = useCountdownTimer(endTime);

  const handleFailed = () => {
    ref.current?.clear();
    showToast({
      title: i18n.t("auth.oneTimeCode.toasts.failed.title"),
      preset: "error",
      haptic: "error",
    });
  };

  const handleNext = async (value: string) => {
    const { data } = await sendCode({
      variables: { email, code: value },
    });
    if (data?.login?.__typename === "LoginResult") {
      const { accessToken } = data.login;
      if (!accessToken) {
        handleFailed();
        return;
      }
      const user = await login(accessToken);
      if (!user) {
        handleFailed();
        return;
      }
      if (new Date(user.createdAt).toString() === new Date(user.updatedAt).toString()) {
        router.dismissAll();
        router.replace(`/auth/form?operation=create&id=${user.id}`);
        return;
      }
      router.dismissAll();
      router.back();
      router.replace('/');
      showToast({
        title: i18n.t("auth.oneTimeCode.toasts.success.title"),
        preset: "none",
        haptic: "success",
      });
      return;
    }
  };

  const handleResendCode = async () => {
    const { data } = await getCode({ variables: { email } });
    if (data?.requestCode?.expiresIn) {
      showToast({
        title: i18n.t("auth.index.codeSendedToast"),
        preset: "none",
        haptic: "success",
      });
      setEndTime(+data.requestCode.expiresIn);
      return;
    }
    showToast({
      title: i18n.t("auth.index.codeSendFailed"),
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
          type="text"
          text={
            +elapsedSeconds > 0
              ? i18n.t("auth.oneTimeCode.resendCodeWait", {
                  value: elapsedSeconds,
                })
              : i18n.t("auth.oneTimeCode.resendCode")
          }
          onPress={handleResendCode}
          disabled={loading || +elapsedSeconds > 0}
          loading={resendLoading}
        />
      }
    >
      <Text type="headlineLarge" text={i18n.t("auth.oneTimeCode.title")} />
      <Text
        type="bodyLarge"
        color="textSecondary"
        text={i18n.t("auth.oneTimeCode.description", {
          email,
        })}
        mt="md"
      />
      <OtpInput
        ref={ref}
        mt="xl"
        numberOfDigits={+codeLength}
        onFilled={handleNext}
        disabled={loading || resendLoading}
      />
    </Layout>
  );
}
