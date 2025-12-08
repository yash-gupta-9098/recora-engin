import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData, useParams, Form, useRouteError, isRouteErrorResponse } from "@remix-run/react";
import { authenticate } from "app/shopify.server";
import { getShopSettings } from "db/getShopSettings";
import { updateShopSettings } from "db/updateShopSettings";
import { useEffect, useRef, useState, useCallback } from "react";
import { SaveBar, useAppBridge } from "@shopify/app-bridge-react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Grid,
  InlineGrid,
  InlineStack,
  Layout,
  Page,
  Divider,
  Tooltip,
  Tabs,
  Text,
  BlockStack,
} from "@shopify/polaris";
import {
  DesktopIcon,
  TabletIcon,
  MobileIcon,
} from "@shopify/polaris-icons";
import TabsLayout from "app/component/recoracomponent/settings/Tabs/TabsLayout";
import TabsProductCard from "app/component/recoracomponent/settings/Tabs/TabsProductCard";
import DesktopPreview from "app/component/recoracomponent/PreviewRight/DesktopPreview";
import RecoraDiv from "app/component/recoracomponent/RecoraDiv";
import { RootState } from "app/redux/store/store";
import { widgetActions, selectWidgetByKey } from "app/redux/slices/pageWidgetConfigSlice";
import { setGlobalSettings } from "app/redux/slices/globalSettingsSlice";
import { mergeWidgetSettings } from "app/utils/mergeWidgetSettings";
import { WidgetConfig, WidgetsPage } from "app/constants/interfaces/widgetConfigInterface";

const query = `
query Products($first: Int) {
     products(first: $first) {
    edges {
      node {
        id
        title
        vendor
        status
        variants(first: 5) {
          nodes {
            price
            displayName
            contextualPricing(context: {}) {
              compareAtPrice {
                amount
                currencyCode
              }
              price {
                amount
                currencyCode
              }
            }
            image {
              url(transform: {crop: CENTER})
            }
          }
        }
        media(first: 2) {
          nodes {
            preview {
              image {
                url
              }
            }
          }
        }
      }
    }
  }
}
`;

// Tabs without Color tab
const tabs = [
  {
    id: "product-card",
    content: "Product Card",
    accessibilityLabel: "Product Card",
    panelID: "product-card-content",
  },
  {
    id: "layout",
    content: "Layout",
    accessibilityLabel: "Layout",
    panelID: "layout-content",
  },
];

