import React, {useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';

import {RootStackParamList} from '../../constants/Navegation';
import { router, useRouter } from 'expo-router';

export default function Crud() {

    return(
        <View style={styles.container}>
            <Text style={styles.logo}>BeTalent</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0000FF',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: 'bold'
    },
});

