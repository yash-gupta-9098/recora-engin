import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData, useSubmit, useActionData } from "@remix-run/react";
import { authenticate } from "app/shopify.server";
import { getShopSettings } from "db/getShopSettings";
import { updateShopSettings } from "db/updateShopSettings";
import { useEffect } from "react";
import { SaveBar, useAppBridge } from "@shopify/app-bridge-react";
import { useDispatch, useSelector } from "react-redux";
import SinglePage from "../component/Widget";
import { WidgetConfig, WidgetsPage, WidgetsSettings } from "app/constants/interfaces/widgetConfigInterface";
import { widgetActions, selectWidgets } from "app/redux/slices/pageWidgetConfigSlice";
import { AppDispatch, RootState } from "app/redux/store/store";


export const loader: LoaderFunction = async ({ params, request }) => {
  const { widgetSlug } = params;

  try {
    const { session } = await authenticate.admin(request);

    const shop_Settings = await getShopSettings(session.shop);

    const single_Page_Data = shop_Settings[widgetSlug as keyof typeof shop_Settings] as WidgetsPage | null | undefined;

    if (!single_Page_Data || typeof single_Page_Data !== "object" || !("widgets" in single_Page_Data)) {
      return json({ widgetSlug, widgetSettings: {}, shopDomain: session.shop });
    }

    // single_Page_Data.widgets is Record<string, WidgetConfig>
    const widgetSettings: Record<string, WidgetConfig> = single_Page_Data.widgets || {};

    return json({ widgetSlug, widgetSettings, shopDomain: session.shop });
  } catch (error) {
    console.error("Error loading widget settings:", error);
    throw new Error("Failed to load widget settings");
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  const { widgetSlug } = params;

  try {
    const formData = await request.formData();
    const widgetsData = formData.get("widgetsData");
    const selectedPagesForWidgets = formData.get("selectedPagesForWidgets"); // Widget-specific page mapping

    if (!widgetsData || !widgetSlug) {
      return json({ success: false, error: "Missing data" }, { status: 400 });
    }

    // Parse the widgets data from JSON
    const parsedWidgetsData = JSON.parse(widgetsData as string);

    // Get the session to fetch existing shop settings
    const { session } = await authenticate.admin(request);
    const shop_Settings = await getShopSettings(session.shop);

    // Update shop settings in database
    // Structure: { [widgetSlug]: { widgets: {...} } }
    const updateData: any = {
      [widgetSlug]: parsedWidgetsData
    };

    // If selectedPagesForWidgets is provided, copy only conditions for specific widgets
    if (selectedPagesForWidgets) {
      const widgetPageMapping = JSON.parse(selectedPagesForWidgets as string);

      // widgetPageMapping structure: { widgetKey: [page1, page2, ...] }
      Object.entries(widgetPageMapping).forEach(([widgetKey, pages]: [string, any]) => {
        if (Array.isArray(pages)) {
          pages.forEach((targetPage: string) => {
            if (targetPage !== widgetSlug) {
              // Get existing target page data
              const existingPageData = shop_Settings[targetPage as keyof typeof shop_Settings] as any;

              if (!existingPageData || !existingPageData.widgets) {
                return; // Skip if target page doesn't exist
              }

              // Get source widget data
              const sourceWidget = parsedWidgetsData.widgets[widgetKey];

              if (!sourceWidget) {
                return; // Skip if widget doesn't exist in source
              }

              // Get target widget data
              const targetWidget = existingPageData.widgets[widgetKey];

              if (!targetWidget) {
                return; // Skip if widget doesn't exist on target page
              }

              // Only copy ruleSettings (conditions) and product_data_settings
              const updatedTargetWidget = {
                ...targetWidget,
                ruleSettings: sourceWidget.ruleSettings || targetWidget.ruleSettings,
                product_data_settings: sourceWidget.product_data_settings || targetWidget.product_data_settings,
              };

              // Initialize updateData for this page if not exists
              if (!updateData[targetPage]) {
                updateData[targetPage] = {
                  ...existingPageData,
                };
              }

              // Update only the specific widget
              updateData[targetPage] = {
                ...updateData[targetPage],
                widgets: {
                  ...updateData[targetPage].widgets,
                  [widgetKey]: updatedTargetWidget,
                },
              };
            }
          });
        }
      });
    }

    await updateShopSettings(request, updateData);

    return json({ success: true, message: "Settings saved successfully" });
  } catch (error) {
    console.error("Error saving widget settings:", error);
    return json({ success: false, error: "Failed to save settings" }, { status: 500 });
  }
};

export default function Widgets() {
  const shopify = useAppBridge();
  const dispatch = useDispatch<AppDispatch>();
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const { widgetSlug, widgetSettings, shopDomain } = useLoaderData<typeof loader>();

  // Get widgets from Redux store
  const widgets = useSelector((state: RootState) => selectWidgets(state));

  // Initialize Redux state from server data in useEffect
  // This runs when widgetSlug changes (page navigation) to load new widget data into Redux
  useEffect(() => {
    if (widgetSettings && Object.keys(widgetSettings).length > 0) {
      // Convert widgetSettings from server to WidgetsPage format for Redux
      const widgetsPageData: WidgetsPage = {
        pageBlockSettings: {
          pageActive: true,
          icon: true,
        },
        widgets: widgetSettings,
      };
      dispatch(widgetActions.setFullConfig(widgetsPageData));
    } else {
      // Reset to empty state if no widgets
      dispatch(widgetActions.setFullConfig({
        pageBlockSettings: { pageActive: true, icon: true },
        widgets: {},
      }));
    }
  }, [dispatch, widgetSlug, JSON.stringify(widgetSettings)]);

  const handleSave = () => {
    try {
      // Get current Redux state
      const currentWidgetsState = {
        pageBlockSettings: {
          pageActive: true,
          icon: true,
        },
        widgets: widgets,
      };

      console.log('currentWidgetsState', currentWidgetsState);

      // Validate all conditions before saving
      const invalidWidgets: string[] = [];
      Object.entries(widgets).forEach(([widgetKey, widget]) => {
        if (widget?.ruleSettings?.conditions && widget.ruleSettings.conditions.length > 0) {
          const hasInvalidCondition = widget.ruleSettings.conditions.some(condition => {
            // Check if any field is empty
            const hasEmptyField = !condition.field || !condition.operator || !condition.value || condition.value.trim() === '';

            // Additional validation based on field type
            if (!hasEmptyField) {
              // For modal fields (vendors, types, tags), check if at least one value is selected
              if (['product_vendor', 'product_type', 'product_tags'].includes(condition.field)) {
                const values = condition.value.split(',').map((v: string) => v.trim()).filter((v: string) => v.length > 0);
                return values.length === 0;
              }

              // For price field, check if it's a valid number
              if (condition.field === 'product_price') {
                const numValue = parseFloat(condition.value.replace('$', '').trim());
                return isNaN(numValue) || numValue < 0;
              }

              // For text fields (like product_title), require at least 3 characters
              return condition.value.trim().length < 3;
            }

            return hasEmptyField;
          });

          if (hasInvalidCondition) {
            invalidWidgets.push(widget.title || widgetKey);
          }
        }
      });

      // If there are invalid widgets, show error and stop submission
      if (invalidWidgets.length > 0) {
        shopify.toast.show(
          `Please complete all condition fields in: ${invalidWidgets.join(', ')}`,
          { isError: true, duration: 5000 }
        );
        return;
      }

      // Create form data
      const formData = new FormData();
      formData.append("widgetsData", JSON.stringify(currentWidgetsState));

      // Get selected pages for copying settings
      const selectedPagesForWidgets = (window as any).__selectedPagesForWidgets || {};

      // Add selectedPagesForWidgets if there are any
      if (Object.keys(selectedPagesForWidgets).length > 0) {
        formData.append("selectedPagesForWidgets", JSON.stringify(selectedPagesForWidgets));
      }

      // Submit using Remix's submit
      submit(formData, { method: "POST" });

      // Clear the window variable after saving
      (window as any).__selectedPagesForWidgets = {};

    } catch (error) {
      console.error("Error saving:", error);
      shopify.toast.show('Error saving settings', { isError: true });
    }
  };

  // Handle action response
  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        shopify.toast.show('Settings saved successfully');
        shopify.saveBar.hide("single-page-settings");
      } else {
        shopify.toast.show('Error saving settings', { isError: true });
      }
    }
  }, [actionData, shopify]);

  const handleDiscard = () => {
    console.log("Discarding");
    shopify.saveBar.hide("single-page-settings");
  };

  // Custom dispatch wrapper that shows save bar
  const customDispatch = (action: any) => {
    dispatch(action);
    shopify.saveBar.show("single-page-settings");
  };

  // Convert widgets Record to the format expected by SinglePage component
  const UpdatedPageSetting = widgets;

  return (
    <>
      <SinglePage
        pageName={widgetSlug}
        settings={UpdatedPageSetting}
        dispatch={customDispatch}
        shopify={shopify}
        shopDomain={shopDomain}
      >
        <SaveBar id="single-page-settings">
          <button variant="primary" onClick={handleSave}></button>
          <button onClick={handleDiscard}></button>
        </SaveBar>
      </SinglePage>
    </>
  );
}