export const loader: LoaderFunction = async ({ params, request }) => {
  const { widgetSlug } = params;
  const url = new URL(request.url);
  const widgetId = url.searchParams.get("widgetId");
  const isDeveloper = url.searchParams.get("r3c0r@") === "true";

  try {
    const { session, admin } = await authenticate.admin(request);
    const defaultSettings = await getShopSettings(session.shop);

    const response = await admin.graphql(query, { variables: { first: 10 } });
    const products = await response.json();

    // Get widget data
    const single_Page_Data = defaultSettings[widgetSlug as keyof typeof defaultSettings] as WidgetsPage | null | undefined;

    if (!single_Page_Data || !widgetId) {
      return json({ 
        developerMode: isDeveloper,
        products: products.data.products.edges,
        widgetId: null,
        widget: null,
        settings: { value: { payload: JSON.stringify(defaultSettings) } },
      });
    }

    const widget = single_Page_Data.widgets?.[widgetId];

    return {
      developerMode: isDeveloper,
      products: products.data.products.edges,
      widgetId,
      widget,
      settings: { value: { payload: JSON.stringify(defaultSettings) } },
    };
  } catch (error) {
    console.error("Error loading widget settings:", error);
    throw new Error("Failed to load widget settings");
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const { widgetSlug } = params;
  const url = new URL(request.url);
  const widgetId = url.searchParams.get("widgetId");
  const payload = formData.get("payload") as string;

  try {
    const { session } = await authenticate.admin(request);
    const shopSettings = await getShopSettings(session.shop);

    // Get current page data
    const pageData = shopSettings[widgetSlug as keyof typeof shopSettings] as WidgetsPage | null | undefined;
    
    if (!pageData || !widgetId || !pageData.widgets[widgetId]) {
      return json({ success: false, error: "Widget not found" });
    }

    // Update widget in page data
    const updatedWidget = JSON.parse(payload);
    pageData.widgets[widgetId] = updatedWidget;

    // Update shop settings
    const updateData: Record<string, any> = {
      [widgetSlug as string]: pageData,
    };
    
    await updateShopSettings(request, updateData);

    return json({ success: true });
  } catch (error) {
    console.error("Error saving widget settings:", error);
    return json({ success: false, error: "Failed to save settings" });
  }
};

export default function WidgetSettingsPage() {
  console.log("innnnnn")
  const shopify = useAppBridge();
  const dispatch = useDispatch();
  const { widgetId: loadedWidgetId, widget, products, developerMode, settings } = useLoaderData<typeof loader>();
  const { widgetSlug } = useParams();
  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const widgetId = loadedWidgetId || urlParams.get("widgetId");

  // Redux state
  const globalSettings = useSelector((state: RootState) => state.globalSettings);
  const reduxWidget = useSelector((state: RootState) => 
    widgetId ? selectWidgetByKey(widgetId)(state) : null
  );

  const initialSettingsRef = useRef<any | null>(null);
  const saveBarTimerRef = useRef<number | null>(null);

  // Initialize global settings in Redux
  useEffect(() => {
    if (settings && !initialSettingsRef.current) {
      const settingFromDb = JSON.parse(settings.value.payload);
      initialSettingsRef.current = settingFromDb.globalSettings ?? settingFromDb;
      dispatch(setGlobalSettings(initialSettingsRef.current));
    }
  }, [settings, dispatch]);

  // Initialize widget in Redux if not already there
  useEffect(() => {
    if (widget && widgetId && !reduxWidget) {
      dispatch(widgetActions.setFullConfig({
        pageBlockSettings: { pageActive: true, icon: true },
        widgets: { [widgetId]: widget },
      }));
    }
  }, [widget, widgetId, reduxWidget, dispatch]);

  // Tab state
  const [selected, setSelected] = useState<number>(0);
  const handleTabChange = useCallback((selectedTabIndex: number) => {
    setSelected(selectedTabIndex);
  }, []);

  // Preview state
  const [previewStyle, setPreviewStyle] = useState("desktop");
  const [disableDesktop, setDisableDesktop] = useState(false);
  const [disableTablet, setDisableTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setDisableDesktop(false);
        setDisableTablet(false);
        setPreviewStyle("desktop");
      } else if (window.innerWidth < 768 && window.innerWidth > 549) {
        setDisableDesktop(true);
        setPreviewStyle("tablet");
      } else {
        setDisableDesktop(true);
        setDisableTablet(true);
        setPreviewStyle("mobile");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePreviewStyle = useCallback((value: string) => {
    setPreviewStyle(value);
  }, []);

  // Get merged settings (widget-specific overrides global)
  const currentWidget = reduxWidget || widget;
  const mergedSettings = currentWidget?.widgetSettings && currentWidget.widgetSettings.useGlobalSettings !== true
    ? mergeWidgetSettings(globalSettings, currentWidget.widgetSettings)
    : globalSettings;

  // Create a custom dispatch that updates widget-specific settings instead of global
  const widgetDispatch = useCallback((action: any) => {
    if (!widgetId) return;
    
    // Handle updateSection action (e.g., updateSection({ section: 'commanView', payload: {...} }))
    if (action.type === 'globalSettings/updateSection') {
      const { section, payload } = action.payload || {};
      if (section && payload) {
        dispatch(widgetActions.updateWidgetSettingsSection({
          widgetId,
          section: section as keyof import('app/constants/interfaces/widgetConfigInterface').WidgetSpecificSettings,
          payload,
        }));
      }
    }
    // Handle updateNestedField action (e.g., updateNestedField({ path: ['commanView', 'heading', 'fontSize'], value: 2.0 }))
    else if (action.type === 'globalSettings/updateNestedField') {
      const { path, value } = action.payload || {};
      if (path && path.length >= 1 && value !== undefined) {
        const section = path[0] as keyof import('app/constants/interfaces/widgetConfigInterface').WidgetSpecificSettings;
        
        // Build nested payload object
        let nestedPayload: any = value;
        for (let i = path.length - 1; i >= 1; i--) {
          nestedPayload = { [path[i]]: nestedPayload };
        }
        
        dispatch(widgetActions.updateWidgetSettingsSection({
          widgetId,
          section,
          payload: nestedPayload,
        }));
      }
    }
    // Handle other global settings actions
    else if (action.type?.startsWith('globalSettings/')) {
      // For other actions, we might need to handle them differently
      console.warn('Unhandled global settings action:', action.type);
    }
    // Pass through other actions
    else {
      dispatch(action);
    }
    shopify.saveBar.show("widget-settings");
  }, [dispatch, widgetId, shopify]);

  // Save bar logic
  useEffect(() => {
    if (!initialSettingsRef.current || !reduxWidget) return;

    const widgetSettingsToCompare = JSON.stringify(reduxWidget.widgetSettings || {});
    const initialWidgetSettings = widget?.widgetSettings 
      ? JSON.stringify(widget.widgetSettings)
      : "{}";

    if (saveBarTimerRef.current) {
      window.clearTimeout(saveBarTimerRef.current);
    }
    saveBarTimerRef.current = window.setTimeout(() => {
      if (widgetSettingsToCompare !== initialWidgetSettings) {
        shopify.saveBar.show?.("widget-settings");
      } else {
        shopify.saveBar.hide?.("widget-settings");
      }
    }, 200);

    return () => {
      if (saveBarTimerRef.current) {
        window.clearTimeout(saveBarTimerRef.current);
      }
    };
  }, [reduxWidget?.widgetSettings, widget, shopify]);

  const handleSave = () => {
    if (!reduxWidget || !widgetId) return;
    
    document.querySelector("form")?.requestSubmit();
    shopify.toast.show("Widget settings saved");
    shopify.saveBar.hide("widget-settings");
  };

  const handleDiscard = () => {
    if (!widget || !widgetId) return;
    
    // Reset to original widget settings
    dispatch(widgetActions.setFullConfig({
      pageBlockSettings: { pageActive: true, icon: true },
      widgets: { [widgetId]: widget },
    }));
    shopify.saveBar.hide("widget-settings");
  };


  // Early return if widget not found
  if (!widgetId) {
    return (
      <Page title="Widget Settings">
        <Card>
          <BlockStack gap="200">
            <Text as="h2" variant="headingMd">Widget not found</Text>
            <Text as="p">Please provide a valid widgetId in the URL query parameter.</Text>
          </BlockStack>
        </Card>
      </Page>
    );
  }

  if (!currentWidget) {
    return (
      <Page title="Widget Settings">
        <Card>
          <BlockStack gap="200">
            <Text as="h2" variant="headingMd">Loading...</Text>
            <Text as="p">Loading widget settings...</Text>
          </BlockStack>
        </Card>
      </Page>
    );
  }

  return (
    <Form method="post" action={`/app/features/${widgetSlug}/settings?widgetId=${widgetId}`}>
      <input
        type="hidden"
        name="payload"
        value={JSON.stringify(reduxWidget || widget)}
      />
      <RecoraDiv style={{ maxWidth: "1024px", margin: "0 auto" }}>
        <Page
          fullWidth={true}
          title={`${currentWidget.backend?.widgetName || currentWidget.title} Settings`}
          backAction={{
            content: "Back",
            url: `/app/features/${widgetSlug}`,
          }}
        >
          <SaveBar id="widget-settings">
            <button variant="primary" onClick={handleSave}></button>
            <button onClick={handleDiscard}></button>
          </SaveBar>
          <Layout sectioned={false}>
            <Layout.Section>
              <Card background="bg-surface" padding="0" roundedAbove="sm">
                <Box
                  as="div"
                  borderStyle="solid"
                  padding="400"
                  paddingInline="400"
                  printHidden={false}
                  visuallyHidden={false}
                >
                  <InlineGrid
                    columns={{ xs: 1, sm: 1, lg: 2, xl: 2, md: 2 }}
                    alignItems="center"
                  >
                    {tabs && (
                      <Tabs
                        tabs={tabs}
                        selected={selected}
                        onSelect={handleTabChange}
                        disclosureText="More views"
                      />
                    )}
                    <InlineStack wrap={true} gap="100" align="end">
                      <ButtonGroup
                        variant="segmented"
                        fullWidth={false}
                        connectedTop={false}
                        noWrap={false}
                      >
                        <Tooltip content="Desktop View" dismissOnMouseOut>
                          <Button
                            disabled={disableDesktop}
                            size="large"
                            pressed={previewStyle === "desktop"}
                            onClick={() => handlePreviewStyle("desktop")}
                            icon={DesktopIcon}
                          ></Button>
                        </Tooltip>
                        <Tooltip content="Tablet View" dismissOnMouseOut>
                          <Button
                            disabled={disableTablet}
                            size="large"
                            pressed={previewStyle === "tablet"}
                            onClick={() => handlePreviewStyle("tablet")}
                            icon={TabletIcon}
                          ></Button>
                        </Tooltip>
                        <Tooltip content="Mobile View" dismissOnMouseOut>
                          <Button
                            size="large"
                            pressed={previewStyle === "mobile"}
                            onClick={() => handlePreviewStyle("mobile")}
                            icon={MobileIcon}
                          ></Button>
                        </Tooltip>
                      </ButtonGroup>
                    </InlineStack>
                  </InlineGrid>
                </Box>
                <Divider borderColor="border-secondary" borderWidth="025" />
                <Box as="div" borderStyle="solid" paddingBlockEnd="400">
                  <Grid>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, lg: 3, xl: 3 }}>
                      <div style={{ display: selected === 0 ? "block" : "none" }}>
                        <TabsProductCard
                          settingfromDb={mergedSettings as any}
                          developerMode={developerMode}
                        />
                      </div>
                      <div style={{ display: selected === 1 ? "block" : "none" }}>
                        <TabsLayout
                          settingfromDb={mergedSettings as any}
                          developerMode={developerMode}
                        />
                      </div>
                    </Grid.Cell>

                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 9, xl: 9 }}>
                      <Box padding={"300"}>
                        <DesktopPreview
                          products={products}
                          previewStyle={previewStyle}
                          payload={mergedSettings}
                        />
                      </Box>
                    </Grid.Cell>
                  </Grid>
                </Box>
              </Card>
            </Layout.Section>
            <Layout.Section />
          </Layout>
        </Page>
      </RecoraDiv>
    </Form>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  
  if (isRouteErrorResponse(error)) {
    return (
      <Page title="Error">
        <Card>
          <BlockStack gap="200">
            <Text as="h2" variant="headingMd">Error {error.status}</Text>
            <Text as="p">{error.statusText || "An error occurred"}</Text>
            {error.data && (
              <Text as="p" variant="bodyMd" tone="subdued">
                {typeof error.data === 'string' ? error.data : JSON.stringify(error.data)}
              </Text>
            )}
          </BlockStack>
        </Card>
      </Page>
    );
  }

  return (
    <Page title="Error">
      <Card>
        <BlockStack gap="200">
          <Text as="h2" variant="headingMd">Unexpected Error</Text>
          <Text as="p">
            {error instanceof Error ? error.message : "An unexpected error occurred"}
          </Text>
          {process.env.NODE_ENV === 'development' && error instanceof Error && (
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {error.stack}
            </pre>
          )}
        </BlockStack>
      </Card>
    </Page>
  );
}

