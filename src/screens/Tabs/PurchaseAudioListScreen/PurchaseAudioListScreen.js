import React from "react";
import { View, FlatList, Alert } from 'react-native';
import { connect } from 'react-redux';
import requestAPI from '../../../modules/api';
import LogoComponent from '../../../components/LogoComponent/LogoComponent';
import AudioitemComponent from '../../../components/AudioItemComponent/AudioitemComponent';
import ModalOverlay from '../../../components/ModalOverlay';
import { Actions } from "react-native-router-flux";

class PurchaseAudioListScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false
        }
    }

    onItemPress(item) {
        console.log("item == ", item);
        if (item['type'] == "pacchetto") {
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
                        if (dataList.length > 0) {
                            let itemList = [];
                            dataList.map((item) => {
                                item['purchase'] = true;
                                itemList.push(item);
                            })
                            Actions.itinerlist({ itemList });
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
        } else {
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

    onBack() {
        Actions.pop();
    }

    render() {
        const { isFetching } = this.state;
        const { purchaseList } = this.props;

        return (
            <View style={{ display: 'flex', flex: 1, backgroundColor: 'white' }}>
                <ModalOverlay isFetching={isFetching} />
                <LogoComponent
                    isBack={true}
                    onBack={this.onBack}
                />
                <FlatList
                    style={{ paddingHorizontal: 10 }}
                    data={purchaseList}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <AudioitemComponent
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
const mapStateToProps = state => ({
    purchaseList: state.umbriaReducer.purchaseList,
});

export default connect(mapStateToProps)(PurchaseAudioListScreen)

// export default PurchaseAudioListScreen;