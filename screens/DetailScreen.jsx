import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import FeatherIcon from "react-native-vector-icons/Feather";
import Swiper from "react-native-swiper";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import parkingimg from "../assets/images/parking3.jpg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import AboutDeatails from "../components/AboutDeatails";
import ReviewsDetails from "../components/ReviewsDetails";
import { Icon } from "react-native-elements";
import { ActivityIndicator } from "react-native-paper";
import DeatilsList from "../components/DeatilsList";
const DetailsScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const itemImages = [
    parkingimg,
    parkingimg,
    parkingimg,
    parkingimg,
    parkingimg,
  ];
  const { id, parkdata } = route.params;
  const { image, title, address, price } = parkdata;
  const [park, setPark] = useState({});
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState([]);
  const [catergoryIndex, setCategoryIndex] = useState(0);
  const categories = ["About", "Reviews"];
  const [panel, setPanel] = useState("About");
  useEffect(() => {
    AsyncStorage.getItem("accessToken")
      .then((accees) => {
        axios
          .get(`http://54.193.180.3:8080/v2/parking/byid/${id}/about`, {
            headers: {
              Authorization: `Bearer ${accees ? accees : ""}`,
            },
          })
          .then((response) => {
            setPark(response.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch();
  }, []);

  //   GET PARKING SERVICE :
  getServicesParkByid = () => {
    axios
      .get(`http://54.193.180.3:8080/v2/parking/byid/${id}/services`)
      .then((resopnse) => {
        setOptions(resopnse.data.options);
        setPark(resopnse.data);
        setLoading(false);
      })
      .catch((err) => {});
  };

  const ManageFavoritekByid = () => {
    console.log("sdgfsgdfgdgd");
    AsyncStorage.getItem("accessToken")
      .then((accees) => {
        axios
          .get(`http://54.193.180.3:8080/v2/parking/byid/${id}/favorite`, {
            headers: {
              Authorization: `Bearer ${accees ? accees : ""}`,
            },
          })
          .then((response) => {
            setPark({
              ...park,
              favorite: !park.favorite,
            });
            setLoading(false);
          })
          .catch((error) => {
            TostMessage("You need To be logged in");
          });
      })
      .catch((error) => {
        console.log("kjhkjh;hkh");
      });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}
    >
      {!loading ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/*----------------------------- media: */}
          <View>
            {itemImages.length > 0 && (
              <Swiper
                dotColor={"rgba(255,255,255,.15)"}
                activeDotColor={"rgba(255,255,255,1)"}
                style={{
                  height: 300,
                }}
              >
                {itemImages.map((data, index) => {
                  return (
                    <View key={index}>
                      <Image
                        style={{
                          height: "100%",
                          width: "100%",
                        }}
                        source={data}
                      />
                    </View>
                  );
                })}
              </Swiper>
            )}
            <View style={styles.headerArea}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.headBtn}
              >
                <FeatherIcon
                  style={{ right: 1 }}
                  color={COLORS.second}
                  size={26}
                  name="chevron-left"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headBtn}>
                {park.favorite ? (
                  <Icon
                    name="favorite"
                    color={"red"}
                    size={30}
                    onPress={ManageFavoritekByid}
                  />
                ) : (
                  <Icon
                    name="favorite"
                    color={"black"}
                    size={30}
                    onPress={ManageFavoritekByid}
                  />
                )}
              </TouchableOpacity>
            </View>

            <DeatilsList
              categories={categories}
              catergoryIndex={catergoryIndex}
              setCategoryIndex={setCategoryIndex}
              setPanel={setPanel}
            />
          </View>

          {panel === "About" ? (
            <AboutDeatails parkData={park} />
          ) : (
            <ReviewsDetails id={park.id} />
          )}
        </ScrollView>
      ) : (
        <ActivityIndicator
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          size="small"
          color={COLORS.second}
        />
      )}
      {/* ------------------------bottons: */}
      <View
        style={{
          paddingHorizontal: 15,
          paddingVertical: 5,
          backgroundColor: COLORS.white,
          flexDirection: "row",
        }}
      >
        <TouchableOpacity style={styles.bottons}>
          {/* <FeatherIcon
            style={{ marginRight: 6 }}
            size={20}
            color={selectedComponent == "about" ? COLORS.white : COLORS.white}
            name="info"
          /> */}
          <Text
            style={{
              color: COLORS.white,
              lineHeight: 24,
              fontFamily: FONTS.bold,
              fontSize: SIZES.medium,
            }}
          >
            Reserve
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DetailsScreen;
const styles = StyleSheet.create({
  headerArea: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: "row",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    justifyContent: "space-between",
  },
  headBtn: {
    height: 48,
    width: 48,
    borderRadius: 48,
    backgroundColor: "rgba(255,255,255,.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  desList: {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottomWidth: 1,
  },
  listLabel: {
    ...FONTS.font,
    width: 180,
  },
  bottons: {
    backgroundColor: COLORS.second,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
});
