"use client";

import {
  AtlassianNavigation,
  CustomProductHome,
  IconButton,
  PrimaryButton,
} from "@atlaskit/atlassian-navigation";
import { useUIStore } from "@/lib/store/ui.store";
import { usePersonalizationStore } from "@/lib/store/personalization.store";
import styles from "./TopBar.module.css";

function OmegaProductHome() {
  return (
    <a href="/dashboard" className={styles.productHome}>
      <div className={styles.logoMark}>Ω</div>
      <span className={styles.productName}>Omega</span>
    </a>
  );
}

function LiveStatusItem() {
  return (
    <span className={styles.statusLabel}>
      <span className={styles.liveDot} />
      {" "}active
    </span>
  );
}

export function TopBar() {
  const { openCommandPalette, notificationCount } = useUIStore();
  const { isAdapting, adaptProfile } = usePersonalizationStore();

  const SearchButton = () => (
    <IconButton
      icon={() => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10.5 10.5 13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
      label="Search (⌘K)"
      onClick={openCommandPalette}
      tooltip="Search (⌘K)"
    />
  );

  const AdaptButton = () => (
    <PrimaryButton
      onClick={() => adaptProfile()}
      isDisabled={isAdapting}
    >
      {isAdapting ? "Adapting…" : "Adapt"}
    </PrimaryButton>
  );

  const NotificationsButton = () => (
    <IconButton
      icon={() => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M8 2a5 5 0 0 0-5 5v2.5L2 11h12l-1-1.5V7a5 5 0 0 0-5-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M6.5 13a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.5" />
          {notificationCount > 0 && (
            <circle cx="12" cy="3" r="2.5" fill="#A78BFA" />
          )}
        </svg>
      )}
      label={notificationCount > 0 ? `${notificationCount} notifications` : "Notifications"}
      tooltip="Notifications"
    />
  );

  return (
    <AtlassianNavigation
      label="Omega navigation"
      renderProductHome={OmegaProductHome}
      primaryItems={[<LiveStatusItem key="status" />]}
      secondaryItems={[
        <SearchButton key="search" />,
        <AdaptButton key="adapt" />,
        <NotificationsButton key="notifications" />,
      ]}
    />
  );
}
