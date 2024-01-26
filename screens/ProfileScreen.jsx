import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  Image,
} from "react-native";
import Ionic from "react-native-vector-icons/Ionicons";
import "../utils/i18n";
import { t } from "i18next";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ProfileList from "../components/ProfileList";
import PersonnelDataUser from "../components/PersonnelDataUser";
import HistoriqueUser from "../components/HistoriqueUser";
import NotificatinUser from "../components/NotificatinUser";
import VoitureUser from "../components/VoitureUser";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const ProfileScreen = ({ navigation }) => {
  const TostMessage = () => {
    ToastAndroid.show("Edited Sucessfully !", ToastAndroid.SHORT);
  };
  const [userInfo, setuserInfo] = useState("");
  const [catergoryIndex, setCategoryIndex] = useState(0);
  const [panel, setPanel] = useState("Donnée personnelle");
  const categories = [
    "Donnée personnelle",
    "Historique",
    "Notification",
    "Ma voiture",
  ];
  useEffect(() => {
    getUserDetails();
  }, []);
  const getUserDetails = () => {
    AsyncStorage.getItem("accessToken")
      .then((accees) => {
        axios
          .get("http://54.193.180.3:8080/v1/user/info", {
            headers: {
              Authorization: "Bearer " + accees,
            },
          })
          .then((response) => {
            setuserInfo(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch();
  };
  const UpdateUser = () => {
    AsyncStorage.getItem("accessToken")
      .then((accees) => {
        const request = {
          metadata: {},
          userUpdateRequest: {
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.username,
          },
          timeStamps: new Date(),
        };
        axios
          .post("http://54.193.180.3:8080/v1/user/update/info", request, {
            headers: {
              Authorization: "Bearer " + accees,
            },
          })
          .then((response) => {
            setuserInfo(response.data);
            TostMessage();
            navigation.goBack();
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch();
  };
  const convertImageUrlToBase64 = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const imageBlob = await response.blob();
    const base64String = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageBlob);
    });
    return base64String;
  };
  const UpdateUserImage = (avatar) => {
    AsyncStorage.getItem("accessToken")
      .then(async (accees) => {
        const base64 = await convertImageUrlToBase64(avatar);
        const data = new FormData();
        data.append("file", base64);
        data.append("upload_preset", "Mycloud");
        data.append("cloud_name", "drxc1ewyj");
        const cloudinaryUrl =
          "https://api.cloudinary.com/v1_1/drxc1ewyj/image/upload";
        axios
          .post(cloudinaryUrl, data)
          .then((res) => {
            const request = {
              metadata: {},
              updateAvatarRequest: {
                avatar: res.data.url,
              },
              timeStamps: new Date(),
            };
            axios
              .post("http://54.193.180.3:8080/v1/user/update/avatar", request, {
                headers: {
                  Authorization: "Bearer " + accees,
                },
              })
              .then((response) => {
                TostMessage();
              })
              .catch((error) => {
                console.error(error);
              });
          })
          .catch();
      })
      .catch();
  };
  const handleProfileImage = async () => {
    try {
      ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })
        .then((result) => {
          UpdateUserImage(result.assets[0].uri);
          setuserInfo({ ...userInfo, avatar: result.assets[0].uri });
        })
        .catch((err) => console.error(err));
    } catch (error) {
      console.log("ImagePicker Error: ", error);
    }
  };
  return (
    <View style={{ width: "100%", height: "100%", backgroundColor: "white" }}>
      {/*----------------------header: */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 10,
          top: 30,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionic name="close-outline" size={35} color={"#49DFEA"} />
        </TouchableOpacity>

        <Text
          style={{
            fontFamily: FONTS.regular,
            fontSize: SIZES.large,
            color: "#808080",
          }}
        >
          {t("Editer le profil")}
        </Text>
        <TouchableOpacity onPress={UpdateUser}>
          <Ionic name="checkmark" size={35} color={"#49DFEA"} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          alignItems: "center",
          marginBottom: 20,
          top: 50,
        }}
      >
        <View>
          <TouchableOpacity
            onPress={handleProfileImage}
            style={{
              height: 32,
              width: 32,
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: COLORS.light,
              borderRadius: 30,
              zIndex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons name="edit" size={24} color={COLORS.second} />
          </TouchableOpacity>
          <Image
            style={{
              height: 100,
              width: 100,
              borderRadius: 100,
            }}
            source={{ uri: userInfo.avatar }}
          />
        </View>
      </View>
      <View style={{ padding: 10, top: 25 }}>
        <ProfileList
          categories={categories}
          catergoryIndex={catergoryIndex}
          setCategoryIndex={setCategoryIndex}
          setPanel={setPanel}
        />
      </View>
      {panel === "Donnée personnelle" && (
        <PersonnelDataUser userInfo={userInfo} setuserInfo={setuserInfo} />
      )}
      {panel === "Historique" && <HistoriqueUser />}
      {panel === "Notification" && <NotificatinUser />}
      {panel === "Ma voiture" && <VoitureUser />}
    </View>
  );
};

export default ProfileScreen;
