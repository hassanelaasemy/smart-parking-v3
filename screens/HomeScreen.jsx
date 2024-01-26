import React from "react";
import { View, SafeAreaView, Image, Text, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import profile from "../assets/icons/icon.png";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import { StatusBar } from "expo-status-bar";
import "../utils/i18n";
import { t } from "i18next";
import { ActivityIndicator } from "react-native-paper";
const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={styles.header}>
        <Entypo
          name="chevron-left"
          size={35}
          color="#49DFEA"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>{t("Accueil")}</Text>
        <Image source={profile} style={styles.profileImage} />
      </View>
      <ActivityIndicator
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        size="small"
        color={COLORS.second}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    width: "100%",
    marginTop: 25,
  },
  title: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.large,
    color: "#808080",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default Home;
