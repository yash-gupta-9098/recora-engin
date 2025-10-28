import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData} from "@remix-run/react";
import { authenticate } from "app/shopify.server";
import { getShopSettings } from "db/getShopSettings";
import { useReducer } from "react";
import { SaveBar, useAppBridge } from "@shopify/app-bridge-react";
import SinglePage from "../component/Widget";
import { WidgetConfig, WidgetsPage, WidgetsSettings } from "app/constants/interfaces/widgetConfigInterface";

// Database types
export type RuleLogic = "all" | "any";


// interface Condition {
//   id: string;
//   field: string; // e.g. "product_title"
//   operator: string; // e.g. "contains"
//   value: string;
// }

// interface RuleSettings {
//   priceMatch: RuleLogic;
//   conditions: Condition[];
// }

// interface WidgetsSettings {
//   heading: string;
//   subHeading: string;
//   viewType: string;
//   layoutValue: string;
//   viewCardDesign: string;
//   totalProduct: number;
//   rangeDeskProValue: number;
//   rangeTbtProValue: number;
//   rangeMbProValue: number;
// }

export type ConditionFieldKey = "field" | "operator" | "value";

//  export interface WidgetState {
//   title: string;
//   active: boolean;
//   no_of_products: number;
//   backend: {
//     widgetName: string;
//     widgetDescription: string;
//     availableOnpages?: Array<any>;
//   };
//   ruleSettings: RuleSettings;
//   widgetsSettings: WidgetsSettings;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

export interface SetLogicAction {
  type: "SET_LOGIC";
  payload: { widgetId: string; priceMatch: RuleLogic };
}

export interface SingleGrnSettingsAction {
  type: "UPDATE_SINGLE_WIDGET_SETTING";
  payload: { widgetId: string; settings: WidgetsSettings };
}

export interface AddConditionAction {
  type: "ADD_CONDITION";
  payload: { widgetId: string };
}

export interface UpdateConditionAction {
  type: "UPDATE_CONDITION";
  payload: {
    widgetId: string;
    conditionId: string;
    field: ConditionFieldKey;
    value: string;
  };
}

export interface DeleteConditionAction {
  type: "DELETE_CONDITION";
  payload: { widgetId: string; conditionId: string };
}

// Simple static data functions
const getAllWidgetsData = {
  getAllWidgets: async (
    staticWidgetData: Record<string, WidgetsPage>,
  ): Promise<WidgetsPage[]> => {
    if (!staticWidgetData || typeof staticWidgetData !== "object") return [];
    // Create a shallow copy so the original object isn't mutated
    const filteredData = { ...staticWidgetData };
    // Return all remaining widget values
    return Object.values(filteredData);
  },
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { widgetSlug } = params;

  try {
    const { session } = await authenticate.admin(request);

    const shop_Settings = await getShopSettings(session.shop);

    const single_Page_Data =
      shop_Settings[widgetSlug as keyof typeof shop_Settings] ;

    // Convert to the format expected by the component
    const widgets = await getAllWidgetsData.getAllWidgets(
      single_Page_Data?.widgets,
    );
    //
    const widgetSettings: Record<string, WidgetsPage> = {};
    widgets.forEach((widget) => {
      widgetSettings[widget.title] = widget;
    });

    // console.log("Final widgetSettings:", widgetSettings);
    return json({ widgetSlug, widgetSettings });
  } catch (error) {
    console.error("Error loading widget settings:", error);
    throw new Error("Failed to load widget settings");
  }
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  //*R@-pending*  form  submit karwana h kuch chnage  karna  ho to  vo dekhna h
};

export default function Widgets() {
  const shopify = useAppBridge();

  

  const handleSave = () => {
    document.querySelector("form")?.requestSubmit();
    shopify.toast.show('Message sent');
    shopify.saveBar.hide("single-page-settings");
  };

  const handleDiscard = () => {
    console.log("Discarding");
    shopify.saveBar.hide("single-page-settings");
  };

  type WidgetAction =
    | SingleGrnSettingsAction
    | SetLogicAction
    | AddConditionAction
    | UpdateConditionAction
    | DeleteConditionAction;

  function widgetReducer(
    state: Record<string, WidgetState>,
    action: WidgetAction,
  ): Record<string, WidgetState> {
    switch (action.type) {
      case "UPDATE_SINGLE_WIDGET_SETTING": {
        const { widgetId, settings } = action.payload;
        return {
          ...state,
          [widgetId]: {
            ...state[widgetId],
            ...settings,
            ruleSettings: {
              ...state[widgetId].ruleSettings,
              ...(settings.ruleSettings || {}),
              conditions: settings.ruleSettings?.conditions
                ? [
                    ...state[widgetId].ruleSettings.conditions,
                    ...settings.ruleSettings.conditions,
                  ]
                : state[widgetId].ruleSettings.conditions,
            },
            widgetsSettings: {
              ...state[widgetId].widgetsSettings,
              ...(settings.widgetsSettings || {}),
            },
          },
        };
      }
      case "SET_LOGIC": {
        const { widgetId, priceMatch } = action.payload;
        const w = state[widgetId];
        return {
          ...state,
          [widgetId]: {
            ...w,
            ruleSettings: { ...w.ruleSettings, priceMatch },
          },
        };
      }

      case "ADD_CONDITION": {
        const { widgetId } = action.payload;
        const w = state[widgetId];
        if (!w) return state;
        const newCond: Condition = {
          id: `cond_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
          field: "product_title",
          operator: "contains",
          value: "",
        };
        return {
          ...state,
          [widgetId]: {
            ...w,
            ruleSettings: {
              ...w.ruleSettings,
              conditions: [...w.ruleSettings.conditions, newCond],
            },
          },
        };
      }

      case "UPDATE_CONDITION": {
        const { widgetId, conditionId, field, value } = action.payload;
        const w = state[widgetId];
        if (!w) return state;
        const next = w.ruleSettings.conditions.map((c) =>
          c.id === conditionId ? { ...c, [field]: value } : c,
        );
        return {
          ...state,
          [widgetId]: {
            ...w,
            ruleSettings: { ...w.ruleSettings, conditions: next },
          },
        };
      }

      case "DELETE_CONDITION": {
        const { widgetId, conditionId } = action.payload;
        const w = state[widgetId];
        if (!w) return state;
        const next = w.ruleSettings.conditions.filter(
          (c) => c.id !== conditionId,
        );
        return {
          ...state,
          [widgetId]: {
            ...w,
            ruleSettings: { ...w.ruleSettings, conditions: next },
          },
        };
      }

      default:
        return state;
    }
  }

  const { widgetSlug, widgetSettings } = useLoaderData<typeof loader>();
  const [UpdatedPageSetting, dispatch] = useReducer(
    widgetReducer,
    widgetSettings,
  );

  const customDispatch = (action: WidgetAction) => {
    dispatch(action);
    shopify.saveBar.show("single-page-settings");

    //*R@-pending*  --- settings  ko agar revet kar diya  chnage  karke  to sav bar hat jana  chahiye

    //   const nextSettings = widgetReducer(UpdatedPageSetting, action);

    // // deep compare karo (lodash ya JSON.stringify se simple compare kar sakte ho)
    // const hasChanges = JSON.stringify(widgetSettings) !== JSON.stringify(nextSettings);

    // if (hasChanges) {
    //   shopify.saveBar.show("single-page-settings");
    // } else {
    //   shopify.saveBar.hide("single-page-settings");
    // }

    //*R@-pending*
  };

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
