import React, { useEffect } from "react";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  ActionList,
  Badge,
  BlockStack,
  Box,
  Button,
  ButtonGroup,
  Card,
  Collapsible,
  Divider,
  FormLayout,
  Icon,
  InlineGrid,
  InlineStack,
  Key,
  Layout,
  Link,
  OptionList,
  Page,
  Popover,
  RadioButton,
  Select,
  Text,
  TextContainer,
  TextField,
  Tooltip,
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import {
  ArrowDownIcon,
  CaretDownIcon,
  ChevronDownIcon,
  ExternalIcon,
  MenuHorizontalIcon,
  OrderIcon,
  PlusIcon,
  SettingsIcon,
} from "@shopify/polaris-icons";
import WidgetRuleCondition from "./WidgetRuleCondition";
import WidgetSettings from "./widgetSettings";
import { Navigate, useNavigate } from "@remix-run/react";
import { WidgetConfig } from "app/constants/interfaces/widgetConfigInterface";
import { widgetActions } from "app/redux/slices/pageWidgetConfigSlice";
import RelatedProductSelection from "./RelatedProduct/RelatedProductSelection";

interface WidgetSettingProps {
  pageName: string;
  settings: Record<string, WidgetConfig>;
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

  const [allPagesAddPopover, setAllPagesAddPopover] = useState<Record<string, boolean>>({});


  const [selectedPagesName, setSelectedPagesName] = useState<Record<string, string[]>>({});
  // const toggleAllPagesAddPopover = useCallback(
  //   () => setAllPagesAddPopover((allPagesAddPopover) => !allPagesAddPopover),
  //   [],
  // );
  const toggleAllPagesAddPopover = (key: string) => {
    setAllPagesAddPopover(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };



  const handleSelectedPagesChange = (key: string, selected: string[]) => {
  setSelectedPagesName((prev) => ({
    ...prev,
    [key]: selected,
  }));
};

  const [showSlidekick, setShowSlidekick] = useState(false);

  const handleToggle = useCallback((key: string) => {
    setOpenWidget((prev) => {
      const newValue = prev === key ? null : key;

      // If no widget is open, close the settings panel
      if (newValue === null) {
        setShowSlidekick(false);
      //   if( key) {
      //   setSelectedPagesName((key: string)=>{
      //     {Object.entries(settings as Record<string, WidgetState>).map(
      //         ([key, widget]) => {
      //           if(key === openWidget){
      //             return widget?.backend?.availableOnpages ? widget?.backend?.availableOnpages[1] : []
      //         }
      //   })};

      //   });
      // }
      }

      return newValue;
    });
  }, []);

  const handlePriceMatchChange = useCallback(
    (widgetKey: string, newValue: "all" | "any") => {
      dispatch(widgetActions.setLogic({ widgetId: widgetKey, priceMatch: newValue }));
    },
    [dispatch],
  );

  const handleAddCondition = useCallback((widgetKey: string) => {
    dispatch(widgetActions.addCondition({ widgetId: widgetKey }));
  }, [dispatch]);

  const handleRemoveCondition = useCallback(
    (widgetKey: string, conditionId: string) => {
      dispatch(widgetActions.deleteCondition({ widgetId: widgetKey, conditionId }));
    },
    [dispatch],
  );

  const handleConditionChange = useCallback(
    (
      widgetKey: string,
      conditionId: string,
      field: "field" | "operator" | "value",
      value: string,
    ) => {
      dispatch(widgetActions.updateCondition({ widgetId: widgetKey, conditionId, field, value }));
    },
    [dispatch],
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
            {Object.entries(settings as Record<string, WidgetConfig>).map(
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
                            {widget?.backend?.widgetName}
                          </Text>
                          <Text as="p" variant="bodyMd">
                            {widget?.backend?.widgetDescription}
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
                          <Card >
                            <BlockStack gap="200">
                            
                                {/* <Card background="bg-fill-transparent" roundedAbove="md" > */}
                                <BlockStack gap="200" >
                                    <Text as="h3" fontWeight="bold">
                                      Widget Settings
                                    </Text>
                                    <RelatedProductSelection />
                                    <Divider borderWidth="0"/>
                                </BlockStack>                              
                              {/* </Card> */}

                            <Divider />

                            

                              <InlineStack wrap={false} gap="500" align="space-between" blockAlign="start">
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
                                              widget?.ruleSettings?.priceMatch ===
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
                                              widget?.ruleSettings?.priceMatch ===
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
                                </BlockStack>
                                
                                  <InlineStack gap="200" wrap={false} align="center">
                                    <Popover
                                      active={!!allPagesAddPopover[key]}
                                      autofocusTarget="none"
                                      activator={<Tooltip content="More" dismissOnMouseOut><Button
                                        icon={MenuHorizontalIcon}
                                        onClick={() => toggleAllPagesAddPopover(key)}
                                        // loading={fetcher?.state === 'submitting'}
                                        variant="plain"
                                      >
                                      </Button></Tooltip>}
                                      onClose={() => toggleAllPagesAddPopover(key)}
                                      sectioned
                                    >
                                      {/* <FormLayout> */}
                                        <BlockStack gap="100">
                                        <OptionList
                                          title="Condition apply for selected pages"
                                          onChange={(selected) => handleSelectedPagesChange (key , selected)}
                                          options={widget?.backend?.availableOnpages?.[0] || []}
                                          selected={selectedPagesName[key] || []}
                                          allowMultiple
                                        />
                                        <Divider /> 
                                       <Box paddingInline="400" paddingBlock="200">                                        
                                        <ButtonGroup>
                                          <Button variant="plain"disabled={(selectedPagesName[key]?.length || 0) < 1}
      onClick={() => handleSelectedPagesChange(key, [])}>Clear</Button>
                                          <Button variant="primary" disabled={(selectedPagesName[key]?.length || 0) < 1} >Apply</Button>
                                        </ButtonGroup>
                                        </Box>
                                        </BlockStack>
                                      {/* </FormLayout> */}
                                    </Popover>                                    
                                    <Tooltip content="Custom Widget Settings" dismissOnMouseOut>
                                      <Button
                                        icon={SettingsIcon}
                                        url={`/app/features/${pageName}/settings?widgetId=${key}`}
                                        variant="plain"
                                      >
                                      </Button>
                                </Tooltip>
                                  </InlineStack>
                                
                              </InlineStack>

                              {widget?.ruleSettings?.conditions?.map(
                                (condition: any) => (
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
                                    dispatch(widgetActions.updateSingleWidgetSetting({
                                      widgetId: key,
                                      settings: {
                                        ...widget.widgetsSettings,
                                        heading: value,
                                      },
                                    }))
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
                                    dispatch(widgetActions.updateSingleWidgetSetting({
                                      widgetId: key,
                                      settings: {
                                        ...widget.widgetsSettings,
                                        subHeading: value,
                                      },
                                    }));
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
                              widgetName={widget?.backend?.widgetName}
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
              widgetName={settings[openWidget]?.backend?.widgetName || "Widget"}
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
