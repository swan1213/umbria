import React from 'react'
import { View, Text, StyleSheet, FlatList, Dimensions, Image, Alert, RefreshControl } from 'react-native';
import Dots from 'react-native-dots-pagination';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import LockButtonComponent from '../../../components/LockButtonComponent/LockButtonComponent';
import ModalOverlay from '../../../components/ModalOverlay';
import requestAPI from '../../../modules/api';
import { ItinerItem } from '../../../components/AudioItemComponent/AudioitemComponent';
import AppLogo from '../../../../assets/images/brand_dark.png'
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../../../css/colors';

class ExploreScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItnIndex: 0,
            activePacIndex: 0,
            isFetching: false
        }
        this.onItemPress = this.onItemPress.bind(this);
    }

    onlockPressed() {
        // Actions.purchase();
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
        const width = Dimensions.get('window').width;
        const { pacchettiList, itinerariList } = this.props;
        const { activeItnIndex, activePacIndex, isFetching } = this.state
        return (
            <View>
                <ModalOverlay isFetching={isFetching} />
                <ScrollView contentContainerStyle={styles.container}>
                    <Image
                        source={AppLogo}
                        style={{ width: 300, height: 80, marginBottom: 5 }}
                        resizeMode="stretch"
                    />
                    <Text style={styles.title}>Itinerari in evidenza</Text>
                    <FlatList
                        horizontal
                        pagingEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        data={itinerariList}
                        renderItem={({ item }) => (
                            <ItinerItem
                                item={item}
                                onPress={() => { this.onItemPress(item) }}
                            />
                        )}
                        keyExtractor={item => Math.random() + item.id}
                        onScroll={(e) => {
                            let offset = e.nativeEvent.contentOffset.x;
                            let index = parseInt(offset / (width - 50));   // your cell height
                            this.setState({ activeItnIndex: index });
                        }}
                    />
                    <Dots length={itinerariList.length} active={activeItnIndex} />
                    <Text style={styles.title}>Pacchetti in evidenza</Text>
                    <FlatList
                        horizontal
                        pagingEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        data={pacchettiList}
                        renderItem={({ item }) => (
                            <ItinerItem
                                item={item}
                                onPress={() => { this.onItemPress(item) }}
                            />
                        )}
                        keyExtractor={item => Math.random() + item.id}
                        onScroll={(e) => {
                            let offset = e.nativeEvent.contentOffset.x;
                            let index = parseInt(offset / (width - 50));   // your cell height
                            this.setState({ activePacIndex: index });
                        }}
                    />
                    <Dots length={pacchettiList.length} active={activePacIndex} />
                   
                </ScrollView>

            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingBottom: 30,
        paddingHorizontal: 10
    },
    title: {
        color: Colors.blueDarkColor,
        fontSize: 18,
        fontWeight: 'bold'
    },
    itemTxtContainer: {
        backgroundColor: '#41424C',
        position: 'absolute',
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingRight: 20,
        paddingBottom: 20
    },
    qrcodeContainer: {
        backgroundColor: Colors.blueDarkColor,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 120,
        borderRadius: 15,
        marginBottom: 30,
        marginTop: 10
    }
});

const mapStateToProps = state => ({
    pacchettiList: state.umbriaReducer.pacchettiList,
    itinerariList: state.umbriaReducer.itinerariList
});

export default connect(mapStateToProps)(ExploreScreen)

