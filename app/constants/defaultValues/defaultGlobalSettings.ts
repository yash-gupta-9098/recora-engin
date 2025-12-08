// app/constants/defaultGlobalSettings.ts

import { GlobalSettingsState } from "app/constants/interfaces/globalSettingsInterface";








export const defaultGlobalSettings: GlobalSettingsState = {
  commanView: {
    customClass: "",
    layoutValue: "Layout 2",
    totalProduct: 10,
    heading: {
      fontSize: 1.8,
      color: "#000000ff",
      textAlign: "left",
      customClass: "",
    },
    subHeading: {
      fontSize: 1.2,
      color: "#000000ff",
      textAlign: "left",
      customClass: "",
    },
    desktop: {
      screenSize: "1024",
      viewType: "grid",
      rangeProValue: 4,
    },
    tablet: {
      screenSize: "768",
      viewType: "grid",
      rangeProValue: 3,
    },
    mobile: {
      screenSize: "449",
      viewType: "grid",
      rangeProValue: 2,
    },
  },
  productTitle: {
    showTitle: true,
    titleClip: false,
    color: "#333333ff",
    fontSize: 1,
    customClass: "",
    colorScheme: "Scheme 1",
  },
  productPrice: {
    showPrice: true,
    color: "#333333ff",
    fontSize: 1.2,
    colorScheme: "Scheme 1",
    comparePrice: {
      fontSize: 1.2,
      showComparePrice: false,
      color: "#666666ff",
      colorScheme: "Scheme 1",
    },
    variantPrice: {
      fontSize: 1.8,
      showVariantPrice: false,
      color: "#6d5be2ff",
      colorScheme: "Scheme 1",
    },
    singlePrice: {
      applySinglePrice: false,
     color: "#333333ff",
     colorScheme: "Scheme 1",
    },
    showZeroToFree: false,
    customClass: "",
    
  },
  productImage: {
    ratio: "1 / 1",
    onHover: true,
    showVariantImage: true,
    cropImage: true,
    cropType: "center",
    padding: 0,
    customClass: "",
  },
  productCard: {
    cardStyle: "standard",
    reviewType: "none",
    wishlist: "none",
    colorScheme: "Scheme 1",
    showVendor: false,
    textAlignType: "left",
    customClass: "",
  },
  customCSS: "",
  colorScheme: {
    "Scheme 1": {
      border: "#e1e1e1ff",
      text: "#333333ff",
      text_Secondary: "#666666ff",
      background: "#ffffffff",
      card_border: "#e1e1e1ff",
      button_background: "#000000ff",
      button_text: "#ffffff",
      button_outline: "#000000ff",
      button_hover_background: "#333333ff",
      button_hovertext: "#ffffffff",
      button_hover_outline: "#333333ff",
      icon_color: "#000000ff",
      icon_hover_color: "#555555ff",
      icon_background: "#f0f0f0ff",
      icon_hover_background: "#e1e1e1ff",
    },
    "Scheme 2": {
      border: "#444444ff",
      text: "#ffffffff",
      text_Secondary: "#ccccccff",
      background: "#2c2c2cff",
      card_border: "#444444ff",
      button_background: "#ffffffff",
      button_text: "#000000ff",
      button_outline: "#ffffffff",
      button_hover_background: "#333333ff",
      button_hovertext: "#ffffffff",
      button_hover_outline: "#333333ff",
      icon_color: "#000000ff",
      icon_hover_color: "#555555ff",
      icon_background: "#f0f0f0ff",
      icon_hover_background: "#e1e1e1ff",
    },
  },
};
