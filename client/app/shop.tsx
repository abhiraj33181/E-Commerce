import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { Product } from "@/constants/types";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import ProductCard from "@/components/ProductCard";
import api from "@/constants/api";
import { useLocalSearchParams } from "expo-router";

const CATEGORIES = [
  "All",
  "Men",
  "Women",
  "Kids",
  "Shoes",
  "Bags",
  "Other",
];

export default function Shop() {
  const params = useLocalSearchParams();

  const initialSearch = (params.search as string) || "";
  const initialCategory = (params.category as string) || "All";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Search and Filter States
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [showFilters, setShowFilters] = useState(false);

  // Updated fetch function accepting search and category params
  const fetchProducts = async (
    pageNumber = 1,
    currentSearch = searchQuery,
    currentCategory = selectedCategory,
  ) => {
    if (pageNumber === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const queryParams: any = { page: pageNumber, limit: 10 };

      // Attach search and category to API call
      if (currentSearch) queryParams.search = currentSearch;
      if (currentCategory !== "All") queryParams.category = currentCategory;

      const { data } = await api.get("/products", { params: queryParams });

      if (pageNumber === 1) {
        setProducts(data.data);
      } else {
        setProducts((prev) => [...prev, ...data.data]);
      }
      setHasMore(data.pagination.page < data.pagination.pages);
      setPage(pageNumber);
    } catch (error) {
      console.error("Pagination error :", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && !loading && hasMore) {
      fetchProducts(page + 1);
    }
  };

  // Trigger search when "Enter" is pressed on keyboard
  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);
    fetchProducts(1, searchInput, selectedCategory);
  };

  // Trigger category change
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    fetchProducts(1, searchQuery, category);
  };

  useEffect(() => {
    setSearchInput(initialSearch);
    setSearchQuery(initialSearch);
    setSelectedCategory(initialCategory);

    fetchProducts(1, initialSearch, initialCategory);
  }, [params.category, params.search]);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Shop" showBack showCart />

      <View className="flex-row gap-2 mb-2 mx-4 mt-2">
        {/* Search Bar */}
        <View className="flex-1 flex-row items-center bg-white rounded-xl border border-gray-100 shadow-sm shadow-gray-200 px-2 h-12">
          <Ionicons
            name="search"
            size={20}
            color={COLORS.secondary}
            className="ml-2"
          />
          <TextInput
            className="flex-1 ml-2 text-primary h-full"
            placeholder="Search products..."
            returnKeyType="search"
            placeholderTextColor={COLORS.secondary}
            value={searchInput}
            onChangeText={setSearchInput}
            onSubmitEditing={handleSearchSubmit} // Calls function when user hits "Search" on keyboard
          />
          {searchInput.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchInput("");
                setSearchQuery("");
                fetchProducts(1, "", selectedCategory);
              }}
              className="p-2"
            >
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Toggle Button */}
        <TouchableOpacity
          onPress={() => setShowFilters(!showFilters)}
          className={`w-12 h-12 items-center justify-center rounded-xl shadow-sm ${showFilters ? "bg-primary" : "bg-[#111827]"}`}
        >
          <Ionicons name="options-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Expandable Category Filters */}
      {showFilters && (
        <View className="mb-2">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => handleCategorySelect(cat)}
                className={`px-5 py-2 rounded-full mr-3 border ${
                  selectedCategory === cat
                    ? "bg-[#111827] border-[#111827]"
                    : "bg-white border-gray-200"
                }`}
              >
                <Text
                  className={`font-medium ${selectedCategory === cat ? "text-white" : "text-[#6B7280]"}`}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 100,
          }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => <ProductCard product={item} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View className="py-4">
                <ActivityIndicator size={"small"} color={COLORS.primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            !loading && (
              <View className="flex-1 items-center justify-center py-20">
                <Ionicons
                  name="search-outline"
                  size={48}
                  color="#D1D5DB"
                  className="mb-4"
                />
                <Text className="text-secondary text-lg font-medium">
                  No products found
                </Text>
                <Text className="text-gray-400 text-sm mt-1">
                  Try adjusting your filters or search query.
                </Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}
