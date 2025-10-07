// app/routes/tabs.tsx
import { Card, LegacyCard, Tabs } from "@shopify/polaris";
import { useState, useCallback } from "react";

// Custom components for each tab
function AllCustomers() {
  return <p>This is All Customers tab content.</p>;
}

function AcceptsMarketing() {
  return <p>This is Accepts Marketing tab content.</p>;
}

function RepeatCustomers() {
  return <p>This is Repeat Customers tab content.</p>;
}

function Prospects() {
  return <p>This is Prospects tab content.</p>;
}

export default function TabsPage() {
  const [selected, setSelected] = useState<number>(0);

  const handleTabChange = useCallback((selectedTabIndex: number) => {
    setSelected(selectedTabIndex);
  }, []);

  const tabs = [
    {
      id: "all-customers-4",
      content: "All",
      accessibilityLabel: "All customers",
      panelID: "all-customers-content-4",
    },
    {
      id: "accepts-marketing-4",
      content: "Accepts marketing",
      panelID: "accepts-marketing-content-4",
    },
    {
      id: "repeat-customers-4",
      content: "Repeat customers",
      panelID: "repeat-customers-content-4",
    },
    {
      id: "prospects-4",
      content: "Prospects",
      panelID: "prospects-content-4",
    },
  ];

  const renderTabContent = () => {
    switch (selected) {
      case 0:
        return <AllCustomers />;
      case 1:
        return <AcceptsMarketing />;
      case 2:
        return <RepeatCustomers />;
      case 3:
        return <Prospects />;
      default:
        return null;
    }
  };

  return (
    <>
      <Card>
        <Tabs
          tabs={tabs}
          selected={selected}
          onSelect={handleTabChange}
          disclosureText="More views"
        />
      </Card>

      <Card>
        {renderTabContent()}
      </Card>
    </>
  );
}
