import React from 'react';
import { ScrollView, View, Text, Image, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import AppLogo from '../../../../assets/images/brand_dark.png';
import CustomButton from '../../../components/CustomButton/CustomButton';
import Colors from '../../../css/colors';

class PurchaseScreen extends React.Component {
    constructor(props) {
        super(props);
        this.onLockPress =this.onLockPress.bind(this);
    }

    onLockPress() {
        const { item } = this.props;
        Actions.paymentmethodscreen({item});
        // Actions.purchaseresut({success: true, item: item});

        // const token = await stripe.deviceSupportsNativePay()
        // console.log('Token from Card ', token)
    }

    onBack() {
        Actions.pop();
    }

    render() {
        const width = Dimensions.get('window').width;
        const { item, languageList } = this.props;
        const linga_value = item.lingua != null ? item.lingua.toLowerCase() : 'italian';
        return (
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
                <Image
                    source={AppLogo}
                    style={{ width: 300, height: 80, marginBottom: 15 }}
                    resizeMode="stretch"
                />
                <TouchableOpacity style={styles.backContainer} onPress={this.onBack}>
                    <Icon name={'arrow-circle-o-left'} size={40} color='gray' />
                </TouchableOpacity>
                <View style={{ width: '100%', height: width / 2, marginBottom: 15 }}>
                    <FastImage
                        style={{ flex: 1 }}
                        source={{
                            uri: item.file,
                        }}
                        resizeMode={FastImage.resizeMode.stretch}
                    />
                    <View style={styles.priceContainer}>
                        <Text style={{ color: 'white', fontSize: 12 }}>{'€' + item.prezzo_listino}</Text>
                    </View>
                </View>
                <Text style={{ fontSize: 25, fontWeight: 'bold', color: Colors.blueDarkColor }}>{item.titolo}</Text>
                <Text style={{ fontSize: 10, color: Colors.blueDarkColor, marginBottom: 10 }}>{item.categoria}</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: Colors.darkGrayColor }}>{item.descrizione}</Text>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: Colors.blueDarkColor, marginVertical: 20 }}>Lingue disponibili</Text>
                <View style={{ marginBottom: 30 }}>
                    {
                        languageList.map((item)=>(
                            <Text style={styles.languangText}>{item.text}</Text>
                        ))
                    }
                    <CustomButton
                        onPress={this.onLockPress}
                        btnText={"Paga adesso"}
                    />
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    backContainer: {
        position: 'absolute',
        top: 10,
        right: 10
    },
    priceContainer: {
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        position: 'absolute',
        top: 20,
        right: 10,
        paddingVertical: 5,
        backgroundColor: Colors.loginbtnColor
    },
    languangText: {
        marginRight: 35,
        marginBottom: 15,
        fontSize: 15,
        color: '#000',
        fontWeight: '700'
    }
})

export default PurchaseScreen;
