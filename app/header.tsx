import { View, Image } from "react-native";
import "~/global.css";
import Logo from "~/assets/images/brewhub.png";

export default function Header() {
  return (
    <View>
      <Image
        source={Logo}
        className="w-40 h-12"
        resizeMode="contain"
      />
    </View>
  );
}
