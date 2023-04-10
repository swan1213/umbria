import React from "react";
import { View, FlatList, Alert } from 'react-native';
import requestAPI from '../../../modules/api';
import LogoComponent from '../../../components/LogoComponent/LogoComponent';
import AudioitemComponent from '../../../components/AudioItemComponent/AudioitemComponent';
import ModalOverlay from '../../../components/ModalOverlay';
import { Actions } from "react-native-router-flux";

class ItinerListScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false
        }
    }

    onItemPress(item) {
        this.setState({ isFetching: true });
        const dict = {
            cmd: "scheda",
            itinerario_id: item["id"]
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

    onBack() {
        Actions.pop();
    }

    render() {
        const { isFetching } = this.state;
        const { itemList } = this.props;

        return (
            <View style={{ display: 'flex', flex: 1, backgroundColor: 'white' }}>
                <ModalOverlay isFetching={isFetching} />
                <LogoComponent
                    isBack={true}
                    onBack={this.onBack}
                />
                <FlatList
                    style={{ paddingHorizontal: 10 }}
                    data={itemList}
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
export default ItinerListScreen;