import { PermissionsAndroid, Platform } from "react-native";

async function requestBluetoothPermissions(): Promise<void> {
  if (Platform.OS === "android" && Platform.Version >= 31) {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);

    if (
      granted["android.permission.BLUETOOTH_SCAN"] !== PermissionsAndroid.RESULTS.GRANTED ||
      granted["android.permission.BLUETOOTH_CONNECT"] !== PermissionsAndroid.RESULTS.GRANTED ||
      granted["android.permission.BLUETOOTH_ADVERTISE"] !== PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.warn("Bluetooth permissions not granted");
    }
  }
}

export default requestBluetoothPermissions;
