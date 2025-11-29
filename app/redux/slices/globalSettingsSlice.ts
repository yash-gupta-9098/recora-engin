import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { defaultGlobalSettings } from 'app/constants/defaultValues/defaultGlobalSettings';
import { ColorScheme, GlobalSettingsState } from 'app/constants/interfaces/globalSettingsInterface';


type SectionKey = keyof GlobalSettingsState; 


type PartialSectionPayload<K extends SectionKey> = {
  section: K;
  payload: Partial<GlobalSettingsState[K]>;
};


type UpdateColorSchemePayload = {
  key: string;
  value: Partial<{
    text: string;
    text_Secondary: string;
    background: string;
    card_border: string;
    button_background: string;
    button_text: string;
    button_outline: string;
    button_hover_background: string;
    button_hovertext: string;
    button_hover_outline: string;
    icon_color: string;
    icon_hover_color: string;
    icon_background: string;
    icon_hover_background: string;
  }>;
};


const initialState: GlobalSettingsState = defaultGlobalSettings;




const globalSettingsSlice = createSlice({
  name: 'globalSettings',
  initialState,
  reducers: {
    // Replace the whole global settings
    setGlobalSettings(state, action: PayloadAction<GlobalSettingsState>) {
      return action.payload;
    },

    // Reset to defaults
    resetGlobalSettings() {
      return initialState;
    },

    // Update an entire top-level section (partial merge)
    updateSection(state, action: PayloadAction<PartialSectionPayload<SectionKey>>) {
      const { section, payload } = action.payload;
      
      state[section] = { ...(state[section] as any), ...(payload as any) };
    },

    // Update nested fields by providing a path array (e.g. ['commanView','heading'])
    // Useful for deep updates without replacing the whole section
    updateNestedField(
      state,
      action: PayloadAction<{ path: string[]; value: any }>
    ) {
      const { path, value } = action.payload;
      if (!path.length) return;
      let cursor: any = state;
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (!cursor[key]) cursor[key] = {};
        cursor = cursor[key];
      }
      cursor[path[path.length - 1]] = value;
    },

    // Update color scheme key partially or create new key
    updateColorScheme(state, action: PayloadAction<UpdateColorSchemePayload>) {
      const { key, value } = action.payload;
      state.colorScheme = {
        ...state.colorScheme,
        [key]: { ...(state.colorScheme[key] || {}), ...value },
      };
    },

    // Remove a color scheme key
    removeColorSchemeKey(state, action: PayloadAction<{ key: string }>) {
      const { key } = action.payload;
      const { [key]: removed, ...rest } = state.colorScheme;
      state.colorScheme = rest;
    },

    // Convenience: set custom CSS
    setCustomCSS(state, action: PayloadAction<string>) {
      state.customCSS = action.payload;
    },
  },
});

// Exports
export const {
  setGlobalSettings,
  resetGlobalSettings,
  updateSection,
  updateNestedField,
  updateColorScheme,
  removeColorSchemeKey,
  setCustomCSS,
} = globalSettingsSlice.actions;

export default globalSettingsSlice.reducer;


// #up: Opyimization  below  default  UseSelector  Value 


// export const selectGlobalSettings = (state: { globalSettings: GlobalSettingsState }) =>
//   state.globalSettings;

// export const selectColorScheme = (state: { globalSettings: GlobalSettingsState }, key = 'default') =>
//   state.globalSettings.colorScheme[key] ?? state.globalSettings.colorScheme['default'];



// #ref:
// app/store/selectors/globalSettingsSelectors.ts
// import { RootState } from "../store";

// export const selectGlobalSettings = (state: RootState) => state.globalSettings;

// export const selectColorScheme = (state: RootState) =>
//   state.globalSettings.colorScheme;

// export const selectProductTitle = (state: RootState) =>
//   state.globalSettings.productTitle;

// export const selectCommanView = (state: RootState) =>
//   state.globalSettings.commanView;



// export const { setGlobalSettings, updateGlobalSettings } = globalSettingsSlice.actions;
// export default globalSettingsSlice.reducer;