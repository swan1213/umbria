import React from 'react'
import { View, Text, Alert, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import requestAPI from '../../../modules/api';
import ModalOverlay from '../../../components/ModalOverlay';
import { loginSuccess } from '../../../modules/action';

class ScanScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: '',
            isFetching: false
        }
    }

    onSuccess = e => {
        console.log("reader: ", e.data);
        this.setState({ result: e.data });
        this.onScanner(e.data);
    };

    async onScanner(data) {
        this.setState({ isFetching: true });
        const { userInfo } = this.props;
        const dict = {
            cmd: 'obliterazione',
            utente_id: userInfo.utente_id,
            barcode: data
        }
        let response = await requestAPI(dict);
      
        if (response.status == 200) {
            const{email, password} = userInfo;
            const dict_login = {
                cmd: 'login',
                email: email,
                password: password
            } 
            response = await requestAPI(dict_login);
            let purchaseList = [];  
            this.setState({isFetching: false});          
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
                Actions.purchaseaudio();
            }
        } else {
            this.setState({isFetching: false});  
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
        const { isFetching } = this.state;
        return (
            <View style={styles.container}>
                <ModalOverlay isFetching={isFetching} />
                <QRCodeScanner
                    onRead={this.onSuccess}
                    reactivate={true}
                    flashMode={RNCamera.Constants.FlashMode.off}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: 'white'
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
    },
    textBold: {
        fontWeight: '500',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        padding: 16
    }
});

const mapStateToProps = state => ({
    userInfo: state.umbriaReducer.userInfo,
});


const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({ loginSuccess }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScanScreen)
