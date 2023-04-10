import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import { GooglePay } from 'react-native-google-pay';
import { ApplePay } from 'react-native-apay';
import { connect } from 'react-redux';
import { STRIPE_PUBLIC_KEY, STRIPE_KEY } from '../../../modules/constant';
import requestAPI from '../../../modules/api';
import AppLogo from '../../../../assets/images/brand_dark.png';
import ModalOverlay from '../../../components/ModalOverlay';
import Colors from '../../../css/colors';

const allowedCardNetworks = ['VISA', 'MASTERCARD'];
const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];

class SectionTouchView extends React.Component {
    render() {
        const { title } = this.props;
        return (
            <TouchableOpacity style={[styles.sectionContentContainer, { marginBottom: 30 }]} onPress={this.props.onPress}>
                <Text style={styles.sectionLabelTxt}>{title}</Text>
                <Image
                    source={require('../../../../assets/images/icon_rightarrow.png')}
                    resizeMode='contain'
                    style={styles.rightArrowImg}
                />
            </TouchableOpacity>
        )
    }
}


class PaymentMethodScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false
        }
        this.onChooseMethod = this.onChooseMethod.bind(this);
    }
    onBack() {
        Actions.pop();
    }

    async onChooseMethod(type) {
        const { item, userInfo } = this.props;
        // console.log("test == ", );
        if (type == 'credit') {
            Actions.paymentscreen({ item, userInfo });
            // const token = await stripe.paymentRequestWithCardForm(options);
            // console.log("token === ", token);

            // const request_token = await stripe.createTokenWithCard(params)
        }
        if (type == 'google' && Platform.OS == 'android') {
            this.setState({ isFetching: true });
            GooglePay.setEnvironment(GooglePay.ENVIRONMENT_TEST);
            const requestData = {
                cardPaymentMethod: {
                    tokenizationSpecification: {
                        type: 'PAYMENT_GATEWAY',
                        gateway: 'stripe',
                        gatewayMerchantId: '',
                        stripe: {
                            publishableKey: STRIPE_KEY,
                            version: '2018-11-08',
                        },
                    },
                    allowedCardNetworks,
                    allowedCardAuthMethods,
                },
                transaction: {
                    totalPrice: item['prezzo_listino'],
                    totalPriceStatus: 'FINAL',
                    currencyCode: 'USD',
                },
                merchantName: 'Example Merchant',
            };
            GooglePay.isReadyToPay(allowedCardNetworks, allowedCardAuthMethods)
                .then((ready) => {
                    if (ready) {
                        console.log("ready;", ready);
                        // Request payment token
                        GooglePay.requestPayment(requestData)
                            .then((token) => {
                                this.setState({ isFetching: false });
                                const dict = {
                                    cmd: 'payment',
                                    prodotto: item['type'],
                                    item_id: item['id'],
                                    utente_id: userInfo['utente_id'],
                                    stripe_token: token
                                }
                                requestAPI(dict)
                                    .then(response => {
                                        if (response.status == 200) {
                                            Actions.purchaseresut({ success: true, item: item });
                                        }
                                        else {
                                            Alert.alert(
                                                "Error",
                                                response['message'],
                                                [
                                                    { text: "OK", onPress: () => Actions.purchaseresut({ success: false }) }
                                                ]
                                            );
                                        }
                                        this.setState({ isFetching: false });
                                    })
                                    .catch((error) => {
                                        console.error(error);
                                        this.setState({ isFetching: false });
                                    });
                                // Send a token to your payment gateway
                                // Alert.alert(
                                //     "",
                                //     token,
                                //     [
                                //         { text: "OK"}
                                //     ]
                                //   );
                            })
                            .catch((error) => {
                                this.setState({ isFetching: false });
                                console.log(error.code, error.message)
                            });
                    } else {
                        this.setState({ isFetching: false });
                    }
                })
        }
        if (type == 'apple' && Platform.OS == 'ios') {
            const requestData = {
                merchantIdentifier: 'merchant.com.example',
                supportedNetworks: ['mastercard', 'visa'],
                countryCode: 'US',
                currencyCode: 'USD',
                paymentSummaryItems: [
                    {
                        label: 'Purchase',
                        amount: item['prezzo_listino'],
                    },
                ],
            }
            if (ApplePay.canMakePayments) {
                ApplePay.requestPayment(requestData)
                    .then((paymentData) => {
                        console.log("paymentData===", paymentData);
                    });
            };
        }
    }

    render() {
        const { isFetching } = this.state;
        return (
            <View style={{ paddingHorizontal: 20 }}>
                <ModalOverlay isFetching={isFetching} />
                <Image
                    source={AppLogo}
                    style={{ width: 300, height: 80, marginBottom: 15 }}
                    resizeMode="stretch"
                />
                <TouchableOpacity style={styles.backContainer} onPress={this.onBack}>
                    <Icon name={'arrow-circle-o-left'} size={40} color='gray' />
                </TouchableOpacity>
                <Text style={styles.titleTxt}>Scegliere il metodo di pagamento</Text>
                <SectionTouchView title={'Credit Card'} onPress={() => { this.onChooseMethod('credit') }} />
                {
                    Platform.OS == 'ios' ?
                        <SectionTouchView title={'Apple Pay'} onPress={() => { this.onChooseMethod('apple') }} /> :
                        <SectionTouchView title={'Google Pay'} onPress={() => { this.onChooseMethod('google') }} />
                }


            </View>
        )
    }
}

const styles = StyleSheet.create({
    backContainer: {
        position: 'absolute',
        top: 10,
        right: 10
    },
    titleTxt: {
        fontSize: 30,
        color: Colors.blueDarkColor,
        textAlign: 'center',
        fontWeight: 'bold',
        marginVertical: 30
    },
    sectionContentContainer: {
        paddingHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    sectionLabelTxt: {
        color: '#1F1F1F',
        fontSize: 15,
        // fontFamily: 'Montserrat-Regular'
    },
    rightArrowImg: {
        width: 7,
        height: 12,
        marginLeft: 5,
    }
})

const mapStateToProps = state => ({
    userInfo: state.umbriaReducer.userInfo,
});

export default connect(mapStateToProps)(PaymentMethodScreen)
