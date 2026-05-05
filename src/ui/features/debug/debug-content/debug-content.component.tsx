import JsonView from "@uiw/react-json-view";
import { useMemo } from "react";
import { useGetDebugInfo, UseGetDebugInfoKeyFn } from "../../../../api/queries";
import { useAtomValue } from "jotai/react";
import { gameStateAtom } from "../../../../atoms/game-state.atom";
import { Tabs } from "radix-ui";
import styles from "./debug-content.module.css";
import { DebugAnimation } from "../debug-animation";

function DebugDataView({ value }: { value?: Record<string, any> }) {
  const formattedValue = useMemo(() => {
    if (!value) {
      return null;
    }

    // If the value is an object, we can return it directly
    if (typeof value === "object") {
      return value;
    }

    // For other types (string, number, etc.), we can wrap it in an object for better display
    return { value };
  }, [value]);

  if (!formattedValue) {
    return <div>No data</div>;
  }

  return (
    <div
      style={{
        height: "100%",
        overflow: "auto",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <JsonView value={formattedValue} />
    </div>
  );
}

export function DebugContent() {
  const { data } = useGetDebugInfo({}, UseGetDebugInfoKeyFn(), {
    refetchInterval: 1_000,
  });

  const gameState = useAtomValue(gameStateAtom);

  const tabs = Object.keys(data ?? {}).map((key) => ({
    label: key,
    content: <DebugDataView value={data?.[key]} />,
  }));

  const defaultTab = tabs[0] ? "tab1" : "game-state";

  return (
    <Tabs.Root className={styles.TabsRoot} defaultValue={defaultTab}>
      <Tabs.List className={styles.TabsList} aria-label="Debug sections">
        {tabs.map((tab, index) => (
          <Tabs.Trigger
            className={styles.TabsTrigger}
            value={`tab${index + 1}`}
            key={index}
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
        <Tabs.Trigger className={styles.TabsTrigger} value="game-state">
          game state
        </Tabs.Trigger>
        <Tabs.Trigger className={styles.TabsTrigger} value="animations">
          animations
        </Tabs.Trigger>
      </Tabs.List>

      {tabs.map((tab, index) => (
        <Tabs.Content
          className={styles.TabsContent}
          value={`tab${index + 1}`}
          key={index}
        >
          {tab.content}
        </Tabs.Content>
      ))}
      <Tabs.Content className={styles.TabsContent} value="game-state">
        <DebugDataView value={gameState} />
      </Tabs.Content>
      <Tabs.Content className={styles.TabsContent} value="animations">
        <DebugAnimation />
      </Tabs.Content>
    </Tabs.Root>
  );
}
