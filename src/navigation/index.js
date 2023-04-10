import React,{Component} from 'react';
import {View , StyleSheet, Text} from 'react-native';
import {
    Scene,
    Router,
    Stack,Tabs
  } from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/FontAwesome';
import SigninScreen from '../screens/SigninScreen';
import SignupScreen from '../screens/SignUpScreen';
import DashboardScreen from '../screens/Tabs/DashboardScreen';
import ExploreScreen from '../screens/Tabs/ExploreScreen';
import ProfileScreen from '../screens/Tabs/ProfileScreen';
import ScanScreen from '../screens/Tabs/ScanScreen';
import SearchScreen from '../screens/Tabs/SearchScreen';
import StartScreen from '../screens/StartScreen';
import ProfileEditScreen from '../screens/Tabs/ProfileEditScreen';
import BillingScreen from '../screens/Tabs/BillingScreen/BillingScreen';
import PurchaseAudioListScreen from '../screens/Tabs/PurchaseAudioListScreen';
import AudioPlayScreen from '../screens/Tabs/AudioPlayScreen';
import PurchaseScreen from '../screens/Tabs/PurchaseScreen/PurchaseScreen';
import PurchaseResultScreen from '../screens/Tabs/PurchaseResultScreen/PurchaseResultScreen';
import PaymentScreen from '../screens/Tabs/PaymentScreen';
import PaymentMethodScreen from '../screens/Tabs/PaymentMethodScreen';
import ProvinciaScreen from '../screens/Tabs/ProvinciaScreen/ProvinciaScreen';
import ItinerListScreen from '../screens/Tabs/ItinerListScreen';
import Colors from '../css/colors';


// stripe.setOptions({
//   publishableKey: 'pk_test_51KXLWGHSYca6SEIgJnf7lw5ZS53sJo0jzgQ70blVYT1MxxA9VyzxHpukEdZiY3XhsbcMKDwf3oJbcS3uEZuoeK1D00yEjo4tOx',
//   androidPayMode: 'test',
// })
// stripe.setStripeAccount(null)

class TabIcon extends Component {
    render() {
      const{focused, iconName} = this.props;
      var color = focused ? Colors.tabActiveColor : Colors.tabColor;
      return (
        <View style={{alignItems: 'center'}}>
          <Icon style={{color: color}} name={iconName || "circle"} size={focused ? 30 : 23}/>
          {
            focused == false &&
            <Text style={{color: color, fontSize: 9, marginTop: 5}}>{this.props.title}</Text>
          }
        </View>
      );
    }
  }

class Navigation extends React.Component{
    
    render(){
        return(
            <Router>
                <Stack key="root">
                    <Scene key='start' component={StartScreen} hideNavBar initial/>
                    <Scene key="signin" component={SigninScreen} hideNavBar />
                    <Scene key="signup" component={SignupScreen} hideNavBar />
                    <Scene key="purchase" component={PurchaseScreen} hideNavBar />
                    <Scene key="purchaseresut" component={PurchaseResultScreen} hideNavBar />
                    <Scene key="paymentscreen" component={PaymentScreen} hideNavBar />
                    <Scene key="paymentmethodscreen" component={PaymentMethodScreen} hideNavBar />
                    <Tabs key="homeTab" default="tab1" hideNavBar tabBarStyle={styles.tabBar} tabStyle={styles.tabStyle} showLabel={false}>
                        <Scene key="dashboardtab" iconName="home" hideNavBar title="Dashboard" icon={TabIcon}  initial={true}>
                          <Scene key="dashboardtab" hideNavBar component={DashboardScreen} initial/>
                          <Scene key="itinerlist" hideNavBar component={ItinerListScreen}/>
                          <Scene key="audioplay" hideNavBar component={AudioPlayScreen} />
                        </Scene>
                        <Scene key="exploretab" iconName="headphones" hideNavBar component={ExploreScreen} title="Esplora" icon={TabIcon}  />
                        <Scene key="searchtab" iconName="search" hideNavBar title="Cerca" icon={TabIcon}>
                          <Scene key="searchtab" hideNavBar component={SearchScreen} initial />
                          <Scene key="itinerlist" hideNavBar component={ItinerListScreen}/>
                          <Scene key="audioplay" hideNavBar component={AudioPlayScreen} />
                        </Scene>
                        <Scene key="scantab" iconName="qrcode" hideNavBar component={ScanScreen} title="Scansiona" icon={TabIcon}  />                      
                        <Scene key="profiletab" iconName="gear" hideNavBar  title="Impostazioni" icon={TabIcon}>
                           <Scene key="profiletab" component={ProfileScreen} hideNavBar initial/>
                           <Scene key="itinerlist" hideNavBar component={ItinerListScreen}/>
                           <Scene key="itinerlist" hideNavBar component={ItinerListScreen}/>
                           <Scene key="audioplay" component={AudioPlayScreen} hideNavBar/>
                           <Scene key="profileedit" component={ProfileEditScreen} hideNavBar />
                           <Scene key="billedit" component={BillingScreen} hideNavBar />
                           <Scene key="purchaseaudio" component={PurchaseAudioListScreen} hideNavBar />
                           <Scene key="provincia" component={ProvinciaScreen} hideNavBar />
                        </Scene>
                    </Tabs>
                </Stack>
            </Router>
        )
    }
}

const styles = StyleSheet.create({
  tabStyle: {
    alignItems: 'center', 
    justifyContent: 'center',
    paddingHorizontal: 0,
    paddingBottom: 2,
  },
  iconStyle: {
    color: 'white'
  },
  tabBar: {
    height: 70,
    backgroundColor: '#F0F0F2'
    }
})

export default Navigation