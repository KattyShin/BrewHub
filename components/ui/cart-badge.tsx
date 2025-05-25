import { View, Text } from "react-native"
import { useCart } from "contexts/cart-context"

export function CartBadge() {
  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()

  if (totalItems === 0) return null

  return (
    <View className="absolute -top-2 -right-2 bg-red-500 rounded-full min-w-[20px] h-5 flex items-center justify-center">
      <Text className="text-white text-xs font-bold">{totalItems > 99 ? "99+" : totalItems}</Text>
    </View>
  )
}
