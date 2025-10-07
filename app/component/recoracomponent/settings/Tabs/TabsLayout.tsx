// app/components/TabsProductCard.tsx

import {
  BlockStack,
  InlineStack,
  InlineGrid,
  Text,
  Box,
  Button,
  ButtonGroup,
  Divider,
  TextField,
  RangeSlider,
  Popover,
  ActionList,
  Collapsible,
  Select,
  Tooltip,
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import { Icon } from "@shopify/polaris";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  LayoutPopupIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from "@shopify/polaris-icons"; // Replace with your custom LayoutPopupIcon if needed

// -- Types
interface DeviceViewSettings {
  viewType: "grid" | "slider";
  rangeProValue: number;
  screenSize: string;
}

interface TextSettings {
  fontSize: number;
  color: string;
  textAlign: "left" | "center" | "right";
  customClass: string;
}

interface SettingFromDb {
  colorScheme: {
    [key: string]: {
      background: string;
      text: string;
      border: string;
      text_Secondary: string;
    };
  };
  commanView: {
    customClass: string;
    layoutValue: string;
    totalProduct: number;
    heading: TextSettings;
    subHeading: TextSettings;
    desktop: DeviceViewSettings;
    tablet: DeviceViewSettings;
    mobile: DeviceViewSettings;
  };
}

interface Props {
  developerMode: boolean;
  settingfromDb: SettingFromDb;
  dispatch: React.Dispatch<any>; // Replace 'any' with the correct type for Action if known
}

export default function TabsLayout({
  settingfromDb,
  dispatch,
  developerMode,
}: Props) {
  const [selectedColorSchemes, setSelectedColorSchemes] = useState<any>(
    settingfromDb.colorScheme,
  );
  const HeadingColor = [
    { label: "Scheme 1", value: selectedColorSchemes["Scheme 1"].text },
    { label: "Scheme 2", value: selectedColorSchemes["Scheme 2"].text },
  ];

  const SubHeadingColor = [
    { label: "Scheme 1", value: selectedColorSchemes["Scheme 1"].text },
    { label: "Scheme 2", value: selectedColorSchemes["Scheme 2"].text },
  ];

  // Common view state
  // const [layoutValue, setLayoutValue] = useState(settingfromDb.commanView.layoutValue);
  // const [totalProduct, setTotalProduct] = useState(settingfromDb.commanView.totalProduct);
  const [popoverActive, setPopoverActive] = useState(false);

  // Device-specific states
  // const [desktopSettings, setDesktopSettings] = useState(settingfromDb.commanView.desktop);
  // const [tabletSettings, setTabletSettings] = useState(settingfromDb.commanView.tablet);
  // const [mobileSettings, setMobileSettings] = useState(settingfromDb.commanView.mobile);

  const desktopSettings = settingfromDb.commanView.desktop;
  const tabletSettings = settingfromDb.commanView.tablet;
  const mobileSettings = settingfromDb.commanView.mobile;

  // console.log(desktopSettings , "desktopSettings new")

  // Handlers
  const togglePopoverActive = useCallback(() => {
    setPopoverActive((active) => !active);
  }, []);

  const handleTotalProductRange = useCallback((value: number) => {
    // dispatch({ type: "UPDATE_TOTAL_PRODUCT", payload: (value > 20 ? 20 : value < 1 ? 1 : value) })
    // dispatch({ type: "UPDATE_TOTAL_PRODUCT", payload: (value > 20 ? 20 : value < 1 ? 1 : value) })
    dispatch({
      type: "UPDATE_COMMANVIEW",
      payload: { totalProduct: value > 20 ? 20 : value < 1 ? 1 : value },
    });
    // setTotalProduct(value > 20 ? 20 : value < 1 ? 1 : value);
  }, []);

  // const handleRangeChange = useCallback(
  //   (value: number, max: number, setter: (val: DeviceViewSettings) => void, current: DeviceViewSettings) => {
  //     setter({
  //       ...current,
  //       rangeProValue: value > max ? max : value < 1 ? 1 : value,
  //     });
  //   },
  //   [],
  // );

  // const handleViewTypeChange = useCallback(
  //   (view: 'grid' | 'slider', setter: (val: DeviceViewSettings) => void, current: DeviceViewSettings) => {
  //     setter({ ...current, viewType: view });
  //   },
  //   [],
  // );

  // Collapse section control
  const [openSection, setOpenSection] = useState<string | null>(
    "Product_Layout",
  );
  const handleToggle = (section: string) =>
    setOpenSection((prev) => (prev === section ? null : section));

  return (
    <Box
      as="ul"
      style={{ maxHeight: '600px', overflowY: 'scroll' }}
      borderStyle="solid"
      overflowY="scroll"
    >
      {/* ProductCard */}
      <Box
        as="li"
        key={"settings_Layout"}
        borderStyle="solid"
        printHidden={false}
        visuallyHidden={false}
        borderBlockEndWidth="025"
        borderColor="border-secondary"
      >
        <Box
          as="div"
          padding={300}
          onClick={() => {
            handleToggle("Product_Layout");
          }}
          background={
            openSection === "Product_Layout" ? "bg-fill-secondary" : "bg-fill"
          }
        >
          <InlineStack gap="200" align="space-between">
            <InlineStack gap="100" align="space-between" blockAlign="center">
              <Text as="h3" variant="headingSm" fontWeight="bold">
                {" "}
                Widget Layout{" "}
              </Text>
            </InlineStack>
            <InlineGrid alignItems="end">
              <Icon
                source={
                  openSection === "Product_Layout"
                    ? ChevronUpIcon
                    : ChevronDownIcon
                }
                tone="base"
              />
            </InlineGrid>
          </InlineStack>
        </Box>
        <Collapsible
          open={openSection === "Product_Layout"}
          expandOnPrint={true}
          transition={true}
        >
          <Box paddingBlock={400} paddingInline={300} position="relative">
            <BlockStack gap="400">
              {/* View Toggle */}
              <InlineStack gap="100" align="space-between" blockAlign="center">
                <Text as="p" variant="bodyMd">
                  View
                </Text>
                <Box background="bg-fill-secondary" borderRadius="200">
                  <ButtonGroup variant="segmented">
                    <Button
                      size="slim"
                      variant={
                        desktopSettings.viewType === "grid"
                          ? "secondary"
                          : "tertiary"
                      }
                      // onClick={() => handleViewTypeChange('grid', setDesktopSettings, desktopSettings)}
                      // onClick={() => dispatch({ type: "UPDATE_VIEW_TYPE", device: "desktop", payload: "grid" })}
                      onClick={() =>
                        dispatch({
                          type: "UPDATE_COMMANVIEW",
                          payload: { desktop: { viewType: "grid" } },
                        })
                      }
                    >
                      Grid
                    </Button>
                    <Button
                      size="slim"
                      variant={
                        desktopSettings.viewType === "slider"
                          ? "secondary"
                          : "tertiary"
                      }
                      // onClick={() => dispatch({ type: "UPDATE_VIEW_TYPE", device: "desktop", payload: "slider" })}
                      onClick={() =>
                        dispatch({
                          type: "UPDATE_COMMANVIEW",
                          payload: { desktop: { viewType: "slider" } },
                        })
                      }
                    >
                      Slider
                    </Button>
                  </ButtonGroup>
                </Box>
              </InlineStack>

              {/* Template Selector */}
              <InlineStack gap="100" align="space-between" blockAlign="center">
                <Text as="p" variant="bodyMd">
                  Template
                </Text>
                <Popover
                  active={popoverActive}
                  activator={
                    <Button
                      variant="secondary"
                      disclosure="select"
                      icon={LayoutPopupIcon} // Replace with custom icon if needed
                      onClick={togglePopoverActive}
                    >
                      {settingfromDb.commanView.layoutValue}
                    </Button>
                  }
                  autofocusTarget="none"
                  onClose={togglePopoverActive}
                >
                  <Popover.Pane fixed>
                    <Popover.Section>
                      <p>Select Template</p>
                    </Popover.Section>
                  </Popover.Pane>
                  <Divider />
                  <Popover.Pane>
                    <ActionList
                      actionRole="menuitem"
                      items={[
                        {
                          content: "Layout 1",
                          active:
                            settingfromDb.commanView.layoutValue == "Layout 1",
                          onAction: () =>
                            dispatch({
                              type: "UPDATE_COMMANVIEW",
                              payload: { layoutValue: "Layout 1" },
                            }),
                        },
                        {
                          content: "Layout 2",
                          active:
                            settingfromDb.commanView.layoutValue == "Layout 2",
                          onAction: () =>
                            dispatch({
                              type: "UPDATE_COMMANVIEW",
                              payload: { layoutValue: "Layout 2" },
                            }),
                        },
                        {
                          content: "Layout 3",
                          active:
                            settingfromDb.commanView.layoutValue == "Layout 3",
                          onAction: () =>
                            dispatch({
                              type: "UPDATE_COMMANVIEW",
                              payload: { layoutValue: "Layout 3" },
                            }),
                        },
                      ]}
                    />
                  </Popover.Pane>
                </Popover>
              </InlineStack>

              {/* Total Product Slider */}
              <InlineGrid gap="100">
                <Text as="p" variant="bodyMd">
                  Maximum products to show
                </Text>
                <InlineStack
                  gap="100"
                  align="space-between"
                  blockAlign="center"
                >
                  <RangeSlider
                    label=" "
                    min={1}
                    max={20}
                    value={settingfromDb.commanView.totalProduct}
                    onChange={handleTotalProductRange}
                    output
                    suffix={
                      <Box maxWidth="80px">
                        <TextField
                          autoSize
                          type="number"
                          value={settingfromDb.commanView.totalProduct}
                          onChange={handleTotalProductRange}
                          min={1}
                          max={20}
                          autoComplete="off"
                          size="slim"
                        />
                      </Box>
                    }
                  />
                </InlineStack>
              </InlineGrid>

              {developerMode && (
                <TextField
                  label={<Text variant="bodyMd" as="span" tone="critical" fontWeight="bold">Layout Custom Class</Text>}
                  tone="magic"
                  value={settingfromDb.commanView.customClass}
                  onChange={(value: string) =>
                    dispatch({
                      type: "UPDATE_COMMANVIEW",
                      payload: { customClass: value },
                    })
                  }
                  autoComplete="off"
                />
              )}

              {/* Device-specific sections */}
              {/* {[
                  { title: 'Desktop', max: 6, state: desktopSettings },
                  { title: 'Tablet Layout', max: 4, state: tabletSettings },
                  { title: 'Mobile Layout', max: 3, state: mobileSettings },
                ].map(({ title, max, state }) => (
                  <InlineGrid key={title} gap="100">
                    <Box position="relative" paddingBlockStart="500" paddingBlockEnd="400" paddingInlineEnd="300">
                      <Divider />
                      <Box
                        style={{
                          top: '9px',
                          position: 'absolute',
                          left: '10px',
                          paddingInline: '10px',
                          background: 'var(--p-color-bg-surface)',
                        }}
                      >
                        <Text as="p" variant="bodyMd" fontWeight="bold">
                          {title}
                        </Text>
                      </Box>
                    </Box>

                      { title !== 'Desktop' && 
                    <InlineStack gap="300" align="space-between" blockAlign="center">
                      <Text as="p" variant="bodyMd">View</Text>
                      <Box background="bg-fill-secondary" borderRadius="200">
                        <ButtonGroup variant="segmented">
                          <Button
                            size="slim"
                            variant={state.viewType === 'grid' ? 'secondary' : 'tertiary'}
                            // onClick={() => handleViewTypeChange('grid', setter, state)}
                            onClick={() => dispatch({ type: "UPDATE_VIEW_TYPE", device: state, payload: "grid" })}
                          >
                            Grid
                          </Button>
                          <Button
                            size="slim"
                            variant={state.viewType === 'slider' ? 'secondary' : 'tertiary'}
                            onClick={() => dispatch({ type: "UPDATE_VIEW_TYPE", device: state, payload: "slider" })}
                          >
                            Slider
                          </Button>
                        </ButtonGroup>
                      </Box>
                    </InlineStack>
                      }
                    <InlineGrid gap="100">
                      <Text as="p" variant="bodyMd">Product per row</Text>
                      <InlineStack gap="100" align="space-between" blockAlign="center">
                        <RangeSlider
                          label=""
                          min={1}
                          step={0.1}
                          max={max}
                          value={state.rangeProValue}
                          // onChange={(value) => handleRangeChange(value, max, setter, state)}
                          onChange={(value) => dispatch({ type: "UPDATE_DEVICE_RANGE", device: state, payload: value })}
                          output
                          suffix={
                            <Box maxWidth="80px">
                              <TextField
                                type="number"
                                value={state.rangeProValue}
                                // onChange={(value) => handleRangeChange(Number(value), max, setter, state)}
                                onChange={(value) => dispatch({ type: "UPDATE_DEVICE_RANGE", device: state, payload: value })}
                                min={1}
                                max={max}
                                autoComplete="off"
                              />
                            </Box>
                          }
                        />
                      </InlineStack>
                    </InlineGrid>
                  </InlineGrid>
                ))} */}

              <InlineGrid key={"Desktop"} gap="100">
                <Box
                  position="relative"
                  paddingBlockStart="500"
                  paddingBlockEnd="400"
                  paddingInlineEnd="300"
                >
                  <Divider />
                  <Box
                    style={{
                      top: "9px",
                      position: "absolute",
                      left: "10px",
                      paddingInline: "10px",
                      background: "var(--p-color-bg-surface)",
                    }}
                  >
                    <Text as="p" variant="bodyMd" fontWeight="bold">
                      Desktop
                    </Text>
                  </Box>
                </Box>

                {/* <InlineStack gap="300" align="space-between" blockAlign="center">
                      <Text as="p" variant="bodyMd">View</Text>
                      <Box background="bg-fill-secondary" borderRadius="200">
                        <ButtonGroup variant="segmented">
                          <Button
                            size="slim"
                            variant={state.viewType === 'grid' ? 'secondary' : 'tertiary'}
                            // onClick={() => handleViewTypeChange('grid', setter, state)}
                            onClick={() => dispatch({ type: "UPDATE_VIEW_TYPE", device: "desktop", payload: "grid" })}
                          >
                            Grid
                          </Button>
                          <Button
                            size="slim"
                            variant={state.viewType === 'slider' ? 'secondary' : 'tertiary'}
                            onClick={() => dispatch({ type: "UPDATE_VIEW_TYPE", device: state, payload: "slider" })}
                          >
                            Slider
                          </Button>
                        </ButtonGroup>
                      </Box>
                    </InlineStack> */}

                <InlineGrid gap="100">
                  <Text as="p" variant="bodyMd">
                    Product per row
                  </Text>
                  <InlineStack
                    gap="100"
                    align="space-between"
                    blockAlign="center"
                  >
                    <RangeSlider
                      label=""
                      min={1}
                      step={settingfromDb.commanView.desktop.viewType == "slider" ? 0.1 : 1}
                      max={6}
                      value={settingfromDb.commanView.desktop.rangeProValue}
                      // onChange={(value) => handleRangeChange(value, max, setter, state)}
                      // onChange={(value) => dispatch({ type: "UPDATE_DEVICE_RANGE", device: "desktop", payload: value })}
                      onChange={(value) =>
                        dispatch({
                          type: "UPDATE_COMMANVIEW",
                          payload: { desktop: { rangeProValue: value } },
                        })
                      }
                      output
                      suffix={
                        <Box maxWidth="80px">
                          <TextField
                            type="integer"
                            value={
                              settingfromDb.commanView.desktop.rangeProValue
                            }
                            // onChange={(value) => handleRangeChange(Number(value), max, setter, state)}
                            // onChange={(value) => dispatch({ type: "UPDATE_DEVICE_RANGE", device: "dektop", payload: value })}
                            onChange={(value) =>
                              dispatch({
                                type: "UPDATE_COMMANVIEW",
                                payload: { desktop: { rangeProValue: value } },
                              })
                            }
                            min={1}
                            max={6}
                            autoComplete="off"
                          />
                        </Box>
                      }
                    />
                  </InlineStack>
                </InlineGrid>

                {developerMode && (
                <TextField
                  label={<Text variant="bodyMd" as="span" tone="critical" fontWeight="bold">Desktop Screen Size</Text>}
                  tone="magic"
                  value={settingfromDb.commanView.desktop.screenSize}
                  onChange={(value) =>
                    dispatch({
                      type: "UPDATE_COMMANVIEW",
                      payload: { desktop : { screenSize: value } },
                    })
                  }
                  autoComplete="off"
                />
              )} 


              </InlineGrid>

              {/* tablet  */}

              <InlineGrid key={"Tablet"} gap="100">
                <Box
                  position="relative"
                  paddingBlockStart="500"
                  paddingBlockEnd="400"
                  paddingInlineEnd="300"
                >
                  <Divider />
                  <Box
                    style={{
                      top: "9px",
                      position: "absolute",
                      left: "10px",
                      paddingInline: "10px",
                      background: "var(--p-color-bg-surface)",
                    }}
                  >
                    <Text as="p" variant="bodyMd" fontWeight="bold">
                      Tablet
                    </Text>
                  </Box>
                </Box>

                <InlineStack
                  gap="300"
                  align="space-between"
                  blockAlign="center"
                >
                  <Text as="p" variant="bodyMd">
                    View
                  </Text>
                  <Box background="bg-fill-secondary" borderRadius="200">
                    <ButtonGroup variant="segmented">
                      <Button
                        size="slim"
                        variant={
                          settingfromDb.commanView.tablet.viewType === "grid"
                            ? "secondary"
                            : "tertiary"
                        }
                        // onClick={() => handleViewTypeChange('grid', setter, state)}
                        // onClick={() => dispatch({ type: "UPDATE_VIEW_TYPE", device: "tablet", payload: "grid" })}
                        onClick={() =>
                          dispatch({
                            type: "UPDATE_COMMANVIEW",
                            payload: { tablet: { viewType: "grid" } },
                          })
                        }
                      >
                        Grid
                      </Button>
                      <Button
                        size="slim"
                        variant={
                          settingfromDb.commanView.tablet.viewType === "slider"
                            ? "secondary"
                            : "tertiary"
                        }
                        // onClick={() => dispatch({ type: "UPDATE_VIEW_TYPE", device: "tablet", payload: "slider" })}
                        onClick={() =>
                          dispatch({
                            type: "UPDATE_COMMANVIEW",
                            payload: { tablet: { viewType: "slider" } },
                          })
                        }
                      >
                        Slider
                      </Button>
                    </ButtonGroup>
                  </Box>
                </InlineStack>

                <InlineGrid gap="100">
                  <Text as="p" variant="bodyMd">
                    Product per row
                  </Text>
                  <InlineStack
                    gap="100"
                    align="space-between"
                    blockAlign="center"
                  >
                    <RangeSlider
                      label=""
                      min={1}
                      step={settingfromDb.commanView.desktop.viewType == "slider" ? 0.1 : 1}
                      max={4}
                      value={settingfromDb.commanView.tablet.rangeProValue}
                      // onChange={(value) => handleRangeChange(value, max, setter, state)}
                      // onChange={(value) => dispatch({ type: "UPDATE_DEVICE_RANGE", device: "tablet", payload: value })}
                      onChange={(value) =>
                        dispatch({
                          type: "UPDATE_COMMANVIEW",
                          payload: { tablet: { rangeProValue: value } },
                        })
                      }
                      output
                      suffix={
                        <Box maxWidth="80px">
                          <TextField
                            type="integer"
                            value={
                              settingfromDb.commanView.tablet.rangeProValue
                            }
                            // onChange={(value) => handleRangeChange(Number(value), max, setter, state)}
                            // onChange={(value) => dispatch({ type: "UPDATE_DEVICE_RANGE", device: "tablet", payload: value })}
                            onChange={(value) =>
                              dispatch({
                                type: "UPDATE_COMMANVIEW",
                                payload: { tablet: { rangeProValue: value } },
                              })
                            }
                            min={1}
                            max={6}
                            autoComplete="off"
                          />
                        </Box>
                      }
                    />
                  </InlineStack>
                </InlineGrid>

                {developerMode && (
                <TextField
                  label={<Text variant="bodyMd" as="span" tone="critical" fontWeight="bold">Tablet Screen Size</Text>}
                  tone="magic"
                  value={settingfromDb.commanView.tablet.screenSize}
                  onChange={(value) =>
                    dispatch({
                      type: "UPDATE_COMMANVIEW",
                      payload: { tablet : { screenSize: value } },
                    })
                  }
                  autoComplete="off"
                />
              )} 
              </InlineGrid>

              {/* Mobile  */}

              <InlineGrid key={"Mobile"} gap="100">
                <Box
                  position="relative"
                  paddingBlockStart="500"
                  paddingBlockEnd="400"
                  paddingInlineEnd="300"
                >
                  <Divider />
                  <Box
                    style={{
                      top: "9px",
                      position: "absolute",
                      left: "10px",
                      paddingInline: "10px",
                      background: "var(--p-color-bg-surface)",
                    }}
                  >
                    <Text as="p" variant="bodyMd" fontWeight="bold">
                      Mobile
                    </Text>
                  </Box>
                </Box>

                <InlineStack
                  gap="300"
                  align="space-between"
                  blockAlign="center"
                >
                  <Text as="p" variant="bodyMd">
                    View
                  </Text>
                  <Box background="bg-fill-secondary" borderRadius="200">
                    <ButtonGroup variant="segmented">
                      <Button
                        size="slim"
                        variant={
                          settingfromDb.commanView.mobile.viewType === "grid"
                            ? "secondary"
                            : "tertiary"
                        }
                        // onClick={() => handleViewTypeChange('grid', setter, state)}
                        // onClick={() => dispatch({ type: "UPDATE_VIEW_TYPE", device: "mobile", payload: "grid" })}
                        onClick={() =>
                          dispatch({
                            type: "UPDATE_COMMANVIEW",
                            payload: { mobile: { viewType: "grid" } },
                          })
                        }
                      >
                        Grid
                      </Button>
                      <Button
                        size="slim"
                        variant={
                          settingfromDb.commanView.mobile.viewType === "slider"
                            ? "secondary"
                            : "tertiary"
                        }
                        onClick={() =>
                          dispatch({
                            type: "UPDATE_COMMANVIEW",
                            payload: { mobile: { viewType: "slider" } },
                          })
                        }
                        // onClick={() => dispatch({ type: "UPDATE_VIEW_TYPE", device: "mobile", payload: "slider" })}
                      >
                        Slider
                      </Button>
                    </ButtonGroup>
                  </Box>
                </InlineStack>

                <InlineGrid gap="100">
                  <Text as="p" variant="bodyMd">
                    Product per row
                  </Text>
                  <InlineStack
                    gap="100"
                    align="space-between"
                    blockAlign="center"
                  >
                    <RangeSlider
                      label=""
                      min={1}
                      step={settingfromDb.commanView.mobile.viewType == "slider" ? 0.1 : 1}
                      max={3}
                      value={settingfromDb.commanView.mobile.rangeProValue}
                      // onChange={(value) => handleRangeChange(value, max, setter, state)}
                      // onChange={(value) => dispatch({ type: "UPDATE_DEVICE_RANGE", device: "mobile", payload: value })}
                      onChange={(value) =>
                        dispatch({
                          type: "UPDATE_COMMANVIEW",
                          payload: { mobile: { rangeProValue: value } },
                        })
                      }
                      output
                      suffix={
                        <Box maxWidth="80px">
                          <TextField
                            type="integer"
                            value={
                              settingfromDb.commanView.mobile.rangeProValue
                            }
                            // onChange={(value) => handleRangeChange(Number(value), max, setter, state)}
                            // onChange={(value) => dispatch({ type: "UPDATE_DEVICE_RANGE", device: "mobile", payload: value })}
                            onChange={(value) =>
                              dispatch({
                                type: "UPDATE_COMMANVIEW",
                                payload: { mobile: { rangeProValue: value } },
                              })
                            }
                            min={1}
                            max={6}
                            autoComplete="off"
                          />
                        </Box>
                      }
                    />
                  </InlineStack>
                </InlineGrid>

                {developerMode && (
                <TextField
                  label={<Text variant="bodyMd" as="span" tone="critical" fontWeight="bold">Mobile Screen Size</Text>}
                  tone="magic"
                  value={settingfromDb.commanView.mobile.screenSize}
                  onChange={(value) =>
                    dispatch({
                      type: "UPDATE_COMMANVIEW",
                      payload: { mobile : { screenSize: value } },
                    })
                  }
                  autoComplete="off"
                />
              )} 
              </InlineGrid>
            </BlockStack>
          </Box>
        </Collapsible>
      </Box>
      {/* Heading  */}

      <Box
        as="li"
        key={"settings_Heading"}
        borderStyle="solid"
        printHidden={false}
        visuallyHidden={false}
        borderBlockEndWidth="025"
        borderColor="border-secondary"
      >
        <Box
          as="div"
          padding={300}
          onClick={() => {
            handleToggle("Product_Heading");
          }}
          background={
            openSection === "Product_Heading" ? "bg-fill-secondary" : "bg-fill"
          }
        >
          <InlineStack gap="200" align="space-between">
            <InlineStack gap="100" align="space-between" blockAlign="center">
              <Text as="h3" variant="headingSm" fontWeight="bold">
                {" "}
                Widget Heading{" "}
              </Text>
            </InlineStack>
            <InlineGrid alignItems="end">
              <Icon
                source={
                  openSection === "Product_Heading"
                    ? ChevronUpIcon
                    : ChevronDownIcon
                }
                tone="base"
              />
            </InlineGrid>
          </InlineStack>
        </Box>
        <Collapsible
          open={openSection === "Product_Heading"}
          expandOnPrint={true}
          transition={true}
        >
          <Box paddingBlock={400} paddingInline={300} position="relative">
            <BlockStack gap={300}>
              <InlineGrid gap={100}>
                <Text as="p" variant="bodyMd">
                  Font size
                </Text>
                <InlineStack
                  gap={100}
                  align="space-between"
                  blockAlign="center"
                >
                  <RangeSlider
                    label=" "
                    min={0.8}
                    step={0.05}
                    max={3.5}
                    value={Number(settingfromDb.commanView.heading.fontSize)}
                    // onChange={handleHeadingFontSize}
                    onChange={(value: number) =>
                      dispatch({
                        type: "UPDATE_COMMANVIEW",
                        payload: {
                          heading: {
                            fontSize: Math.min(Math.max(value, 0.8), 3.6),
                          },
                        },
                      })
                    }
                    suffix={
                      <p style={{ minWidth: "24px", textAlign: "right" }}>
                        <strong>
                          {Math.floor(
                            settingfromDb.commanView.heading.fontSize * 20,
                          )}
                          px
                        </strong>
                      </p>
                    }
                  />
                </InlineStack>
              </InlineGrid>
              <InlineStack gap="100" align="space-between" blockAlign="center">
                <Text as="p" variant="bodyMd">
                  Color
                </Text>
                <Select
                  options={HeadingColor}
                  value={settingfromDb.commanView.heading.color}
                  // onChange={(value) => dispatch({type: "UPDATE_PRODUCT_PRICE", payload: {color: value}})}
                  onChange={(value: string) =>
                    dispatch({
                      type: "UPDATE_COMMANVIEW",
                      payload: { heading: { color: value } },
                    })
                  }
                />
              </InlineStack>
              <InlineGrid gap="100">
                <Text as="p" variant="bodyMd">
                  Alignment
                </Text>
                <ButtonGroup gap="loose" variant="segmented">
                  <Tooltip content="Text Align Left" dismissOnMouseOut>
                    <Button
                      size="slim"
                      pressed={
                        settingfromDb.commanView.heading.textAlign === "left"
                      }
                      // onClick={() => dispatch({type: "UPDATE_PRODUCT_CARD", payload: {textAlignType: "left"}})}
                      onClick={() =>
                        dispatch({
                          type: "UPDATE_COMMANVIEW",
                          payload: { heading: { textAlign: "left" } },
                        })
                      }
                    >
                      <Icon source={TextAlignLeftIcon} />
                    </Button>
                  </Tooltip>

                  <Tooltip content="Text Align Center" dismissOnMouseOut>
                    <Button
                      size="slim"
                      pressed={
                        settingfromDb.commanView.heading.textAlign === "center"
                      }
                      // onClick={() => dispatch({type: "UPDATE_PRODUCT_CARD", payload: {textAlignType: "center"}})}
                      onClick={() =>
                        dispatch({
                          type: "UPDATE_COMMANVIEW",
                          payload: { heading: { textAlign: "center" } },
                        })
                      }
                    >
                      <Icon source={TextAlignCenterIcon} />
                    </Button>
                  </Tooltip>

                  <Tooltip content="Text Align Right" dismissOnMouseOut>
                    <Button
                      size="slim"
                      pressed={
                        settingfromDb.commanView.heading.textAlign === "right"
                      }
                      // onClick={() =>  dispatch({type: "UPDATE_PRODUCT_CARD", payload: {textAlignType: "right"}})}
                      onClick={() =>
                        dispatch({
                          type: "UPDATE_COMMANVIEW",
                          payload: { heading: { textAlign: "right" } },
                        })
                      }
                    >
                      <Icon source={TextAlignRightIcon} />
                    </Button>
                  </Tooltip>
                </ButtonGroup>
              </InlineGrid>

              {developerMode && (
                <TextField
                  label={<Text variant="bodyMd" as="span" tone="critical" fontWeight="bold">Heading customClass</Text>}
                  tone="magic"
                  value={settingfromDb.commanView.heading.customClass}
                  onChange={(value) =>
                    dispatch({
                      type: "UPDATE_COMMANVIEW",
                      payload: { heading: { customClass: value } },
                    })
                  }
                  autoComplete="off"
                />
              )}
            </BlockStack>
          </Box>
        </Collapsible>
      </Box>

      {/* SubHeading  */}

      <Box
        as="li"
        key={"settings_subHeading"}
        borderStyle="solid"
        printHidden={false}
        visuallyHidden={false}
        borderBlockEndWidth="025"
        borderColor="border-secondary"
      >
        <Box
          as="div"
          padding={300}
          onClick={() => {
            handleToggle("Product_SubHeading");
          }}
          background={
            openSection === "Product_SubHeading"
              ? "bg-fill-secondary"
              : "bg-fill"
          }
        >
          <InlineStack gap="200" align="space-between">
            <InlineStack gap="100" align="space-between" blockAlign="center">
              <Text as="h3" variant="headingSm" fontWeight="bold">
                {" "}
                Widget SubHeading{" "}
              </Text>
            </InlineStack>
            <InlineGrid alignItems="end">
              <Icon
                source={
                  openSection === "Product_SubHeading"
                    ? ChevronUpIcon
                    : ChevronDownIcon
                }
                tone="base"
              />
            </InlineGrid>
          </InlineStack>
        </Box>
        <Collapsible
          open={openSection === "Product_SubHeading"}
          expandOnPrint={true}
          transition={true}
        >
          <Box paddingBlock={400} paddingInline={300} position="relative">
            <BlockStack gap={300}>
              <InlineGrid gap={100}>
                <Text as="p" variant="bodyMd">
                  Font size
                </Text>
                <InlineStack
                  gap={100}
                  align="space-between"
                  blockAlign="center"
                >
                  <RangeSlider
                    label=" "
                    min={1}
                    step={0.05}
                    max={3}
                    value={Number(settingfromDb.commanView.subHeading.fontSize)}
                    // onChange={handleHeadingFontSize}
                    onChange={(value: number) =>
                      dispatch({
                        type: "UPDATE_COMMANVIEW",
                        payload: {
                          subHeading: {
                            fontSize: Math.min(Math.max(value, 1), 3),
                          },
                        },
                      })
                    }
                    suffix={
                      <p style={{ minWidth: "24px", textAlign: "right" }}>
                        <strong>
                          {Math.floor(
                            settingfromDb.commanView.subHeading.fontSize * 10,
                          )}
                          px
                        </strong>
                      </p>
                    }
                  />
                </InlineStack>
              </InlineGrid>
              <InlineStack gap="100" align="space-between" blockAlign="center">
                <Text as="p" variant="bodyMd">
                  Color
                </Text>
                <Select
                  options={HeadingColor}
                  value={settingfromDb.commanView.subHeading.color}
                  // onChange={(value) => dispatch({type: "UPDATE_PRODUCT_PRICE", payload: {color: value}})}
                  onChange={(value: string) =>
                    dispatch({
                      type: "UPDATE_COMMANVIEW",
                      payload: { subHeading: { color: value } },
                    })
                  }
                />
              </InlineStack>
              <InlineGrid gap="100">
                <Text as="p" variant="bodyMd">
                  Alignment
                </Text>
                <ButtonGroup gap="loose" variant="segmented">
                  <Tooltip content="Text Align Left" dismissOnMouseOut>
                    <Button
                      size="slim"
                      pressed={
                        settingfromDb.commanView.subHeading.textAlign === "left"
                      }
                      // onClick={() => dispatch({type: "UPDATE_PRODUCT_CARD", payload: {textAlignType: "left"}})}
                      onClick={() =>
                        dispatch({
                          type: "UPDATE_COMMANVIEW",
                          payload: { subHeading: { textAlign: "left" } },
                        })
                      }
                    >
                      <Icon source={TextAlignLeftIcon} />
                    </Button>
                  </Tooltip>

                  <Tooltip content="Text Align Center" dismissOnMouseOut>
                    <Button
                      size="slim"
                      pressed={
                        settingfromDb.commanView.subHeading.textAlign ===
                        "center"
                      }
                      // onClick={() => dispatch({type: "UPDATE_PRODUCT_CARD", payload: {textAlignType: "center"}})}
                      onClick={() =>
                        dispatch({
                          type: "UPDATE_COMMANVIEW",
                          payload: { subHeading: { textAlign: "center" } },
                        })
                      }
                    >
                      <Icon source={TextAlignCenterIcon} />
                    </Button>
                  </Tooltip>

                  <Tooltip content="Text Align Right" dismissOnMouseOut>
                    <Button
                      size="slim"
                      pressed={
                        settingfromDb.commanView.subHeading.textAlign ===
                        "right"
                      }
                      // onClick={() =>  dispatch({type: "UPDATE_PRODUCT_CARD", payload: {textAlignType: "right"}})}
                      onClick={() =>
                        dispatch({
                          type: "UPDATE_COMMANVIEW",
                          payload: { subHeading: { textAlign: "right" } },
                        })
                      }
                    >
                      <Icon source={TextAlignRightIcon} />
                    </Button>
                  </Tooltip>
                </ButtonGroup>
              </InlineGrid>
            
              {developerMode && (
                <TextField
                tone="magic"
                  label={<Text variant="bodyMd" as="span" tone="critical" fontWeight="bold">SubHeading custom Class</Text>}
                  value={settingfromDb.commanView.subHeading.customClass}
                  onChange={(value) =>
                    dispatch({
                      type: "UPDATE_COMMANVIEW",
                      payload: { subHeading: { customClass: value } },
                    })
                  }
                  autoComplete="off"
                />
              )} 
            </BlockStack>
          </Box>
        </Collapsible>
      </Box>
    </Box>
  );
}
