import React from 'react'
import {View,Text,StyleSheet,TouchableHighlight} from 'react-native'
import Colors from '../../css/colors';
import userStyles from '../../css/styles';

const CustomButton = ({onPress, btnText})=>{
    return(
        <TouchableHighlight 
            style={[styles.loginContainer, {marginTop: 20}]}
            underlayColor={Colors.loginbtnHighLightColor}
            activeOpacity={0.55}
            onPress={onPress}
        >
            <View style={[styles.clickTxtContainer, {backgroundColor: Colors.loginbtnColor}]}>
                <Text style={userStyles.loginTxt}>{btnText}</Text>
            </View>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    loginContainer:{
        width: '100%',
        justifyContent: 'center', 
        borderRadius: 30
    },
    clickTxtContainer:{ 
        borderRadius: 30, 
        alignItems: 'center', 
        padding: 13
    },
})
export default CustomButton