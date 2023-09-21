import {View, Pressable, Text, SafeAreaView, StyleSheet, ImageBackground} from 'react-native';
import React from 'react';
import BG_HOME from './../../assets/images/homepage_simplonville_homepage.jpg';
import { Link } from 'expo-router';
export default function Accueil() {

    return (
        
        <View style={styles.container}>
         
        <ImageBackground source={BG_HOME} resizeMode="cover"  style={styles.image}>
        <View style={{flex:1, justifyContent:"center", alignItems:"center",gap:10}}>
            
        <Link href="./accueil" style={styles.links}> 
            <Text >Accueil</Text>
        </Link>

        <Link href="/alerte" style={styles.links}>
            <Text  >Alertez-Nous !</Text>
        </Link>
  
        <Link href="./legal" style={styles.links}>
            <Text >Mentions Légales</Text>
        </Link>
        </View>
        </ImageBackground>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      image: {
        flex: 1,
        justifyContent: 'center',
      },
      links:{
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 50,
        color:'white',
        fontSize:20,
        padding:5,
        width:"100%",
        heigth:"100%",
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf:"center",
        textAlign:"center",
        marginBottom:15,
      }
});