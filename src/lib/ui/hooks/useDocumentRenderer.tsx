import React from "react";

import { DocumentRendererProps } from "@keystone-6/document-renderer";
import { Linking, Pressable, Text } from "react-native";
import { useTheme } from "./useTheme";
import { Surface } from "../layouts/Surface";
import { getPressedStyle } from "../helpers/getPressedStyle";
import { TypographyKeys } from "../theme/types";

export const useDocumentRenderer = () => {
  const { typography, colors, spacings } = useTheme();

  const renderers: DocumentRendererProps["renderers"] = {
    // use your editor's autocomplete to see what other renderers you can override
    inline: {
      bold: ({ children }) => {
        return (
          <Text style={{ ...typography.headline, color: colors.textDefault }}>
            {children}
          </Text>
        );
      },
      italic: ({ children }) => {
        return (
          <Text style={{ ...typography.default, color: colors.textDefault }}>
            {children}
          </Text>
        );
      },
      underline: ({ children }) => {
        return (
          <Text style={{ ...typography.default, color: colors.textDefault }}>
            {children}
          </Text>
        );
      },
      link: ({ href, children }) => {
        return (
          <Pressable onPress={() => Linking.openURL(href)}>
            {({ pressed }) => (
              <Text style={{ ...typography.default, color: colors.textLink, ...getPressedStyle(pressed) }}>
              {children}
            </Text>
            )}
          </Pressable>
        );
      },
    },
    block: {
      paragraph: ({ children }) => {
        return (
          <Text
            style={{
              ...typography.default,
              color: colors.textDefault,
              marginVertical: spacings.md,
            }}
          >
            {children}
          </Text>
        );
      },
      heading: ({ level, children }) => {
        let typographyType: TypographyKeys = 'headline'
        if (level === 1) {
          typographyType = 'title1'
        }
        if (level === 2) {
          typographyType = 'title2'
        }
        if (level === 3) {
          typographyType = 'title3'
        }
        return (
          <Text style={{ ...typography[typographyType], color: colors.textDefault, marginVertical: spacings.md }}>
            {children}
          </Text>
        );
      },
      blockquote: ({ children }) => {
        return (
          <Surface p="md" br="l" bg="surfaceSecondary">
            <Text style={{ ...typography.callout, color: colors.textDefault }}>
              {children}
            </Text>
          </Surface>
        );
      },
      list: ({ type, children }) => {
        return (
          <Surface ml="md">
            {children.map((item, index) => (
              <Text style={{ ...typography.default, color: colors.textDefault }} key={index}>
                {type === 'ordered' ? `${index + 1}. ` : `• `}
                {item}
              </Text>
            ))}
          </Surface>
        );
      },
    },
  };

  return renderers;
};
