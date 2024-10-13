import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import globalstyles from "../shared/globalStyles";
import { useNavigation } from "@react-navigation/native";

const SearchComponent = ({ searchInput, setSearchInput }) => {
  const navigation = useNavigation();
  const [clients, setClients] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState([]);

  useEffect(() => {
    fetch("http://ec2-54-227-106-154.compute-1.amazonaws.com:8000/Clients")
      .then((response) => response.json())
      .then((data) => {
        setClients(data);
        setFilteredClients(data);
      })
      .catch((error) => console.error("Error fetching clients:", error));
  }, []);

  useEffect(() => {
    fetch("http://ec2-54-227-106-154.compute-1.amazonaws.com:8000/NonProfits")
      .then((response) => response.json())
      .then((data) => {
        setOrganizations(data);
        setFilteredOrganizations(data);
      })
      .catch((error) => console.error("Error fetching non-profits:", error));
  }, []);

  const handleSearch = (text) => {
    setSearchInput(text);
    if (text.trim()) {
      const filtered = organizations.filter(
        (organization) =>
          organization.name.toLowerCase().includes(text.toLowerCase()) ||
          organization.attributes?.Name?.toLowerCase().includes(
            text.toLowerCase()
          )
      );
      setFilteredOrganizations(filtered);
    } else {
      setFilteredOrganizations(organizations);
    }
  };

  const handleSendSearch = () => {
    const dataToSend = {
      search: searchInput,
      Organization: searchInput, // In case no organization is found, use search input as organization name
      iterations: 1,
      id: `${searchInput} Needs an id`,
    };

    fetch("http://ec2-54-227-106-154.compute-1.amazonaws.com:8000/Data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to send data");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data sent successfully:", data);
      })
      .catch((error) => {
        console.error("Error sending data to /Data endpoint:", error);
      });

    setSearchInput(""); // Clear the search input
  };

  const handleSearchPress = (organization) => {
    const dataToSend = {
      search: searchInput,
      Organization: organization.attributes?.Name || organization.name,
      iterations: 1, // or set this dynamically if needed
      id: organization.id, // Include the organization's id
    };

    fetch("http://ec2-54-227-106-154.compute-1.amazonaws.com:8000/Data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to send data");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data sent successfully:", data);
      })
      .catch((error) => {
        console.error("Error sending data to /Data endpoint:", error);
      });

    // Clear the search input and navigate to the AmenityPage
    setSearchInput("");
    navigation.navigate("Amenity Page", { amenity: organization });
  };

  const handlePress = (client) => {
    setSearchInput("");
    navigation.navigate("Profile Page", { client: clients[0] });
  };

  return (
    <View>
      <View style={globalstyles.searchSection}>
        <View style={globalstyles.searchContainer}>
          <Icon
            name="search-outline"
            size={25}
            color="#616a6c"
            style={globalstyles.searchIcon}
          />
          <TextInput
            blurOnSubmit={true}
            style={globalstyles.searchBar}
            value={searchInput}
            onChangeText={handleSearch}
            placeholder="Type in keyword"
          />
        </View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handlePress(filteredClients[0])}
        >
          <Image
            source={require("../assets/images/userImage1.jpg")}
            style={[
              globalstyles.profileImage,
              { marginLeft: 10, width: 45, height: 45 },
            ]}
          />
        </TouchableOpacity>
      </View>

      {searchInput.trim() !== "" && (
        <View style={styles.floatingListContainer}>
          <FlatList
            data={filteredOrganizations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSearchPress(item)}
                style={styles.organizationItem}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={{
                      uri: item?.attributes?.Avatar
                        ? item.attributes.Avatar.replace(
                            "ipfs://",
                            "https://ipfs.io/ipfs/"
                          )
                        : "https://example.com/default-avatar.png", // Replace with your default image URL
                    }}
                    style={styles.organizationImage}
                    defaultSource={require("../assets/images/location4.jpg")} // Add a default image for faster load times
                  />
                  <Text style={styles.organizationName}>
                    {item.attributes?.Name || item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View>
                <Text style={styles.noResults}>
                  No organizations found. Please type the full name of the organization and press the button below.
                </Text>
                {/* Button to allow sending the search string to the backend */}
                <TouchableOpacity onPress={handleSendSearch}>
                  <Text style={styles.sendSearchText}>
                    Send "{searchInput}" to database for future addition to Ellis
                  </Text>
                </TouchableOpacity>
              </View>
            }
            contentContainerStyle={styles.listContainer}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  organizationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 5, // Adds space between each item
    borderRadius: 8, // Optional: Makes each item look more like a card
  },
  organizationName: {
    fontSize: 16,
    color: "#333",
  },
  organizationImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  floatingListContainer: {
    position: "absolute",
    top: 60, // Adjust this value to position the list below the search bar
    left: 0,
    right: 0,
    zIndex: 10, // Make sure it appears above other elements
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: 5, // Adds some space around the list content
  },
  sendSearchText: {
    marginTop: 10,
    marginHorizontal: 15,
    color: "#10798B",
    fontSize: 16,
    textAlign: "center",
  },
  noResults: {
    fontSize: 16,
    fontFamily: 'karla-regular',
    padding: 10,
    textAlign: 'center'
  }
});

export default SearchComponent;
