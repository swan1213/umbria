import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default class RadioButton extends Component {
	// componentDidMount(){
	// 	this.setState({value: this.props.valueKey});
	// }
	render() {
		const { PROP, onChangeRadio, valueKey} = this.props;
		// const { value } = this.state;
		
		return (
			<View>
				{PROP.map(res => {
					return (
						<View key={res.key} style={styles.container}>
							<Text style={styles.radioText}>{res.text}</Text>
							<TouchableOpacity
								style={styles.radioCircle}
								onPress={()=>{onChangeRadio(res)}}>
                                  {res.key === valueKey && <View style={styles.selectedRb} />}
							</TouchableOpacity>
						</View>
					);
				})}              
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
        marginBottom: 15,
        alignItems: 'center',
        flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 15,
	},
    radioText: {
        marginRight: 35,
        fontSize: 15,
        color: '#000',
        fontWeight: '700'
    },
	radioCircle: {
		height: 25,
		width: 25,
		borderRadius: 100,
		borderWidth: 2,
		borderColor: '#3740ff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	selectedRb: {
		width: 15,
		height: 15,
		borderRadius: 50,
		backgroundColor: '#3740ff',
    },
    result: {
        marginTop: 20,
        color: 'white',
        fontWeight: '600',
        backgroundColor: '#F3FBFE',
    },
});