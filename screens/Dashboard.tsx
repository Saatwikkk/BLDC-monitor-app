import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Card } from "react-native-paper";
import RNSpeedometer from "react-native-speedometer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigationTypes"; 

const DashboardScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "Dashboard">>();

  const [speed, setSpeed] = useState(0);
  const [data, setData] = useState({
    rpm: 0,
    voltage: 48,
    throttle: 0,
    temperature: 30,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newSpeed = Math.floor(Math.random() * 100);
      const newData = {
        rpm: Math.floor(Math.random() * 5000),
        voltage: 48 + Math.random() * 2,
        throttle: Math.floor(Math.random() * 100),
        temperature: 30 + Math.random() * 10,
      };

      setSpeed(newSpeed);
      setData(newData);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <LinearGradient colors={["#2C5364", "#203A43", "#0F2027"]} style={styles.container}>
      
      {/* Back Button (Transparent Background) */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Motor Dashboard</Text>

      {/* Speedometer Graphic */}
      <View style={styles.speedometerContainer}>
        <RNSpeedometer value={speed} maxValue={100} size={250} />
      </View>

      {/* Data Card */}
      <Card style={styles.card}>
        <Card.Title title="Motor Parameters" titleStyle={styles.cardTitle} />
        <Card.Content>
          <Text style={styles.dataText}>RPM: {data.rpm}</Text>
          <Text style={styles.dataText}>Voltage: {data.voltage.toFixed(1)}V</Text>
          <Text style={styles.dataText}>Throttle: {data.throttle}%</Text>
          <Text style={styles.dataText}>Temperature: {data.temperature.toFixed(1)}°C</Text>
        </Card.Content>
      </Card>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 5, // Reduce padding to avoid background effect
  },
  backText: {
    fontSize: 32, // Increase arrow size
    color: "#fff",
    fontWeight: "bold",
  },
  title: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 20,
    alignItems: "center",
  },
  speedometerContainer: {
    backgroundColor: "#ffffff20",
    padding: 15,
    paddingBottom: 60,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 2 },
    elevation: 5,
  },
  card: {
    width: "90%",
    backgroundColor: "#1E1E1E",
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 2 },
    elevation: 5,
  },
  cardTitle: {
    color: "#FF6B6B",
    fontSize: 22,
    fontWeight: "bold",
    alignContent: "center",
  },
  dataText: {
    fontSize: 18,
    color: "#fff",
    marginTop: 5,
    fontWeight: "600",
  },
});

export default DashboardScreen;
