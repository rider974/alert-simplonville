import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TextInput, Button, Pressable, Dimensions, SafeAreaView, ScrollView, TouchableOpacity, Image  } from 'react-native';
import ReactDOM from 'react-dom/client';
import SelectDropdown from 'react-native-select-dropdown';
import DatePicker from 'react-date-picker';
import React, { useState, useEffect, useRef } from 'react';
import MapView, {Marker} from 'react-native-maps';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Location from 'expo-location';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import * as MailComposer from 'expo-mail-composer'; 
import { Link } from 'expo-router';
 export default function Alerte() {
  /************************* Alert Type Dropdown ************************ */

  const alertTypes = [ 
    "Voirie",
    "Stationnement",
    "Animaux",
    "Travaux"
  ];


  /*************************** Date And Time ***************************** */
  const [dateTime, setDateTime] = useState(new Date(Date.now()).toLocaleString());
  

  /***********************  Maps and marker *************************************/
const [mapRegion, setMapRegion] = useState(false);
  
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

/*************************************  Picture field *****************************/

const [type, setType] = useState(CameraType.back);
const [image, setImage] = useState(false);
const cameraRef = useRef(null);
const [hasCameraPermission, setHasCameraPermission] = useState(false);
const [photo, setPhoto] = useState();
const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(false);



/****************** Pick a picture from the media Library ********** */
const pickImage = async () => {
    
    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

    setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });


  if (!result.canceled) {
    setImage(result.assets[0].uri);
  }
};

const optionsPhoto = {
  quality: 1,
};

/************************ Take a picture with the camera *************** */
const openCamera =  async ()=> 
{
  const cameraPermission = await Camera.requestCameraPermissionsAsync();

  if (cameraPermission.granted === false) 
  {
    alert("Accès à la caméra refuser");
    return;
  }
  setHasCameraPermission(cameraPermission.status === "granted");

  // show camera AND take picture 
  const photo = await ImagePicker.launchCameraAsync(optionsPhoto, (res)=> {

    if(!res.didCancel)
    {
      setState({photo: res.uri});
    }

  });

  // show picture on screen 
  setImage(photo.assets[0].uri);

}

/********************************* Send Mail ************************************ */

const openEmail = ()=> {
  Linking.openUrl("mailto:"+ "ok");
}
/******************************* App return ************************************* */
  return (
    <SafeAreaView >
      
    <ScrollView>
      <View style={styles.container}>
    
    
      <View style={styles.headerContainer}>
      <Text style={styles.pageTitle}>Alertez-nous</Text>
      </View>

      <View style={styles.mainContainer}>
        <View style={styles.alertTypeContainer}>
          <Text style={styles.label}>Type d'alerte :</Text>
          <SelectDropdown
          style={[styles.selectDropdown, styles.alertTypeSelect]}
          onSelect={(selectedItem, index) => {
          }}
          data={alertTypes}
          buttonTextAfterSelection={(selectedItem, index) => {

            return selectedItem
          }}
          rowTextForSelection={(item, index) => {

            return item
          }}
        />
      </View>
      <View style={styles.alertDescriptionContainer}>

      <Text style={styles.label}>Description de l'alerte* :</Text>
      <TextInput  placeholder="Un accident est survenue sur l'autoroute SI32. Des embouteillages à prévoir..." multiline  style={styles.textarea} required/>
      </View>   
      
      </View>
      {mapRegion ? 
      (
        <View style={styles.mapContainer}>
          <MapView style={styles.map} 
            region={ mapRegion}>
            <Marker draggable coordinate={mapRegion} title="alert location"/>
          </MapView>
      </View>
        ) 
        : 
        (
          <View>
            <Text>Chargement de la carte...</Text>
          </View>
        )}
           <View style={styles.imageContainer}>
            <Pressable  style={styles.button} onPress={pickImage} ><Text>Choisir une photo depuis le smartphone</Text></Pressable>
              {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} /> }
              <Pressable  style={styles.button}  onPress={openCamera}><Text>Prendre une photo</Text></Pressable>
              {hasMediaLibraryPermission ? <Button title="Sauvegarder cette photo" />: null}
            </View>

          <View style={styles.userInfos}>

          <Text style={styles.label}>Nom* :</Text>
          <TextInput   placeholder="ex: Doe" style={styles.textarea} required/>

          <Text style={styles.label}>Prenom* :</Text>
          <TextInput  placeholder="ex: John" style={styles.textarea} required/>

          <Text style={styles.label}>Adresse* :</Text>
          <TextInput  placeholder="ex: 8, avenue react, XXXX, Simplonville" multiline style={styles.textarea} required/>

          <Text style={styles.label}>Code Postal* :</Text>
          <TextInput   placeholder="ex: XXXXX" style={styles.textarea} required/>

          <Text style={styles.label}>Ville* :</Text>
          <TextInput  placeholder="ex: Simplonville" style={styles.textarea} required/>

          <Text style={styles.label}>Email* :</Text>
          <TextInput  placeholder="ex: john.doe@user.com" style={styles.textarea} required/>
          
          <Text style={styles.label}>Telephone* :</Text>
          <TextInput  placeholder="ex: 06 XX XX XX XX" style={styles.textarea} required/>
     
          <Pressable style={styles.buttonContainer}>
            <Text style={styles.textButton}  onPress={()=> openEmail()}>Envoyez l'alerte</Text>
          </Pressable>
          <Text style={styles.mandatoryFields}>* Champ Obligatoire</Text>
          </View>  
    </View>
    </ScrollView>
    
    <StatusBar style="auto" />
    </SafeAreaView>
  );
}


/********************************** Styles ********************************* */
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
    paddingBottom:30,
  },
  mainContainer:{
    flex:2,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  mapContainer:{
    justifyContent:'flex-start',
    alignContent:'center',
    marginTop:"5%",
    width: Dimensions.get("window").width,
    height:150,
  },
  alertTypeContainer:{
    flex:1,
    justifyContent:'center',
    alignContent:'center',
    alignItems: 'center',
    width:"100%",
    paddingTop: 0,
  },
  alertTypeSelect:{
    borderWidth:50,
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
    borderWidth: 0.5,
    borderColor: "grey",
    borderRadius: 50,
    padding:30,
    fontSize:16,
  },
  alertDescriptionContainer:{
    width:"100%",
    padding:30,
  },
  map: {
    width: Dimensions.get("window").width,
    height: "100%",
  },
  camera:{
    flex:1,
    borderRadius:20,
  },
  buttonContainer:{
    borderWidth:0.5, 
    borderRadius:20, 
    color:"red",
    padding:5,
    marginTop:20,
    marginBottom:20,
    width:"100%",
    height:50,
    justifyContent:'center',
    alignSelf: 'center',
  },
  textButton:{
    fontWeight:"bold",
    fontSize:20,
  },
  button:{
    borderWidth:2,
    fontSize:16,
    fontWeight:"bold",
    borderRadius:50,
    padding:15,
    margin:15,
  },
  userInfos:{
    padding:15,
  }
});
