import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import CartItem from '@/components/CartItem';

export default function Cart() {

  const { cartItems, cartTotal, removeFromCart, clearCart, updateQuantity } = useCart();
  const router = useRouter();

  const shipping = 2.00;
  const total = cartTotal + shipping;

  return (
    <SafeAreaView className='flex-1 bg-surface' edges={['top']}>
      <Header title='My Cart' showBack />

      {cartItems.length > 0 ? (
        <>
          <ScrollView className='flex-1 px-4 mt-1' showsVerticalScrollIndicator={false}>
            {cartItems.map((item, index) => (
              <CartItem
                item={item}
                key={index}
                onRemove={() => removeFromCart(item.id, item.size)}
                onUpdateQuantity={() => updateQuantity(item.id, 5, item.size)}
              />
            ))}
          </ScrollView>

          <View className='p-4 bg-white rounded-t-3xl shadow-sm'>
            {/* SubTotal */}
            <View className='flex-row justify-between mb-2'>
              <Text className='text-secondary'>Sub Total</Text>
              <Text className='text-primary font-bold'>${cartTotal.toFixed(2)}</Text>
            </View>

            {/* Shipping Details */}
            <View className='flex-row justify-between mb-2'>
              <Text className='text-secondary'>Shipping</Text>
              <Text className='text-primary font-bold'>${shipping.toFixed(2)}</Text>
            </View>

            {/* border */}
            <View className='h-[1px] bg-border mb-4' />

            {/* Total */}
            <View className='flex-row justify-between mb-6'>
              <Text className='text-primary font-bold text-lg'>Total</Text>
              <Text className='text-primary font-bold text-lg'>${total.toFixed(2)}</Text>
            </View>


            {/* Checkout */}
            <TouchableOpacity className='bg-primary py-4 rounded-full items-center' onPress={() => router.push("/checkout")}>
              <Text className='text-white font-bold text-base'>Chechout</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View className='flex-1 items-center justify-center'>
          <Text className='text-secondary text-lg'>Your Cart is empty</Text>
          <TouchableOpacity onPress={() => router.push('/')} className='rounded mt-4 bg-primary'>
            <Text className='p-2 text-white font-bold'>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}