import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
  Session
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";
import { aiSmartPicksConfig, personalizedForYouConfig, latestArrivalsConfig, recentlyViewedConfig, similarProductsConfig, bestSellersConfig, trendingNowConfig } from "./constants/defaultValues/defaultWidgetConfig";
import { defaultGlobalSettings } from "./constants/defaultValues/defaultGlobalSettings";
import { Prisma } from "@prisma/client";

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
      // console.log("afterAuth", session)
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


// insert default shop data
async function insertDefaultShopData(session: Session) {
  try {
    // Check if shop data already exists
    const existingShop = await prisma.shopsettings.findUnique({
      where: { shop: session.shop }
    });

    const defaultData = {
      id: session.id,
      shop: session.shop,
      accessToken: session.accessToken,
      scope: session.scope,
      storefrontaccessToken: await getstorefronttoken(session),
      firstName: 'rinkal verma',
      globalSettings: defaultGlobalSettings as unknown as Prisma.JsonObject,
      home: {
        pageBlockSettings: { pageActive: true, icon: true },
        widgets: {
          bestSellers: bestSellersConfig,
          trendingNow: trendingNowConfig,
          aiSmartPicks: aiSmartPicksConfig,
          latestArrivals: latestArrivalsConfig,
          recentlyViewed: recentlyViewedConfig,
        }
      },
      product: {
        pageBlockSettings: { pageActive: true, icon: true },
        widgets: {
          similarProducts: similarProductsConfig,
          bestSellers: bestSellersConfig,
          trendingNow: trendingNowConfig,
          personalizedForYou: personalizedForYouConfig,
          aiSmartPicks: aiSmartPicksConfig,
          latestArrivals: latestArrivalsConfig,
          recentlyViewed: recentlyViewedConfig,
        }
      },
      collection: {
        pageBlockSettings: { pageActive: true, icon: true },
        widgets: {
          bestSellers: bestSellersConfig,
          trendingNow: trendingNowConfig,
          aiSmartPicks: aiSmartPicksConfig,
          latestArrivals: latestArrivalsConfig,
          recentlyViewed: recentlyViewedConfig,
        }
      },
      cart: {
        pageBlockSettings: { pageActive: true, icon: true },
        widgets: {
          similarProducts: similarProductsConfig,
          bestSellers: bestSellersConfig,
          trendingNow: trendingNowConfig,
          personalizedForYou: personalizedForYouConfig,
          aiSmartPicks: aiSmartPicksConfig,
          latestArrivals: latestArrivalsConfig,
          recentlyViewed: recentlyViewedConfig,
        }
      },
      other: {
        pageBlockSettings: { pageActive: true, icon: true },
        widgets: {
          bestSellers: bestSellersConfig,
          trendingNow: trendingNowConfig,
          aiSmartPicks: aiSmartPicksConfig,
          latestArrivals: latestArrivalsConfig,
          recentlyViewed: recentlyViewedConfig,
        }
      },
      search: {
        pageBlockSettings: { pageActive: true, icon: true },
        widgets: {
          bestSellers: bestSellersConfig,
          trendingNow: trendingNowConfig,
          aiSmartPicks: aiSmartPicksConfig,
          latestArrivals: latestArrivalsConfig,
          recentlyViewed: recentlyViewedConfig,
        }
      },
      notFound: {
        pageBlockSettings: { pageActive: true, icon: true },
        widgets: {
          bestSellers: bestSellersConfig,
          trendingNow: trendingNowConfig,
          aiSmartPicks: aiSmartPicksConfig,
          latestArrivals: latestArrivalsConfig,
          recentlyViewed: recentlyViewedConfig,
        }
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



// get storeFront access token
async function getstorefronttoken(session: Session) {
  let shop = session.shop;
  let shopToken = session.accessToken;
  const mutation = `
        mutation {
          storefrontAccessTokenCreate(input: {
            title: "Recora Storefront Token"
          }) {
            storefrontAccessToken {
              accessToken
              title
            }
            userErrors {
              field
              message
            }
          }
        }
      `;
  let response = await fetch(`https://${shop}/admin/api/2025-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': shopToken
    },
    body: JSON.stringify({
      query: mutation
    })
  });
  const data = await response.json();
  let storefronttoken = data.data.storefrontAccessTokenCreate.storefrontAccessToken.accessToken;
  return storefronttoken;
}




export default shopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
