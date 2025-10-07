import prisma from "../db.server";


export async function saveShopSettings(shop: string, completeSettings: any) {
  try {
    // Extract the globalSettings from the complete settings object
    const { globalSettings, ...otherSettings } = completeSettings;
    
    // First try to find existing shop settings for this shop
    const existingShopSettings = await prisma.shopsettings.findUnique({
      where: { shop }
    });

    let result;
    if (existingShopSettings) {
      // Update existing shop settings
      result = await prisma.shopsettings.update({
        where: { shop },
        data: {
          globalSettings: globalSettings,
          settings: otherSettings.settings,
          home: otherSettings.home,
          product: otherSettings.product,
          collection: otherSettings.collection,
          cart: otherSettings.cart,
          checkout: otherSettings.checkout,
          other: otherSettings.other,
          homeWidgets: otherSettings.homeWidgets,
          productWidgets: otherSettings.productWidgets,
          collectionWidgets: otherSettings.collectionWidgets,
          cartWidgets: otherSettings.cartWidgets,
          checkoutWidgets: otherSettings.checkoutWidgets,
          otherWidgets: otherSettings.otherWidgets,
          preferences: otherSettings.preferences
        }
      });
    } 

    console.log('Settings saved successfully for shop:', shop);
    return result;
  } catch (error) {
    console.error('Error saving shop settings:', error);
    throw error;
  }
}
