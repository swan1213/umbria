import React from "react";
import { View, ScrollView, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { Actions } from "react-native-router-flux";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import LogoComponent from '../../../components/LogoComponent/LogoComponent';
import ModalOverlay from "../../../components/ModalOverlay";
import CustomButton from '../../../components/CustomButton/CustomButton';
import CustomInput from "../../../components/CustomInput/CustomInput";
import requestAPI from "../../../modules/api";
import { userInfoUpdate } from "../../../modules/action";

class BillingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            billname: '',
            billcompanyname: '',
            billcountry: '',
            billcity: '',
            billstreet: '',
            billcap: '',
            billregion: '',
            billprovince: '',
            isFetching: false
        }
        this.onUpdateProvinca = this.onUpdateProvinca.bind(this);
    }

    componentDidMount() {
        const { dati_fatt } = this.props.userInfo;
        if (dati_fatt != undefined) {
            this.setState({
                billcap: dati_fatt['cap'],
                billcity: dati_fatt['citta'],
                billname: dati_fatt['nome'],
                billcompanyname: dati_fatt['societa'],
                billcountry: dati_fatt['part_iva'],
                billregion: dati_fatt['paese_regione'],
                billprovince: {
                    nome: dati_fatt['provincia'],
                    id: dati_fatt['provincia_id']
                },
                billstreet: dati_fatt['indrizzo']
            })
        }

    }

    onUpdate() {
        const { billprovince, billcity, billregion, billcap, billcompanyname, billcountry, billstreet, billname } = this.state;
     
        this.setState({ isFetching: true });
        const {userInfo} = this.props;
        const { utente_id, dati_fatt } = userInfo;
        const update_dict ={
            nome: billname,
            utente_id: utente_id,
            societa: billcompanyname,
            part_iva: billcountry,
            indrizzo: billstreet,
            cap: billcap,
            citta: billcity,
            paese_regione: billregion,
            provincia_id: billprovince['id'],
            provincia: billprovince['nome'],
            email: dati_fatt["email"],
            telefono: dati_fatt["telefono"],
            id: dati_fatt["id"],
            salt_password: dati_fatt["salt_password"]
        }
        const dict = {
            cmd: "profupdate",
            nome: billname,
            utente_id: utente_id,
            societa: billcompanyname,
            part_iva: billcountry,
            indrizzo: billstreet,
            cap: billcap,
            citta: billcity,
            paese_regione: billregion,
            provincia_id: billprovince['id'],        
        }
        requestAPI(dict)
            .then(response => {
                this.setState({ isFetching: false });
                userInfo["dati_fatt"] = update_dict;
                this.props.actions.userInfoUpdate(userInfo);
            }
            ).catch((error) => {
                console.error(error);
                this.setState({ isFetching: false, refreshing: false });
            });
    }

    onBack() {
        Actions.pop();
    }

    onUpdateProvinca(item) {
        this.setState({ billprovince: item })
    }

    onProvincia() {
        Actions.provincia({ onUpdateProvinca: this.onUpdateProvinca });
    }

    render() {
        const { billcap, billcity, billcompanyname, billcountry, billname, billprovince, billregion, billstreet, isFetching } = this.state;
        return (
            <ScrollView contentContainerStyle={{ backgroundColor: 'white' }}>
                <ModalOverlay isFetching={isFetching} />
                <LogoComponent
                    isBack={true}
                    onBack={this.onBack}
                />
                <View style={{ paddingHorizontal: 15 }}>
                    <CustomInput
                        value={billname}
                        setValue={(text) => { this.setState({ billname: text }) }}
                        placeholder={'Nome e Cognome'}
                    />
                    <CustomInput
                        value={billcompanyname}
                        setValue={(text) => { this.setState({ billcompanyname: text }) }}
                        placeholder={'Nome della società'}
                    />
                    <CustomInput
                        value={billcountry}
                        setValue={(text) => { this.setState({ billcountry: text }) }}
                        placeholder={'Partita iva/codice fiscale'}
                    />
                    <CustomInput
                        value={billregion}
                        setValue={(text) => { this.setState({ billregion: text }) }}
                        placeholder={'Paese/regione'}
                    />
                    <CustomInput
                        value={billstreet}
                        setValue={(text) => { this.setState({ billstreet: text }) }}
                        placeholder={'Via e numero'}
                    />
                    <CustomInput
                        value={billcap}
                        setValue={(text) => { this.setState({ billcap: text }) }}
                        placeholder={'C.A.P.'}
                    />
                    <CustomInput
                        value={billcity}
                        setValue={(text) => { this.setState({ billcity: text }) }}
                        placeholder={'Città'}
                    />
                    <TouchableOpacity style={styles.sectionContentContainer} onPress={() => { this.onProvincia() }}>
                        <Text style={styles.sectionLabelTxt}>Provincia</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.sectionLabelTxt}>{billprovince['nome']}</Text>
                            <Image
                                source={require('../../../../assets/images/icon_rightarrow.png')}
                                resizeMode='contain'
                                style={styles.rightArrowImg}
                            />
                        </View>
                    </TouchableOpacity>
                    <CustomButton
                        onPress={() => this.onUpdate()}
                        btnText={"Salva"}
                    />
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    sectionContentContainer: {
        paddingHorizontal: 5,
        marginBottom: 20,
        marginTop: 10,
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

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({ userInfoUpdate }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(BillingScreen);