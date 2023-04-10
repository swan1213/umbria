import React from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import LogoComponent from '../../../components/LogoComponent/LogoComponent';
import requestAPI from '../../../modules/api';
import ModalOverlay from '../../../components/ModalOverlay';


class ProvinciaScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isFetching: false,
            provinciaList: []
        }
    }

    onBack() {
        Actions.pop();
    }

    componentDidMount(){
        this.onListFetch();
    }

    onItemClick(item){
        this.props.onUpdateProvinca(item);
        Actions.pop();
    }

    onListFetch(){
        this.setState({isFetching: true});
        const dict = {
            cmd: 'provincia'
        }
        requestAPI(dict)
        .then(response => {
            if(response.status ==200){
                let provinciaList = [];
                response.data.map((item)=>{
                    provinciaList.push(item);
                })
                this.setState({provinciaList, isFetching: false});
            }
        }).catch((error) => {
            console.error(error);
            this.setState({ isFetching: false });
        });
    }

    render() {
        const{isFetching, provinciaList} = this.state;
        return (
            <View style={styles.container}>
                <ModalOverlay isFetching={isFetching}/>
                <LogoComponent
                    isBack={true}
                    onBack={this.onBack}
                />
                <FlatList
                    style={{paddingHorizontal: 10}}
                    data={provinciaList}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item})=>(
                        <TouchableOpacity style={{height: 50, justifyContent: 'center', paddingHorizontal: 10}} onPress={()=>this.onItemClick(item)}> 
                            <Text>{item['nome']}</Text>
                         
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id}     
                />          
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',       
        flex: 1
    }
})

export default ProvinciaScreen;