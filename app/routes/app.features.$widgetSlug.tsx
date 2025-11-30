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
      return json({ widgetSlug, widgetSettings: {} });
    }

    // single_Page_Data.widgets is Record<string, WidgetConfig>
    const widgetSettings: Record<string, WidgetConfig> = single_Page_Data.widgets || {};

    return json({ widgetSlug, widgetSettings });
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

    if (!widgetsData || !widgetSlug) {
      return json({ success: false, error: "Missing data" }, { status: 400 });
    }

    // Parse the widgets data from JSON
    const parsedWidgetsData = JSON.parse(widgetsData as string);

    // Update shop settings in database
    // Structure: { [widgetSlug]: { widgets: {...} } }
    const updateData = {
      [widgetSlug]: parsedWidgetsData
    };

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
  const { widgetSlug, widgetSettings } = useLoaderData<typeof loader>();

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

      // Create form data
      const formData = new FormData();
      formData.append("widgetsData", JSON.stringify(currentWidgetsState));

      // Submit using Remix's submit
      submit(formData, { method: "POST" });

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
      >
        <SaveBar id="single-page-settings">
          <button variant="primary" onClick={handleSave}></button>
          <button onClick={handleDiscard}></button>
        </SaveBar>
      </SinglePage>
    </>
  );
}
