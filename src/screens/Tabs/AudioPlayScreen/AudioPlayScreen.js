import React from "react";
import { View, Dimensions, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, FlatList } from "react-native";
import { Actions } from "react-native-router-flux";
import Icon from 'react-native-vector-icons/FontAwesome';
import Slider from '@react-native-community/slider';
// import SoundPlayer from 'react-native-sound-player'
import { AudioPlayItemComponent } from '../../../components/AudioItemComponent/AudioitemComponent';
// import requestAPI from '../../../modules/api';
import LogoComponent from '../../../components/LogoComponent/LogoComponent';
import ModalOverlay from "../../../components/ModalOverlay";
import RadioButton from '../../../components/RadioButton';
import Colors from "../../../css/colors";
var moment = require("moment");

var Sound = require('react-native-sound');
// Sound.setCategory('Playback');
Sound.setCategory('Playback', true); 
let audioCurrentTimeValue = 0;

class AudioPlayScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlayIndex: -1,
            isFetchData: [],
            isPlayed: false,
            isrightFormat: true,
            isFetching: false,
            isFileErr: true,
            isRepeat: false,
            audioDurationValue: 0,
            audioDuration: '00:00',
            audioCurrentTime: '00:00',
            languageList: [],
            selectlangItem: '',
            selectaudioItem: ''
        }
        this.onPlayClick = this.onPlayClick.bind(this);
        this.onPlayItemChanged = this.onPlayItemChanged.bind(this);
        this.audioPlay = this.audioPlay.bind(this);
        this.onChangeLanguage = this.onChangeLanguage.bind(this);
    }

    async audioPlay(selecteditem, langItem) {
        audioCurrentTimeValue = 0;
        const audio_url = langItem.audio;
        // try {
        //     SoundPlayer.playUrl('audio_url')
        // } catch (e) {
        //     console.log(`cannot play the sound file`, e)
        // }
        // const info = await SoundPlayer.getInfo() // Also, you need to await this because it is async
        // console.log('getInfo', info)

        this.setState({
            isFetching: true,
            isPlayIndex: selecteditem.id,
            isPlayed: false,
            audioCurrentTime: '00:00'
        });

        this.whoosh = new Sound(audio_url, "", (error) => {
            if (error) {
                console.log('failed to load the sound === ', error);
                Alert.alert(
                    "Error",
                    "Cannot play file, try again later.",
                    [
                        { text: "OK", onPress: () => this.setState({ isFetching: false, isFileErr: true }) }
                    ]
                );
                return;
            }
            // loaded successfully
            let audio_duration = 0;
            let rightFormatFlag = true;
            if (this.whoosh.getDuration() <= 0)
                {
                    rightFormatFlag = false;
                    audio_duration = 180;
                }
            else
                audio_duration = this.whoosh.getDuration();
            const timeValue = this.getTimeFormat(audio_duration);
            console.log('duration in seconds: ' + audio_duration);

            this.setState({ audioDuration: timeValue, isFetching: false, 
                            audioDurationValue: audio_duration, isFileErr: false, isrightFormat: rightFormatFlag });
            this.onPlayClick();
        });
    }

    getTimeFormat(duration) {
        const time = moment.duration(duration, 'seconds');
        const timeValue = moment.utc(time.asMilliseconds()).format("mm:ss");
        return timeValue;
    }

    componentDidMount() {
        this.interval = null;
    }

    componentWillUnmount() {
        if (this.whoosh)
            this.whoosh.release();
        audioCurrentTimeValue = 0;
        if (this.interval != null)
            clearInterval(this.interval);
    }

    onPlayItemChanged(item) {
        if (this.whoosh)
            this.whoosh.release();
        audioCurrentTimeValue = 0;
        if (this.interval != null)
            clearInterval(this.interval);

        this.setState({
            isPlayed: false,
            isPlayIndex: -1,
            selectlangItem: '',
            audioCurrentTime: '00:00'
        });

        let languageList = [];
        const default_lang = {
            key: 'italian',
            text: 'Italiano',
            lingua_id: 0,
            audio: item["audio_path"],
            title: item["titolo"],
            description: item["descrizione"]
        }
        languageList.push(default_lang);
        if (item['traduzione'] != null) {
            item['traduzione'].map((langitem) => {
                const lang_item = langitem[0];
                console.log("item;", lang_item);
                const new_lang = {
                    key: lang_item['lingua'].toLowerCase(),
                    text: lang_item['lingua'],
                    lingua_id: lang_item['lingua_id'],
                    audio: lang_item["audio_path_trad"],
                    title: lang_item["titolo_trad"],
                    description: lang_item["descrizione_trad"]
                }
                languageList.push(new_lang);
            })
        }
        this.setState({ languageList, selectaudioItem: item }, () => {
            this.onChangeLanguage(default_lang);
        });
    }

    onPlayClick() {
        const { isPlayed } = this.state;
        if (isPlayed) {
            this.whoosh.pause();
            clearInterval(this.interval);
        } else {
            this.whoosh.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                    audioCurrentTimeValue = 0;
                    const timeValue = this.getTimeFormat(audioCurrentTimeValue);
                    this.setState({ isPlayed: false, audioCurrentTime: timeValue });
                    clearInterval(this.interval);
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
            this.interval = setInterval(() => {
                this.whoosh.getCurrentTime((seconds) => {
                    audioCurrentTimeValue = seconds;
                    const timeValue = this.getTimeFormat(audioCurrentTimeValue);
                    this.setState({ audioCurrentTime: timeValue });
                });
            }, 1000);

        }
        this.setState({ isPlayed: !isPlayed });
    }
    onForward(flag) {
        if (flag)
            this.jumpSeconds(15);
        else
            this.jumpSeconds(-15)
    }
    jumpSeconds = (secsDelta) => {
        if (this.whoosh) {
            // this.whoosh.getCurrentTime((secs) => {
            //     let nextSecs = secs + secsDelta;
            //     if (nextSecs < 0) nextSecs = 0;
            //     else if (nextSecs > this.state.duration) nextSecs = this.state.audioDurationValue;
            //     this.whoosh.setCurrentTime(nextSecs);          
            //     audioCurrentTimeValue = nextSecs;
            //     const timeValue = this.getTimeFormat(audioCurrentTimeValue);
            //     this.setState({ audioCurrentTime: timeValue });
            // })
            
            console.log("secsDelta = ", secsDelta);           
            this.whoosh.setCurrentTime(secsDelta);         
        }
    }
    onBack() {
        Actions.pop();
    }
    onSoundRepeat() {
        const { isRepeat } = this.state;
        this.setState({ isRepeat: !isRepeat });
        if (!isRepeat) {
            this.whoosh.setNumberOfLoops(-1);
        } else {
            this.whoosh.setNumberOfLoops(0);
        }
    }
    onChangeLanguage(item) {
        if (this.whoosh)
            this.whoosh.release();
        audioCurrentTimeValue = 0;
        if (this.interval != null)
            clearInterval(this.interval);

        const { languageList, selectaudioItem } = this.state;
        languageList.map((lang) => {
            if (item.key == lang.key) {
                this.setState({ selectlangItem: item });
            }
        })
        this.audioPlay(selectaudioItem, item);
    }
    render() {
        const width = Dimensions.get('window').width;
        const circle_width = width * 4 / 5;
        const play_circle_width = circle_width / 3 - 20;
        const forward_circle_width = play_circle_width * 3 / 4;
        const { isPlayed, audioDuration, audioCurrentTime, isFetching, audioDurationValue,
            isFileErr, isPlayIndex, isRepeat, languageList, selectlangItem, selectaudioItem, isrightFormat } = this.state;
        const { audioList } = this.props;

        return (
            <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
                <ModalOverlay isFetching={isFetching} />
                <LogoComponent
                    isBack={true}
                    onBack={this.onBack}
                />
                <View style={{ marginHorizontal: 20 }}>
                    <RadioButton PROP={languageList} valueKey={selectlangItem.key} onChangeRadio={this.onChangeLanguage} />
                </View>
                <View style={{ alignItems: 'center', flex: 1, marginBottom: 20, backgroundColor: 'red' }}>
                    <View style={styles.playrootContainer}>
                        <View style={styles.playContainer} pointerEvents={isFileErr ? "none" : "auto"}>
                            {/* <TouchableOpacity onPress={() => { this.onForward(false) }} style={[styles.itemCenter, { width: forward_circle_width, height: forward_circle_width, borderRadius: forward_circle_width / 2, borderWidth: 1, borderColor: "gray" }]}>
                                <Icon style={{ color: 'gray' }} name="backward" size={35} />
                            </TouchableOpacity> */}
                            <TouchableOpacity style={{ paddingVertical: 20 }} onPress={() => this.onSoundRepeat()}>
                                <Icon style={{ padding: 0, margin: 0 }} name={"repeat"} size={20} color={isRepeat ? Colors.loginbtnColor : Colors.darkGrayColor} />
                            </TouchableOpacity>
                            <View style={[styles.playContainer, { flexDirection: 'row', paddingHorizontal: 30 }]}>
                                <Text>{audioCurrentTime}</Text>
                                <Slider
                                    style={{ flex: 1, height: 50 }}
                                    step={1}
                                    disabled={!isrightFormat}
                                    minimumValue={0}
                                    maximumValue={audioDurationValue}
                                    value={audioCurrentTimeValue}     
                                    onValueChange={this.jumpSeconds}                            
                                    minimumTrackTintColor={Colors.loginbtnColor}
                                    maximumTrackTintColor="#000000"
                                />
                                <Text>{audioDuration}</Text>
                            </View>
                            <TouchableOpacity onPress={this.onPlayClick} style={[styles.itemCenter, { width: play_circle_width, height: play_circle_width, borderRadius: play_circle_width / 2, borderWidth: 2, borderColor: Colors.loginbtnColor, marginHorizontal: 20 }]}>
                                <Icon style={{ padding: 0, margin: 0 }} name={isPlayed ? "pause" : "play"} size={30} color={Colors.loginbtnColor} />
                            </TouchableOpacity>
                            {/* <TouchableOpacity onPress={() => { this.onForward(true) }} style={[styles.itemCenter, { width: forward_circle_width, height: forward_circle_width, borderRadius: forward_circle_width / 2, borderWidth: 1, borderColor: "gray" }]}>
                                <Icon style={{ color: 'gray' }} name="forward" size={30} />
                            </TouchableOpacity> */}
                        </View>

                    </View>
                </View>
                <FlatList
                    style={{ paddingTop: 5, paddingBottom: 20 }}
                    data={audioList}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <AudioPlayItemComponent
                            item={item}
                            langItem={selectlangItem}
                            onPress={() => { this.onPlayItemChanged(item) }}
                            index={isPlayIndex}
                            audioItem={selectaudioItem}
                        />
                    )}
                    keyExtractor={item => item.id + Math.random()}
                />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    playrootContainer: {
        backgroundColor: 'white',
        justifyContent: "space-around",
        alignItems: 'center'
    },
    playContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    spinnerTextStyle: {
        color: '#FFF',
    },

})

export default AudioPlayScreen;