import { View, Text, StyleSheet, Image, TextInput } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "react-native-elements";
import { Entypo } from "@expo/vector-icons";
import profile from "../assets/images/header.jpeg";
import "../utils/i18n";
import { t } from "i18next";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";
import CategoryListSearch from "../components/CategoryListSearch";
import { useState } from "react";
import PopularSearch from "../components/PopularSearch";
import PresDetoisearch from "../components/PresDetoisearch";
import HistoriqueSearch from "../components/HistoriqueSearch";
import OffreSearch from "../components/OffreSearch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const SearchScreen = () => {
  const navigation = useNavigation();
  const [catergoryIndex, setCategoryIndex] = useState(0);
  const categories = ["Popular", "Prés de toi", "Historique", "Offre"];
  const [panel, setPanel] = useState("Popular");
  const [loading, setLoading] = useState(true);
  const [Parking, setParking] = useState([]);
  const [reload, setReload] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredParking, setFilteredParking] = useState();
  const [hasSearchResults, setHasSearchResults] = useState(true);

  useEffect(() => {
    const parkingdata = {
      metaData: {},
      listParking: {
        country: "MAROC",
        city: "Casablanca",
      },
      timeStamps: Date.now(),
    };
    AsyncStorage.getItem("accessToken")
      .then((accees) => {
        axios
          .post("http://54.193.180.3:8080/v2/parking/byCity", parkingdata, {
            headers: {
              Authorization: `Bearer ${accees ? accees : ""}`,
            },
          })
          .then((response) => {
            setParking(response.data);
          })
          .catch((errorMsg) => {
            console.log(errorMsg);
            setReload(true);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    const filteredResult = Parking.filter((parking) =>
      parking.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredParking(filteredResult);
    setHasSearchResults(filteredResult.length > 0);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, paddingHorizontal: 20, backgroundColor: COLORS.white }}
    >
      <View style={styles.header}>
        <Entypo
          name="chevron-left"
          size={35}
          color="#49DFEA"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>{t("Trouver un parking")}</Text>
        <Image source={profile} style={styles.profileImage} />
      </View>
      <View style={{ marginTop: 10, flexDirection: "row" }}>
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={25}
            style={{ marginLeft: 20 }}
            color={COLORS.light}
          />
          <TextInput
            placeholder={t("Cherche ici...")}
            style={styles.input}
            clearButtonMode="always"
            autoCorrect={false}
            placeholderTextColor={COLORS.light}
            onChangeText={(text) => handleSearch(text)}
            value={searchText}
          />
        </View>
        <View style={styles.sortBtn}>
          <Icon name="sort" size={30} color={COLORS.light} />
        </View>
      </View>
      <CategoryListSearch
        categories={categories}
        catergoryIndex={catergoryIndex}
        setCategoryIndex={setCategoryIndex}
        setPanel={setPanel}
      />
      {panel === "Popular" && (
        <PopularSearch
          loading={loading}
          Parking={filteredParking ? filteredParking : Parking}
          hasSearchResults={hasSearchResults}
        />
      )}
      {panel === "Prés de toi" && <PresDetoisearch />}
      {panel === "Historique" && <HistoriqueSearch />}
      {panel === "Offre" && <OffreSearch />}
    </SafeAreaView>
  );
};

export default SearchScreen;
const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchContainer: {
    height: 40,
    backgroundColor: COLORS.gray,
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    fontSize: 18,
    color: COLORS.black,
  },
  sortBtn: {
    marginLeft: 10,
    height: 40,
    width: 40,
    borderRadius: 10,
    backgroundColor: COLORS.second,
    justifyContent: "center",
    alignItems: "center",
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
