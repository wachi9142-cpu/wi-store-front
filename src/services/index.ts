import {
  confirmOrderApi,
  createProductApi,
  createPromotionApi,
  deleteProductApi,
  getBotLogsApi,
  getCouponsApi,
  getOrdersApi,
  getProductsApi,
  getPromotionsApi,
  getSettingApi,
  getStatsApi,
  getStockLogsApi,
  getUsersApi,
  rejectOrderApi,
  setProductStockApi,
  updateProductApi,
  updatePromotionApi,
  updateSettingApi,
} from "@/lib/api/api-main";
import type { OrderStatus, Product, Promotion, Setting } from "@/types/api/main";

// ---- dashboard ----
export const getStats = async () => (await getStatsApi()).data;

// ---- orders ----
export interface OrderListParams {
  status?: OrderStatus | "";
  pickupDate?: string;
}
export const getOrders = async (params: OrderListParams) =>
  (await getOrdersApi({ status: params.status || undefined, pickupDate: params.pickupDate || undefined, take: 300 })).data;
export const confirmOrder = async (id: string, force = false) => (await confirmOrderApi(id, force)).data;
export const rejectOrder = async (id: string, reason?: string) => (await rejectOrderApi(id, reason)).data;

// ---- products ----
export type ProductFormValues = Pick<Product, "name" | "price" | "unit" | "active" | "sortOrder">;
export const getProducts = async () => (await getProductsApi()).data;
export const createProduct = async (v: ProductFormValues) => (await createProductApi(v)).data;
export const updateProduct = async (id: string, v: Partial<ProductFormValues>) => (await updateProductApi(id, v)).data;
export const setProductStock = async (id: string, stock: number) => (await setProductStockApi(id, stock)).data;
export const deleteProduct = async (id: string) => (await deleteProductApi(id)).data;
export const getStockLogs = async (id: string) => (await getStockLogsApi(id)).data;

// ---- promotions ----
export type PromotionFormValues = Pick<Promotion, "name" | "startDate" | "endDate" | "targetQty" | "rewardAmount" | "productId" | "active">;
export const getPromotions = async () => (await getPromotionsApi()).data;
export const createPromotion = async (v: PromotionFormValues) => (await createPromotionApi(v)).data;
export const updatePromotion = async (id: string, v: Partial<PromotionFormValues>) => (await updatePromotionApi(id, v)).data;
export const getCoupons = async () => (await getCouponsApi()).data;

// ---- settings ----
export const getSetting = async () => (await getSettingApi()).data;
export const updateSetting = async (v: Partial<Setting>) => (await updateSettingApi(v)).data;

// ---- bot / users ----
export const getBotLogs = async (onlyErrors: boolean) => (await getBotLogsApi({ onlyErrors, take: 200 })).data;
export const getUsers = async () => (await getUsersApi()).data;
