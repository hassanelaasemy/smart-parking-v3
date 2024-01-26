import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { colors } from "react-native-elements";
import { COLORS, FONTS } from "../constants/theme";
import { IconButton } from "react-native-paper";
import FeatherIcon from "react-native-vector-icons/Feather";
import { TextInput } from "react-native";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { AirbnbRating } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
const ReviewsDetails = ({ id }) => {
  const [parkReviews, setParkReviews] = useState([]);
  const [comment, setcomment] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [review, setReview] = useState(1);
  const [loading, setLoading] = useState(true);
  const [authReviews, setAuthReviews] = useState({});
  const [userInfo, setuserInfo] = useState("");

  useEffect(() => {
    DisplayReviwsByid();
    DisplayReviwsAuthByid();
  }, []);
  useEffect(() => {
    AsyncStorage.getItem("accessToken").then((accessToken) => {
      if (accessToken !== null) {
        // If 'accessToken' exists, set 'isLoggedIn' to true
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  const getUserDetails = () => {
    AsyncStorage.getItem("accessToken")
      .then((accees) => {
        if (accees) {
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
        }
      })
      .catch();
  };
  useEffect(() => {
    getUserDetails();
  }, []);
  const handelpost = () => {
    AsyncStorage.getItem("accessToken")
      .then((accees) => {
        const datasend = {
          reviews: {
            parking: id,
            description: comment,
            rating: review,
          },
          metaData: {},
          timeStamps: Date.now(),
        };
        if (comment != "") {
          axios
            .post(
              "http://54.193.180.3:8080/v2/reviews/parking/manage/byid",
              datasend,
              {
                headers: {
                  Authorization: `Bearer ${accees ? accees : ""}`,
                },
              }
            )
            .then((response) => {
              setcomment("");
              const resp = response.data;
              const data = parkReviews.find(
                (rating) => rating.id === response.data?.id
              );
              const olddata = parkReviews.filter(
                (rating) => rating.id != response.data?.id
              );
              if (data) {
                setParkReviews([resp, ...olddata]);
                // console.log("exist");
              } else {
                setParkReviews([response.data, ...parkReviews]);
                // console.log("not exist");
              }
              // console.log(response.data);
              // console.log(parkReviews);
            })
            .catch((error) => {
              //display popup
            });
        } else {
          console.log("errur");
        }
      })
      .catch();
  };
  const DisplayReviwsByid = () => {
    axios
      .get(`http://54.193.180.3:8080/v2/parking/byid/${id}/reviews`)
      .then((resopnse) => {
        if (resopnse.data?.reviews) {
          setParkReviews(resopnse.data.reviews);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const DisplayReviwsAuthByid = () => {
    AsyncStorage.getItem("accessToken")
      .then((accees) => {
        axios
          .get(
            `http://54.193.180.3:8080/v2/reviews/parking/find/${id}/byauth`,
            {
              headers: {
                Authorization: `Bearer ${accees ? accees : ""}`,
              },
            }
          )
          .then((response) => {
            setAuthReviews(response.data);
            setLoading(false);
          })
          .catch((error) => {
            //display popup
          });
      })
      .catch();
  };
  function convertToRelativeTime(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const timeDifference = now - date;
    const secondsDifference = Math.floor(timeDifference / 1000);
    if (secondsDifference < 60) {
      return `${secondsDifference}s ago`;
    } else if (secondsDifference < 3600) {
      const minutesDifference = Math.floor(secondsDifference / 60);
      return `${minutesDifference}m ago`;
    } else if (secondsDifference < 86400) {
      const hoursDifference = Math.floor(secondsDifference / 3600);
      return `${hoursDifference}h ago`;
    } else {
      const daysDifference = Math.floor(secondsDifference / 86400);
      return `${daysDifference}d ago`;
    }
  }
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 15,
          paddingBottom: 5,
          borderBottomColor: COLORS.gray,
          borderBottomWidth: 1,
          backgroundColor: COLORS.white,
        }}
      >
        <Text style={{ ...FONTS.h6, color: colors.title, flex: 1 }}>
          Comments
        </Text>
        <IconButton
          icon={() => <FeatherIcon color={COLORS.white} size={22} name="x" />}
        />
      </View>

      {loading ? (
        <ActivityIndicator
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          size="large"
          color={COLORS.second}
        />
      ) : (
        <>
          {isLoggedIn ? (
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.gray,
                alignItems: "flex-start",
                backgroundColor: COLORS.white,
              }}
            >
              <Image
                source={{ uri: userInfo.avatar }}
                style={{
                  height: 45,
                  width: 45,
                  borderRadius: 35,
                  marginTop: 1,
                }}
              />
              <View style={{ marginLeft: 9, flex: 1 }}>
                <Text style={{ ...FONTS.font, color: colors.title }}>
                  {userInfo.firstName} {userInfo.lastName}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <TextInput
                    style={{
                      ...FONTS.font,
                      color: colors.title,
                      paddingHorizontal: 5,
                      flex: 1,
                      height: 48,
                      marginRight: 10,
                      bottom: 10,
                    }}
                    placeholder="Add a comment..."
                    placeholderTextColor={colors.textLight}
                    value={comment}
                    onChangeText={(text) => setcomment(text)}
                    editable={isLoggedIn}
                  />
                  <TouchableOpacity
                    style={{ padding: 5, top: 1 }}
                    onPress={handelpost}
                  >
                    <Text
                      style={{
                        ...FONTS.h6,
                        color: COLORS.primary3,
                        bottom: 10,
                      }}
                    >
                      Post
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <AirbnbRating
                    starContainerStyle={{ bottom: 25, right: 15 }}
                    size={25}
                    value={review}
                    showRating={false}
                    defaultRating={review}
                    onFinishRating={(rating) => setReview(rating)}
                  />
                </View>
              </View>
            </View>
          ) : (
            <></>
          )}

          <View >
            {parkReviews
              .sort((a, b) => a?.id - b?.id)
              .map((data, index) => {
                if (authReviews?.id === data?.id) {
                  parkReviews.splice(index, 1);
                  parkReviews.unshift(data);
                }
                return (
                  <View key={index}>
                    <View
                      style={{
                        flexDirection: "row",
                        paddingHorizontal: 15,
                        paddingVertical: 12,
                        backgroundColor: COLORS.white,
                      }}
                    >
                      <Image
                        style={{
                          height: 30,
                          width: 30,
                          borderRadius: 30,
                          marginRight: 10,
                          marginTop: 4,
                        }}
                        source={{ uri: data?.auth.avatar }}
                      />
                      <View style={{ flex: 1 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ ...FONTS.fontSm, color: colors.text }}>
                            {data.auth.firstName} {data.auth.lastName}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              paddingVertical: 3,
                              paddingHorizontal: 3,
                              marginRight: 8,
                            }}
                          >
                            <AirbnbRating
                              defaultRating={data.rating}
                              size={15}
                              showRating={false}
                              isDisabled
                            />

                            <View
                              style={{
                                height: 4,
                                width: 4,
                                borderRadius: 3,
                                backgroundColor: colors.textLight,
                                opacity: 0.5,
                                marginHorizontal: 6,
                              }}
                            />
                            <Text
                              style={{
                                ...FONTS.fontXs,
                                color: colors.textLight,
                              }}
                            >
                              {convertToRelativeTime(data.createdAt)}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <Text style={{ ...FONTS.font, color: colors.title }}>
                          {data.description}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
          </View>
        </>
      )}
    </View>
  );
};

export default ReviewsDetails;
