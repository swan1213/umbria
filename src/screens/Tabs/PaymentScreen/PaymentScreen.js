import React from 'react';
import { StyleSheet, Alert, View, Button, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CreditCardInput } from 'react-native-credit-card-input';
import { Actions } from 'react-native-router-flux';
import Stripe from 'react-native-stripe-api';
import ModalOverlay from '../../../components/ModalOverlay';
import requestAPI from '../../../modules/api';
import { STRIPE_PUBLIC_KEY } from '../../../modules/constant';
import AppLogo from '../../../../assets/images/brand_dark.png';


const apiKey = STRIPE_PUBLIC_KEY;
const client = new Stripe(apiKey);

export default class PaymentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      cardData: { valid: false } ,
      isFetching: false
    };
  }

  onBack() {
    Actions.pop();
  }

  async fetchStripe() {
    const { item, userInfo } = this.props;
    
    const { values } = this.state.cardData;
    this.setState({isFetching: true});

    const expiry = values.expiry.split('/');
    const token_response = await client.createToken({
      number: values.number,
      exp_month: expiry[0],
      exp_year: expiry[1],
      cvc: values.cvc,
      address_zip: ''
    })
    
    
    if (token_response.id != undefined) {
      console.log("token_response;", token_response.id);
      const dict = {
        cmd: 'payment',
        prodotto: item['type'],
        item_id: item['id'],
        utente_id: userInfo['utente_id'],
        stripe_token: token_response.id
      }      
     
      requestAPI(dict)
      .then(response => {     
        if(response.status == 200){
          Actions.purchaseresut({success: true, item: item});
        }
        else{
          Alert.alert(
            "Error",
            response['message'],
            [
                { text: "OK", onPress: ()=>Actions.purchaseresut({success: false})}
            ]
          );          
        }
        this.setState({isFetching: false});
      })
      .catch((error) => {
          console.error(error);
          this.setState({ isFetching: false });
      });
     
    }
  }

  render() {
    const { submitted, error } = this.props;
    const{isFetching} = this.state;
  
    return (
      <View>
        <ModalOverlay isFetching={isFetching}/>
        <Image
          source={AppLogo}
          style={{ width: 300, height: 80, marginBottom: 15 }}
          resizeMode="stretch"
        />
        <TouchableOpacity style={styles.backContainer} onPress={this.onBack}>
          <Icon name={'arrow-circle-o-left'} size={40} color='gray' />
        </TouchableOpacity>
        <View>
          <CreditCardInput requiresName onChange={(cardData) => this.setState({ cardData })} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title='Pay Now'
            disabled={!this.state.cardData.valid || submitted}
            onPress={() => this.fetchStripe()}
          />
        </View>
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
  container: {
    flex: 1,
    alignItems: 'center'
  },
  buttonWrapper: {
    padding: 10,
    zIndex: 100
  },
  alertTextWrapper: {
    flex: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  alertIconWrapper: {
    padding: 5,
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  alertText: {
    color: '#c22',
    fontSize: 16,
    fontWeight: '400'
  },
  alertWrapper: {
    backgroundColor: '#ecb7b7',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 5,
    paddingVertical: 5,
    marginTop: 10
  }
});