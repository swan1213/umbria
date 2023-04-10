import React from 'react'
import { View, Text, StyleSheet, ScrollView, Alert, Dimensions, Image, TouchableHighlight } from 'react-native';
import { Actions } from 'react-native-router-flux';
import ModalOverlay from '../../components/ModalOverlay';
import requestAPI from '../../modules/api';
import AppLogo from '../../../assets/images/brand_light.png';
import CustomInput from '../../components/CustomInput/CustomInput';
import validate from '../../modules/validate';
import userStyles from '../../css/styles';
import Colors from '../../css/colors';

class SignUpScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            useremail: '',
            userphone: '',
            password: '',
            passwordrepeat: '',
            isFetching: false
        }
        this.onSignUppress = this.onSignUppress.bind(this);
    }

    onSignInPressed() {
        Actions.pop();
    }
    onSignUppress() {
        const { username, useremail, userphone, password, passwordrepeat } = this.state;
        if (!validate(useremail) || useremail == ''){
            Alert.alert(
                "Error",
                "Digitare un indirizzo email valido.",
                [
                  { text: "OK"}
                ]
              );
            return ;
        }
        // if (username == ''){
        //     Alert.alert(
        //         "Error",
        //         "Enter user full name.",
        //         [
        //           { text: "OK"}
        //         ]
        //       );
        //     return ;
        // }
        // if (userphone == ''){
        //     Alert.alert(
        //         "Error",
        //         "Enter user phone number.",
        //         [
        //           { text: "OK"}
        //         ]
        //       );
        //     return ;
        // }
        if(password == ''){
            Alert.alert(
                "Error",
                "Enter user password.",
                [
                    { text: "OK"}
                ]
              );
            return ;
        }
        if(passwordrepeat == '' || passwordrepeat != password){
            Alert.alert(
                "Error",
                "Does not match password, check again.",
                [
                    { text: "OK"}
                ]
              );
            return ;
        }

        if (validate(useremail)) {
            this.setState({ isFetching: true });          
            const dict = {
                cmd: 'register',
                name: username,
                email: useremail,
                phone: userphone,
                password: password
            }
            console.log("dict ==== ", dict);
            requestAPI(dict)
                .then(response => {
                    if (response.status === 200) {
                        Actions.pop();
                        this.setState({ isFetching: false });
                    } else {
                        Alert.alert(
                            "Error",
                            response.message,
                            [
                                { text: "OK", onPress: () => this.setState({ isFetching: false }) }
                            ]
                        );
                    }
                })
                .catch((error) => {
                    console.error(error);
                    this.setState({ isFetching: false });
                });
        } else {
            Alert.alert(
                "Error",
                response['message'],
                [
                    { text: "OK" }
                ]
            );
        }

    }
     
    render() {
        const { username, password, useremail, userphone, passwordrepeat, isFetching } = this.state;
        const height = Dimensions.get('window').height;
        return (
            <ScrollView contentContainerStyle={[userStyles.container, { paddingBottom: 20 }]}>
                <ModalOverlay isFetching={isFetching} />
                <View style={styles.loginrootContainer}>
                    <Image
                        source={AppLogo}
                        style={{ height: height / 10, marginBottom: 15 }}
                        resizeMode="contain"
                    />
                    <View style={styles.txtContainer}>
                        <CustomInput
                            value={username}
                            setValue={(text) => { this.setState({ username: text }) }}
                            placeholder={'Nome e Cognome'}
                        />
                    </View>
                    <View style={styles.txtContainer}>
                        <CustomInput
                            value={useremail}
                            setValue={(text) => { this.setState({ useremail: text }) }}
                            keyboardType="email-address"
                            placeholder={'Indirizzo E-Mail'}
                        />
                    </View>
                    <View style={styles.txtContainer}>
                        <CustomInput
                            value={userphone}
                            setValue={(text) => { this.setState({ userphone: text }) }}
                            keyboardType="phone-pad"
                            placeholder={'Numero di telefono'}
                        />
                    </View>
                    <View style={styles.txtContainer}>
                        <CustomInput
                            value={password}
                            setValue={(text) => { this.setState({ password: text }) }}
                            placeholder={'Password'}
                            secureTextEntry={true}
                        />
                    </View>
                    <View style={styles.txtContainer}>
                        <CustomInput
                            value={passwordrepeat}
                            setValue={(text) => { this.setState({ passwordrepeat: text }) }}
                            placeholder={'Conferma password'}
                            secureTextEntry={true}
                            returnKeyType={true}
                        />
                    </View>
                    <TouchableHighlight
                        style={[styles.loginContainer, { marginTop: 20 }]}
                        underlayColor={Colors.loginbtnHighLightColor}
                        activeOpacity={0.75}
                        onPress={this.onSignUppress}
                    >
                        <View style={[styles.clickTxtContainer, { backgroundColor: Colors.loginbtnColor }]}>
                            <Text style={userStyles.loginTxt}>Registrati adesso</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={styles.signupclickContainer}>
                    <TouchableHighlight
                        style={styles.loginContainer}
                        underlayColor={Colors.signupbtnHighLightColor}
                        activeOpacity={0.55}
                        onPress={this.onSignInPressed}
                    >
                        <View style={[styles.clickTxtContainer, { backgroundColor: Colors.signupbtnColor }]}>
                            <Text style={userStyles.loginTxt}>Hai un profilo? Accedi</Text>
                        </View>
                    </TouchableHighlight>
                    <Text style={{ color: 'white', fontSize: 12 }}>Hai bisogno di supporto?</Text>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    loginrootContainer: {
        height: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    loginContainer: {
        width: '100%',
        justifyContent: 'center',
        borderRadius: 30
    },
    clickTxtContainer: {
        borderRadius: 30,
        alignItems: 'center',
        padding: 13
    },
    signupclickContainer: {
        height: '10%',
        width: '100%',
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    txtContainer: {
        backgroundColor: 'white',
        width: '100%',
        borderColor: '#e8e8e8',
        borderWidth: 1,
        borderRadius: 30,
        paddingHorizontal: 10,
        marginVertical: 5,
    },

    input: {},
});

export default SignUpScreen
