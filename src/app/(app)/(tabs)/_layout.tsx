import { Avatar, Surface, useTheme } from "@/lib/ui";
import { useAuth } from "@/lib/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { GET_PROFILE } from "@/lib/gql";
import { useQuery } from "@apollo/client";

export default function TabLayout() {
  const { t } = useTranslation();
  const { colors, spacings, sizes } = useTheme();
  const router = useRouter();
  const { isLoggedIn, currentUser } = useAuth();

  const tabBarIconSize = sizes.controlSmall;

  const { data } = useQuery(GET_PROFILE, {
    variables: {
      id: currentUser?.id ?? "",
    },
    skip: !currentUser?.id,
    fetchPolicy: "cache-first",
  });

  const handleAddEntry = () => {
    if (isLoggedIn) {
      router.navigate("/entry-form");
      return;
    }
    router.navigate("/auth");
  };
  return (
    <Tabs screenOptions={{ tabBarIconStyle: { marginTop: spacings.sm } }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "MentalApp",
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={tabBarIconSize}
              color={focused ? colors.text : colors.textSecondary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="resources"
        options={{
          title: "",
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "book" : "book-outline"}
              size={tabBarIconSize}
              color={focused ? colors.text : colors.textSecondary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="action"
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "add-circle" : "add-circle-outline"}
              size={tabBarIconSize}
              color={focused ? colors.text : colors.textSecondary}
            />
          ),
          tabBarButton: ({ children, ...rest }) => (
            <Pressable {...rest} onPress={handleAddEntry}>
              {({ pressed }) => (
                <Surface style={{ opacity: pressed ? 0.5 : 1 }}>
                  {children}
                </Surface>
              )}
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: t("chats.title"),
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "chatbubble" : "chatbubble-outline"}
              size={tabBarIconSize}
              color={focused ? colors.text : colors.textSecondary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("profile.title"),
          tabBarLabel: "",
          tabBarIcon: ({ focused }) =>
            data?.user ? (
              <Surface
                p="xxs"
                style={
                  focused
                    ? {
                        borderRadius: sizes.controlSmall,
                        borderWidth: 1,
                        borderColor: colors.text,
                      }
                    : undefined
                }
              >
                <Avatar
                  size="s"
                  name={data.user.name}
                  source={
                    data.user.avatar ? { uri: data.user.avatar.url } : undefined
                  }
                />
              </Surface>
            ) : (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={tabBarIconSize}
                color={focused ? colors.text : colors.textSecondary}
              />
            ),
        }}
      />
    </Tabs>
  );
}
