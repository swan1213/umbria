import React from "react";
import { View, Modal, ActivityIndicator } from "react-native";

const ModalOverlay = ({isFetching})=>{
    return(
        <Modal
            animationType={'none'}
            transparent={true}
            visible={isFetching}>
            <View style={{flex:1}}/>
            <View style={{
                height:80,
                width:80,
                alignItems:'center',
                justifyContent:'center',
                backgroundColor:'#3434347f',
                borderRadius:10,alignSelf:'center'}}>
                <ActivityIndicator
                    animating={true}
                    size={"large"}
                    color={'white'}
                />
            </View>
            <View style={{flex:1}}/>
        </Modal>
    )
}

export default ModalOverlay;