import { Product } from "@/constants/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./authContext";
import api from "@/constants/api";
import { getToken } from "@/utils/secureStore";
import Toast from "react-native-toast-message";

export type CartItem = {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size: string;
  price: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, size: string) => Promise<void>;
  removeFromCart: (itemId: string, size: string) => Promise<void>;
  updateQuantity: (
    itemId: string,
    quantity: number,
    size: string,
  ) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  itemCount: number;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      const serverCart = data.data;
      const mappeditems: CartItem[] = serverCart.items.map((item: any) => ({
        id: item.product._id,
        productId: item.product._id,
        product: item.product,
        quantity: item.quantity,
        size: item.size || "M",
        price: item.price,
      }));
      setCartItems(mappeditems);
      setCartTotal(serverCart.totalAmount);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }

    setIsLoading(false);
  };

  const addToCart = async (product: Product, size: string) => {
    if (!user) {
      return Toast.show({
        text1: "Please login to add to cart",
        type: "error",
      });
    }

    try {
      setIsLoading(true);
      const { data } = await api.post(
        "/cart/add",
        { productId: product._id, quantity: 1, size },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        },
      );

      if (data.success) {
        await fetchCart();
      }
    } catch (error) {
        console.error('Failed to add to cart:', error)
        Toast.show({
            type : 'error',
            text1 : "Failed to add to cart"
        })
    } finally {
        setIsLoading(false)
    }
  };

  const removeFromCart = async (productId: string, size: string) => {
    if (!user) return;

    try {
        const {data} = await api.delete(`/cart/item/${productId}?size=${size}`, {
            headers : {
                Authorization: `Bearer ${await getToken()}`,
            },
        });

        if (data.success) {
            await fetchCart();
        }
    } catch (error) {
        console.error('Failed to remove from cart:', error)
        Toast.show({
            type : 'error',
            text1 : "Failed to remove from cart"
        })
    } finally {
        setIsLoading(false);
    }
  };

  const updateQuantity = async (
    productId: string,
    quantity: number,
    size: string = "M",
  ) => {
    if (!user) return;
    if (quantity < 1) return;

    try {
        const {data} = await api.put(`/cart/item/${productId}`, { quantity, size }, {
            headers : {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        if (data.success) {
            await fetchCart();
        }
    } catch (error) {
        console.error('Failed to update quantity:', error)
        Toast.show({
            type : 'error',
            text1 : "Failed to update quantity"
        })
    }
    
  };

  const clearCart = async () => {
    if (!user) return;

    try {
        setIsLoading(true);
        const {data} = await api.delete('/cart/clear', {
            headers : {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        if (data.success) {
            setCartItems([]);
            setCartTotal(0);
        }
    } catch (error) {
        console.error('Failed to clear cart:', error);
        Toast.show({
            type : 'error',
            text1 : "Failed to clear cart"
        })
    } finally {
        setIsLoading(false);
    }
  };

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
      setCartTotal(0);
    }
  }, [user]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    itemCount,
    isLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a cartProvider");
  }

  return context;
}
