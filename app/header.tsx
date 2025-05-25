import { View,Text } from "react-native"
import "~/global.css";


export default function Header() {
    return(
         <View className="flex flex-row items-center">
                    <View className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2">
                      <Text className="text-[#D97706] font-bold text-sm">BH</Text>
                    </View>
                    <View className="flex flex-row">
                      <Text className="text-white font-bold text-lg">Brew</Text>
                      <Text className="text-white font-bold text-lg bg-black px-2">
                        HUB
                      </Text>
                    </View>
                  </View>
        
    )
    
}