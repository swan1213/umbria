import React from 'react'
import { TextInput,StyleSheet, Platform } from 'react-native';

const CustomInput =({value, setValue,placeholder,secureTextEntry, returnKeyType, keyboardType}) => {
    return(
        <TextInput
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            placeholderTextColor={'grey'}
            style={Platform.OS === 'ios'?styles.iosInput:styles.input}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            returnKeyType={returnKeyType?"done":'next'}
        />
    )
}

const styles =StyleSheet.create({       
    input:{
        color: 'black'
    },
    iosInput:{
        paddingHorizontal: 10,
        paddingVertical:10,
        color: 'black'
    }
});
export default CustomInput
