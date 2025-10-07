import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
  Session
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.January25,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  hooks: {
    afterAuth: async ({ session } : any  ) => {
      console.log("afterAuth", session)
      // Update the session record in the database with your default settings
      await insertDefaultShopData(session);
    },
  },
  distribution: AppDistribution.AppStore,
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});


async function insertDefaultShopData(session : Session) {
    try {
      console.log('session in insertDefaultShopData ',session);
      // Check if shop data already exists
      const existingShop = await prisma.shopsettings.findUnique({
        where: { shop: session.shop }
      });

        const defaultData = {
            id: session.id,
          shop: session.shop,
          accessToken: session.accessToken,
          scope: session.scope,
          firstName: 'rinkal verma',
          globalSettings:{commanView: {
      customClass:"", 
    layoutValue: "Layout 1",
    totalProduct: 10,
    heading:{
      fontSize:1.8,
  color:"#000000ff",
  textAlign:"left",
  customClass:"",
    },
    subHeading:{
fontSize:1.2,
  color:"#000000ff",
  textAlign:"left",
  customClass:"",
    },
    desktop: {
      screenSize:"1024",
      viewType: "grid",
      rangeProValue: 4
    },
    tablet: {
      screenSize:"768",
      viewType: "grid",
      rangeProValue: 3
    },
    mobile: {
      screenSize:"449",
      viewType: "grid",
      rangeProValue: 2
    }
  },
  productTitle: {
    showTitle: true,
    titleClip: false,
    color: "#333333ff",
    fontSize: 1,
    customClass:"",
  },
  productPrice: {
    showPrice: true,
    color: "#333333ff",
    fontSize: 1.2,
    comparePrice: {
      fontSize:1.2,
      showComparePrice: false,
      color: "#666666ff"
    },
    variantPrice:{
      fontSize:1.8,
      showVariantPrice: false,
      color: "#6d5be2ff"
    },
    singlePriceColor:"#333333ff",
    showZeroToFree: false,
    customClass:"",
  },
  productImage: {
    ratio: "1 / 1",
    onHover: true,
    showVariantImage: true,
    cropImage: true,
    cropType: "center",
    padding: 0,
    customClass:"",
  },
  productCard: {
    cardStyle: "standard",
    reviewType: "none",
    wishlist: "none",
    colorScheme: "Scheme 1",
    showVendor: false,
    textAlignType: "left",
    customClass:"",
  },
  customCSS: "",
  colorScheme: {
    "Scheme 1": {
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

    }
  }},
          
  home: {
    homeSettings: { pageActive: true, icon: true },
    widgets: {
      newrrival: {
        title: "New Arrivals",
        active: true,
        no_of_products: 10,
        backend: {
          widgetName: "New Arrivals",
          widgetDescription: "Displays the latest products added to the store."
        },
        ruleSettings: { priceMatch: "all", conditions: [] },
        widgetsSettings: {
          heading: "New Arrivals",
          subHeading: "",
          viewType: "grid",
          layoutValue: "Layout_1",
          viewCardDesign: "vertical",
          totalProduct: 10,
          rangeDeskProValue: 4,
          rangeTbtProValue: 3,
          rangeMbProValue: 2
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      relatedProducts: {
        title: "Related Products",
        active: true,
        no_of_products: 10,
        backend: {
          widgetName: "Related Products",
          widgetDescription: "Displays related products to the user."
        },
        ruleSettings: { priceMatch: "all", conditions: [] },
        widgetsSettings: {
          heading: "Related Products",
          subHeading: "",
          viewType: "grid",
          layoutValue: "Layout_1",
          viewCardDesign: "vertical",
          totalProduct: 10,
          rangeDeskProValue: 4,
          rangeTbtProValue: 3,
          rangeMbProValue: 2
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      aiBasedRecommendations: {
        title: "AI Based Recommendations",
        active: true,
        no_of_products: 10,
        backend: {
          widgetName: "AI Based Recommendations",
          widgetDescription: "Displays AI-based recommended products."
        },
        ruleSettings: { priceMatch: "all", conditions: [] },
        widgetsSettings: {
          heading: "AI Based Recommendations",
          subHeading: "",
          viewType: "grid",
          layoutValue: "Layout_1",
          viewCardDesign: "vertical",
          totalProduct: 10,
          rangeDeskProValue: 4,
          rangeTbtProValue: 3,
          rangeMbProValue: 2
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      recentlyViewedProducts: {
        title: "Recently Viewed Products",
        active: true,
        no_of_products: 10,
        backend: {
          widgetName: "Recently Viewed Products",
          widgetDescription: "Displays products recently viewed by the user."
        },
        ruleSettings: { priceMatch: "all", conditions: [] },
        widgetsSettings: {
          heading: "Recently Viewed Products",
          subHeading: "",
          viewType: "grid",
          layoutValue: "Layout_1",
          viewCardDesign: "vertical",
          totalProduct: 10,
          rangeDeskProValue: 4,
          rangeTbtProValue: 3,
          rangeMbProValue: 2
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  },

  product: {
    productSettings: { pageActive: true, icon: true },
    widgets: {
      newrrival: {
        title: "New Arrivals",
        active: true,
        no_of_products: 10,
        backend: {
          widgetName: "New Arrivals",
          widgetDescription: "Displays the latest products added to the store."
        },
        ruleSettings: { priceMatch: "all", conditions: [] },
        widgetsSettings: {
          heading: "New Arrivals",
          subHeading: "",
          viewType: "grid",
          layoutValue: "Layout_1",
          viewCardDesign: "vertical",
          totalProduct: 10,
          rangeDeskProValue: 4,
          rangeTbtProValue: 3,
          rangeMbProValue: 2
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      relatedProducts: {
        title: "Related Products",
        active: true,
        no_of_products: 10,
        backend: {
          widgetName: "Related Products",
          widgetDescription: "Displays related products to the user."
        },
        ruleSettings: { priceMatch: "all", conditions: [] },
        widgetsSettings: {
          heading: "Related Products",
          subHeading: "",
          viewType: "grid",
          layoutValue: "Layout_1",
          viewCardDesign: "vertical",
          totalProduct: 10,
          rangeDeskProValue: 4,
          rangeTbtProValue: 3,
          rangeMbProValue: 2
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      aiBasedRecommendations: {
        title: "AI Based Recommendations",
        active: true,
        no_of_products: 10,
        backend: {
          widgetName: "AI Based Recommendations",
          widgetDescription: "Displays AI-based recommended products."
        },
        ruleSettings: { priceMatch: "all", conditions: [] },
        widgetsSettings: {
          heading: "AI Based Recommendations",
          subHeading: "",
          viewType: "grid",
          layoutValue: "Layout_1",
          viewCardDesign: "vertical",
          totalProduct: 10,
          rangeDeskProValue: 4,
          rangeTbtProValue: 3,
          rangeMbProValue: 2
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      recentlyViewedProducts: {
        title: "Recently Viewed Products",
        active: true,
        no_of_products: 10,
        backend: {
          widgetName: "Recently Viewed Products",
          widgetDescription: "Displays recently viewed products."
        },
        ruleSettings: { priceMatch: "all", conditions: [] },
        widgetsSettings: {
          heading: "Recently Viewed Products",
          subHeading: "",
          viewType: "grid",
          layoutValue: "Layout_1",
          viewCardDesign: "vertical",
          totalProduct: 10,
          rangeDeskProValue: 4,
          rangeTbtProValue: 3,
          rangeMbProValue: 2
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  },

  collection: {
    collectionSettings: { pageActive: true, icon: true },
    widgets: {
      newrrival: {
        title: "New Arrivals",
        active: true,
        no_of_products: 10,
        backend: {
          widgetName: "New Arrivals",
          widgetDescription: "Displays the latest products added to the store."
        },
        ruleSettings: { priceMatch: "all", conditions: [] },
        widgetsSettings: {
          heading: "New Arrivals",
          subHeading: "",
          viewType: "grid",
          layoutValue: "Layout_1",
          viewCardDesign: "vertical",
          totalProduct: 10,
          rangeDeskProValue: 4,
          rangeTbtProValue: 3,
          rangeMbProValue: 2
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      relatedProducts: {
        title: "Related Products",
        active: true,
        no_of_products: 10,
        backend: {
          widgetName: "Related Products",
          widgetDescription: "Displays related products to the user."
        },
        ruleSettings: { priceMatch: "all", conditions: [] },
        widgetsSettings: {
          heading: "Related Products",
          subHeading: "",
          viewType: "grid",
          layoutValue: "Layout_1",
          viewCardDesign: "vertical",
          totalProduct: 10,
          rangeDeskProValue: 4,
          rangeTbtProValue: 3,
          rangeMbProValue: 2
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      aiBasedRecommendations: {
        title: "AI Based Recommendations",
        active: true,
        no_of_products: 10,
        backend: {
          widgetName: "AI Based Recommendations",
          widgetDescription: "Displays AI-based recommended products."
        },
        ruleSettings: { priceMatch: "all", conditions: [] },
        widgetsSettings: {
          heading: "AI Based Recommendations",
          subHeading: "",
          viewType: "grid",
          layoutValue: "Layout_1",
          viewCardDesign: "vertical",
          totalProduct: 10,
          rangeDeskProValue: 4,
          rangeTbtProValue: 3,
          rangeMbProValue: 2
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      recentlyViewedProducts: {
        title: "Recently Viewed Products",
        active: true,
        no_of_products: 10,
        backend: {
          widgetName: "Recently Viewed Products",
          widgetDescription: "Displays recently viewed products."
        },
        ruleSettings: { priceMatch: "all", conditions: [] },
        widgetsSettings: {
          heading: "Recently Viewed Products",
          subHeading: "",
          viewType: "grid",
          layoutValue: "Layout_1",
          viewCardDesign: "vertical",
          totalProduct: 10,
          rangeDeskProValue: 4,
          rangeTbtProValue: 3,
          rangeMbProValue: 2
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  },

  cart: {
    cartSettings: { pageActive: true, icon: true },
    widgets: {
      newrrival: {
        title: "New Arrivals",
        active: true,
        no_of_products: 10,
        backend: {
          widgetName: "New Arrivals",
          widgetDescription: "Displays the latest products added to the store."
        },
        ruleSettings: { priceMatch: "all", conditions: [] },
        widgetsSettings: {
          heading: "New Arrivals",
          subHeading: "",
          viewType: "grid",
          layoutValue: "Layout_1",
          viewCardDesign: "vertical",
          totalProduct: 10,
          rangeDeskProValue: 4,
          rangeTbtProValue: 3,
          rangeMbProValue: 2
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      relatedProducts: {
        title: "Related Products",
        active: true,
        no_of_products: 10,
        backend: {
          widgetName: "Related Products",
          widgetDescription: "Displays related products to the user."
        },
        ruleSettings: { priceMatch: "all", conditions: [] },
        widgetsSettings: {
          heading: "Related Products",
          subHeading: "",
          viewType: "grid",
          layoutValue: "Layout_1",
          viewCardDesign: "vertical",
          totalProduct: 10,
          rangeDeskProValue: 4,
          rangeTbtProValue: 3,
          rangeMbProValue: 2
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      aiBasedRecommendations: {
        title: "AI Based Recommendations",
        active: true,
        no_of_products: 10,
        backend: {
          widgetName: "AI Based Recommendations",
          widgetDescription: "Displays AI-based recommended products."
        },
        ruleSettings: { priceMatch: "all", conditions: [] },
        widgetsSettings: {
          heading: "AI Based Recommendations",
          subHeading: "",
          viewType: "grid",
          layoutValue: "Layout_1",
          viewCardDesign: "vertical",
          totalProduct: 10,
          rangeDeskProValue: 4,
          rangeTbtProValue: 3,
          rangeMbProValue: 2
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      recentlyViewedProducts: {
        title: "Recently Viewed Products",
        active: true,
        no_of_products: 10,
        backend: {
          widgetName: "Recently Viewed Products",
          widgetDescription: "Displays recently viewed products."
        },
        ruleSettings: { priceMatch: "all", conditions: [] },
        widgetsSettings: {
          heading: "Recently Viewed Products",
          subHeading: "",
          viewType: "grid",
          layoutValue: "Layout_1",
          viewCardDesign: "vertical",
          totalProduct: 10,
          rangeDeskProValue: 4,
          rangeTbtProValue: 3,
          rangeMbProValue: 2
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  },

  other: {
    otherSettings: { pageActive: true, icon: true },
    widgets: {
      newrrival: {
        title: "New Arrivals",
        active: true,
        no_of_products: 10,
        backend: {
          widgetName: "New Arrivals",
          widgetDescription: "Displays the latest products added to the store."
        },
        ruleSettings: { priceMatch: "all", conditions: [] },
        widgetsSettings: {
          heading: "New Arrivals",
          subHeading: "",
          viewType: "grid",
          layoutValue: "Layout_1",
          viewCardDesign: "vertical",
          totalProduct: 10,
          rangeDeskProValue: 4,
          rangeTbtProValue: 3,
          rangeMbProValue: 2
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      relatedProducts: {
        title: "Related Products",
        active: true,
        no_of_products: 10,
        backend: {
          widgetName: "Related Products",
          widgetDescription: "Displays related products to the user."
        },
        ruleSettings: { priceMatch: "all", conditions: [] },
        widgetsSettings: {
          heading: "Related Products",
          subHeading: "",
          viewType: "grid",
          layoutValue: "Layout_1",
          viewCardDesign: "vertical",
          totalProduct: 10,
          rangeDeskProValue: 4,
          rangeTbtProValue: 3,
          rangeMbProValue: 2
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      aiBasedRecommendations: {
        title: "AI Based Recommendations",
        active: true,
        no_of_products: 10,
        backend: {
          widgetName: "AI Based Recommendations",
          widgetDescription: "Displays AI-based recommended products."
        },
        ruleSettings: { priceMatch: "all", conditions: [] },
        widgetsSettings: {
          heading: "AI Based Recommendations",
          subHeading: "",
          viewType: "grid",
          layoutValue: "Layout_1",
          viewCardDesign: "vertical",
          totalProduct: 10,
          rangeDeskProValue: 4,
          rangeTbtProValue: 3,
          rangeMbProValue: 2
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      recentlyViewedProducts: {
        title: "Recently Viewed Products",
        active: true,
        no_of_products: 10,
        backend: {
          widgetName: "Recently Viewed Products",
          widgetDescription: "Displays recently viewed products."
        },
        ruleSettings: { priceMatch: "all", conditions: [] },
        widgetsSettings: {
          heading: "Recently Viewed Products",
          subHeading: "",
          viewType: "grid",
          layoutValue: "Layout_1",
          viewCardDesign: "vertical",
          totalProduct: 10,
          rangeDeskProValue: 4,
          rangeTbtProValue: 3,
          rangeMbProValue: 2
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  },

  search: {
  searchSettings: { pageActive: true, icon: true },
  widgets: {
    newrrival: {
      title: "New Arrivals",
      active: true,
      no_of_products: 10,
      backend: {
        widgetName: "New Arrivals",
        widgetDescription: "Displays the latest products added to the store."
      },
      ruleSettings: { priceMatch: "all", conditions: [] },
      widgetsSettings: {
        heading: "New Arrivals",
        subHeading: "",
        viewType: "grid",
        layoutValue: "Layout_1",
        viewCardDesign: "vertical",
        totalProduct: 10,
        rangeDeskProValue: 4,
        rangeTbtProValue: 3,
        rangeMbProValue: 2
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    relatedProducts: {
      title: "Related Products",
      active: true,
      no_of_products: 10,
      backend: {
        widgetName: "Related Products",
        widgetDescription: "Displays related products to the user."
      },
      ruleSettings: { priceMatch: "all", conditions: [] },
      widgetsSettings: {
        heading: "Related Products",
        subHeading: "",
        viewType: "grid",
        layoutValue: "Layout_1",
        viewCardDesign: "vertical",
        totalProduct: 10,
        rangeDeskProValue: 4,
        rangeTbtProValue: 3,
        rangeMbProValue: 2
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    aiBasedRecommendations: {
      title: "AI Based Recommendations",
      active: true,
      no_of_products: 10,
      backend: {
        widgetName: "AI Based Recommendations",
        widgetDescription: "Displays AI-based recommended products."
      },
      ruleSettings: { priceMatch: "all", conditions: [] },
      widgetsSettings: {
        heading: "AI Based Recommendations",
        subHeading: "",
        viewType: "grid",
        layoutValue: "Layout_1",
        viewCardDesign: "vertical",
        totalProduct: 10,
        rangeDeskProValue: 4,
        rangeTbtProValue: 3,
        rangeMbProValue: 2
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    recentlyViewedProducts: {
      title: "Recently Viewed Products",
      active: true,
      no_of_products: 10,
      backend: {
        widgetName: "Recently Viewed Products",
        widgetDescription: "Displays products recently viewed by the user."
      },
      ruleSettings: { priceMatch: "all", conditions: [] },
      widgetsSettings: {
        heading: "Recently Viewed Products",
        subHeading: "",
        viewType: "grid",
        layoutValue: "Layout_1",
        viewCardDesign: "vertical",
        totalProduct: 10,
        rangeDeskProValue: 4,
        rangeTbtProValue: 3,
        rangeMbProValue: 2
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
},
notFound: {
  notFoundSettings: { pageActive: true, icon: true },
  widgets: {
    newrrival: {
      title: "New Arrivals",
      active: true,
      no_of_products: 10,
      backend: {
        widgetName: "New Arrivals",
        widgetDescription: "Displays the latest products added to the store."
      },
      ruleSettings: { priceMatch: "all", conditions: [] },
      widgetsSettings: {
        heading: "New Arrivals",
        subHeading: "",
        viewType: "grid",
        layoutValue: "Layout_1",
        viewCardDesign: "vertical",
        totalProduct: 10,
        rangeDeskProValue: 4,
        rangeTbtProValue: 3,
        rangeMbProValue: 2
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    relatedProducts: {
      title: "Related Products",
      active: true,
      no_of_products: 10,
      backend: {
        widgetName: "Related Products",
        widgetDescription: "Displays related products to the user."
      },
      ruleSettings: { priceMatch: "all", conditions: [] },
      widgetsSettings: {
        heading: "Related Products",
        subHeading: "",
        viewType: "grid",
        layoutValue: "Layout_1",
        viewCardDesign: "vertical",
        totalProduct: 10,
        rangeDeskProValue: 4,
        rangeTbtProValue: 3,
        rangeMbProValue: 2
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    aiBasedRecommendations: {
      title: "AI Based Recommendations",
      active: true,
      no_of_products: 10,
      backend: {
        widgetName: "AI Based Recommendations",
        widgetDescription: "Displays AI-based recommended products."
      },
      ruleSettings: { priceMatch: "all", conditions: [] },
      widgetsSettings: {
        heading: "AI Based Recommendations",
        subHeading: "",
        viewType: "grid",
        layoutValue: "Layout_1",
        viewCardDesign: "vertical",
        totalProduct: 10,
        rangeDeskProValue: 4,
        rangeTbtProValue: 3,
        rangeMbProValue: 2
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    recentlyViewedProducts: {
      title: "Recently Viewed Products",
      active: true,
      no_of_products: 10,
      backend: {
        widgetName: "Recently Viewed Products",
        widgetDescription: "Displays products recently viewed by the user."
      },
      ruleSettings: { priceMatch: "all", conditions: [] },
      widgetsSettings: {
        heading: "Recently Viewed Products",
        subHeading: "",
        viewType: "grid",
        layoutValue: "Layout_1",
        viewCardDesign: "vertical",
        totalProduct: 10,
        rangeDeskProValue: 4,
        rangeTbtProValue: 3,
        rangeMbProValue: 2
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
},




          homeWidgets: ['new_arrival', 'ai_based_recommendations', 'recently_viewed_products'],
          productWidgets: ['new_arrival', 'related_products', 'ai_based_recommendations', 'recently_viewed_products', 'fbt_products'],
          collectionWidgets: ['new_arrival', 'ai_based_recommendations', 'recently_viewed_products'],
          cartWidgets: ['new_arrival', 'related_products', 'ai_based_recommendations', 'recently_viewed_products'],
          checkoutWidgets: ['new_arrival', 'related_products', 'ai_based_recommendations', 'recently_viewed_products'],
          otherWidgets: [],
          preferences: {
            dashboardLayout: 'grid',
            itemsPerPage: 25,
            timezone: 'UTC'
          },
          shopActive: true
        };

      if (!existingShop) {
        // Insert default shop data
        await prisma.shopsettings.create({
          data: {
            ...defaultData,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });


        console.log(`Default data inserted for shop: ${session.shop}`);
      }
      else
      {
        await prisma.shopsettings.update({
          where: { shop: session.shop },
          data: defaultData
        });
      }
    } catch (error) {
      console.error('Error inserting default data:', error);
      // Don't throw error to avoid breaking session creation
    }
  }

export default shopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
