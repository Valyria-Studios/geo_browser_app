import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import globalstyles from "../shared/globalStyles";
import Icon from "@expo/vector-icons/MaterialIcons";

const CreateOrganization = ({ route, navigation }) => {
  const { userId } = route.params;
  const [locations, setLocations] = useState([
    { address: "", phoneNumber: "", website: "", serviceHours: "" },
  ]);
  const [organization, setOrganization] = useState("");

  const handleSubmit = async () => {
    const organizationData = {
      organizationName: organization,
      locations,
    };

    try {
      const response = await fetch(`http://localhost:3000/Accounts/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ organization: organizationData }),
      });
      // Handle successful addition

      if (response.ok) {
        const responseJson = await response.json();
        const userId = responseJson.id;
        navigation.navigate("Services", { userId: userId });
      } else {
        console.error("HTTP error: " + response.status);
      }
    } catch (error) {
      console.error("Error sending data to API", error);
    }
  };

  const handleInputChange = (index, field, value) => {
    const newLocations = [...locations];
    newLocations[index][field] = value;
    setLocations(newLocations);
  };

  const addNewLocation = () => {
    setLocations([
      ...locations,
      { address: "", phoneNumber: "", website: "", serviceHours: "" },
    ]);
  };

  const formatPlaceholder = (field) => {
    switch (field) {
      case "address":
        return "Address";
      case "phoneNumber":
        return "Phone Number";
      case "website":
        return "Website";
      case "serviceHours":
        return "Service Hours";
    }
  };

  const removeLocation = (index) => {
    setLocations(locations.filter((_, locIndex) => locIndex !== index));
  };

  const renderLocationInputs = () => {
    return locations.map((location, locationIndex) => (
      <View key={locationIndex}>
        <View style={styles.locationHeaderContainer}>
          <Text style={styles.subheader2}>
            {locationIndex === 0
              ? "Main Location"
              : `Location ${locationIndex + 1}`}
          </Text>
          {locationIndex !== 0 && (
            <TouchableOpacity onPress={() => removeLocation(locationIndex)} activeOpacity={0.5}>
              <Icon
                name="highlight-remove"
                size={20}
                style={styles.removeIcon}
              />
            </TouchableOpacity>
          )}
        </View>
        {Object.keys(location).map(
          (field, fieldIndex) =>
            field !== "organization" && (
              <TextInput
                key={fieldIndex}
                style={globalstyles.textInput}
                placeholder={formatPlaceholder(field)}
                value={location[field]}
                onChangeText={(value) =>
                  handleInputChange(locationIndex, field, value)
                }
              />
            )
        )}
      </View>
    ));
  };

  return (
    <ScrollView>
      <SafeAreaView style={globalstyles.container}>
        <View style={{ margin: 40 }} />
        <View style={globalstyles.headerContainer}>
          <Text style={globalstyles.header}>Set up your Organization</Text>
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text style={[globalstyles.subHeader, { marginBottom: 20 }]}>
            Add your organization details
          </Text>
          <TextInput
            placeholder="Organization Name"
            style={globalstyles.textInput}
            value={organization}
            onChangeText={setOrganization}
          />
          <View>
            {renderLocationInputs()}
            <TouchableOpacity
              style={[globalstyles.buttonContainer, { marginTop: 5 }]}
              activeOpacity={0.6}
              onPress={addNewLocation}
            >
              <Text style={globalstyles.buttonText}>Add Another Location</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={[
              globalstyles.buttonContainer,
              { backgroundColor: "#10798B", marginTop: 20 },
            ]}
            onPress={handleSubmit}
          >
            <Text style={[globalstyles.buttonText, { color: "#fff" }]}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  locationHeaderContainer: {
    paddingTop: 20,
    paddingBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subheader2: {
    color: "#030E07",
    fontSize: 18,
    fontFamily: "gabarito-regular",
    alignItems: "center",
  },
  removeIcon: {
    marginRight: 5,
    color: "#030E07",
  },
});

export default CreateOrganization;
