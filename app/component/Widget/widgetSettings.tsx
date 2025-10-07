import React from "react";
import { ActionList, BlockStack, Box, Button, ButtonGroup, Card, Divider, Icon, InlineGrid, InlineStack, Popover, RangeSlider, Text, TextField, Tooltip } from "@shopify/polaris";
import { useCallback, useState, useEffect } from "react";
import { DeleteIcon, ExternalIcon, LayoutBuyButtonHorizontalIcon, LayoutBuyButtonVerticalIcon, LayoutPopupIcon, PlusIcon, XIcon } from '@shopify/polaris-icons';
interface WidgetSettingsProps {
  setShowSlidekick: (show: boolean) => void;
  widgetName?: string;
  widgetsSettings: {
    heading:string,
    subHeading:string,
    viewType: string;
    layoutValue: string;
    viewCardDesign: string;
    totalProduct: number;
    rangeDeskProValue: number;
    rangeTbtProValue: number;
    rangeMbProValue: number;
  };
  widgetKey?: string;
  dispatch?: React.Dispatch<any>;
//   onSettingsChange?: (settings: any) => void;
}

export default function WidgetSettings({ setShowSlidekick, widgetName = "Widget", widgetsSettings , widgetKey , dispatch }: WidgetSettingsProps) {

    console.log(widgetsSettings , "widgetSettings")

    // Ensure we have valid settings with proper fallbacks
    // const getValidSettings = () => {
    //     if (!widgetsSettings) return {
    //         viewType: "grid",
    //         layoutValue: "Layout_1",
    //         viewCardDesign: "vertical",
    //         totalProduct: 10,
    //         rangeDeskProValue: 4,
    //         rangeTbtProValue: 3,
    //         rangeMbProValue: 2,
    //         heading: widgetName
    //     };
        
    //     return {
    //         viewType: widgetsSettings.viewType || "grid",
    //         layoutValue: widgetsSettings.layoutValue || "Layout_1",
    //         viewCardDesign: widgetsSettings.viewCardDesign || "vertical",
    //         totalProduct: typeof widgetsSettings.totalProduct === 'number' ? widgetsSettings.totalProduct : 10,
    //         rangeDeskProValue: typeof widgetsSettings.rangeDeskProValue === 'number' ? widgetsSettings.rangeDeskProValue : 4,
    //         rangeTbtProValue: typeof widgetsSettings.rangeTbtProValue === 'number' ? widgetsSettings.rangeTbtProValue : 3,
    //         rangeMbProValue: typeof widgetsSettings.rangeMbProValue === 'number' ? widgetsSettings.rangeMbProValue : 2,
    //         heading: widgetsSettings.heading || widgetName
    //     };
    // };

    // const settings = getValidSettings();

    // view 
    // const [viewType, setViewType] = useState(settings.viewType);
    
    // Update state when widgetSettings prop changes
    // useEffect(() => {
    //     const newSettings = getValidSettings();
    //     setViewType(newSettings.viewType);
    //     setLayoutValue(newSettings.layoutValue);
    //     setViewCardDesign(newSettings.viewCardDesign);
    //     setTotalProduct(newSettings.totalProduct);
    //     setRrangeDeskProValue(newSettings.rangeDeskProValue);
    //     setRrangeTbtProValue(newSettings.rangeTbtProValue);
    //     setRrangeMbProValue(newSettings.rangeMbProValue);
    //     setHeading(newSettings.heading);
    // }, [initialSettings, widgetName]);

    // // layout
    // const [layoutValue, setLayoutValue] = useState(settings.layoutValue);
    const [popoverActive, setPopoverActive] = useState(false);

    // // card design
    // const [viewCardDesign, setViewCardDesign] = useState(settings.viewCardDesign);

    // // maximum product
    // const [totalProduct, setTotalProduct] = useState(settings.totalProduct);

    // // product Per Screen  
    // const [rangeDeskProValue, setRrangeDeskProValue] = useState(settings.rangeDeskProValue);
    // const [rangeTbtProValue, setRrangeTbtProValue] = useState(settings.rangeTbtProValue);
    // const [rangeMbProValue, setRrangeMbProValue] = useState(settings.rangeMbProValue);

    // // heading
    // const [heading, setHeading] = useState(settings.heading);


    const updateWidgetSetting = (key: keyof typeof widgetsSettings, value: any) => {

       
        // console.log( , "widgetKey" )
  if (!widgetKey || !dispatch) {
    console.log("Hello")
    return  
  };



dispatch({
  type: "UPDATE_SINGLE_WIDGET_SETTING",
  payload: {
    widgetId: widgetKey, // jaise "New Arrivals"
    settings: {
      widgetsSettings: {
        ...widgetsSettings,
        [key]: value
      }
    }
  }
});
    

 
};


    // Function to notify parent of settings changes
    // const notifySettingsChange = useCallback(() => {
    //     if (onSettingsChange) {
    //         onSettingsChange({
    //             viewType,
    //             layoutValue,
    //             viewCardDesign,
    //             totalProduct,
    //             rangeDeskProValue,
    //             rangeTbtProValue,
    //             rangeMbProValue,
    //             heading
    //         });
    //     }
    // }, [viewType, layoutValue, viewCardDesign, totalProduct, rangeDeskProValue, rangeTbtProValue, rangeMbProValue, heading, onSettingsChange]);

    // Simple handlers for state updates
    // const handleViewType = (value: string) => {
    //     setViewType(value);
        
    // };

    // const handleLayoutValue = (value: string) => {
    //     setLayoutValue(value);
        
    // };

    // const handleViewCardDesign = (value: string) => {
    //     setViewCardDesign(value);
        
    // };

    // const handleTotalProductRange = (value: number) => {
    //     setTotalProduct(value);
        
    // };

    // const handleDeskProRange = (value: number) => {
    //     setRrangeDeskProValue(value);
        
    // };

    // const handleTbtProRange = (value: number) => {
    //     setRrangeTbtProValue(value);
        
    // };

    // const handleMbProRange = (value: number) => {
    //     setRrangeMbProValue(value);
        
    // };

    // const handleHeadingChange = (value: string) => {
    //     setHeading(value);
        
    // };

    const togglePopoverActive = () => setPopoverActive((prev) => !prev);



    return (
        <Card>
            <BlockStack gap={"500"}>
                <Box as="div" position="absolute" insetInlineEnd="300"><Button icon={XIcon} onClick={() => setShowSlidekick(false)}></Button></Box>
                <Text as="h2" variant="headingMd" fontWeight="bold">{widgetName} Settings</Text>
                <Divider borderColor="border" />
                <BlockStack gap={"300"}>

                    {/* Widget Heading */}
                    
                        
                     <TextField
                            label={<Text as="p" variant="bodyMd" fontWeight="bold">Widget Heading:</Text>}
                            value={widgetsSettings?.heading}
                            onChange={(value) => updateWidgetSetting("heading", value) }
                            placeholder={widgetsSettings?.heading}
                            autoComplete="off"
                            size="slim"
                        /> 
                    {/* subHeading */}
                    <TextField
                            label={<Text as="p" variant="bodyMd" fontWeight="bold">Widget subHeading:</Text>}
                            value={widgetsSettings?.subHeading}
                            onChange={(value) => updateWidgetSetting("subHeading", value) }
                            placeholder={widgetsSettings?.subHeading}
                            autoComplete="off"
                            size="slim"
                        /> 

                    {/* view  */}
                    <InlineStack gap={"100"} align="space-between" blockAlign="center">
                        <Text as="p" variant="bodyMd" fontWeight="bold">View:</Text>
                        <Box background="bg-fill-secondary" borderRadius="200">
                            <ButtonGroup variant="segmented" >
                                <Button size="slim" variant={widgetsSettings?.viewType === "grid" ? "secondary" : "tertiary"} onClick={() => updateWidgetSetting("viewType", "grid")}>Grid</Button>
                                <Button size="slim" variant={widgetsSettings?.viewType === "slider" ? "secondary" : "tertiary"} onClick={() => updateWidgetSetting("viewType", "slider")}>Slider</Button>
                            </ButtonGroup>
                        </Box>
                    </InlineStack>



                    {/* Template */}
                    <InlineStack align="space-between" blockAlign="center">
                        <Text as="p" variant="bodyMd" fontWeight="bold">Template:</Text>
                        <Popover
                            active={popoverActive}
                            activator={<Button variant="secondary" disclosure="select" icon={LayoutPopupIcon} onClick={togglePopoverActive}>
                                {widgetsSettings?.layoutValue}
                            </Button>}
                            autofocusTarget="none"
                            onClose={togglePopoverActive}
                        >
                            <Popover.Pane fixed>
                                <Popover.Section>
                                    <p>Select Template</p>
                                </Popover.Section>
                            </Popover.Pane>
                            <Popover.Pane>
                                <ActionList
                                    actionRole="menuitem"
                                    items={[
                                        { content: 'Layout 1', active:
                            widgetsSettings?.layoutValue == "Layout_1", onAction: () => updateWidgetSetting("layoutValue", "Layout_1")   },
                                        { content: 'Layout 2', active:
                            widgetsSettings?.layoutValue == "Layout_2", onAction: () => updateWidgetSetting("layoutValue", "Layout_2")  },
                                        { content: 'Layout 3', active:
                            widgetsSettings?.layoutValue == "Layout_3", onAction: () => updateWidgetSetting("layoutValue", "Layout_3")  },
                                    ]}

                                />
                            </Popover.Pane>
                        </Popover>
                    </InlineStack>

                    {/*  Card-design  */}
                     <InlineStack gap={"100"} align="space-between" blockAlign="center">
                        <Text as="p" variant="bodyMd" fontWeight="bold">Card Design:</Text>
                        <Box background="bg-fill-secondary" borderRadius="200">
                            <ButtonGroup variant="segmented" >
                                <Tooltip content="Vertical Card" dismissOnMouseOut>
                                    <Button size="slim" variant={widgetsSettings?.viewCardDesign === "vertical" ? "secondary" : "tertiary"} onClick={() => updateWidgetSetting("viewCardDesign", "vertical")} icon={LayoutBuyButtonVerticalIcon}> </Button>
                                </Tooltip>
                                <Tooltip content="Horizontal Card" dismissOnMouseOut>
                                    <Button size="slim" variant={widgetsSettings?.viewCardDesign === "horizontal" ? "secondary" : "tertiary"} onClick={() => updateWidgetSetting("viewCardDesign", "horizontal")} icon={LayoutBuyButtonHorizontalIcon}> </Button>
                                </Tooltip>
                            </ButtonGroup>
                        </Box>
                    </InlineStack> 


                    {/* max-Product */}
                    <InlineGrid gap={"100"}>
                        <Text as="p" variant="bodyMd" fontWeight="bold">Maximum products to show:</Text>
                        <InlineStack gap={"100"} align="space-between" blockAlign="center">
                            <RangeSlider
                                label=" "
                                min={1}
                                step={1}
                                max={20}
                                value={Number(widgetsSettings?.totalProduct)}
                                onChange={(value) => updateWidgetSetting("totalProduct", (Number(value)))}
                                suffix={<TextField labelHidden={true} autoSize={true} type="number" name="Maximum Products to show" value={widgetsSettings?.totalProduct} onChange={(value) => updateWidgetSetting("totalProduct", (Number(value)))} min={1} max={20} autoComplete="off" size='slim' label />}
                                output={true}
                            />
                        </InlineStack>
                    </InlineGrid> 

                    {/* Product Per Screen  */}
                    {/* Desktop */}
                    <InlineGrid gap={"100"}>
                        <Box position='relative' paddingBlockStart={"500"} paddingBlockEnd={"200"} paddingInlineEnd={"300"} >
                            <Divider borderColor="border"></Divider>
                            <Box position="absolute" background="bg-surface" paddingInlineEnd={"100"} insetInlineStart={"0"} insetBlockStart={"200"} >
                                <Text as="p" variant='bodyMd' fontWeight="bold">Desktop</Text>
                            </Box>
                        </Box>

                        <Text as="p" variant="bodyMd" >Product per row</Text>
                        <InlineStack gap={"100"} align="space-between" blockAlign="center">
                            <RangeSlider
                                label=""
                                min={1}
                                step={0.1}
                                max={10}
                                value={Number(widgetsSettings?.rangeDeskProValue)}
                                onChange={(value) => updateWidgetSetting("rangeDeskProValue", (Number(value)))}
                                suffix={<TextField type="number" value={widgetsSettings?.rangeDeskProValue} onChange={(value) => updateWidgetSetting("rangeDeskProValue", (Number(value)))} min={1} max={10} maxLength={2} autoComplete="off" labelHidden={true} label />}
                                output={true}
                            />

                        </InlineStack>
                    </InlineGrid>

                    {/* Tablet Per Row  */}
                    <InlineGrid gap={"100"}>
                        <Box position='relative' paddingBlockStart={"500"} paddingBlockEnd={"200"} paddingInlineEnd={"300"} >
                            <Divider></Divider>
                            <Box position="absolute" background="bg-surface" paddingInlineEnd={"100"} insetInlineStart={"0"} insetBlockStart={"200"} >
                                <Text as="p" variant='bodyMd' fontWeight="bold">Tablet Layout</Text>
                            </Box>
                        </Box>                        
                        <InlineGrid gap={"100"}>
                            <Text as="p" variant="bodyMd" >Product per row</Text>
                            <InlineStack gap={"100"} align="space-between" blockAlign="center">
                                <RangeSlider
                                    label=""
                                    min={1}
                                    step={0.1}
                                    max={4}
                                    value={widgetsSettings?.rangeTbtProValue}
                                    onChange={(value) => updateWidgetSetting("rangeTbtProValue", (Number(value)))}
                                    suffix={<TextField label labelHidden={true} type="number" value={String(widgetsSettings?.rangeTbtProValue)} onChange={(value) => updateWidgetSetting("rangeTbtProValue", (Number(value)))} min={1} max={4} autoComplete="off" />}
                                    output={true}
                                />

                            </InlineStack>
                        </InlineGrid>
                    </InlineGrid>

                    {/* Mobile Per Row  */}
                    <InlineGrid gap={"100"}>
                        <Box position='relative' paddingBlockStart={"500"} paddingBlockEnd={"200"} paddingInlineEnd={"300"} >
                            <Divider></Divider>
                            <Box position="absolute" background="bg-surface" paddingInlineEnd={"100"} insetInlineStart={"0"} insetBlockStart={"200"} >
                                <Text as="p" variant='bodyMd' fontWeight="bold">Mobile Layout</Text>
                            </Box>
                        </Box>

                        <InlineGrid gap={"100"}>
                            <Text as="p" variant="bodyMd" >Product per row</Text>
                            <InlineStack gap={"100"} align="space-between" blockAlign="center">
                                <RangeSlider
                                    label=""
                                    min={1}
                                    step={0.1}
                                    max={3}
                                    value={Number(widgetsSettings?.rangeMbProValue)}
                                    onChange={(value) => updateWidgetSetting("rangeMbProValue", (Number(value)))}
                                    suffix={<TextField type="number" value={widgetsSettings?.rangeMbProValue} onChange={(value) => updateWidgetSetting("rangeMbProValue", (Number(value)))} min={1} step={0.1} max={4} autoComplete="off" />}
                                    output={true}
                                />

                            </InlineStack>
                        </InlineGrid>
                    </InlineGrid> 



                </BlockStack>
            </BlockStack>
        </Card>
    );
}