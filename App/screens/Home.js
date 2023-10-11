import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../shared/Card";
import Amenities from "../shared/Amenities";
import Fontisto from "@expo/vector-icons/Fontisto";

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredAmenities, setFilteredAmenities] = useState(Amenities);

  const handlePress = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleSearchChange = (text) => {
    setSearchInput(text);
    const filtered = Amenities.filter((amenity) =>
      amenity.location.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredAmenities(filtered);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <TextInput
            value={searchInput}
            onChangeText={handleSearchChange}
            placeholder="Type in keyword"
            style={styles.searchBar}
          />
        </View>
        <Fontisto
          name="nav-icon-grid-a"
          size={20}
          color="#094851"
          style={styles.gridIcon}
        />
      </View>
      <View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {[
            "All",
            "Food",
            "Shelter",
            "Hygiene",
            "Health",
            "Work & Learn",
            "Finance",
            "Other",
          ].map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => handlePress(category)}
              activeOpacity={1}
            >
              <View
                style={[
                  styles.scrollerItemContainer,
                  category === selectedCategory &&
                    styles.selectedCategoryContainer,
                ]}
              >
                <Text
                  style={[
                    styles.scrollerItems,
                    category === selectedCategory &&
                      styles.selectedScrollerItem,
                  ]}
                >
                  {category}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.sortByContainer}>
          <Text style={styles.sortBy}>Sort by</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <Text style={styles.sortByItems}>Distance</Text>
            <Text style={styles.sortByItems}>Type</Text>
            <Text style={styles.sortByItems}>Availability</Text>
          </ScrollView>
        </View>
        <View>
          <Text style={styles.directory}>Directory</Text>
        </View>
        {filteredAmenities.map((amenity) => (
          <Card key={amenity.key}>
            <Text style={styles.cardLocation}>{amenity.location}</Text>
            <Text style={styles.cardDetails}>
              {amenity.times}
              {"\n"}
              {amenity.distance}
              {"\n"}
              {amenity.address}
            </Text>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f8f9",
    padding: 15,
    // alignItems: "center",
    // justifyContent: "center",
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 50,
    padding: 5,
    alignItems: "center",
    flex: 1,
    height: 50,
    backgroundColor: "white",
  },
  searchBar: {
    flex: 1,
    fontSize: 18,
    color: "#999fa0",
  },
  gridIcon: {
    paddingLeft: 20,
  },
  scrollerItemContainer: {
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 25,
    marginTop: 5,
    marginHorizontal: 5, // Added this for spacing between items
  },

  selectedCategoryContainer: {
    borderColor: "#ebae52",
    backgroundColor: "#ffffff", // Adjust this to your desired background color
  },

  scrollerItems: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "600",
    padding: 10,
    color: "#094851",
  },

  selectedScrollerItem: {
    color: "#533509",
  },

  sortByContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sortBy: {
    fontSize: 20,
  },
  sortByItems: {
    fontSize: 20,
    color: "blue",
    padding: 20,
  },
  directory: {
    fontSize: 40,
    fontWeight: "bold",
  },

  cardLocation: {
    fontSize: 30,
  },
  cardDetails: {
    fontSize: 20,
  },
});
