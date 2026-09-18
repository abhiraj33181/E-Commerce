import api from "@/constants/api";
import { Product, WishlistContextType } from "@/constants/types";
import { getToken } from "@/utils/secureStore";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./authContext";

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const {user, token} = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      if (!user || !token) {
        setWishlist([]);
        return;
      }
      const { data } = await api.get("/products/wishlist", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      console.log("Fetched Wishlist:", data.data);
      setWishlist(data.data);
    } catch (error: any) {
      console.log("Response:", error?.response?.data);
      console.error(
        "Fetch Wishlist Error:",
        error?.response?.data?.message || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (product: Product) => {
    try {
      await api.patch(
        `/products/${product._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        },
      );
      await fetchWishlist();
    } catch (error: any) {
      console.error(
        "Toggle Wishlist Error:",
        error?.response?.data?.message || error.message,
      );
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p._id === productId);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const value = {
    wishlist,
    loading,
    toggleWishlist,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
