import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useNavigation, useTheme } from "@react-navigation/native";
import { COLORS, FONTS, SIZES, ICONS } from "../constants/theme";
import { GlobalStyleSheet } from "../constants/StyleSheet";
import { Entypo } from "@expo/vector-icons";
import { useState } from "react";
import { Icon } from "react-native-elements";
import axios from "axios";
import { SvgXml } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Loginscreen = () => {
  const { colors } = useTheme();
  const [passwordShow, setPasswordShow] = useState(true);
  const handndleShowPassword = () => {
    setPasswordShow(!passwordShow);
  };
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setnewpassword] = useState("");
  const [loading, setLoading] = useState(false);

  // validation:
  const [usernameerrur, setusernameerrurd] = useState("");
  const [passworerrur, setpassworderrur] = useState("");
  //-----------------Handle login logic here
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setusernameerrurd("Invalid email address");
      return false;
    }
    setusernameerrurd("");
    return true;
  };
  const validatePassword = (password) => {
    if (password.length < 6) {
      setpassworderrur("Password must be at least 6 characters");
      return false;
    }
    setpassworderrur("");
    return true;
  };
  const handleLogin = () => {
    setLoading(true);
    const isLastnameValid = validatePassword(password);
    const isEmailValid = validateEmail(username);
    const loginrequest = {
      metaData: {},
      login: {
        email: username,
        password: password,
      },
      timeStamps: new Date(),
    };
    if (isLastnameValid && isEmailValid) {
      axios
        .post("http://54.193.180.3:8080/v1/auth/login", loginrequest)
        .then(async (response) => {
          if (response.status === 200) {
            console.log("User logged in successfully");
          }
          AsyncStorage.setItem("accessToken", response.data.accessToken);
          AsyncStorage.setItem("refreshToken", response.data.refreshToken);
          AsyncStorage.setItem("user", JSON.stringify(response.data.user));
          navigation.navigate("Home");
        });
    } else {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Entypo
            style={{ marginTop: 25 }}
            name="chevron-left"
            size={35}
            color="#49DFEA"
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={{ flex: 1, backgroundColor: COLORS.light }}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              minHeight: 200,
            }}
          >
            <Image
              style={{
                width: 190,
                height: 190,
                marginBottom: 40,
                resizeMode: "contain",
              }}
              source={require("../assets/images/logo.png")}
            />
            <Image
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                resizeMode: "stretch",
                height: 80,
                tintColor: COLORS.white,
              }}
              source={require("../assets/images/bg-shape.png")}
            />
          </View>
          <View style={{ backgroundColor: COLORS.white }}>
            <View style={GlobalStyleSheet.container}>
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={[
                    {
                      textAlign: "center",
                      color: colors.title,
                      fontSize: SIZES.xLarge,
                    },
                  ]}
                >
                  Se connecter
                </Text>
                <Text
                  style={[
                    FONTS.font,
                    { textAlign: "center", color: colors.text },
                  ]}
                >
                  Déjà membre de Smart Parking ? Connectez-vous pour accéder à
                  votre compte et profiter de toutes les fonctionnalités
                </Text>
              </View>
              <View style={{ marginBottom: 15 }}>
                <View style={styles.inputIcon}>
                  <Icon name="email" size={20} color={COLORS.second} />
                </View>
                <TextInput
                  style={[
                    styles.inputStyle,
                    { borderColor: COLORS.gray, color: colors.title },
                  ]}
                  placeholder="Enter email"
                  placeholderTextColor={COLORS.gray}
                  onChangeText={(text) => {
                    setUsername(text);
                    setusernameerrurd("");
                  }}
                />
                {usernameerrur ? (
                  <Text style={styles.error}>{usernameerrur}</Text>
                ) : null}
              </View>

              <View style={{ marginBottom: 15 }}>
                <View style={styles.inputIcon}>
                  <Icon name="lock" size={20} color={COLORS.second} />
                </View>
                <TextInput
                  secureTextEntry={passwordShow}
                  style={[
                    styles.inputStyle,
                    { borderColor: COLORS.gray, color: colors.title },
                  ]}
                  placeholder="Mot de pass"
                  placeholderTextColor={COLORS.gray}
                  onChangeText={(text) => {
                    setnewpassword(text);
                    setpassworderrur("");
                  }}
                />
                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel="Password"
                  accessibilityHint="Password show and hidden"
                  onPress={() => handndleShowPassword()}
                  style={styles.eyeIcon}
                >
                  <SvgXml xml={passwordShow ? ICONS.eyeClose : ICONS.eyeOpen} />
                </TouchableOpacity>
                {passworerrur ? (
                  <Text style={styles.error}>{passworerrur}</Text>
                ) : null}
              </View>
              <View style={{ alignItems: "flex-end", marginBottom: 15 }}>
                <TouchableOpacity style={{ marginLeft: 5 }}>
                  <Text
                    style={[
                      FONTS.fontLg,
                      {
                        color: COLORS.second,
                        textDecorationLine: "underline",
                      },
                    ]}
                  >
                    Forgot Password
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ paddingBottom: 10 }}>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.buttonText}>Se connecter</Text>
                  )}
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 15,
                  marginTop: 5,
                }}
              >
                <Text style={[FONTS.font, { color: colors.text }]}>
                  Vous n'avez pas un compte?
                </Text>
                <TouchableOpacity
                  style={{ marginLeft: 5 }}
                  onPress={() => navigation.navigate("Register")}
                >
                  <Text
                    style={[
                      FONTS.fontLg,
                      {
                        color: COLORS.black,
                        textDecorationLine: "underline",
                      },
                    ]}
                  >
                    S'inscrire
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Loginscreen;

const styles = StyleSheet.create({
  inputStyle: {
    ...FONTS.fontLg,
    height: 50,
    paddingLeft: 60,
    borderWidth: 1,
    borderRadius: SIZES.radius,
  },
  inputIcon: {
    backgroundColor: COLORS.white,
    height: 40,
    width: 40,
    borderRadius: 10,
    position: "absolute",
    left: 5,
    top: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  eyeIcon: {
    position: "absolute",
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    right: 0,
    zIndex: 1,
    top: 0,
  },
  error: {
    color: "red",
    marginBottom: 5,
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
