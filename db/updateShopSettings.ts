import prisma from "../db.server";
import { authenticate } from '../app/shopify.server';

export async function updateShopSettings(request: Request, updateSettings: any) {
  try {
    // Extract the globalSettings from the complete settings object
    // const { globalSettings, ...otherSettings } = completeSettings;
    const {session} = await authenticate.admin(request); 
    const shop = session.shop;
    console.log('update file shop',shop)
    console.log('update file',updateSettings)
    // First try to find existing shop settings for this shop
    const existingShopSettings = await prisma.shopsettings.findUnique({
      where: { shop }
    });

    let result;
    if (existingShopSettings) {
      // Update existing shop settings
      result = await prisma.shopsettings.update({
        where: { shop },
        data: updateSettings 
      });
    } 

    
    console.log('Settings saved successfully for shop:', shop);
    return result;
  } catch (error) {
    console.error('Error saving shop settings:', error);
    throw error;
  }
}
