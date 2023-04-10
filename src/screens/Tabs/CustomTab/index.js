import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import Colors from '../../../css/colors';


class TabIcon extends React.Component {
    render() {
        const{focused, title, iconName} = this.props;
        var color = focused ? Colors.tabActiveColor : Colors.tabColor;
        return (
            <View style={{alignItems: 'center'}}>
                <Icon style={{ color: color }} name={iconName || "circle"} size={18} />
                <Text style={{color: color, fontSize: 10, marginTop: 7}}>{title}</Text>
            </View>
        );
    }
}


class CustomTabBar extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { state } = this.props.navigation;
        const activeTabIndex = state.index;
        console.log("state.routes === ", state.routes);
        return (
            <View style={styles.container}>
                <TouchableOpacity key={'dashboardtab'} onPress={() => { Actions['dashboardtab']() }}>
                    <TabIcon focused={activeTabIndex == 0} iconName="home" title="Dashboard" />
                </TouchableOpacity>
                <TouchableOpacity key={'exploretab'} onPress={() => { Actions['exploretab']() }}>
                    <TabIcon focused={activeTabIndex == 1} iconName="headphones" title="Explora" />
                </TouchableOpacity>
                <TouchableOpacity key={'searchtab'} onPress={() => { Actions['searchtab']() }}>
                    <TabIcon focused={activeTabIndex == 2} iconName="search" title="Cerca"/>
                </TouchableOpacity>
                <TouchableOpacity key={'scantab'} onPress={() => { Actions['scantab']() }}>
                    <TabIcon focused={activeTabIndex == 3} iconName="qrcode" title="Scansiona"/>
                </TouchableOpacity>
                <TouchableOpacity key={'profiletab'} onPress={() => { Actions['profiletab']() }}>
                    <TabIcon focused={activeTabIndex == 4} iconName="gear" title="Impostazioni"/>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F0F0F2',
        height: 70,
        flexDirection: 'row',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})

export default CustomTabBar;