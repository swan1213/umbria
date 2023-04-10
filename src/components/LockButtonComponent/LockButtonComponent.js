import React from 'react'
import {View,Text,StyleSheet,TouchableHighlight} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../../css/colors';

const LockButtonComponent =({onPress})=>{
    return(
        <View style={styles.lockContainer}>
            <TouchableHighlight 
                style={[styles.btnContainer, {marginVertical: 20}]}
                underlayColor={Colors.loginbtnHighLightColor}
                activeOpacity={0.75}
                onPress={onPress}
            >
                <View style={[styles.clickTxtContainer, {backgroundColor: Colors.loginbtnColor}]}>
                    <Icon style={styles.lockIcon} name="lock" size={30}/>
                    <Text style={styles.lockTxt}>Alcuni oontennuti non sono disponibili</Text>
                    <Text style={styles.lockTxt}>con la version base</Text>
                </View>
            </TouchableHighlight>  
        </View>
    )
}

const styles = StyleSheet.create({
    lockContainer:{
        width: '100%',
        backgroundColor: 'white',
    },
    btnContainer:{
        width: '100%',
        justifyContent: 'center', 
        borderRadius: 30
    },
    clickTxtContainer:{ 
        borderRadius: 30, 
        alignItems: 'center', 
        padding: 13
    },
    lockIcon:{
        color: 'white', 
        position: 'absolute', 
        left: 30, 
        top: 12
    },
    lockTxt:{
        fontSize: 11,
        fontWeight:'700',
        color: 'white'
    }
})


export default LockButtonComponent;