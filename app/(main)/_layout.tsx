import { Tabs } from "expo-router";
import { Platform, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors, Shadow } from "@/constants/theme";
import { useT } from "@/src/i18n";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

function TabIcon({ name, color, size }: { name: IoniconName; color: string; size: number }) {
  return <Ionicons name={name} size={size} color={color} />;
}

export default function MainLayout() {
  const t = useT();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveBackgroundColor: Colors.surface,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabBoard,
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="newspaper-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="lectures"
        options={{
          title: t.tabCourseReview,
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="school-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: t.tabChat,
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="chatbubbles-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="mentoring"
        options={{
          title: t.tabMentoring,
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="people-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="guide"
        options={{
          title: t.tabGuide,
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="book-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t.tabProfile,
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="person-outline" color={color} size={size} />
          ),
        }}
      />
      {/* 탭바에서 숨길 스크린들 (각 폴더는 자체 _layout으로 하위 라우트를 처리하므로 폴더명만 숨김) */}
      <Tabs.Screen name="quiz" options={{ href: null }} />
      <Tabs.Screen name="mentoring-activity" options={{ href: null }} />
      <Tabs.Screen name="mentoring-activity-create" options={{ href: null }} />
      <Tabs.Screen name="mentor-profile" options={{ href: null }} />
      <Tabs.Screen name="board" options={{ href: null }} />
      <Tabs.Screen name="qna" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    height: Platform.OS === "ios" ? 88 : 68,
    paddingBottom: Platform.OS === "ios" ? 28 : 10,
    paddingTop: 8,
    ...Shadow.md,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
});