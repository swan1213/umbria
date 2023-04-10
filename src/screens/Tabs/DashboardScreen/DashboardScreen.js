import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Image, ScrollView, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Dots from 'react-native-dots-pagination';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { PacchettiListChange, ItinerartiListChange, LangListChange } from '../../../modules/action';
import ModalOverlay from '../../../components/ModalOverlay';
import { ItinerItem } from '../../../components/AudioItemComponent/AudioitemComponent';
import requestAPI from '../../../modules/api';
import LockButtonComponent from '../../../components/LockButtonComponent/LockButtonComponent';
import AppLogo from '../../../../assets/images/brand_dark.png';
import Colors from '../../../css/colors';
import { Actions } from 'react-native-router-flux';
let ItnData = [], PacData = [];

class DashboardScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItnIndex: 0,
            activePacIndex: 0,
            isFetching: false,
            refreshing: false
        }
        this.onItemPress = this.onItemPress.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
    }

    fetchData() {
        const { purchaseList } = this.props;
        const dict = {
            cmd: "prodotti"
        }
        requestAPI(dict)
            .then(response => {
                if (response.status === 200) {
                    const responseData = response.data;
                    ItnData = [];
                    PacData = [];
                    let languageList = [];
                    const default_lang = {
                        key: 'italian',
                        text: 'Italiano'
                    }
                    languageList.push(default_lang);

                    responseData.itinerari.map((item, index) => {
                        let purchased = false;
                        purchaseList.map((purchast_item) => {
                            if (purchast_item['item_id'] == item['id'] && purchast_item['type'] == 'itinerario') {
                                purchased = true;
                                return true;
                            }
                        })
                        if(parseInt(item['prezzo_listino']) == 0)
                            purchased = true;
                        item['purchase'] = purchased;
                        item['type'] = 'itinerario';
                        if (item['lingua'] != null) {
                            const lang = {
                                key: item['lingua'].toLowerCase(),
                                text: item['lingua']
                            }
                            let isExist = false;
                            languageList.map((exist) => {
                                if (exist.key == item['lingua'].toLowerCase()) {
                                    isExist = true;
                                    return;
                                }
                            })
                            if (!isExist) languageList.push(lang);
                        }
                        responseData.itinerari[index] = item;
                    })
                    responseData.pacchetti.map((item, index) => {
                        let purchased = false;
                        purchaseList.map((purchast_item) => {
                            if (purchast_item['item_id'] == item['id'] && purchast_item['type'] == 'pacchetto') {
                                purchased = true;
                                return true;
                            }
                        })
                        if(parseInt(item['prezzo_listino']) == 0)
                            purchased = true;
                        item['purchase'] = purchased;
                        item['type'] = 'pacchetto';
                        if (item['lingua'] != null) {
                            const lang = {
                                key: item['lingua'].toLowerCase(),
                                text: item['lingua']
                            }
                            let isExist = false;
                            languageList.map((exist) => {
                                if (exist.key == item['lingua'].toLowerCase()) {
                                    isExist = true;
                                    return;
                                }
                            })
                            if (!isExist) languageList.push(lang);
                        }
                        responseData.pacchetti[index] = item;
                    })

                    this.props.actions.ItinerartiListChange(responseData.itinerari);
                    this.props.actions.PacchettiListChange(responseData.pacchetti);
                    this.props.actions.LangListChange(languageList);
                    for (let ii = 0; ii < responseData.pacchetti.length; ii++) {
                        if (ii < 5)
                            PacData.push(responseData.pacchetti[ii]);
                        else
                            break;
                    }
                    for (let ii = 0; ii < responseData.itinerari.length; ii++) {
                        if (ii < 5)
                            ItnData.push(responseData.itinerari[ii]);
                        else
                            break;
                    }
                    this.setState({ isFetching: false, refreshing: false });
                } else {
                    Alert.alert(
                        "Error",
                        "Network connectin failed. Please try again later.",
                        [
                            { text: "OK", onPress: () => this.setState({ isFetching: false, refreshing: false }) }
                        ]
                    );
                }
            })
            .catch((error) => {
                console.error(error);
                this.setState({ isFetching: false, refreshing: false });
            });
    }

    componentDidMount() {
        this.setState({ isFetching: true });
        this.fetchData();
    }

    onlockPressed() {
        // Actions.purchase();
    }

    onRefresh() {
        this.setState({ refreshing: true });
        this.fetchData();
    }

    onGoScan() {
        Actions.scantab();
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
        const { activeItnIndex, activePacIndex, isFetching, refreshing } = this.state;
        return (
            <View>
                <ModalOverlay isFetching={isFetching} />
                <ScrollView
                    contentContainerStyle={styles.container}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={this.onRefresh}
                        />
                    }>
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
                        data={ItnData}
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
                    <Dots length={ItnData.length} active={activeItnIndex} />
                    <Text style={styles.title}>Pacchetti in evidenza</Text>
                    <FlatList
                        horizontal
                        pagingEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        data={PacData}
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
                    <Dots length={PacData.length} active={activePacIndex} />
                    <Text style={styles.title}>Hai acquistato un'audioguida?</Text>
                    <TouchableOpacity style={styles.qrcodeContainer} onPress={() => this.onGoScan()}>
                        <Icon style={{ color: 'white' }} name="qrcode" size={35} />
                        <Text style={{ color: 'white', fontSize: 12 }}>Scansiona il codice</Text>
                    </TouchableOpacity>
                  
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
    itinerariList: state.umbriaReducer.itinerariList,
    userInfo: state.umbriaReducer.userInfo,
    purchaseList: state.umbriaReducer.purchaseList
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({ PacchettiListChange, ItinerartiListChange, LangListChange }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen)