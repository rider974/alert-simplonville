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
const [adress, setAdress] = useState(false);

const GEO_APIKEY = "55e3bb7990804df9a3e020753fdcfdb3";

async function getReverseGeocode(latitude, longitude, apiKey)
{
  fetch("https://api.geoapify.com/v1/geocode/reverse?lat="+latitude+"&lon="+longitude+"&apiKey="+GEO_APIKEY)
  .then(response => response.json())
  .then(result => {
   const formattedAdress = result.features[0].properties.formatted;

    setAdress(formattedAdress);
  })
  .catch(error => console.log('error', error));
}

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

    getReverseGeocode(location.coords.latitude, location.coords.longitude, GEO_APIKEY);
 }

 useEffect(()=> 
 {
    alertLocation();
 },[]);
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

/************************ Take a picture with the camera *************** */

const optionsPhoto = {
  quality: 1,
};


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
/********************************* Forms Input Check ***************************** */
const [alertType, setAlertType] = useState(false);
const [descriptionAlert, setDescriptionAlert] = useState(false);
const [photoAlert, setPhotoAlert] = useState(false);
const [userName, setUserName] = useState(false);
const [userFirstName, setUserFirstName] = useState(false);
const [userAdress, setUserAdress] = useState(false);
const [userCity, setUserCity] = useState(false);
const [userEmail, setUserEmail] = useState(false);
const [userZipCode, setUserZipCode] = useState(false);

const [userPhone, setUserPhone] = useState(false);
const [dateTimeAlert, setDateTimeAlert] = useState(false);
const [adressAlert, setAdressAlert] = useState(false);

const handleChangeAlertType = (text)=> {
  setAlertType(text);
};

const handleChangeDescriptionAlert = (text)=> {
  setDescriptionAlert(text);
};

const handleChangeUserName = (text)=> {
  setUserName(text);
};


const handleChangeUserFirstName = (text)=> {
  setUserFirstName(text);
};


const handleChangeUserAdress = (text)=> {
  setUserAdress(text);
};


const handleChangeUserCity = (text)=> {
  setUserCity(text);
};


const handleChangeUserEmail = (text)=> {
  setUserEmail(text);
};
const handleChangeUserZipCode = (text)=> {
  setUserZipCode(text);
};

const handleChangeUserPhone = (text)=> {
  setUserPhone(text);
};

/********************************* Send Mail ************************************ */
const [isMailAvailable, setIsMailAvailable] = useState(false);

useEffect(()=> {
  async function checkMailAvailability(){
    const isAvailable = await MailComposer.isAvailableAsync();
    setIsMailAvailable(isAvailable);
  }
  checkMailAvailability();
}, []);

const sendEmail = ()=> {
  MailComposer.composeAsync(
  {
    subject: "Alerte " +alertType,
    body: "Bonjour, \n \n Voici les informations concernant l'alerte: \n \n Type d'alerte: "+alertType + "\n Date: "+ dateTime.split(",")[0]+"\n Heure: "+dateTime.split(",")[1]+"\n Description de l'alerte: "+ descriptionAlert+"\n Adresse de l'alerte: "+ adress+ "\n \n Informations sur le lanceur d'alerte: \n \n Prenom: "+ userFirstName+"\n Nom: "+ userName+"\n Numéro de téléphone: "+userPhone+"\n Email: "+ userEmail+"\n Adresse: "+userAdress+"\n Ville: "+userCity+"\n Code Postal: "+userZipCode+"\n \n Cordialement, \n \n "+userFirstName + " "+ userName,
    recipients: [alertType +"@simplonville.com"],
    bccRecipients:["cdelobel.ext@simplon.co"],
    attachments:[image],
  });
};
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
             handleChangeAlertType(selectedItem);
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
      <TextInput  numberOfLines={2} onChangeText={handleChangeDescriptionAlert} placeholder="Un accident est survenue sur l'autoroute SI32. Des embouteillages à prévoir..." multiline  style={styles.textarea} required/>
      </View>   

      </View>
      {mapRegion ? 
      (
        <View style={styles.mapContainer}>
          <MapView style={styles.map} 
            region={ mapRegion}>
            <Marker draggable={true} coordinate={mapRegion} title={adress ? adress : "Point d'alerte"} onDragEnd={(e)=> {
              setMapRegion({
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
              });
              getReverseGeocode(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude, GEO_APIKEY);
            }}/>
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
              {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, alignSelf:'center'}} /> }
              <Pressable  style={styles.button}  onPress={openCamera}><Text>Prendre une photo</Text></Pressable>
              {hasMediaLibraryPermission ? <Button title="Sauvegarder cette photo" />: null}
            </View>

          <View style={styles.userInfos}>

          <Text style={styles.label}>Nom* :</Text>
          <TextInput   onChangeText={handleChangeUserName} placeholder="ex: Doe" style={styles.textarea} required/>

          <Text style={styles.label}>Prenom* :</Text>
          <TextInput   onChangeText={handleChangeUserFirstName}placeholder="ex: John" style={styles.textarea} required/>

          <Text style={styles.label}>Adresse* :</Text>
          <TextInput    numberOfLines={2} onChangeText={handleChangeUserAdress}placeholder="ex: 8, avenue react, XXXX, Simplonville" multiline style={styles.textarea} required/>

          <Text style={styles.label}>Code Postal* :</Text>
          <TextInput  regex={/^\d{0,5}$/}keyboardType="numeric" onChangeText={handleChangeUserZipCode}  placeholder="ex: XXXXX" style={styles.textarea} required/>

          <Text style={styles.label}>Ville* :</Text>
          <TextInput   regex={/^[A-Za-z\s-]$/} onChangeText={handleChangeUserCity}placeholder="ex: Simplonville" style={styles.textarea} required/>

          <Text style={styles.label}>Email* :</Text>
          <TextInput  regex={/^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/} onChangeText={handleChangeUserEmail} placeholder="ex: john.doe@user.com" style={styles.textarea} required/>
          
          <Text style={styles.label}>Telephone* :</Text>
          <TextInput keyboardType="numeric"  placeholder="ex: 06 XX XX XX XX" style={styles.textarea} required/>
     
          <Pressable style={styles.buttonContainer}>
            <Text style={styles.textButton}  onPress={()=> sendEmail()}>Envoyez l'alerte</Text>
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
  },
  mandatoryFields:{
    fontWeight:"bold",
  }
});
