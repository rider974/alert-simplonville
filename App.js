import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TextInput, Dimensions, SafeAreaView } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import ReactDOM from 'react-dom/client';
import SelectDropdown from 'react-native-select-dropdown';
import DatePicker from 'react-date-picker';
import React, { useState, useEffect } from 'react';
import MapView, {Marker} from 'react-native-maps';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Location from 'expo-location';


 export default function App() {
  const [dateTime, setDateTime] = useState(new Date(Date.now()).toLocaleString());
  const alertTypes = [ 
    "Voirie",
    "Stationnement",
    "Animaux",
    "Travaux"
  ];
  const [mapRegion, setMapRegion] = useState({
    latitude: 78.58,
    longitude: -122.56,
    latitudeDelta:0.0922,
    longitudeDelta:0.0421,
  });
  
 const alertLocation = async ()=> {
  let {status} = await Location.requestForegroundPermissionsAsync();
  if(status !== 'granted'){ 
    return ;
  }
  let location = await Location.getCurrentPositionAsync({enableHighAccuracy:true});
  setMapRegion({   
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta:0.0922,
    longitudeDelta:0.0421,
  });
 }

 useEffect(()=> 
 {
    alertLocation();
 },[]);

alertLocation();

  return (
    <SafeAreaView style={[styles.container]}>
    <View style={styles.container}>

      <View style={styles.headerContainer}>
      <Text style={styles.pageTitle}>Alertez-nous</Text>
      </View>

      <View style={styles.mainContainer}>
        <View style={styles.alertTypeContainer}>
          <Text style={styles.label}>Type d'alerte :</Text>
          <SelectDropdown
          style={styles.selectDropdown}
          onSelect={(selectedItem, index) => {
          }}
          data={alertTypes}
          buttonTextAfterSelection={(selectedItem, index) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return selectedItem
          }}
          rowTextForSelection={(item, index) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return item
          }}
        />
      </View>
      <View style={styles.alertDescriptionContainer}>

      <Text style={styles.label}>Description de l'alerte:</Text>
      <TextInput  multiline  style={styles.textarea} required/>
      </View>   
      
      </View>
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.mapContainer}>
        <MapView style={styles.map} 
        region={ mapRegion}
        >
          <Marker coordinate={mapRegion} title="alert location"/>
        </MapView>
  
        {/* <Button title="obtenir ma position" onPress={alertLocation}/> */}
        </View>
        </GestureHandlerRootView>
      <StatusBar style="auto" />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    height:"100%",
  },
  headerContainer:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:'10%',
    width: "100%",
    height:"20%",
  },
  mainContainer:{
    flex:2,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  mapContainer:{
    flex:2,
    justifyContent:'flex-start',
    alignContent:'center',
  },
  alertTypeContainer:{
    width:"100%",
    paddingTop: 0,
    borderWidth:2,
  },
  pageTitle:{
    fontWeight:"bold",
    fontSize: 30,
  },
  label:{
    fontWeight:"bold",
    fontSize:20,
    margin: "3%",
  },
  selectDropdown:{
    borderRadius:"3%",
  },
  textarea:{
    borderWidth: 2,
    borderColor: "grey",
    borderRadius: 15,
    padding:5,
  },
  alertDescriptionContainer:{
    width:"100%",
  },
  map: {
    width: Dimensions.get("window").width,
    height: "100%",
  },
});
