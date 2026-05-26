"use client";

import { usePathname, useRouter } from "next/navigation";
import SideNavigation, {
  NavigationHeader,
  NavigationContent,
  NavigationFooter,
  Section,
  HeadingItem,
  ButtonItem,
} from "@atlaskit/side-navigation";
import Badge from "@atlaskit/badge";
import { useUIStore } from "@/lib/store/ui.store";
import { usePersonalizationStore } from "@/lib/store/personalization.store";
import { getTimeOfDayGreeting } from "@/lib/utils";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  {
    group: "Core",
    items: [
      { href: "/dashboard",  label: "Dashboard" },
      { href: "/analytics",  label: "Analytics" },
      { href: "/insights",   label: "Behavior Insights" },
    ],
  },
  {
    group: "Personalization",
    items: [
      { href: "/personalize", label: "Personalize",   badge: true },
      { href: "/editor",      label: "Live Editor" },
      { href: "/themes",      label: "Themes" },
    ],
  },
  {
    group: "AI",
    items: [
      { href: "/chat", label: "AI Assistant" },
    ],
  },
  {
    group: "System",
    items: [
      { href: "/settings", label: "Settings" },
    ],
  },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { openCommandPalette } = useUIStore();
  const { recommendations } = usePersonalizationStore();
  const unresolvedRecs = recommendations.filter((r) => !r.applied && !r.dismissed);

  return (
    <SideNavigation label="App navigation" testId="side-navigation">
      <NavigationHeader>
        <div className={styles.navHeader}>
          <div className={styles.brand}>Ω</div>
          <div>
            <div className={styles.brandName}>Omega</div>
            <div className={styles.brandVersion}>v0.1 · beta</div>
          </div>
        </div>
      </NavigationHeader>

      <NavigationContent>
        {NAV_ITEMS.map((group) => (
          <Section key={group.group}>
            <HeadingItem>{group.group}</HeadingItem>
            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const showBadge = "badge" in item && item.badge && unresolvedRecs.length > 0;
              return (
                <ButtonItem
                  key={item.href}
                  isSelected={isActive}
                  onClick={() => router.push(item.href)}
                  iconAfter={
                    showBadge ? (
                      <Badge appearance="primary" max={9}>
                        {unresolvedRecs.length}
                      </Badge>
                    ) : undefined
                  }
                >
                  {item.label}
                </ButtonItem>
              );
            })}
          </Section>
        ))}
      </NavigationContent>

      <NavigationFooter>
        <Section>
          <ButtonItem onClick={openCommandPalette} description="⌘K">
            Command palette
          </ButtonItem>
        </Section>
        <div className={styles.userRow}>
          <div className={styles.avatar}>U</div>
          <div>
            <div className={styles.userName}>User</div>
            <div className={styles.userGreeting}>{getTimeOfDayGreeting()}</div>
          </div>
        </div>
      </NavigationFooter>
    </SideNavigation>
  );
}
