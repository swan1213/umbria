import React from "react";
import { View, Text, StyleSheet, TouchableHighlight, Dimensions, TouchableOpacity } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from "../../css/colors";

class AudioitemComponent extends React.Component {
    render() {
        const { item, onPress } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.imgrootContainer}>
                    <View style={styles.imgContainer}>
                        <FastImage
                            style={styles.img}
                            source={{
                                uri: item.file,
                            }}
                            resizeMode={FastImage.resizeMode.stretch}
                        />
                        <Icon style={{ color: 'white', display: item.purchase ? 'none' : 'flex' }} name='lock' size={35} />
                    </View>

                    <View style={{ marginLeft: 10, flex: 1 }}>
                        <Text style={{ fontSize: 15, color: Colors.darkGrayColor }} numberOfLines={1} >{item.titolo}</Text>
                        <Text style={{ fontSize: 12, color: Colors.darkGrayColor }} numberOfLines={1}>{item.descrizione}</Text>
                    </View>
                </View>
                <TouchableHighlight onPress={onPress} style={[styles.lockTxtContainer, { backgroundColor: item.purchase ? Colors.darkGrayColor : Colors.loginbtnColor }]}>
                    <Text style={{ color: 'white', fontSize: 12 }}>{item.purchase ? "Ascolta" : '€' + item['prezzo_listino']}</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

export const AudioPlayItemComponent = ({ item, onPress, index, langItem, audioItem }) => {
    return (
        <View style={styles.playItemContainer}>
            <View style={{ alignItems: 'center', flexDirection: 'row', width: '85%' }}>
                <View style={[styles.playItemCircleContainer, item.id == index ? { marginLeft: 20, backgroundColor: Colors.darkGrayColor } : { backgroundColor: Colors.loginbtnColor }]}>
                    <Text style={{ color: 'white' }}>{item.nriferimento}</Text>
                </View>

                <View style={{ marginLeft: 10, flex: 1 }}>
                    {
                        item.id == audioItem.id ?
                        <Text style={{ fontSize: 10, color: Colors.darkGrayColor, fontWeight: 'bold' }} numberOfLines={1}>{langItem.title}</Text>
                        : <Text style={{ fontSize: 10, color: Colors.darkGrayColor, fontWeight: 'bold' }} numberOfLines={1}>{item.titolo}</Text>
                    }

                    {/* <Text style={{ fontSize: 11, color: Colors.darkGrayColor }} numberOfLines={2}>{item.descrizione}</Text> */}
                </View>
            </View>
            <TouchableOpacity onPress={onPress}>
                <Icon name="headphones" style={{ color: Colors.loginbtnColor }} size={25} />
            </TouchableOpacity>
        </View>
    )
}


export const ItinerItem = ({ item, onPress }) => {
    const width = Dimensions.get('window').width;
    return (
        <TouchableOpacity activeOpacity={1} style={{ width: width - 50, height: width / 2, marginRight: 20 }} onPress={onPress}>

            <FastImage
                style={{ flex: 1 }}
                source={{
                    uri: item.file,
                }}
                resizeMode={FastImage.resizeMode.stretch}
            >
                <LinearGradient
                    colors={['#00000000', '#000000']}
                    style={{ height: '100%', width: '100%' }}>
                </LinearGradient>
            </FastImage>


            <View style={[styles.itemTxtContainer, {maxWidth: '90%', height: width / 4}]}>
                <Text style={{ color: 'white', fontSize: 19, fontWeight: 'bold' }} numberOfLines={1}>{item.titolo}</Text>
                <Text style={{ color: 'white', fontSize: 14 }} numberOfLines={1}>{item.descrizione}</Text>
            </View>
            {
                item.purchase == false &&
                <View style={[styles.itemLockTxtContainer, { backgroundColor: Colors.loginbtnColor }]}>
                    <Text style={{ color: 'white', fontSize: 12 }}>{'€' + item['prezzo_listino']}</Text>
                </View>
            }
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginVertical: 10
    },
    imgrootContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        width: '70%'
    },
    imgContainer: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },
    img: {
        width: 60,
        height: 60,
        borderRadius: 30,
        position: 'absolute',
        left: 0
    },
    lockTxtContainer: {
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: 90,
        paddingVertical: 9
    },
    itemTxtContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        justifyContent: 'flex-end',
        paddingRight: 20,
        paddingBottom: 20
    },
    itemLockTxtContainer: {
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: 90,
        paddingVertical: 9,
        position: 'absolute',
        top: 10,
        right: 10
    },
    playItemContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginHorizontal: 30,
        marginVertical: 10
    },
    playItemCircleContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default AudioitemComponent;