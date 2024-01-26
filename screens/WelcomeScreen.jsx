import React, { useRef } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  StyleSheet,
  Animated,
  Image,
} from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import { TouchableOpacity } from "react-native";
const DATA = [
  {
    title: "Trouvez Votre Parking\nSécurisé",
    desc: "Partout Au Maroc",
  },
  {
    title: "Stationnement Simplifié",
    desc: "Trouvez des places de parking disponibles en un instant, où que vous soyez au Maroc. Fini les soucis de stationnement.",
  },
  {
    title: "Gérez Vos Réservations",
    desc: "Réservez et payez votre place de parking en avance. Profitez d'une expérience de stationnement sans stress.",
  },
];

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { colors } = theme;
  const scrollValue = useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 50,
            paddingBottom: 30,
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("../assets/images/marker.png")}
              style={{
                height: 48,
                width: 48,
                borderRadius: 48,
                position: "absolute",
                bottom: 0,
                right: 18,
              }}
            />
            <Image
              source={require("../assets/images/marker.png")}
              style={{
                height: 45,
                width: 45,
                borderRadius: 45,
                position: "absolute",
                top: -20,
                right: 60,
              }}
            />
            <Image
              source={require("../assets/images/marker.png")}
              style={{
                height: 35,
                width: 35,
                borderRadius: 35,
                position: "absolute",
                bottom: 50,
                left: -5,
              }}
            />

            <View
              style={{
                padding: 30,
              }}
            >
              <View
                style={{
                  height: 192,
                  width: 192,
                  borderRadius: 100,
                  borderWidth: 4,
                  borderStyle: "dashed",
                  borderColor: COLORS.second,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  style={{
                    height: 150,
                    width: 150,
                    resizeMode: "contain",
                  }}
                  source={require("../assets/images/logo.png")}
                />
              </View>
            </View>
          </View>
        </View>
        <View>
          <ScrollView
            horizontal
            pagingEnabled
            scrollEventThrottle={16}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollValue } } }],
              { useNativeDriver: false }
            )}
          >
            {DATA.map((data, index) => (
              <View style={[styles.slideItem]} key={index}>
                <Text
                  style={[
                    {
                      textAlign: "center",
                      color: COLORS.title,
                      marginBottom: 5,
                      fontSize: SIZES.xLarge,
                      fontFamily: FONTS.regular,
                    },
                  ]}
                >
                  {data.title}
                </Text>
                <Text
                  style={[
                    FONTS.fontBold,
                    {
                      fontSize: 16,
                      textAlign: "center",
                      color: COLORS.title,
                      opacity: 0.7,
                    },
                  ]}
                >
                  {data.desc}
                </Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.indicatorConatiner} pointerEvents="none">
            {DATA.map((x, i) => (
              <Indicator i={i} key={i} scrollValue={scrollValue} />
            ))}
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 45,
            paddingVertical: 35,
          }}
        >
          <View style={{ paddingBottom: 10 }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.buttonText}>Commencer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
function Indicator({ i, scrollValue }) {
  const theme = useTheme();

  const translateX = scrollValue.interpolate({
    inputRange: [
      -SIZES.width + i * SIZES.width,
      i * SIZES.width,
      SIZES.width + i * SIZES.width,
    ],
    outputRange: [-20, 0, 20],
  });
  return (
    <View style={[styles.indicator, { backgroundColor: "#E2E2E2" }]}>
      <Animated.View
        style={[styles.activeIndicator, { transform: [{ translateX }] }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  slideItem: {
    width: SIZES.width,
    alignItems: "center",
    padding: 25,
    paddingBottom: 65,
    paddingTop: 15,
  },
  indicatorConatiner: {
    alignSelf: "center",
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
  },
  indicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 4,
    overflow: "hidden",
  },
  activeIndicator: {
    height: "100%",
    width: "100%",
    backgroundColor: COLORS.second,
    borderRadius: 10,
  },
  button: {
    height: 50,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.second,
    alignItems: "center",
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.white,
  },
});
export default WelcomeScreen;
