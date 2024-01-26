import { StatusBar } from "expo-status-bar";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./screens/WelcomeScreen";
import Loginscreen from "./screens/Loginscreen";
import RegisterScreen from "./screens/RegisterScreen";
import Searchscreen from "./screens/Searchscreen";
import HomeScreen from "./screens/HomeScreen";
import SettingScreen from "./screens/SettingScreen";
import ProfileScreen from "./screens/ProfileScreen";
import FavoriteScreen from "./screens/FavoriteScreen";
import UpdatePassowrscreen from "./screens/UpdatePassowrscreen";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import ButtomTap from "./components/BottomTab";
import DetailsScreen from "./screens/DetailScreen";
import Onboarding from "./screens/Onboarding";
import ReviewsDetails from "./components/ReviewsDetails";

const Stack = createNativeStackNavigator();
const Mycompenet = ({ SetActive }) => {
  const navigation = useNavigation();
  useEffect(() => {
    const unactive = navigation.addListener("state", () => {
      const currentScreen = navigation.getCurrentRoute().name;
      SetActive(currentScreen);
    });
    return unactive;
  }, [navigation]);
};

export default function App() {
  const [Active, SetActive] = useState("");
  const [fontloaded] = useFonts({
    InterBold: require("./assets/font/Inter-Bold.ttf"),
    InterSemiBold: require("./assets/font/Inter-Light.ttf"),
    InterMedium: require("./assets/font/Inter-Medium.ttf"),
    InterRegular: require("./assets/font/Inter-Regular.ttf"),
    InterLight: require("./assets/font/Inter-SemiBold.ttf"),
  });

  // Ignore SSL errors
  if (Platform.OS === "android") {
    console.disableYellowBox = true;
    // You can add more SSL error warnings as needed.
  }

  if (!fontloaded) return null;
  return (
    <>
      <StatusBar style="auto" animated={true} />
      <NavigationContainer>
        <Mycompenet SetActive={SetActive} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcomme" component={WelcomeScreen} />
          <Stack.Screen name="Onboarding" component={Onboarding} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Search" component={Searchscreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Settings" component={SettingScreen} />
          <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Updatepassword" component={UpdatePassowrscreen} />
          <Stack.Screen name="Favorite" component={FavoriteScreen} />
          <Stack.Screen name="Login" component={Loginscreen} />
          <Stack.Screen name="ReviewsDetails" component={ReviewsDetails} />
        </Stack.Navigator>
        {Active !== "Welcomme" &&
        Active !== "Onboarding" &&
        Active !== "Register" &&
        Active !== "Details" &&
        Active !== "Profile" &&
        Active !== "Updatepassword" &&
        Active !== "DetailsScreen" &&
        Active !== "Login" ? (
          <ButtomTap Active={Active} />
        ) : (
          <></>
        )}
      </NavigationContainer>
    </>
  );
}
