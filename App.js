import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TextInput } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import ReactDOM from 'react-dom/client';
import SelectDropdown from 'react-native-select-dropdown';
import DatePicker from 'react-date-picker';
import { useState } from 'react';
import MapView from 'react-native-maps';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 5000);

 export default function App() {
  const [value, setValue] = useState(new Date(Date.now()).toLocaleString());
  const alertTypes = [ 
    "Voirie",
    "Stationnement",
    "Animaux",
    "Travaux"
  ];
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        
      <Text style={styles.pageTitle}>Alertez-nous</Text>


      </View>
      <View style={styles.mainContainer}>
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

      <Text style={styles.label}>Description de l'alerte:</Text>
      <TextInput  multiline numberOfLines={8}  style={styles.textarea} required/>
          
      
      </View>
      <View>
      <Text >{value}</Text>
      
      </View>

        <View>
        <MapView style={styles.map} />
        </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer:{
    flex:1,
    justifyContent: 'center',
    width: "20px",
    height:"20px",
  },
  mainContainer:{
    flex:5,
    justifyContent: 'center',
  },
  pageTitle:{
    fontWeight:"bold",
    fontSize: "30%",
  },
  label:{
    fontWeight:"bold",
    fontSize:"20%",
    margin: "3%",
  },
  selectDropdown:{
    borderRadius:"3%",
  },
  textarea:{
    width:"100",
    borderWidth: 2,
    borderColor: "grey",
    borderRadius: 25,
    
  },
  map: {
    width: '100%',
    height: '30%',
  },
});
