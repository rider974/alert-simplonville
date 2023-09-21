import {View, Pressable, Text} from 'react-native';
import React from 'react';

import { Link } from 'expo-router';
export default function index() {
    return (
        <View>
        <Link href="/alert_form"> 
        <Pressable>
            <Text>Formulaire d'alerte</Text>
        </Pressable>
        </Link>
  
        <Link href="/legal">
        <Pressable>
            <Text>Mentions Légales</Text>
        </Pressable>
        </Link>
        
        </View>
    )
}