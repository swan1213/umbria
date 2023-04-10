import React from 'react'
import {View , Image, StyleSheet, Dimensions,ScrollView, TextInput, TouchableHighlight, Text, Platform, Alert} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loginSuccess } from '../../modules/action';
import requestAPI from '../../modules/api';
import AppLogo from '../../../assets/images/brand_light.png';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomInput from '../../components/CustomInput/CustomInput';
import ModalOverlay from '../../components/ModalOverlay';
import validate from '../../modules/validate';
import userStyles from '../../css/styles';
import Colors from '../../css/colors';

class SigninScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            // username: 'test@test.com',
            // password: 'rootroot',
            // username: 'prova@prova.it',
            // password: 'prova',
            username: '',
            password: '',
            isFetching: false
        }     
        this.onSignInPressed = this.onSignInPressed.bind(this)  ;
    }

    onSignInPressed(){                    
        const{username, password} = this.state;
        if (!validate(username) || username == ''){
            Alert.alert(
                "Error",
                "Digitare un indirizzo email valido.",
                [
                    { text: "OK"}
                ]
              );
            return ;

        }
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
        const dict = {
            cmd: 'login',
            email: username,
            password: password
        }     
        this.setState({isFetching: true});
        
        requestAPI(dict)
        .then(response => {
            
            let purchaseList = [];            
            if(response.status === 200){
                if(response.data.acquisti !=null){
                    if(response.data.acquisti.itinerari !=null){
                        response.data.acquisti.itinerari.map((item)=>{
                            item['purchase'] = true;
                            item['id'] = item['item_id'];
                            item['type'] = 'itinerario';
                            purchaseList.push(item);
                        })
                    }
                    if(response.data.acquisti.pacchetti != null){
                        response.data.acquisti.pacchetti.map((item)=>{
                            item['purchase'] = true;
                            item['id'] = item['item_id'];
                            item['type'] = 'pacchetto';
                            purchaseList.push(item);
                        })
                    }
                }
                const userInfo = {
                    nome: response.data['nome'],
                    password: password,
                    utente_id: response.data['utente_id'],
                    email: response.data['email'],
                    telefono: response.data['telefono'],
                    dati_fatt: response.data['dati_fatt'] == null ? {} :  response.data['dati_fatt'][0],
                }
               
                this.props.actions.loginSuccess(userInfo, purchaseList);
                Actions.reset('homeTab');
                this.setState({isFetching: false});
            }else{
                Alert.alert(
                    "Error",
                    response['message'],
                    [
                      { text: "OK" , onPress: () => this.setState({isFetching: false})}
                    ]
                  );
            }
        })
        .catch((error) => {
            console.error(error);
            this.setState({ isFetching: false });
        });
    }
    onSignUppress(){
        Actions.signup();
    }

    render(){
        const{username, password, isFetching} = this.state;
        const height = Dimensions.get('window').height;   
        return(
            <ScrollView contentContainerStyle={[userStyles.container,{paddingBottom: 20}]}>
                <ModalOverlay isFetching={isFetching}/>
                <View style={styles.loginrootContainer}>
                    <Image
                        source={AppLogo}
                        style={{height: height/10, marginBottom: 15}}
                        resizeMode="contain"
                    />
                    <View style={styles.txtContainer}>
                        <CustomInput 
                            value={username}
                            setValue={(text)=>{this.setState({username: text})}}
                            placeholder={'Username'}
                        />
                    </View>
                    <View style={styles.txtContainer}>                       
                        <CustomInput 
                            value={password}
                            setValue={(text)=>{this.setState({password: text})}}
                            placeholder={'Password'}
                            secureTextEntry={true}
                            returnKeyType={true}
                        />
                    </View>                  
                    <CustomButton 
                        onPress={this.onSignInPressed}
                        btnText={"Accedi"}
                    />                   
                </View>
                <View style={styles.signupclickContainer}>                    
                    <TouchableHighlight 
                        style={styles.loginContainer}
                        underlayColor={Colors.signupbtnHighLightColor}
                        activeOpacity={0.55}
                        onPress={this.onSignUppress}
                    >
                        <View style={[styles.clickTxtContainer, {backgroundColor: Colors.signupbtnColor}]}>
                            <Text style={userStyles.loginTxt}>Non hai un profilo? Registrati</Text>
                        </View>
                    </TouchableHighlight>
                    <Text style={{color: 'white', fontSize: 12}}>v1.0.0</Text>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    loginrootContainer:{
        height: '80%',
        alignItems : 'center',
        justifyContent: 'center',
        padding:20,
    },
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
    signupclickContainer:{   
        height: '20%',
        width: '100%',    
        paddingHorizontal: 20,  
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    txtContainer:{
        backgroundColor:'white',
        width : '100%',
        borderColor:'#e8e8e8',
        borderWidth:1,
        borderRadius:30,
        paddingHorizontal: 10,
        marginVertical: 5,
    },

    input:{},
    iosInput:{
        paddingHorizontal: 10,
        paddingVertical:10
    }
});


const mapStateToProps = state => ({
    purchaseList: state.umbriaReducer.purchaseList,
    userInfo: state.umbriaReducer.userInfo,
  });

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({loginSuccess}, dispatch),
  });
  
export default connect(mapStateToProps, mapDispatchToProps)(SigninScreen)
