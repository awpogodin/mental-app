import { emotions } from "@/core/constants";
import { dayjs } from "@/lib/dayjs";
import { GET_ENTRY } from "@/lib/gql";
import { Image } from "expo-image";
import { Badge, OuterSpacingProps, Surface, Text } from "@/lib/ui";
import { useQuery } from "@apollo/client";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  id?: string | null;
} & OuterSpacingProps;

const EMOJI_SIZE = 100;

export const Details: React.FC<Props> = ({ id, ...rest }) => {
  const { t } = useTranslation();
  const { data } = useQuery(GET_ENTRY, {
    variables: {
      where: {
        id,
      },
    },
    skip: !id,
    notifyOnNetworkStatusChange: true,
  });

  const currentEmotion = useMemo(() => {
    return emotions.find((e) => e.id === data?.entry?.emotion);
  }, [data?.entry?.emotion]);

  if (!data?.entry || !currentEmotion) {
    return null;
  }

  const { situation, thoughts, date } = data?.entry;

  return (
    <Surface {...rest}>
      <Surface flexDirection="row" justifyContent="center">
        <Badge
          text={dayjs(date).calendar(null, {
            sameDay: t("common.calendar.sameDay"),
            lastDay: t("common.calendar.lastDay"),
            nextDay: t("common.calendar.nextDay"),
            lastWeek: t("common.calendar.lastWeek"),
            nextWeek: t("common.calendar.nextWeek"),
            sameElse: t("common.calendar.sameElse"),
          })}
        />
      </Surface>
      <Surface alignItems="center" mt="md">
        <Image
          contentFit="cover"
          style={{
            width: EMOJI_SIZE,
            height: EMOJI_SIZE,
          }}
          source={currentEmotion.source}
        />
      </Surface>
      <Text type="headline" text={currentEmotion.title} align="center" />
      {!!situation && (
        <Text type="subheadline" text={situation} mt="xs" align="center" />
      )}
      {!!thoughts && (
        <Text
          type="footnote"
          color="textSecondary"
          text={thoughts}
          mt="xs"
          align="center"
        />
      )}
    </Surface>
  );
};
