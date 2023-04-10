import React from 'react'
import {View , Text , StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { initialRedux } from '../../../modules/action';
import LogoComponent from '../../../components/LogoComponent/LogoComponent';
import Colors from '../../../css/colors';

class ProfileScreen extends React.Component{
    constructor(props){
        super(props);
    }

    onShoppingPress(){
        Actions.purchaseaudio();
    }
    onUserPress(){
        Actions.profileedit();
    }
    onOtherPress(){
        Actions.billedit();
    }
    onLogout(){
        this.props.actions.initialRedux();
        Actions.reset('signin');
    }

    render(){
        return(
            <View>
                <LogoComponent />
                <TouchableOpacity onPress={this.onShoppingPress} style={{alignItems: 'center', flexDirection: 'row', padding: 15}}>
                    <Icon style={{color: Colors.darkGrayColor, width: 40}} name='shopping-basket' size={20}/>
                    <Text style={{color: Colors.darkGrayColor}}>Storico acquisti</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.onUserPress} style={{alignItems: 'center', flexDirection: 'row', padding: 15}}>
                    <Icon style={{color: Colors.darkGrayColor, width: 40}} name='user' size={20}/>
                    <Text style={{color: Colors.darkGrayColor}}>Modifica dati generali</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.onOtherPress} style={{alignItems: 'center', flexDirection: 'row', padding: 15}}>
                    <Icon style={{color: Colors.darkGrayColor, width: 40}} name='microchip' size={20}/>
                    <Text style={{color: Colors.darkGrayColor}}>Modifica dati fatturazione</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.onLogout()} style={{alignItems: 'center', flexDirection: 'row', padding: 15}}>
                    <Icon style={{color: Colors.darkGrayColor, width: 40}} name='sign-out' size={20}/>
                    <Text style={{color: Colors.darkGrayColor}}>Disconnettersi</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    userRealName:{
        fontSize: 20,
        color: '#ffffff'
    },
    settingContainer:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 15        
    },
    imgContainer:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    settingIconContainer:{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row'
    },
    userName:{
        marginLeft: 3,
        fontSize: 15,
        color: '#ffffff'
    },
    buttonContainer:{
        borderColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        padding: 3
    },
    root:{
        alignItems : 'center',
        padding:20,
    },
    Logo:{
        width : '70%',
        height : 200,
    },
});
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({ initialRedux}, dispatch),
});
const mapStateToProps = state => ({
    email: state.umbriaReducer.email,
    purchaseList: state.umbriaReducer.purchaseList,
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)