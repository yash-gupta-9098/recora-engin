import { WidgetConfig } from "../interfaces/widgetConfigInterface";

const now = () => new Date().toISOString();




const baseWidget = (title: string) => ({
  title,
  active: false,
  no_of_products: 10,
  backend: {
    widgetName: title,
    widgetDescription: "",
  },
  ruleSettings: {},
  widgetsSettings: {
    heading: title,
    subHeading: "",
    viewType: "grid",
    layoutValue: "Layout_1",
    viewCardDesign: "vertical",
    totalProduct: 10,
    rangeDeskProValue: 4,
    rangeTbtProValue: 3,
    rangeMbProValue: 2,
  },
  isActive: false,
  createdAt: now(),
  updatedAt: now(),
});


export const newArrivalsConfig : WidgetConfig = {
  ...baseWidget("New Arrivals"),
  active: true,
  no_of_products: 10,
  backend: {
    widgetName: "New Arrivals",
    widgetDescription: "Displays the latest products added to the store.",
  },
  ruleSettings: { priceMatch: "all", conditions: [] },
  isActive: true,
};


export const relatedProductsConfig : WidgetConfig = {
  ...baseWidget("Related Products"),
  active: true,
    backend: {
        widgetName: "Related Products",
        widgetDescription: "Displays products related to the currently viewed product.",
        },
    ruleSettings: {priceMatch: "all", conditions: []},
    isActive: true,
};



export const topSellingProductsConfig : WidgetConfig = {
  ...baseWidget("Top Selling Products"),
  active: true,
  backend: {
    widgetName: "Top Selling Products",
    widgetDescription: "Displays Top Selling products to the user.",
  },
  ruleSettings: { priceMatch: "all", conditions: [] },
  isActive: true,
};


export const trendingProductsConfig : WidgetConfig = {
  ...baseWidget("Trending Products"),
  active: true,
  backend: {
    widgetName: "Trending Products",
    widgetDescription: "Displays Trending products to the user.",
  },
  ruleSettings: { priceMatch: "all", conditions: [] },
  isActive: true,
};


export const aiBasedRecommendationsConfig : WidgetConfig = {
  ...baseWidget("AI Based Recommendations"),
  active: true,
  backend: {
    widgetName: "AI Based Recommendations",
    widgetDescription: "Displays AI-based recommended products.",
  },
  ruleSettings: {},
  isActive: true,
};



export const recentlyViewedProductsConfig : WidgetConfig = {
  ...baseWidget("Recently Viewed Products"),
  active: true,
  backend: {
    widgetName: "Recently Viewed Products",
    widgetDescription: "Displays products recently viewed by the user.",
  },
  ruleSettings: {},
  isActive: true,
};



export const manualProductsConfig : WidgetConfig = {
  ...baseWidget("Manual Products"),
  active: true,
    backend: {
        widgetName: "Manual Products",
        widgetDescription: "Displays products selected manually by the user.",
        },
    ruleSettings: {},
    isActive: true,
};



export const featureCollectionConfig : WidgetConfig = {
  ...baseWidget("Feature Collection"),
  active: true,
    backend: {
        widgetName: "Feature Collection",
        widgetDescription: "Displays products from a featured collection.",
        },
    ruleSettings: {priceMatch: "all", conditions: []},
    isActive: true,
    collectionId:"",
};






