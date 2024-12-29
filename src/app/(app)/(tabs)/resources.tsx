import { Layout, Text } from "@/lib/ui";
import React from "react";
import { useTranslation } from "react-i18next";

export default function Screen() {
  const { t } = useTranslation();

  return (
    <Layout scrollable p="md">
      <Text text="Resources" />
    </Layout>
  );
}
