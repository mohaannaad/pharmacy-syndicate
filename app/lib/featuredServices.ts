import { prisma } from "./prisma";
import { DEFAULT_FEATURED, isValidFeatured } from "./services";

const SETTING_KEY = "featuredServices";

// بترجع الخدمات المختارة للصفحة الرئيسية (أو الافتراضية لو مفيش اختيار محفوظ)
export async function getFeaturedServiceKeys(): Promise<string[]> {
  const setting = await prisma.siteSetting.findUnique({ where: { key: SETTING_KEY } });
  return setting && isValidFeatured(setting.value) ? setting.value : DEFAULT_FEATURED;
}

export async function saveFeaturedServiceKeys(keys: string[]) {
  await prisma.siteSetting.upsert({
    where: { key: SETTING_KEY },
    update: { value: keys },
    create: { key: SETTING_KEY, value: keys },
  });
}