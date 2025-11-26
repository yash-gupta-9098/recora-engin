import { GlobalSettingsState } from 'app/constants/interfaces/globalSettingsInterface';
import { WidgetSpecificSettings } from 'app/constants/interfaces/widgetConfigInterface';

/**
 * Merges global settings with widget-specific settings.
 * Widget-specific settings override global settings when useGlobalSettings is false or undefined.
 * When useGlobalSettings is true, returns global settings as-is.
 * 
 * @param globalSettings - The global settings from Redux
 * @param widgetSettings - The widget-specific settings (optional)
 * @returns Merged settings object that can be used for rendering
 */
export function mergeWidgetSettings(
  globalSettings: GlobalSettingsState,
  widgetSettings?: WidgetSpecificSettings
): GlobalSettingsState {
  // If widget wants to use global settings explicitly, return global as-is
  if (widgetSettings?.useGlobalSettings === true) {
    return globalSettings;
  }

  // If no widget settings exist, return global settings
  if (!widgetSettings || widgetSettings.useGlobalSettings === undefined) {
    // Default to global settings if not explicitly set
    return globalSettings;
  }

  // Merge widget-specific settings over global settings
  return {
    commanView: {
      ...globalSettings.commanView,
      ...(widgetSettings.commanView || {}),
    },
    productTitle: {
      ...globalSettings.productTitle,
      ...(widgetSettings.productTitle || {}),
    },
    productPrice: {
      ...globalSettings.productPrice,
      ...(widgetSettings.productPrice || {}),
      comparePrice: {
        ...globalSettings.productPrice.comparePrice,
        ...(widgetSettings.productPrice?.comparePrice || {}),
      },
      variantPrice: {
        ...globalSettings.productPrice.variantPrice,
        ...(widgetSettings.productPrice?.variantPrice || {}),
      },
      singlePrice: {
        ...globalSettings.productPrice.singlePrice,
        ...(widgetSettings.productPrice?.singlePrice || {}),
      },
    },
    productImage: {
      ...globalSettings.productImage,
      ...(widgetSettings.productImage || {}),
    },
    productCard: {
      ...globalSettings.productCard,
      ...(widgetSettings.productCard || {}),
    },
    customCSS: widgetSettings.customCSS ?? globalSettings.customCSS,
    // Color scheme is always global - never overridden by widget settings
    colorScheme: globalSettings.colorScheme,
  };
}

