"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  confirmOrder,
  createProduct,
  createPromotion,
  deleteProduct,
  getBotLogs,
  getCoupons,
  getOrders,
  getProducts,
  getPromotions,
  getSetting,
  getStats,
  getStockLogs,
  getUsers,
  rejectOrder,
  setProductStock,
  updateProduct,
  updatePromotion,
  updateSetting,
  type OrderListParams,
  type ProductFormValues,
  type PromotionFormValues,
} from "@/services";
import type { Setting } from "@/types/api/main";

export const STATS_QUERY_KEY = ["stats"] as const;
export const ORDERS_QUERY_KEY = ["orders"] as const;
export const PRODUCTS_QUERY_KEY = ["products"] as const;
export const PROMOTIONS_QUERY_KEY = ["promotions"] as const;
export const COUPONS_QUERY_KEY = ["coupons"] as const;
export const SETTING_QUERY_KEY = ["setting"] as const;
export const BOT_LOGS_QUERY_KEY = ["botLogs"] as const;
export const USERS_QUERY_KEY = ["users"] as const;

// ---- dashboard ----
export const useStats = () => useQuery({ queryKey: STATS_QUERY_KEY, queryFn: getStats, refetchInterval: 15_000 });

// ---- orders ----
export const useOrders = (params: OrderListParams) =>
  useQuery({ queryKey: [...ORDERS_QUERY_KEY, params], queryFn: () => getOrders(params), refetchInterval: 15_000 });

export const useOrderActions = () => {
  const qc = useQueryClient();
  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    void qc.invalidateQueries({ queryKey: STATS_QUERY_KEY });
    void qc.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
  };
  const confirm = useMutation({ mutationFn: ({ id, force }: { id: string; force?: boolean }) => confirmOrder(id, force), onSuccess: invalidate });
  const reject = useMutation({ mutationFn: ({ id, reason }: { id: string; reason?: string }) => rejectOrder(id, reason), onSuccess: invalidate });
  return { confirm, reject };
};

// ---- products ----
export const useProducts = () => useQuery({ queryKey: PRODUCTS_QUERY_KEY, queryFn: getProducts });
export const useStockLogs = (id: string | null) =>
  useQuery({ queryKey: [...PRODUCTS_QUERY_KEY, "logs", id], queryFn: () => getStockLogs(id as string), enabled: !!id });

export const useProductActions = () => {
  const qc = useQueryClient();
  const onSuccess = () => void qc.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
  return {
    create: useMutation({ mutationFn: (v: ProductFormValues) => createProduct(v), onSuccess }),
    update: useMutation({ mutationFn: ({ id, v }: { id: string; v: Partial<ProductFormValues> }) => updateProduct(id, v), onSuccess }),
    setStock: useMutation({ mutationFn: ({ id, stock }: { id: string; stock: number }) => setProductStock(id, stock), onSuccess }),
    remove: useMutation({ mutationFn: (id: string) => deleteProduct(id), onSuccess }),
  };
};

// ---- promotions ----
export const usePromotions = () => useQuery({ queryKey: PROMOTIONS_QUERY_KEY, queryFn: getPromotions });
export const useCoupons = () => useQuery({ queryKey: COUPONS_QUERY_KEY, queryFn: getCoupons });

export const usePromotionActions = () => {
  const qc = useQueryClient();
  const onSuccess = () => void qc.invalidateQueries({ queryKey: PROMOTIONS_QUERY_KEY });
  return {
    create: useMutation({ mutationFn: (v: PromotionFormValues) => createPromotion(v), onSuccess }),
    update: useMutation({ mutationFn: ({ id, v }: { id: string; v: Partial<PromotionFormValues> }) => updatePromotion(id, v), onSuccess }),
  };
};

// ---- settings ----
export const useSetting = () => useQuery({ queryKey: SETTING_QUERY_KEY, queryFn: getSetting });
export const useUpdateSetting = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: Partial<Setting>) => updateSetting(v),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: SETTING_QUERY_KEY });
      void qc.invalidateQueries({ queryKey: STATS_QUERY_KEY });
    },
  });
};

// ---- bot / users ----
export const useBotLogs = (onlyErrors: boolean) =>
  useQuery({ queryKey: [...BOT_LOGS_QUERY_KEY, onlyErrors], queryFn: () => getBotLogs(onlyErrors), refetchInterval: 10_000 });
export const useUsers = () => useQuery({ queryKey: USERS_QUERY_KEY, queryFn: getUsers });
