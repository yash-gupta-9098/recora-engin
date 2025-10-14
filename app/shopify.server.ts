import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
  Session
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";
import { aiBasedRecommendationsConfig, manualProductsConfig, newArrivalsConfig, recentlyViewedProductsConfig, relatedProductsConfig, topSellingProductsConfig, trendingProductsConfig } from "./constants/defaultValues/defaultWidgetConfig";
import { defaultGlobalSettings } from "./constants/defaultValues/defaultGlobalSettings";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.January25,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  hooks: {
    afterAuth: async ({ session }: any) => {
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


async function insertDefaultShopData(session: Session) {
  try {
    console.log('session in insertDefaultShopData ', session);
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
      globalSettings: { defaultGlobalSettings },
      home: {
        homeSettings: { pageActive: true, icon: true },
        widgets: {
          topSelling: topSellingProductsConfig,
          trending: trendingProductsConfig,
          aiBasedRecommendations: aiBasedRecommendationsConfig,
          newarival: newArrivalsConfig,
          recentlyViewed: recentlyViewedProductsConfig,
        }
      },
      product: {
        productSettings: { pageActive: true, icon: true },
        widgets: {
          related: relatedProductsConfig,
          topSelling: topSellingProductsConfig,
          trending: trendingProductsConfig,
          manual: manualProductsConfig,
          aiBasedRecommendations: aiBasedRecommendationsConfig,
          newarival: newArrivalsConfig,
          recentlyViewed: recentlyViewedProductsConfig,
        }
      },
      collection: {
        collectionSettings: { pageActive: true, icon: true },
        widgets: {
          topSelling: topSellingProductsConfig,
          trending: trendingProductsConfig,
          aiBasedRecommendations: aiBasedRecommendationsConfig,
          newarival: newArrivalsConfig,
          recentlyViewed: recentlyViewedProductsConfig,
        }
      },
      cart: {
        cartSettings: { pageActive: true, icon: true },
        widgets: {
          related: relatedProductsConfig,
          topSelling: topSellingProductsConfig,
          trending: trendingProductsConfig,
          manual: manualProductsConfig,
          aiBasedRecommendations: aiBasedRecommendationsConfig,
          newarival: newArrivalsConfig,
          recentlyViewed: recentlyViewedProductsConfig,
        }
      },
      other: {
        otherSettings: { pageActive: true, icon: true },
        widgets: {
          topSelling: topSellingProductsConfig,
          trending: trendingProductsConfig,
          aiBasedRecommendations: aiBasedRecommendationsConfig,
          newarival: newArrivalsConfig,
          recentlyViewed: recentlyViewedProductsConfig,
        }
      },
      search: {
        searchSettings: { pageActive: true, icon: true },
        widgets: {
          topSelling: topSellingProductsConfig,
          trending: trendingProductsConfig,
          aiBasedRecommendations: aiBasedRecommendationsConfig,
          newarival: newArrivalsConfig,
          recentlyViewed: recentlyViewedProductsConfig,
        }
      },
      notFound: {
        notFoundSettings: { pageActive: true, icon: true },
        widgets: {
          topSelling: topSellingProductsConfig,
          trending: trendingProductsConfig,
          aiBasedRecommendations: aiBasedRecommendationsConfig,
          newarival: newArrivalsConfig,
          recentlyViewed: recentlyViewedProductsConfig,
        }
      },
      // preferences: {
      //   dashboardLayout: 'grid',
      //   itemsPerPage: 25,
      //   timezone: 'UTC'
      // },
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
    else {
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
