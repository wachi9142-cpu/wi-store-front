import type { AppUser, BotLog, Coupon, Order, Product, Promotion, Setting, Stats, StockLog } from "@/types/api/main";
import { mainClient } from "./client";

// products
export const getProductsApi = () => mainClient.get<Product[]>("/api/products");
export const createProductApi = (body: Partial<Product>) => mainClient.post<Product>("/api/products", body);
export const updateProductApi = (id: string, body: Partial<Product>) => mainClient.patch<Product>(`/api/products/${id}`, body);
export const setProductStockApi = (id: string, stock: number) => mainClient.put<Product>(`/api/products/${id}/stock`, { stock });
export const deleteProductApi = (id: string) => mainClient.delete<Product>(`/api/products/${id}`);
export const getStockLogsApi = (id: string) => mainClient.get<StockLog[]>(`/api/products/${id}/stock-logs`);

// settings
export const getSettingApi = () => mainClient.get<Setting>("/api/settings");
export const updateSettingApi = (body: Partial<Setting>) => mainClient.put<Setting>("/api/settings", body);

// promotions / coupons
export const getPromotionsApi = () => mainClient.get<Promotion[]>("/api/promotions");
export const createPromotionApi = (body: Partial<Promotion>) => mainClient.post<Promotion>("/api/promotions", body);
export const updatePromotionApi = (id: string, body: Partial<Promotion>) => mainClient.patch<Promotion>(`/api/promotions/${id}`, body);
export const getCouponsApi = () => mainClient.get<Coupon[]>("/api/promotions/coupons");

// admin
export const getStatsApi = () => mainClient.get<Stats>("/api/admin/stats");
export const getOrdersApi = (params?: { status?: string; pickupDate?: string; take?: number }) =>
  mainClient.get<Order[]>("/api/admin/orders", { params });
export const confirmOrderApi = (id: string, force = false) => mainClient.post<Order>(`/api/admin/orders/${id}/confirm`, { force });
export const rejectOrderApi = (id: string, reason?: string) => mainClient.post<Order>(`/api/admin/orders/${id}/reject`, { reason });
export const getBotLogsApi = (params?: { onlyErrors?: boolean; take?: number }) => mainClient.get<BotLog[]>("/api/admin/bot-logs", { params });
export const getUsersApi = () => mainClient.get<AppUser[]>("/api/admin/users");

export const slipUrl = (orderId: string) => `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4008"}/api/orders/${orderId}/slip.jpg`;
