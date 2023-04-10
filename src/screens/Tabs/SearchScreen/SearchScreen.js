import React from 'react'
import { View, Text, StyleSheet, FlatList, Image, Alert, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import AudioitemComponent from '../../../components/AudioItemComponent/AudioitemComponent';
import LockButtonComponent from '../../../components/LockButtonComponent/LockButtonComponent';
import ModalOverlay from '../../../components/ModalOverlay';
import requestAPI from '../../../modules/api';
import LogoComponent from '../../../components/LogoComponent/LogoComponent';

import Colors from '../../../css/colors';
import { Actions } from 'react-native-router-flux';
class SearchScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            isFetching: false,
            filterList: []
        }
        this.updateSearch = this.updateSearch.bind(this);
    }
    onlockPressed() {
        // Actions.purchase();
    }
    updateSearch(search) {
        let selected = [];
        let cercaList = [];
        const { itinerariList, pacchettiList } = this.props;
        itinerariList.map((item) => {
            cercaList.push(item);
        });
        pacchettiList.map((item) => {
            cercaList.push(item);
        });
        cercaList.map((item) => {
            if (item.titolo.includes(search)) {
                selected.push(item);
            }
        })
        console.log("search list=", selected);
        this.setState({ search, filterList: selected });
    }

    onItemPress(item) {
        console.log("item == ", item);
        if (item['type'] == "pacchetto") {
            if (!item['purchase']) {
                let languageList = [];
                const default_lang = {
                    key: 'italian',
                    text: 'Italiano'
                }
                languageList.push(default_lang);
                if(item['lingua']){
                    const lang = {
                        key: item['lingua'].toLowerCase(),
                        text: item['lingua']
                    }
                    languageList.push(lang);    
                }
                Actions.purchase({ item: item, languageList });
            }
            else {                
                this.setState({ isFetching: true });
                const dict = {
                    cmd: "itinerario",
                    pacchetto_id: item.id
                }
                requestAPI(dict)
                    .then(response => {
                        this.setState({ isFetching: false });
                        if (response.status === 200) {
                            // Actions.audioplay({ audioList: response.data, item });
                            const dataList = response.data;
                            if(dataList.length > 0){
                                let itemList = [];           
                                dataList.map((item)=>{
                                    item['purchase'] = true;
                                    itemList.push(item);
                                })                 
                                Actions.itinerlist({itemList});
                            }
                            
                        } else {
                            Alert.alert(
                                "Error",
                                response["message"],
                                [
                                    { text: "OK" }
                                ]
                            );
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        this.setState({ isFetching: false });
                    });
            }
        } else {
            if (!item['purchase']) {
                let languageList = [];
                const default_lang = {
                    key: 'italian',
                    text: 'Italiano'
                }
                languageList.push(default_lang);
                if(item['lingua']){
                    const lang = {
                        key: item['lingua'].toLowerCase(),
                        text: item['lingua']
                    }
                    languageList.push(lang);    
                }                
                Actions.purchase({ item: item, languageList });
            }
            else {
                this.setState({ isFetching: true });
                const dict = {
                    cmd: "scheda",
                    itinerario_id: item.id
                }
                requestAPI(dict)
                    .then(response => {
                        this.setState({ isFetching: false });
                        if (response.status === 200) {
                            Actions.audioplay({ audioList: response.data, item });
                        } else {
                            Alert.alert(
                                "Error",
                                response['message'],
                                [
                                    { text: "OK" }
                                ]
                            );
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        this.setState({ isFetching: false });
                    });
            }
        }
    }

    render() {
        const { search, filterList, isFetching } = this.state;
        const { itinerariList, pacchettiList } = this.props;

        let cercaList = [];
        itinerariList.map((item) => {
            cercaList.push(item);
        });
        pacchettiList.map((item) => {
            cercaList.push(item);
        });
        return (
            <View style={styles.container}>

                <ModalOverlay isFetching={isFetching} />
                <LogoComponent />

                <SearchBar
                    round
                    containerStyle={{backgroundColor: 'white', borderColor: 'white'}}
                    lightTheme
                    inputContainerStyle={{backgroundColor: 'white'}}
                    searchIcon={{ size: 24 }}
                    cancelIcon={{size: 24}}
                    onChangeText={this.updateSearch}
                    placeholder="Cerca..."
                    value={search}
                />
                <FlatList
                    style={{ paddingHorizontal: 10 }}
                    data={search == "" ? cercaList : filterList}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <AudioitemComponent
                            key={item}
                            item={item}
                            onPress={() => { this.onItemPress(item) }}
                        />
                    )}
                    keyExtractor={item => item}
                />
               
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: 'white'
    },
    titleTxt: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 12
    },
    logoContainer: {
        backgroundColor: Colors.BlueColor,
        width: '100%',
        justifyContent: 'flex-end'
    }
});

const mapStateToProps = state => ({
    pacchettiList: state.umbriaReducer.pacchettiList,
    itinerariList: state.umbriaReducer.itinerariList,
});

export default connect(mapStateToProps)(SearchScreen)

