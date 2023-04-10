import React from 'react'
import {View , StyleSheet, Image, Dimensions} from 'react-native';
import {Actions} from 'react-native-router-flux';
import * as Progress from 'react-native-progress';
import Colors from '../../css/colors';
import AppLogo from '../../../assets/images/brand_light.png';

class StartScreen extends React.Component{

    constructor(props) {
        super(props);    
        this.state = {
          progress: 0,
          indeterminate: true
        };
        this.intervalId = null;
    }

    componentDidMount() {
       this.animate();
    }
    componentWillUnmount(){
        clearInterval(this.intervalId);
    }
    
    animate() {
        let progress = 0;
        this.setState({ progress });
        setTimeout(() => {
            this.setState({ indeterminate: false });
            this.intervalId = setInterval(() => {
            progress += Math.random() / 5;
            if (progress > 1) {
                progress = 1;    
                clearInterval(this.intervalId);
                Actions.reset('signin');
            }
            this.setState({ progress });
            }, 300);
        }, 500);
    }

    render(){
        const height = Dimensions.get('window').height;
        return(
            <View style={styles.logoContainer}>
                <Image
                    source={AppLogo}
                    style={{height: height/10}}
                    resizeMode="contain"
                />
                <Progress.Bar
                    style={styles.progress}
                    progress={this.state.progress}
                    indeterminate={this.state.indeterminate}
                    color={'white'}
                />
          </View>
        )
    }
}

const styles = StyleSheet.create({
    logoContainer:{
        display: 'flex',
        flex: 1,
        backgroundColor: Colors.BlueColor,
        justifyContent: 'center',
        alignItems: 'center'
    },    
    progress: {
        position: 'absolute',
        bottom: 10,
        margin: 10,
    },
})
export default StartScreen;