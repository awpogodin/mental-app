import React from "react";

import { DocumentRendererProps } from "@keystone-6/document-renderer";
import { Text } from "react-native";
import { useTheme } from "./useTheme";
import { Surface } from "../layouts/Surface";

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
    },
    block: {
      paragraph: ({ children }) => {
        return (
          <Text
            style={{
              ...typography.default,
              color: colors.textDefault,
            }}
          >
            {children}
          </Text>
        );
      },
      heading: ({ level, children }) => {
        if (level === 1) {
          return (
            <Text style={{ ...typography.title1, color: colors.textDefault, marginBottom: spacings.sm }}>
              {children}
            </Text>
          );
        }
        if (level === 2) {
          return (
            <Text style={{ ...typography.title2, color: colors.textDefault, marginBottom: spacings.sm }}>
              {children}
            </Text>
          );
        }
        if (level === 3) {
          return (
            <Text style={{ ...typography.title3, color: colors.textDefault, marginBottom: spacings.sm }}>
              {children}
            </Text>
          );
        }
        return (
          <Text style={{ ...typography.headline, color: colors.textDefault, marginBottom: spacings.sm }}>
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
    },
  };

  return renderers;
};
