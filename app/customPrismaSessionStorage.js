// app/lib/customPrismaSessionStorage.js
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { title } from "process";

export class CustomPrismaSessionStorage extends PrismaSessionStorage {
  constructor(prisma, options = {}) {
    super(prisma, options);
    this.prisma = prisma;
  }

  async storeSession(session) {
    try {
      console.log('Storing session:', session);

      // Check if session already exists
      const existingSession = await this.prisma.session.findUnique({
        where: { id: session.id }
      });

      console.log('existingSession',existingSession)

      // Prepare the session data
      const sessionData = {
        id: session.id,
        shop: session.shop,
        state: session.state,
        isOnline: session.isOnline,
        scope: session.scope,
        expires: session.expires,
        accessToken: session.accessToken,
        userId: session.userId ? BigInt(session.userId) : null,
        firstName: session.firstName,
        lastName: session.lastName,
        email: session.email,
        accountOwner: session.accountOwner,
        locale: session.locale,
        collaborator: session.collaborator,
        emailVerified: session.emailVerified,
      };

      console.log('sessionData',sessionData)

      if (!existingSession) {
        // New session - add default values
        sessionData.firstName = sessionData.firstName || 'rinkal';
        sessionData.settings = {
          theme: 'light',
          language: 'en',
          currency: 'USD',
          notifications: true,
          autoSync: false
        };
        sessionData.home = {
          pagective: true,
          icon: true,
          newrrival: {
            title:'New Arrivale',
            active: true,
            no_of_products: 10
          },
          relatedProducts: {
            title:'Related Products',
            active: true,
            no_of_products: 10
          },
          aiBasedRecommendations: {
            title:'AI Based Recommendations',
            active: true,
            no_of_products: 10
          },
          recentlyViewedProducts: {
            title:'Recently Viewed Products',
            active: true,
            no_of_products: 10
          }
        };
        sessionData.product = {
          pagective: true,
          icon: true,
          newrrival: {
            title:'New Arrivale',
            active: true,
            no_of_products: 10
          },
          relatedProducts: {
            title:'Related Products',
            active: true,
            no_of_products: 10
          },
          aiBasedRecommendations: {
            title:'AI Based Recommendations',
            active: true,
            no_of_products: 10
          },
          recentlyViewedProducts: {
            title:'Recently Viewed Products',
            active: true,
            no_of_products: 10
          }
        };
        sessionData.collection = {
          pagective: true,
          icon: true,
          newrrival: {
            title:'New Arrivale',
            active: true,
            no_of_products: 10
          },
          relatedProducts: {
            title:'Related Products',
            active: true,
            no_of_products: 10
          },
          aiBasedRecommendations: {
            title:'AI Based Recommendations',
            active: true,
            no_of_products: 10
          },
          recentlyViewedProducts: {
            title:'Recently Viewed Products',
            active: true,
            no_of_products: 10
          }
        };
        sessionData.cart = {
          pagective: true,
          icon: true,
          newrrival: {
            title:'New Arrivale',
            active: true,
            no_of_products: 10
          },
          relatedProducts: {
            title:'Related Products',
            active: true,
            no_of_products: 10
          },
          aiBasedRecommendations: {
            title:'AI Based Recommendations',
            active: true,
            no_of_products: 10
          },
          recentlyViewedProducts: {
            title:'Recently Viewed Products',
            active: true,
            no_of_products: 10
          }
        };
        sessionData.checkout = {
          pagective: true,
          icon: true,
          newrrival: {
            title:'New Arrivale',
            active: true,
            no_of_products: 10
          },
          relatedProducts: {
            title:'Related Products',
            active: true,
            no_of_products: 10
          },
          aiBasedRecommendations: {
            title:'AI Based Recommendations',
            active: true,
            no_of_products: 10
          },
          recentlyViewedProducts: {
            title:'Recently Viewed Products',
            active: true,
            no_of_products: 10
          }
        };
        sessionData.other = {
          pagective: true,
          icon: true,
          newrrival: {
            title:'New Arrivale',
            active: true,
            no_of_products: 10
          },
          relatedProducts: {
            title:'Related Products',
            active: true,
            no_of_products: 10
          },
          aiBasedRecommendations: {
            title:'AI Based Recommendations',
            active: true,
            no_of_products: 10
          },
          recentlyViewedProducts: {
            title:'Recently Viewed Products',
            active: true,
            no_of_products: 10
          }
        };
        // sessionData.preferences = {
        //   dashboardLayout: 'grid',
        //   itemsPerPage: 25,
        //   timezone: 'UTC'
        // };
        // sessionData.shopActive = true;
        // sessionData.createdAt = new Date();

        console.log('Creating new session with defaults');
      } else {
        // Existing session - preserve custom fields
        // sessionData.settings = existingSession.settings;
        sessionData.home = existingSession.home;
        sessionData.product = existingSession.product;
        sessionData.collection = existingSession.collection;
        sessionData.cart = existingSession.cart;
        sessionData.checkout = existingSession.checkout;
        sessionData.other = existingSession.other;
        // sessionData.homeWidgets = existingSession.homeWidgets;
        // sessionData.productWidgets = existingSession.productWidgets;
        // sessionData.collectionWidgets = existingSession.collectionWidgets;
        // sessionData.cartWidgets = existingSession.cartWidgets;
        // sessionData.checkoutWidgets = existingSession.checkoutWidgets;
        // sessionData.otherWidgets = existingSession.otherWidgets;
        // sessionData.preferences = existingSession.preferences;
        // sessionData.shopActive = existingSession.shopActive;
        sessionData.createdAt = existingSession.createdAt;
        sessionData.firstName = existingSession.firstName || sessionData.firstName || 'rinkal';

        console.log('Updating existing session');
      }

      console.log('sessionData',sessionData)
      // Use upsert to handle both cases
      const result = await this.prisma.session.upsert({
        where: { id: session.id },
        update: sessionData,
        create: sessionData
      });

      console.log(`Session stored successfully for shop: ${session.shop}`);
      return result;

    } catch (error) {
      console.error('Error storing session with defaults:', error);
      // Fallback to original method if our custom logic fails
      return await super.storeSession(session);
    }
  }

  // Override the loadSession method to ensure we get all fields
  async loadSession(id) {
    try {
      const session = await this.prisma.session.findUnique({
        where: { id }
      });

      if (session) {
        console.log('Loaded session with custom data:', session);
      }

      return session;
    } catch (error) {
      console.error('Error loading session:', error);
      return await super.loadSession(id);
    }
  }
}