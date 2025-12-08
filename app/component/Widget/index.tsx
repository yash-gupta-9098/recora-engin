import React, { useEffect } from "react";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  ActionList,
  Badge,
  Banner,
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
  Modal,
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
  ArrowRightIcon,
  CaretDownIcon,
  ChevronDownIcon,
  ExternalIcon,
  MenuHorizontalIcon,
  OrderIcon,
  PersonalizedTextIcon,
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
  shopify?: any;
  shopDomain?: string;
}

export default function SinglePage({
  pageName,
  settings,
  dispatch,
  children,
  shopify,
  shopDomain,
}: WidgetSettingProps) {
  const [openWidget, setOpenWidget] = useState<string | null>(
    null
  );

  const [allPagesAddPopover, setAllPagesAddPopover] = useState<Record<string, boolean>>({});

  const [selectedPagesName, setSelectedPagesName] = useState<Record<string, string[]>>({});

  // Track pages with existing conditions for display
  const [pagesWithExistingConditions, setPagesWithExistingConditions] = useState<Record<string, string[]>>({});

  // Confirmation modal state
  const [confirmModalActive, setConfirmModalActive] = useState(false);
  const [pendingApplyData, setPendingApplyData] = useState<{widgetKey: string, selectedPages: string[]} | null>(null);

  // Handle confirmation and apply conditions
  const handleConfirmApply = async (data: {widgetKey: string, selectedPages: string[]} | null) => {
    if (!data) return;

    const { widgetKey: key, selectedPages } = data;
    const widget = settings[key];

    // Check if any selected page has existing conditions
    const pagesWithConditions: string[] = [];

    try {
      // Check each selected page for existing data
      for (const page of selectedPages) {
        if (page !== pageName) {
          const response = await fetch(`/app/features/${page}`);
          if (response.ok) {
            const dataRes = await response.json();
            const pageWidget = dataRes?.widgetSettings?.[key];

            if (pageWidget?.ruleSettings?.conditions?.length > 0 ||
                pageWidget?.product_data_settings?.length > 0) {
              pagesWithConditions.push(page);
            }
          }
        }
      }

      // Store pages with existing conditions for display
      if (pagesWithConditions.length > 0) {
        setPagesWithExistingConditions(prev => ({
          ...prev,
          [key]: pagesWithConditions,
        }));
      }

      // Proceed with applying settings
      // Merge existing apply_on_pages with new selected pages
      const existingApplyOnPages = widget?.backend?.apply_on_pages || [];
      const mergedPages = [...new Set([...existingApplyOnPages, ...selectedPages])];

      const updatedWidget = {
        ...widget,
        backend: {
          ...widget.backend,
          apply_on_pages: mergedPages,
        },
      };
      dispatch(widgetActions.setFullConfig({
        ...settings,
        widgets: {
          ...settings,
          [key]: updatedWidget,
        },
      }));

      // Store selected pages for later use when saving
      (window as any).__selectedPagesForWidgets = {
        ...((window as any).__selectedPagesForWidgets || {}),
        [key]: selectedPages,
      };

      toggleAllPagesAddPopover(key);
    } catch (error) {
      console.error('Error checking existing conditions:', error);
      // On error, proceed anyway with merged pages
      const existingApplyOnPages = widget?.backend?.apply_on_pages || [];
      const mergedPages = [...new Set([...existingApplyOnPages, ...selectedPages])];

      const updatedWidget = {
        ...widget,
        backend: {
          ...widget.backend,
          apply_on_pages: mergedPages,
        },
      };
      dispatch(widgetActions.setFullConfig({
        ...settings,
        widgets: {
          ...settings,
          [key]: updatedWidget,
        },
      }));

      (window as any).__selectedPagesForWidgets = {
        ...((window as any).__selectedPagesForWidgets || {}),
        [key]: selectedPages,
      };

      toggleAllPagesAddPopover(key);
    }

    // Close modal
    setConfirmModalActive(false);
    setPendingApplyData(null);
  };
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

  // Get disabled operators for a specific field (excluding current condition)
  const getDisabledOperators = useCallback((widgetKey: string, currentConditionId: string, currentField: string) => {
    const widget = settings[widgetKey];
    if (!widget || !widget.ruleSettings || !widget.ruleSettings.conditions) return [];
    
    // Get UNIQUE operators already used for this field (excluding current condition)
    const disabledOps = [...new Set(
      (widget.ruleSettings?.conditions || [])
        .filter(condition =>
          condition.id !== currentConditionId &&
          condition.field === currentField
        )
        .map(condition => condition.operator)
        .filter(Boolean)
    )];
    
    return disabledOps;
  }, [settings]);

  // All possible field-operator mappings (shared constant)
  const fieldOperatorMap: Record<string, string[]> = {
    'product_title': ['contains'],
    'product_type': ['is_equal_to', 'is_not_equal_to'],
    'product_vendor': ['is_equal_to', 'is_not_equal_to'],
    'product_price': ['greater_than', 'less_than'],
    'product_tags': ['is_equal_to', 'is_not_equal_to']
  };

  // Get disabled fields - fields where ALL operators are already used
  const getDisabledFields = useCallback((widgetKey: string, currentConditionId: string) => {
    const widget = settings[widgetKey];
    if (!widget || !widget.ruleSettings || !widget.ruleSettings.conditions) return [];

    const disabledFields: string[] = [];
    console.log('demo',widget)
    // Check each field
    Object.entries(fieldOperatorMap).forEach(([field, allOperators]) => {
      // Get all UNIQUE operators already used for this field (excluding current condition)
      const usedOperators = [...new Set(
        (widget?.ruleSettings?.conditions || [])
          .filter(condition =>
            condition.id !== currentConditionId &&
            condition.field === field
          )
          .map(condition => condition.operator)
      )];

      // If all unique operators are used, disable this field
      if (usedOperators.length >= allOperators.length) {
        disabledFields.push(field);
      }
    });

    return disabledFields;
  }, [settings]);

  // Check if all field-operator combinations are used
  const areAllCombinationsUsed = useCallback((widgetKey: string) => {
    const widget = settings[widgetKey];
    if (!widget || !widget.ruleSettings || !widget.ruleSettings.conditions) return false;

    // Calculate total possible combinations
    const totalCombinations = Object.values(fieldOperatorMap).reduce(
      (sum, operators) => sum + operators.length,
      0
    );

    // Get all unique field-operator pairs currently in use
    const usedCombinations = new Set(
      (widget.ruleSettings.conditions || []).map(
        condition => `${condition.field}:${condition.operator}`
      )
    );

    // If number of used combinations equals total possible combinations, all are used
    return usedCombinations.size >= totalCombinations;
  }, [settings]);

  // Get disabled values for modal fields (vendor, type, tags)
  const getDisabledValues = useCallback((widgetKey: string, currentConditionId: string, currentField: string, currentOperator: string) => {
    const widget = settings[widgetKey];
    if (!widget || !widget.ruleSettings || !widget.ruleSettings.conditions) return [];
    
    // Only apply to modal fields
    if (!['product_vendor', 'product_type', 'product_tags'].includes(currentField)) {
      return [];
    }
    
    // console.log(`🔍 getDisabledValues called:`, {
    //   currentConditionId,
    //   currentField,
    //   currentOperator,
    //   totalConditions: widget.ruleSettings?.conditions?.length || 0
    // });
    
    // Get all values already used for this FIELD (regardless of operator, excluding current condition)
    const usedValues: string[] = [];

    (widget.ruleSettings?.conditions || [])
      .filter(condition =>
        condition.id !== currentConditionId &&
        condition.field === currentField &&
        // ⬇️ REMOVED operator check - now disables across ALL operators
        condition.value
      )
      .forEach(condition => {
        // console.log(`  📝 Found matching condition:`, {
        //   id: condition.id,
        //   field: condition.field,
        //   operator: condition.operator,
        //   value: condition.value
        // });
        
        // Parse the values (could be comma-separated string or JSON array)
        let values: string[] = [];
        try {
          const parsed = JSON.parse(condition.value);
          if (Array.isArray(parsed)) {
            values = parsed;
          }
        } catch {
          // If not JSON, split by comma
          values = condition.value.split(',').map(v => v.trim()).filter(v => v.length > 0);
        }
        
        // console.log(`    ➡️ Extracted values:`, values);
        usedValues.push(...values);
      });
    
    const uniqueDisabled = [...new Set(usedValues)];
    // console.log(`✅ Final disabled values (across ALL operators):`, uniqueDisabled);
    
    // Return unique disabled values
    return uniqueDisabled;
  }, [settings]);

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
      const widget = settings[widgetKey];
      
      // If changing field or operator, check for duplicates
      if (field === 'field' || field === 'operator') {
        if (!widget || !widget.ruleSettings || !widget.ruleSettings.conditions) {
          dispatch(widgetActions.updateCondition({ widgetId: widgetKey, conditionId, field, value }));
          return;
        }
        
        const currentCondition = widget.ruleSettings.conditions.find(c => c.id === conditionId);
        
        if (currentCondition) {
          // Determine what the new field and operator will be
          const newField = field === 'field' ? value : currentCondition.field;
          const newOperator = field === 'operator' ? value : currentCondition.operator;
          
          // Check if this combination already exists in another condition
          const duplicateExists = widget.ruleSettings.conditions.some(c => 
            c.id !== conditionId && 
            c.field === newField && 
            c.operator === newOperator
          );
          
          if (duplicateExists) {
            console.warn(`❌ Duplicate detected: ${newField} + ${newOperator} already exists. Change blocked.`);
            return; // Don't allow the change
          }
        }
      }
      
      dispatch(widgetActions.updateCondition({ widgetId: widgetKey, conditionId, field, value }));
    },
    [settings, dispatch],
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

  // Open the first widget on initial load
  useEffect(() => {
    const keys = Object.keys(settings);
    if (keys.length > 0 && !openWidget) {
      setOpenWidget(keys[0]);
    }
  }, [settings]);

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
                  <Card key={key} background={openWidget === key ? "bg-fill-info-secondary" : undefined}>
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
                              Configure
                            </Button>
                            <Button
                              onClick={() => {
                                if (shopify && shopDomain) {
                                  // Map page names to Shopify template names
                                  const templateMap: Record<string, string> = {
                                    'home': 'index',
                                    'product': 'product',
                                    'cart': 'cart',
                                    'collection': 'collection',
                                    'search': 'search',
                                    'notFound': '404',
                                    'other': 'page'
                                  };

                                  const template = templateMap[pageName] || 'index';

                                  // Extract shop name from domain (remove .myshopify.com)
                                  const shopName = shopDomain.replace('.myshopify.com', '');

                                  shopify.toast.show('Opening theme editor. Click "Add block" and search for the widget under Apps.');

                                  // Open theme editor with the correct template - no context parameter
                                  // User will click on a section, then "Add block", then find "New Arrivals" under Apps
                                  window.open(
                                    `https://${shopDomain}/admin/themes/current/editor?template=${template}&addAppBlockId={api_key}/customer_review&target=newAppsSection`,
                                    // `https://admin.shopify.com/store/${shopName}/themes/current/editor?template=${template}`,
                                    '_top'
                                  );
                                }
                              }}
                              variant="primary"
                              icon={ExternalIcon}
                            >
                              {`Add to Theme`}
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

                                {/* Widget Settings - Show only for "Similar Products" widget */}
                                {widget?.backend?.widgetName === "Similar Products" && (
                                  <>
                                    <BlockStack gap="200" >
                                        <Text as="h3" fontWeight="bold">
                                          Widget Settings
                                        </Text>
                                        <RelatedProductSelection
                                          widgetKey={key}
                                          dispatch={dispatch}
                                          initialSelectedValues={widget?.product_data_settings}
                                        />
                                        <Divider borderWidth="0"/>
                                    </BlockStack>
                                    <Divider />
                                  </>
                                )}



                            

                              <InlineStack wrap={false} gap="500" align="space-between" blockAlign="start">
                                <BlockStack gap="200">
                                  <Text as="h3" fontWeight="bold">
                                    Condition
                                  </Text>
                                  {(widget?.ruleSettings?.conditions?.length ?? 0) > 0 ? (
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
                                        {/* Display applied pages message */}
                                        {widget?.backend?.apply_on_pages && widget.backend.apply_on_pages.length > 0 && (() => {
                                          // Filter out current page from the list
                                          const otherPages = widget.backend.apply_on_pages.filter(page => page !== pageName);
                                          return otherPages.length > 0 ? (
                                            <Box paddingInline="400" paddingBlockStart="200" paddingBlockEnd="200">
                                              <Banner tone="info">
                                                <Text as="p" variant="bodySm">
                                                  <Text as="span" fontWeight="semibold">Applied condition for: </Text>
                                                  {otherPages.join(', ')} pages
                                                </Text>
                                              </Banner>
                                            </Box>
                                          ) : null;
                                        })()}
                                        {/* Display pages with existing conditions */}
                                        {pagesWithExistingConditions[key] && pagesWithExistingConditions[key].length > 0 && (
                                          <Box paddingInline="400" paddingBlockEnd="200">
                                            <Banner tone="warning">
                                              <Text as="p" variant="bodySm">
                                                <Text as="span" fontWeight="semibold">Pages with existing conditions: </Text>
                                                {pagesWithExistingConditions[key].join(', ')}
                                              </Text>
                                            </Banner>
                                          </Box>
                                        )}
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
                                          <Button
                                            variant="plain"
                                            disabled={(selectedPagesName[key]?.length || 0) < 1}
                                            onClick={() => {
                                              handleSelectedPagesChange(key, []);
                                              // Clear pages with existing conditions
                                              setPagesWithExistingConditions(prev => ({
                                                ...prev,
                                                [key]: [],
                                              }));
                                              // Clear pages from Redux
                                              const updatedWidget = {
                                                ...widget,
                                                backend: {
                                                  ...widget.backend,
                                                  apply_on_pages: [],
                                                },
                                              };
                                              dispatch(widgetActions.setFullConfig({
                                                ...settings,
                                                widgets: {
                                                  ...settings,
                                                  [key]: updatedWidget,
                                                },
                                              }));
                                              toggleAllPagesAddPopover(key);
                                            }}
                                          >
                                            Clear
                                          </Button>
                                          <Button
                                            variant="primary"
                                            disabled={(selectedPagesName[key]?.length || 0) < 1}
                                            onClick={() => {
                                              const selectedPages = selectedPagesName[key] || [];
                                              // Show confirmation modal
                                              setPendingApplyData({ widgetKey: key, selectedPages });
                                              setConfirmModalActive(true);
                                            }}
                                          >
                                            Apply
                                          </Button>
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
                                (condition: any) => {
                                  // Calculate disabled operators based on current condition's field
                                  const currentDisabledOperators = getDisabledOperators(key, condition.id, condition.field);
                                  
                                  // Calculate disabled fields (where all operators are exhausted)
                                  const currentDisabledFields = getDisabledFields(key, condition.id);
                                  
                                  // Calculate disabled values for modal fields
                                  const currentDisabledValues = getDisabledValues(key, condition.id, condition.field, condition.operator);
                                  
                                  return (
                                    <WidgetRuleCondition
                                      key={condition.id}
                                      condition={{
                                        id: condition.id,
                                        field: condition.field,
                                        operator: condition.operator,
                                        value: condition.value,
                                      }}
                                      disabledOperators={currentDisabledOperators}
                                      disabledFields={currentDisabledFields}
                                      disabledValues={currentDisabledValues}
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
                                  );
                                }
                              )}

                              <InlineStack>
                                <Button
                                  icon={PlusIcon}
                                  onClick={() => handleAddCondition(key)}
                                  disabled={!widget?.ruleSettings?.conditions || areAllCombinationsUsed(key)}
                                // loading={fetcher?.state === 'submitting'}
                                >
                                  {`Add ${(widget?.ruleSettings?.conditions?.length ?? 0) > 0 ? "Another" : ""} Condition `}
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
                                    variant="primary"
                                    icon={PersonalizedTextIcon}
                                  >
                                    Customize Design
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
              key={openWidget}
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

      {/* Confirmation Modal */}
      <Modal
        open={confirmModalActive}
        onClose={() => {
          setConfirmModalActive(false);
          setPendingApplyData(null);
        }}
        title="Confirm Apply Conditions"
        primaryAction={{
          content: 'Yes, Apply',
          onAction: () => handleConfirmApply(pendingApplyData),
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => {
              setConfirmModalActive(false);
              setPendingApplyData(null);
            },
          },
        ]}
      >
        <Modal.Section>
          <Text as="p">
            Are you sure you want to apply these conditions to the selected pages?
          </Text>
        </Modal.Section>
      </Modal>



      {/*  */}
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