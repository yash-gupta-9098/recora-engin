import prisma from "app/db.server";

export async function getShopSettings(shop: string) {
    
  try {
    const shopData = await prisma.shopsettings.findUnique({
      where: {
        shop: shop,
      },
    });

    if (!shopData) {
      throw new Error(`No settings found for shop: ${shop}`);
    }

    return shopData;
  } catch (error) {
    console.error("Error fetching shop settings:", error);
    throw error;
  }
}