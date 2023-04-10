import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { loginSuccess } from '../../../modules/action';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppLogo from '../../../../assets/images/brand_dark.png';
import Colors from '../../../css/colors';


let countdownTimer = 0;
class PurchaseResultScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isSuccess: props.success
        }
    }
    onBack(){
        const {isSuccess} = this.state;
        if(isSuccess){
            const{userInfo, item,  purchaseList} = this.props;
            let new_purchaseList = purchaseList;
            const purchased_item = item;
            purchased_item['utente_id'] = userInfo['utente_id'];
            purchased_item['item_id'] = item['id'];
            purchased_item['prodotto'] = item['type'];
            purchased_item['purchase'] = true;
            new_purchaseList.push(purchased_item);
            this.props.actions.loginSuccess(userInfo, new_purchaseList);
        }
        Actions.reset('homeTab');
    }

    componentWillUnmount() {
        countdownTimer = 0;
        if (this.interval != null)
            clearInterval(this.interval);
    }
    componentDidMount(){
        this.interval = null;
        this.interval = setInterval(() => {
            countdownTimer += 1;
            if(countdownTimer == 3){
                clearInterval(this.interval);
                this.onBack();
            }
        }, 1000);
    }
    render(){
        const {isSuccess} = this.state;
        return(
            <View style={styles.container}>
               <Image 
                     source={AppLogo}
                     style={styles.logoImg}
                     resizeMode="stretch"
                />
                 {/* <TouchableOpacity style={styles.backContainer} onPress={()=>this.onBack()}>
                    <Icon name={'arrow-circle-o-left'} size={40} color='gray'/>
                 </TouchableOpacity> */}

                <Icon color={isSuccess?'#94C14F':"#E20613"} name={isSuccess?"check-circle-o":"times-circle-o"}  size={170}/>
                <Text style={{fontSize:25, color: Colors.BlueColor, marginVertical: 10}}>{isSuccess?"Grazie!":"Ops..."}</Text>
                <Text style={{fontSize:15, color: Colors.darkGrayColor}}>{isSuccess?"Pagamento effettuato correttamente.":"Qualcosaé andato storto."}</Text>
                <Text style={{position:'absolute', alignContent:'center', bottom: 30}}>Verrai reindirizzato alla pagina principale.</Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImg:{
        width: 300, 
        height: 80, 
        position: 'absolute', 
        top:0, 
        left:0
    },
    backContainer:{
        position: 'absolute',
        top: 10,
        right: 10
    },
})

const mapStateToProps = state => ({
    userInfo: state.umbriaReducer.userInfo,
    purchaseList: state.umbriaReducer. purchaseList
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({loginSuccess}, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(PurchaseResultScreen)
