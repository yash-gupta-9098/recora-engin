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
import { useCallback, useState, useEffect, useMemo } from "react";
import { Icon } from "@shopify/polaris";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'app/redux/store/store';
import { updateNestedField, updateSection } from 'app/redux/slices/globalSettingsSlice';
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
}

export default function TabsLayout({
  settingfromDb,
  developerMode,
}: Props) {
  // Redux hooks
  const ReduxDispatch = useDispatch();
  const ReduxColorScheme = useSelector((state: RootState) => state.globalSettings.colorScheme);
  const ReduxCommanView = useSelector((state: RootState) => state.globalSettings.commanView);

  useEffect(() => {
    console.log("TabsLayout - Redux state updated")
  }, [ReduxColorScheme, ReduxCommanView]);
  // const [selectedColorSchemes, setSelectedColorSchemes] = useState<any>(
  //   settingfromDb.colorScheme,
  // );
  const HeadingColor = useMemo(() => [
    { label: "Scheme 1", value: ReduxColorScheme["Scheme 1"]?.text || settingfromDb.colorScheme["Scheme 1"].text },
    { label: "Scheme 2", value: ReduxColorScheme["Scheme 2"]?.text || settingfromDb.colorScheme["Scheme 2"].text },
  ], [ReduxColorScheme, settingfromDb.colorScheme]);

  const SubHeadingColor = useMemo(() => [
    { label: "Scheme 1", value: ReduxColorScheme["Scheme 1"]?.text || settingfromDb.colorScheme["Scheme 1"].text },
    { label: "Scheme 2", value: ReduxColorScheme["Scheme 2"]?.text || settingfromDb.colorScheme["Scheme 2"].text },
  ], [ReduxColorScheme, settingfromDb.colorScheme]);

  // Common view state
  // const [layoutValue, setLayoutValue] = useState(ReduxCommanView.layoutValue);
  // const [totalProduct, setTotalProduct] = useState(ReduxCommanView.totalProduct);
  const [popoverActive, setPopoverActive] = useState(false);

  // Device-specific states
  // const [desktopSettings, setDesktopSettings] = useState(ReduxCommanView.desktop);
  // const [tabletSettings, setTabletSettings] = useState(ReduxCommanView.tablet);
  // const [mobileSettings, setMobileSettings] = useState(ReduxCommanView.mobile);

  const desktopSettings = ReduxCommanView.desktop;
  const tabletSettings = ReduxCommanView.tablet;
  const mobileSettings = ReduxCommanView.mobile;

  // console.log(desktopSettings , "desktopSettings new")

  // Handlers
  const togglePopoverActive = useCallback(() => {
    setPopoverActive((active) => !active);
  }, []);

  const handleTotalProductRange = useCallback((value: number) => {
    // dispatch({ type: "UPDATE_TOTAL_PRODUCT", payload: (value > 20 ? 20 : value < 1 ? 1 : value) })
    // dispatch({ type: "UPDATE_TOTAL_PRODUCT", payload: (value > 20 ? 20 : value < 1 ? 1 : value) })
    ReduxDispatch(updateSection({
      section: 'commanView',
      payload: { totalProduct: value > 20 ? 20 : value < 1 ? 1 : value },
    }));
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



  const handleNestedChange = (path: string[], value: any) => {
    ReduxDispatch(updateNestedField({ path, value }));
  };

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
                        ReduxDispatch(updateNestedField({
                          path: ['commanView', 'desktop', 'viewType'],
                          value: "grid"
                        }))
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
                        ReduxDispatch(updateNestedField({
                          path: ['commanView', 'desktop', 'viewType'],
                          value: "slider"
                        }))
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
                      {ReduxCommanView.layoutValue}
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
                            ReduxCommanView.layoutValue == "Layout 1",
                          onAction: () =>
                            ReduxDispatch(updateSection({
                              section: 'commanView',
                              payload: { layoutValue: "Layout 1" },
                            })),
                        },
                        {
                          content: "Layout 2",
                          active:
                            ReduxCommanView.layoutValue == "Layout 2",
                          onAction: () =>
                            ReduxDispatch(updateSection({
                              section: 'commanView',
                              payload: { layoutValue: "Layout 2" },
                            })),
                        },
                        {
                          content: "Layout 3",
                          active:
                            ReduxCommanView.layoutValue == "Layout 3",
                          onAction: () =>
                            ReduxDispatch(updateSection({
                              section: 'commanView',
                              payload: { layoutValue: "Layout 3" },
                            })),
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
                    value={ReduxCommanView.totalProduct}
                    onChange={handleTotalProductRange}
                    output
                    suffix={
                      <Box maxWidth="80px">
                        <TextField
                          autoSize
                          type="number"
                          value={ReduxCommanView.totalProduct}
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
                  value={ReduxCommanView.customClass}
                  onChange={(value: string) =>
                    ReduxDispatch(updateSection({
                      section: 'commanView',
                      payload: { customClass: value },
                    }))
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
                      step={ReduxCommanView.desktop.viewType == "slider" ? 0.1 : 1}
                      max={6}
                      value={ReduxCommanView.desktop.rangeProValue}
                      // onChange={(value) => handleRangeChange(value, max, setter, state)}
                      // onChange={(value) => dispatch({ type: "UPDATE_DEVICE_RANGE", device: "desktop", payload: value })}
                      onChange={(value) =>
                        ReduxDispatch(updateNestedField({
                          path: ['commanView', 'desktop', 'rangeProValue'],
                          value: value
                        }))
                      }
                      output
                      suffix={
                        <Box maxWidth="80px">
                          <TextField
                            type="integer"
                            value={
                              ReduxCommanView.desktop.rangeProValue
                            }
                            // onChange={(value) => handleRangeChange(Number(value), max, setter, state)}
                            // onChange={(value) => dispatch({ type: "UPDATE_DEVICE_RANGE", device: "dektop", payload: value })}
                            onChange={(value) =>
                              ReduxDispatch(updateSection({
                                section: 'commanView',
                                payload: { desktop: { rangeProValue: value } },
                              }))
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
                    value={ReduxCommanView.desktop.screenSize}
                    onChange={(value) =>
                      ReduxDispatch(updateNestedField({
                        path: ['commanView', 'desktop', 'screenSize'],
                        value: value
                      }))
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
                          ReduxCommanView.tablet.viewType === "grid"
                            ? "secondary"
                            : "tertiary"
                        }
                        // onClick={() => handleViewTypeChange('grid', setter, state)}
                        // onClick={() => dispatch({ type: "UPDATE_VIEW_TYPE", device: "tablet", payload: "grid" })}
                        onClick={() =>
                          ReduxDispatch(updateNestedField({
                            path: ['commanView', 'tablet', 'viewType'],
                            value: "grid"
                          }))
                        }
                      >
                        Grid
                      </Button>
                      <Button
                        size="slim"
                        variant={
                          ReduxCommanView.tablet.viewType === "slider"
                            ? "secondary"
                            : "tertiary"
                        }
                        // onClick={() => dispatch({ type: "UPDATE_VIEW_TYPE", device: "tablet", payload: "slider" })}
                        onClick={() =>
                          ReduxDispatch(updateNestedField({
                            path: ['commanView', 'tablet', 'viewType'],
                            value: "slider"
                          }))
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
                      step={ReduxCommanView.desktop.viewType == "slider" ? 0.1 : 1}
                      max={4}
                      value={ReduxCommanView.tablet.rangeProValue}
                      // onChange={(value) => handleRangeChange(value, max, setter, state)}
                      // onChange={(value) => dispatch({ type: "UPDATE_DEVICE_RANGE", device: "tablet", payload: value })}
                      onChange={(value) =>
                        ReduxDispatch(updateNestedField({
                          path: ['commanView', 'tablet', 'rangeProValue'],
                          value: value
                        }))
                      }
                      output
                      suffix={
                        <Box maxWidth="80px">
                          <TextField
                            type="integer"
                            value={
                              ReduxCommanView.tablet.rangeProValue
                            }
                            // onChange={(value) => handleRangeChange(Number(value), max, setter, state)}
                            // onChange={(value) => dispatch({ type: "UPDATE_DEVICE_RANGE", device: "tablet", payload: value })}
                            onChange={(value) =>
                              ReduxDispatch(updateSection({
                                section: 'commanView',
                                payload: { tablet: { rangeProValue: value } },
                              }))
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
                    value={ReduxCommanView.tablet.screenSize}
                    onChange={(value) =>
                      ReduxDispatch(updateSection({
                        section: 'commanView',
                        payload: { tablet: { screenSize: value } },
                      }))
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
                          ReduxCommanView.mobile.viewType === "grid"
                            ? "secondary"
                            : "tertiary"
                        }
                        // onClick={() => handleViewTypeChange('grid', setter, state)}
                        // onClick={() => dispatch({ type: "UPDATE_VIEW_TYPE", device: "mobile", payload: "grid" })}
                        onClick={() =>
                          ReduxDispatch(updateNestedField({
                            path: ['commanView', 'mobile', 'viewType'],
                            value: "grid"
                          }))
                        }
                      >
                        Grid
                      </Button>
                      <Button
                        size="slim"
                        variant={
                          ReduxCommanView.mobile.viewType === "slider"
                            ? "secondary"
                            : "tertiary"
                        }
                        onClick={() =>
                          ReduxDispatch(updateNestedField({
                            path: ['commanView', 'mobile', 'viewType'],
                            value: "slider"
                          }))
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
                      step={ReduxCommanView.mobile.viewType == "slider" ? 0.1 : 1}
                      max={3}
                      value={ReduxCommanView.mobile.rangeProValue}
                      // onChange={(value) => handleRangeChange(value, max, setter, state)}
                      // onChange={(value) => dispatch({ type: "UPDATE_DEVICE_RANGE", device: "mobile", payload: value })}
                      onChange={(value) =>
                        ReduxDispatch(updateNestedField({
                          path: ['commanView', 'mobile', 'rangeProValue'],
                          value: value
                        }))
                      }
                      output
                      suffix={
                        <Box maxWidth="80px">
                          <TextField
                            type="integer"
                            value={
                              ReduxCommanView.mobile.rangeProValue
                            }
                            // onChange={(value) => handleRangeChange(Number(value), max, setter, state)}
                            // onChange={(value) => dispatch({ type: "UPDATE_DEVICE_RANGE", device: "mobile", payload: value })}
                            onChange={(value) =>
                              ReduxDispatch(updateSection({
                                section: 'commanView',
                                payload: { mobile: { rangeProValue: value } },
                              }))
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
                    value={ReduxCommanView.mobile.screenSize}
                    onChange={(value) =>
                      ReduxDispatch(updateSection({
                        section: 'commanView',
                        payload: { mobile: { screenSize: value } },
                      }))
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
                    value={Number(ReduxCommanView.heading.fontSize)}
                    // onChange={handleHeadingFontSize}
                    onChange={(value: number) =>
                      ReduxDispatch(updateNestedField({
                        path: ['commanView', 'heading', 'fontSize'],
                        value: value
                      }))
                    }
                    suffix={
                      <p style={{ minWidth: "24px", textAlign: "right" }}>
                        <strong>
                          {Math.floor(
                            ReduxCommanView.heading.fontSize * 20,
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
                  value={ReduxCommanView.heading.color}
                  // onChange={(value) => dispatch({type: "UPDATE_PRODUCT_PRICE", payload: {color: value}})}
                  onChange={(value: string) =>
                    ReduxDispatch(updateNestedField({
                      path: ['commanView', 'heading', 'color'],
                      value: value
                    }))
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
                        ReduxCommanView.heading.textAlign === "left"
                      }
                      // onClick={() => dispatch({type: "UPDATE_PRODUCT_CARD", payload: {textAlignType: "left"}})}
                      onClick={() =>
                        ReduxDispatch(updateNestedField({
                          path: ['commanView', 'heading', 'textAlign'],
                          value: "left"
                        }))
                      }
                    >
                      <Icon source={TextAlignLeftIcon} />
                    </Button>
                  </Tooltip>

                  <Tooltip content="Text Align Center" dismissOnMouseOut>
                    <Button
                      size="slim"
                      pressed={
                        ReduxCommanView.heading.textAlign === "center"
                      }
                      // onClick={() => dispatch({type: "UPDATE_PRODUCT_CARD", payload: {textAlignType: "center"}})}
                      onClick={() =>
                        ReduxDispatch(updateNestedField({
                          path: ['commanView', 'heading', 'textAlign'],
                          value: "center"
                        }))
                      }
                    >
                      <Icon source={TextAlignCenterIcon} />
                    </Button>
                  </Tooltip>

                  <Tooltip content="Text Align Right" dismissOnMouseOut>
                    <Button
                      size="slim"
                      pressed={
                        ReduxCommanView.heading.textAlign === "right"
                      }
                      // onClick={() =>  dispatch({type: "UPDATE_PRODUCT_CARD", payload: {textAlignType: "right"}})}
                      onClick={() =>
                        ReduxDispatch(updateNestedField({
                          path: ['commanView', 'heading', 'textAlign'],
                          value: "right"
                        }))
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
                  value={ReduxCommanView.heading.customClass}
                  onChange={(value) =>
                    ReduxDispatch(updateNestedField({
                      path: ['commanView', 'heading', 'customClass'],
                      value: value
                    }))
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
                    value={Number(ReduxCommanView.subHeading.fontSize)}
                    // onChange={handleHeadingFontSize}
                    onChange={(value: number) =>
                      ReduxDispatch(updateNestedField({
                        path: ['commanView', 'subHeading', 'fontSize'],
                        value: value
                      }))
                    }
                    suffix={
                      <p style={{ minWidth: "24px", textAlign: "right" }}>
                        <strong>
                          {Math.floor(
                            ReduxCommanView.subHeading.fontSize * 10,
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
                  value={ReduxCommanView.subHeading.color}
                  // onChange={(value) => dispatch({type: "UPDATE_PRODUCT_PRICE", payload: {color: value}})}
                  onChange={(value: string) =>
                    ReduxDispatch(updateNestedField({
                      path: ['commanView', 'subHeading', 'color'],
                      value: value
                    }))
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
                        ReduxCommanView.subHeading.textAlign === "left"
                      }
                      // onClick={() => dispatch({type: "UPDATE_PRODUCT_CARD", payload: {textAlignType: "left"}})}
                      onClick={() =>
                        ReduxDispatch(updateNestedField({
                          path: ['commanView', 'subHeading', 'textAlign'],
                          value: "left"
                        }))
                      }
                    >
                      <Icon source={TextAlignLeftIcon} />
                    </Button>
                  </Tooltip>

                  <Tooltip content="Text Align Center" dismissOnMouseOut>
                    <Button
                      size="slim"
                      pressed={
                        ReduxCommanView.subHeading.textAlign === "center"
                      }
                      // onClick={() => dispatch({type: "UPDATE_PRODUCT_CARD", payload: {textAlignType: "center"}})}
                      onClick={() =>
                        ReduxDispatch(updateNestedField({
                          path: ['commanView', 'subHeading', 'textAlign'],
                          value: "center"
                        }))
                      }
                    >
                      <Icon source={TextAlignCenterIcon} />
                    </Button>
                  </Tooltip>

                  <Tooltip content="Text Align Right" dismissOnMouseOut>
                    <Button
                      size="slim"
                      pressed={
                        ReduxCommanView.subHeading.textAlign === "right"
                      }
                      // onClick={() =>  dispatch({type: "UPDATE_PRODUCT_CARD", payload: {textAlignType: "right"}})}
                      onClick={() =>
                        ReduxDispatch(updateNestedField({
                          path: ['commanView', 'subHeading', 'textAlign'],
                          value: "right"
                        }))
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
                  value={ReduxCommanView.subHeading.customClass}
                  onChange={(value) =>
                    ReduxDispatch(updateNestedField({
                      path: ['commanView', 'subHeading', 'customClass'],
                      value: value
                    }))
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
