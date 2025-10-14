import React, { useEffect } from "react";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  ActionList,
  Badge,
  BlockStack,
  Box,
  Button,
  Card,
  Collapsible,
  FormLayout,
  Icon,
  InlineGrid,
  InlineStack,
  Key,
  Layout,
  Link,
  Page,
  Popover,
  RadioButton,
  Select,
  Text,
  TextContainer,
  TextField,
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import {
  ArrowDownIcon,
  CaretDownIcon,
  ChevronDownIcon,
  ExternalIcon,
  OrderIcon,
  PlusIcon,
} from "@shopify/polaris-icons";
import WidgetRuleCondition from "./WidgetRuleCondition";
import WidgetSettings from "./widgetSettings";
import { WidgetState } from "app/routes/app.features.$widgetSlug";
import { Navigate, useNavigate } from "@remix-run/react";

interface WidgetSettingProps {
  pageName: string;
  settings: Record<string, WidgetState>;
  dispatch: React.Dispatch<any>;
  children?: React.ReactNode;
}

export default function SinglePage({
  pageName,
  settings,
  dispatch,
  children,
}: WidgetSettingProps) {
  const [openWidget, setOpenWidget] = useState<string | null>(
    Object.keys(settings)[0],
  );
  const [showSlidekick, setShowSlidekick] = useState(false);

  const handleToggle = useCallback((key: string) => {
    setOpenWidget((prev) => {
      const newValue = prev === key ? null : key;

      // If no widget is open, close the settings panel
      if (newValue === null) {
        setShowSlidekick(false);
      }

      return newValue;
    });
  }, []);

  const handlePriceMatchChange = useCallback(
    (widgetKey: string, newValue: "all" | "any") => {
      // Update local state immediately for UI responsiveness
      dispatch({
        type: "SET_LOGIC",
        payload: { widgetId: widgetKey, priceMatch: newValue },
      });

      // Send to database
      // if (fetcher) {
      //   const formData = new FormData();
      //   formData.append('action', 'updatePriceMatch');
      //   formData.append('widgetId', key);
      //   formData.append('priceMatch', newValue);
      //   fetcher.submit(formData, { method: 'post' });
      // }
    },
    [],
  );

  const handleAddCondition = useCallback((widgetKey: string) => {
    // const newCondition: WidgetRuleConditionData = {
    //   id: `temp_${Date.now()}`, // Temporary ID for optimistic update
    //   field: 'product_title',
    //   operator: 'contains',
    //   value: '',
    //   widgetId: widgetKey
    // };

    // Optimistic update
    dispatch({
      type: "ADD_CONDITION",
      payload: { widgetId: widgetKey },
    });
  }, []);

  const handleRemoveCondition = useCallback(
    (widgetKey: string, conditionId: string) => {
      dispatch({
        type: "DELETE_CONDITION",
        payload: { widgetId: widgetKey, conditionId },
      });
    },
    [],
  );

  const handleConditionChange = useCallback(
    (
      widgetKey: string,
      conditionId: string,
      field: "field" | "operator" | "value",
      value: string,
    ) => {
      dispatch({
        type: "UPDATE_CONDITION",
        payload: { widgetId: widgetKey, conditionId, field, value },
      });
    },
    [],
  );

  function capitalize(text: string): string {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  const capitalizedPageName = capitalize(pageName);

  //*R@-pending* --->> Sabhi screen  k  liye  set karna h  1024 se  widgets  settings  widget k card k niche  hi open  hona  chahiye

  const settingKick = {
    md: "5fr 2fr",
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    handleResize(); // initial check on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = useNavigate();

  return (
    <>
      <TitleBar title={`${capitalizedPageName} Page`} />
      {/* {console.log(widgetStates , "retun")} */}
      <Page
        title={`${capitalizedPageName} Page`}
        //R@-pending ---connect with bottom code
        //  titleMetadata={<ActionListInPopoverExample capitalizedPageName={capitalizedPageName} pageName={pageName}/>}
        backAction={{
          content: "Back",
          onAction: () => navigate("/app/features"),
        }}
      >
        <InlineGrid
          columns={isMobile ? 1 : showSlidekick ? { md: "5fr 2fr" } : 1}
          gap="200"
        >
          <BlockStack gap={"500"}>
            {Object.entries(settings as Record<string, WidgetState>).map(
              ([key, widget]) => (
                <>
                  <Card key={key}>
                    <BlockStack gap="400">
                      <InlineStack
                        align="space-between"
                        blockAlign="center"
                        gap="200"
                      >
                        <div>
                          <Text as="h2" variant="headingMd" fontWeight="bold">
                            {widget.backend.widgetName}
                          </Text>
                          <Text as="p" variant="bodyMd">
                            {widget.backend.widgetDescription}
                          </Text>
                        </div>
                        <div>
                          <InlineStack align="end" gap="200">
                            <Button
                              onClick={() => handleToggle(key)}
                              ariaExpanded={openWidget === key}
                              ariaControls={`collapsible-${key}`}
                            >
                              Customize
                            </Button>
                            <Button
                              url={`#`}
                              variant="primary"
                              icon={ExternalIcon}
                            >
                              {`Add Widget`}
                            </Button>
                          </InlineStack>
                        </div>
                      </InlineStack>
                      <Collapsible
                        open={openWidget === key}
                        id={`collapsible-${key}`}
                        transition={{
                          duration: "500ms",
                          timingFunction: "ease-in-out",
                        }}
                        expandOnPrint
                      >
                        <InlineGrid
                          columns={
                            isMobile ? 1 : showSlidekick ? 1 : settingKick
                          }
                          gap="400"
                        >
                          <Card>
                            <BlockStack gap="200">
                              <Text as="h3" fontWeight="bold">
                                Condition
                              </Text>
                              {widget?.ruleSettings?.conditions?.length > 0 ? (
                                <InlineStack blockAlign="center" gap="500">
                                  <Text as="p" variant="bodyMd">
                                    Products must match:
                                  </Text>
                                  <div>
                                    <InlineStack gap="500">
                                      <RadioButton
                                        label="all conditions"
                                        checked={
                                          widget.ruleSettings.priceMatch ===
                                          "all"
                                        }
                                        id={`all-${key}`}
                                        name={`matchWidgetsAllRule-${key}`}
                                        onChange={() =>
                                          handlePriceMatchChange(key, "all")
                                        }
                                      />
                                      <RadioButton
                                        label="any condition"
                                        id={`any-${key}`}
                                        name={`matchWidgetsAllRule-${key}`}
                                        checked={
                                          widget.ruleSettings.priceMatch ===
                                          "any"
                                        }
                                        onChange={() =>
                                          handlePriceMatchChange(key, "any")
                                        }
                                      />
                                    </InlineStack>
                                  </div>
                                </InlineStack>
                              ) : (
                                <Text as="p">
                                  You can Add multiple conditions as per your
                                  preference to customize which products are
                                  displayed in this section.
                                </Text>
                              )}

                              {widget?.ruleSettings?.conditions?.map(
                                (condition) => (
                                  <WidgetRuleCondition
                                    key={condition.id}
                                    condition={{
                                      id: condition.id,
                                      field: condition.field,
                                      operator: condition.operator,
                                      value: condition.value,
                                    }}
                                    onRemove={() =>
                                      handleRemoveCondition(key, condition.id)
                                    }
                                    onChange={(field, value) =>
                                      handleConditionChange(
                                        key,
                                        condition.id,
                                        field,
                                        value,
                                      )
                                    }
                                  />
                                ),
                              )}

                              <InlineStack>
                                <Button
                                  icon={PlusIcon}
                                  onClick={() => handleAddCondition(key)}
                                  disabled={widget?.ruleSettings?.conditions ? false : true}
                                  // loading={fetcher?.state === 'submitting'}
                                >
                                  {`Add ${widget?.ruleSettings?.conditions?.length > 0 ? "Another" : ""} Condition `}
                                </Button>
                              </InlineStack>
                            </BlockStack>
                          </Card>

                          {(!showSlidekick || isMobile) && (
                            <Box as="section">
                              <BlockStack gap="400">
                                {/* Widget Heading */}

                                <TextField
                                  label={
                                    <Text
                                      as="p"
                                      variant="bodyMd"
                                      fontWeight="bold"
                                    >
                                      Widget Heading:
                                    </Text>
                                  }
                                  value={widget?.widgetsSettings?.heading}
                                  onChange={(value) =>
                                    dispatch({
                                      type: "UPDATE_SINGLE_WIDGET_SETTING",
                                      payload: {
                                        widgetId: key, // jaise "New Arrivals"
                                        settings: {
                                          widgetsSettings: {
                                            ...widget.widgetsSettings,
                                            heading: value,
                                          },
                                        },
                                      },
                                    })
                                  }
                                  placeholder={widget?.widgetsSettings?.heading}
                                  autoComplete="off"
                                  size="slim"
                                />
                                {/* subHeading */}
                                <TextField
                                  label={
                                    <Text
                                      as="p"
                                      variant="bodyMd"
                                      fontWeight="bold"
                                    >
                                      Widget subHeading:
                                    </Text>
                                  }
                                  value={widget?.widgetsSettings?.subHeading}
                                  onChange={(value) => {
                                    dispatch({
                                      type: "UPDATE_SINGLE_WIDGET_SETTING",
                                      payload: {
                                        widgetId: key, // jaise "New Arrivals"
                                        settings: {
                                          widgetsSettings: {
                                            ...widget.widgetsSettings,
                                            subHeading: value,
                                          },
                                        },
                                      },
                                    });
                                  }}
                                  placeholder={
                                    widget?.widgetsSettings?.subHeading
                                  }
                                  autoComplete="off"
                                  size="slim"
                                />
                                <InlineStack>
                                  <Button
                                    onClick={() => {
                                      setShowSlidekick(
                                        (prev: boolean) => !prev,
                                      );
                                    }}
                                  >
                                    Customize Settings
                                  </Button>
                                </InlineStack>
                              </BlockStack>
                            </Box>
                          )}
                        </InlineGrid>
                      </Collapsible>
                      {isMobile && openWidget === key && showSlidekick && (
                        <Collapsible
                          open={isMobile && openWidget === key && showSlidekick}
                          id="basic-collapsible"
                          transition={{
                            duration: "500ms",
                            timingFunction: "ease-in-out",
                          }}
                          expandOnPrint
                        >
                          <Box padding="100" borderColor="border-magic">
                            <WidgetSettings
                              setShowSlidekick={setShowSlidekick}
                              widgetName={widget.backend.widgetName}
                              widgetsSettings={widget.widgetsSettings}
                              widgetKey={key}
                              dispatch={dispatch}
                            />
                          </Box>
                        </Collapsible>
                      )}
                    </BlockStack>
                  </Card>
                </>
              ),
            )}
          </BlockStack>

          {!isMobile && showSlidekick && openWidget && (
            <WidgetSettings
              setShowSlidekick={setShowSlidekick}
              widgetName={settings[openWidget]?.backend.widgetName || "Widget"}
              widgetsSettings={settings[openWidget]?.widgetsSettings}
              widgetKey={openWidget || ""}
              dispatch={dispatch}
            />
          )}
        </InlineGrid>
        {children}
      </Page>
    </>
  );
}

//R@-pending --- issue  y  aaya  h  ki  page settings  m changes  hue h vo dusre page  p bhi dikhne  lag gaye h
// to redirection  rokna h jab settings  m kuch  change  ho to
//R@-pending --- page  k title ko bhi comment  kiya h

// function ActionListInPopoverExample({capitalizedPageName , pageName}) {
// // console.log(pageName, "pageName")
//   const navigate = useNavigate()
//   const [active, setActive] = useState(false);

//   const toggleActive = useCallback(() => setActive((active) => !active), []);

//   const handleImportedAction = useCallback(
//     () => console.log('Imported action'),
//     [],
//   );

//   const handleExportedAction = useCallback(
//     (value: string) => navigate(`/app/features/${value}`),
//     [],
//   );

//   const activator = (
//     <Button variant="plain" onClick={toggleActive} disclosure size="large" children={<Text as="h3" variant="headingLg" children={`${capitalizedPageName} Page`} /> } />

//   );

//   return (

//       <Popover
//         active={active}
//         activator={activator}
//         // autofocusTarget="first-node"
//         // preferredPosition=""
//         onClose={toggleActive}
//       >
//         <ActionList
//         onActionAnyItem={toggleActive}
//           actionRole="menuitem"
//           items={[
//             {
//               content: 'Home Page',
//               url:"/app/features/home",
//               active:pageName === "home",
//               disabled:pageName === "home",
//             },
//             {
//               content: 'Product Page',
//               url:"/app/features/product",
//               active:pageName === "product",
//               disabled:pageName === "product",
//             },
//             {
//               content: 'Cart Page',
//               url:"/app/features/cart",
//               active:pageName === "cart",
//               disabled:pageName === "cart",
//             },
//             {
//               content: 'Collection Page',
//               url:"/app/features/collection",
//               active:pageName === "collection",
//               disabled:pageName === "collection",
//             },
//             {
//               content: 'Not Found Page',
//               url:"/app/features/notFound",
//               active:pageName === "notFound",
//               disabled:pageName === "notFound",
//             },
//             {
//               content: 'Search Page',
//               url:"/app/features/Search",
//               active:pageName === "Search",
//               disabled:pageName === "Search",
//             },
//             {
//               content: 'Blog Page',
//               url:"/app/features/other",
//               active:pageName === "other",
//               disabled:pageName === "other",
//             },
//           ]}
//         />
//       </Popover>
//   );
// }
