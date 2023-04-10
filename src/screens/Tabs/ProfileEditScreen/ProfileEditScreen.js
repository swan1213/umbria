import React from 'react'
import { View, Alert } from 'react-native';
import { connect } from 'react-redux';
import LogoComponent from '../../../components/LogoComponent/LogoComponent';
import CustomButton from '../../../components/CustomButton/CustomButton';
import CustomInput from '../../../components/CustomInput/CustomInput';
import ModalOverlay from '../../../components/ModalOverlay';
import { Actions } from 'react-native-router-flux';
import requestAPI from '../../../modules/api';

class ProfileEditScreen extends React.Component {
    constructor(props) {
        super(props);
        const { userInfo } = props;
        this.state = {
            utente_id: userInfo.utente_id,
            username: userInfo.nome,
            useremail: userInfo.email,
            userphone: userInfo.telefono,
            oldpassword: '',
            newpassword: '',
            confirmpasswrod: '',
            isFetching: false
        }

    }

    onProfileSave() {
        const { utente_id, username, useremail, userphone, oldpassword, newpassword, confirmpasswrod } = this.state;
        const dict = {
            cmd: 'modifica_pass',
            email: useremail,
            utente_id: utente_id,
            old_pass: oldpassword,
            new_pass: newpassword,
            confirm_pass: confirmpasswrod
        }
        this.setState({ isFetching: true });
        requestAPI(dict)
            .then(response => {
                const title = response.status == 200 ? "Success" : "Error";
                Alert.alert(
                    title,
                    response['message'],
                    [
                        { text: "OK", onPress: () => this.setState({ isFetching: false }) }
                    ]
                );
            })
    }
    onBack() {
        Actions.pop();
    }

    render() {
        const { useremail, username, userphone, newpassword, oldpassword, confirmpasswrod, isFetching } = this.state;
        return (
            <View style={{ backgroundColor: 'white', flex: 1 }}>
                <ModalOverlay isFetching={isFetching} />
                <LogoComponent
                    isBack={true}
                    onBack={this.onBack}
                />
                <View style={{ paddingHorizontal: 15 }}>
                    <CustomInput
                        value={username}
                        setValue={(text) => { this.setState({ username: text }) }}
                        placeholder={'Username'}
                    />
                    <CustomInput
                        value={useremail}
                        setValue={(text) => { this.setState({ useremail: text }) }}
                        placeholder={'User email'}
                    />
                    <CustomInput
                        value={userphone}
                        setValue={(text) => { this.setState({ userphone: text }) }}
                        placeholder={'User phone'}
                    />
                    <CustomInput
                        value={oldpassword}
                        setValue={(text) => { this.setState({ oldpassword: text }) }}
                        placeholder={'Old password'}
                        secureTextEntry={true}
                    />
                    <CustomInput
                        value={newpassword}
                        setValue={(text) => { this.setState({ newpassword: text }) }}
                        placeholder={'New password'}
                        secureTextEntry={true}
                    />
                    <CustomInput
                        value={confirmpasswrod}
                        setValue={(text) => { this.setState({ confirmpasswrod: text }) }}
                        placeholder={'Confirm password'}
                        secureTextEntry={true}
                        returnKeyType={true}
                    />
                    <CustomButton
                        onPress={() => this.onProfileSave()}
                        btnText={"Salva"}
                    />
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    userInfo: state.umbriaReducer.userInfo,
});


export default connect(mapStateToProps)(ProfileEditScreen)
