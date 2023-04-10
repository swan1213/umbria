import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AppLogo from '../../../assets/images/brand_light.png';
import Colors from "../../css/colors";

const LogoComponent = ({isBack, onBack}) =>{
    return(
        <View style={styles.container}>
            <Image
                source={AppLogo}
                style={styles.logoImg}
                resizeMode="contain"
            />         
             {isBack==true && <TouchableOpacity style={styles.backContainer} onPress={onBack}>
                    <Icon name={'arrow-circle-o-left'} size={40} color='white'/>
                 </TouchableOpacity>}        
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: Colors.BlueColor, 
        alignItems: 'center', 
        height: 100, 
        marginBottom: 15,
        justifyContent: 'center'
    },
    logoImg:{
        width: 200, 
        height: 100, 
        marginBottom: 5
    },
    backContainer:{
        position: 'absolute',
        top: 10,
        right: 10
    }
})

export default LogoComponent;