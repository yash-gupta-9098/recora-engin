import { WidgetConfig } from "../interfaces/widgetConfigInterface";

const now = () => new Date().toISOString();


const avaibleAllPageList = [
  { value: 'home', label: 'Home' },
  { value: 'product', label: 'Product' },
  { value: 'cart', label: 'Cart' },
  { value: 'collection', label: 'Collection' }, 
  { value: 'search', label: 'Search' },
  { value: 'blog', label: 'Blog' },
  { value: 'other', label: 'other' },
  { value: 'notFound', label: '404' }
]

const avaibleIdBasedPageList = [
  { value: 'product', label: 'Product' },
  { value: 'cart', label: 'Cart' }
]



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


export const latestArrivalsConfig : WidgetConfig = {
  ...baseWidget("Latest Arrivals"),
  active: true,
  no_of_products: 10,
  backend: {
    widgetName: "Latest Arrivals",
    widgetDescription: "Displays the latest products added to the store.",
    availableOnpages: [ avaibleAllPageList , []],
    apply_on_pages:[]
  },
  ruleSettings: { priceMatch: "all", conditions: [] },
  isActive: true,
};


export const similarProductsConfig : WidgetConfig = {
  ...baseWidget("Similar Products"),
  active: true,
    backend: {
        widgetName: "Similar Products",
        widgetDescription: "Displays products related to the currently viewed product.",
        availableOnpages: [ avaibleIdBasedPageList , []],
        apply_on_pages:[]
        },
    ruleSettings: {priceMatch: "all", conditions: []},
    isActive: true,
};



export const bestSellersConfig : WidgetConfig = {
  ...baseWidget("Best Sellers"),
  active: true,
  backend: {
    widgetName: "Best Sellers",
    widgetDescription: "Displays Top Selling products to the user.",
    availableOnpages: [ avaibleAllPageList , []],
    apply_on_pages:[]
  },
  ruleSettings: { priceMatch: "all", conditions: [] },
  isActive: true,
};


export const trendingNowConfig : WidgetConfig = {
  ...baseWidget("Trending Now"),
  active: true,
  backend: {
    widgetName: "Trending Now",
    widgetDescription: "Displays Trending products to the user.",
    availableOnpages: [ avaibleAllPageList , []],
    apply_on_pages:[]
  },
  ruleSettings: { priceMatch: "all", conditions: [] },
  isActive: true,
};


export const aiSmartPicksConfig : WidgetConfig = {
  ...baseWidget("AI Smart Picks"),
  active: true,
  backend: {
    widgetName: "AI Smart Picks",
    widgetDescription: "Displays AI-based recommended products.",
    availableOnpages: [ avaibleAllPageList , []],
    apply_on_pages:[]
  },
  ruleSettings: {},
  isActive: true,
};



export const recentlyViewedConfig : WidgetConfig = {
  ...baseWidget("Recently Viewed"),
  active: true,
  backend: {
    widgetName: "Recently Viewed",
    widgetDescription: "Displays products recently viewed by the user.",
    availableOnpages: [ avaibleAllPageList , []],
    apply_on_pages:[]
  },
  ruleSettings: {},
  isActive: true,
};



export const personalizedForYouConfig : WidgetConfig = {
  ...baseWidget("Personalized For You"),
  active: true,
    backend: {
        widgetName: "Personalized For You",
        widgetDescription: "Displays products selected manually by the user.",
        availableOnpages: [ avaibleIdBasedPageList , []],
        apply_on_pages:[]
        },
    ruleSettings: {},
    isActive: true,
};



export const featuredDealsConfig : WidgetConfig = {
  ...baseWidget("Featured Deals"),
  active: true,
    backend: {
        widgetName: "Featured Deals",
        widgetDescription: "Displays products from a featured collection.",
        availableOnpages: [ avaibleAllPageList , []],
        apply_on_pages:[]
        },
    ruleSettings: {priceMatch: "all", conditions: []},
    isActive: true,
    collectionId:"",
};






