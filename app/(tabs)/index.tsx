import React, {useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import {RootStackParamList} from '../../constants/Navegation';


type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;
type Props = {
    navigation: SplashScreenNavigationProp;
};

const SplashScreen: React.FC<Props> = ({ navigation }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Employees')
        }, 2000);
        return () => clearTimeout(timer);
    }, [navigation]);

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

export default SplashScreen;