import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Condition, WidgetsPage, WidgetsSettings, WidgetSpecificSettings } from 'app/constants/interfaces/widgetConfigInterface';
import { GlobalSettingsState } from 'app/constants/interfaces/globalSettingsInterface';

const now = () => new Date().toISOString();

export type RuleLogic = "all" | "any";
export type ConditionFieldKey = "field" | "operator" | "value";

// Initialize empty state - will be populated from server data in useEffect
const initialState: WidgetsPage = {
  pageBlockSettings: {
    pageActive: true,
    icon: true,
  },
  widgets: {},
};

const widgetSlice = createSlice({
  name: 'widgetSlice',
  initialState,
  reducers: {
    // Initialize widgets from server data
    setFullConfig(state, action: PayloadAction<WidgetsPage>) {
      return action.payload;
    },

    // SET_LOGIC: Update priceMatch logic for a widget
    setLogic(state, action: PayloadAction<{ widgetId: string; priceMatch: RuleLogic }>) {
      const { widgetId, priceMatch } = action.payload;
      const widget = state.widgets[widgetId];
      if (!widget) return;
      
      if (!widget.ruleSettings) {
        widget.ruleSettings = { priceMatch, conditions: [] };
      } else {
        widget.ruleSettings.priceMatch = priceMatch;
      }
      widget.updatedAt = now();
    },

    // ADD_CONDITION: Add a new condition to a widget
    addCondition(state, action: PayloadAction<{ widgetId: string }>) {
      const { widgetId } = action.payload;
      const widget = state.widgets[widgetId];
      if (!widget) return;

      if (!widget.ruleSettings) {
        widget.ruleSettings = { priceMatch: "all", conditions: [] };
      }

      if (!widget.ruleSettings.conditions) {
        widget.ruleSettings.conditions = [];
      }

      const newCondition: Condition = {
        id: `cond_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
        field: "product_title",
        operator: "contains",
        value: "",
      };

      widget.ruleSettings.conditions.push(newCondition);
      widget.updatedAt = now();
    },

    // UPDATE_CONDITION: Update a specific condition field
    updateCondition(
      state,
      action: PayloadAction<{
        widgetId: string;
        conditionId: string;
        field: ConditionFieldKey;
        value: string;
      }>
    ) {
      const { widgetId, conditionId, field, value } = action.payload;
      const widget = state.widgets[widgetId];
      if (!widget?.ruleSettings?.conditions) return;

      const condition = widget.ruleSettings.conditions.find((c) => c.id === conditionId);
      if (condition) {
        condition[field] = value;
        widget.updatedAt = now();
      }
    },

    // DELETE_CONDITION: Remove a condition
    deleteCondition(state, action: PayloadAction<{ widgetId: string; conditionId: string }>) {
      const { widgetId, conditionId } = action.payload;
      const widget = state.widgets[widgetId];
      if (!widget?.ruleSettings?.conditions) return;

      widget.ruleSettings.conditions = widget.ruleSettings.conditions.filter(
        (c) => c.id !== conditionId
      );
      widget.updatedAt = now();
    },

    // UPDATE_SINGLE_WIDGET_SETTING: Update widget settings (widgetsSettings)
    updateSingleWidgetSetting(
      state,
      action: PayloadAction<{ widgetId: string; settings: Partial<WidgetsSettings> }>
    ) {
      const { widgetId, settings } = action.payload;
      const widget = state.widgets[widgetId];
      if (!widget) return;

      widget.widgetsSettings = {
        ...widget.widgetsSettings,
        ...settings,
      };
      widget.updatedAt = now();
    },

    // Update widget-specific settings (for overriding global settings)
    updateWidgetSpecificSettings(
      state,
      action: PayloadAction<{ widgetId: string; settings: Partial<WidgetSpecificSettings> }>
    ) {
      const { widgetId, settings } = action.payload;
      const widget = state.widgets[widgetId];
      if (!widget) return;

      if (!widget.widgetSettings) {
        widget.widgetSettings = {};
      }

      widget.widgetSettings = {
        ...widget.widgetSettings,
        ...settings,
      };
      widget.updatedAt = now();
    },

    // Update a specific section of widget-specific settings
    updateWidgetSettingsSection(
      state: WidgetsPage,
      action: PayloadAction<{
        widgetId: string;
        section: keyof WidgetSpecificSettings;
        payload: any;
      }>
    ) {
      const { widgetId, section, payload } = action.payload;
      const widget = state.widgets[widgetId];
      if (!widget) return;

      if (!widget.widgetSettings) {
        widget.widgetSettings = {};
      }

      const currentSection = widget.widgetSettings[section];
      widget.widgetSettings[section] = {
        ...(currentSection && typeof currentSection === 'object' ? currentSection : {}),
        ...(payload && typeof payload === 'object' ? payload : {}),
      } as any;
      widget.updatedAt = now();
    },

    // Toggle between using global settings and widget-specific settings
    toggleUseGlobalSettings(
      state,
      action: PayloadAction<{ widgetId: string; useGlobal: boolean }>
    ) {
      const { widgetId, useGlobal } = action.payload;
      const widget = state.widgets[widgetId];
      if (!widget) return;

      if (!widget.widgetSettings) {
        widget.widgetSettings = {};
      }

      widget.widgetSettings.useGlobalSettings = useGlobal;
      widget.updatedAt = now();
    },
    
        updateProductDataSettings(
      state,
      action: PayloadAction<{ widgetId: string; settings: string[] }>
    ) {
      const { widgetId, settings } = action.payload;
      const widget = state.widgets[widgetId];
      if (!widget) return;

      widget.product_data_settings = settings;
      widget.updatedAt = now();
    },
  
  },
});

export const widgetReducer = widgetSlice.reducer;
export const widgetActions = widgetSlice.actions;

export const selectWidgets = (state: { widgetSlice: WidgetsPage }) => state.widgetSlice.widgets;
export const selectWidgetByKey = (key: string) => (state: { widgetSlice: WidgetsPage }) =>
  state.widgetSlice.widgets[key];
