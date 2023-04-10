import {StyleSheet} from 'react-native';

const userStyles = StyleSheet.create({
    container: {
      flex: 1,      
      backgroundColor: '#022F4E'
    },
    logoImg: {
      height: 100,
      marginBottom: 15
    },
    loginTxt:{
      color: 'white',
      fontSize: 17
    },
    iconPadding:{
      padding: -1,
      margin: -1
    },
    roundImgView:{
      width: 50,
      height: 50,
      borderRadius: 25
    },
    roundBigImgView:{
      width: 70,
      height: 70,
      borderRadius: 35
    }
})
  
  export default userStyles;