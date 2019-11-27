import React, {Component} from 'react';
import { Platform, Dimensions, ScrollView, View, AsyncStorage } from 'react-native';
import { Container, Content, Text, Item,
        Input, Left, Button, Icon, Body, Title, Right, Form
} from 'native-base';
import Toast, { DURATION } from 'react-native-easy-toast';
import { connect } from 'react-redux';
import HTML from 'react-native-render-html';
import { MBonusSpinner } from '../../../commons/Spinner';
import { GoBackHeader } from '../../../commons';
// localize
import { strings } from '../../../../../locales/i18n';
// Colors
import { CLR_TIFFANY_BLUE, CLR_WHITE, CLR_BLACK, CLR_DARK_TIFFANY_BLUE, CLR_DARK_BLUE,
    ASYNCTORAGE_APP_TNC,
} from '../../../../utility/constants';
import { getTNC,
} from '../../../../utility/networking/MBonusUnAuthServices';

class TNCComponent extends Component {

    constructor(props) {
        super(props);
        this.state = ({
            loading: true,
            tnc: '<html></html>',
        });
    }

    // Re-render
    componentWillMount() {
        // Running Async Task
        // Getting Phone Ext
        // this.getPhoneExtOptionList();
        // AsyncStorage.setItem(ASYNCTORAGE_APP_TNC, 'HERE IS TNC PRE DATA');
        this.getInitialDataFromLocalDB();
    }



    componentDidUpdate() {
        if (this.props.errorMsg) {
            this.refs.toast.show(this.props.errorMsg, DURATION.LENGTH_LONG);
        }

        if (this.props.successMsg) {
            this.refs.toast.show(this.props.successMsg, DURATION.LENGTH_LONG);
        }
    }

    getInitialDataFromLocalDB = () => new Promise((resolve, reject) => {

        AsyncStorage.getItem(ASYNCTORAGE_APP_TNC)
            .then(localStorageData => {
                // console.log(`res: ${res}`);
                if (localStorageData !== null) {
                    this.setState({
                        tnc: localStorageData,
                        loading: true,
                    });
                    this.getTNCContent();
                }
                else
                {
                    this.getTNCContent();
                }
            })
            .catch(err => reject(err));
     });

    getTNCContent = () => {
        getTNC()
            .then((tnc) => {
                console.log('from mbonus');
                const tnc_data = tnc.data.data;
                console.log(tnc.data.data);
                this.getAndSetUpdatedData(tnc_data);
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    tnc: [],
                    loading: false
                });
            });
    }

    getAndSetUpdatedData = (data) => {
        AsyncStorage.setItem(ASYNCTORAGE_APP_TNC, data);
        this.setState({
            tnc: data,
            loading: false,
        });
    }

    renderSpinner() {
        if (this.state.loading) {
            return (
                <MBonusSpinner
                    size={35}
                    type='Wave'
                    color='CLR_TIFFANY_BLUE'
                />
            );
        }
    }

    render() {
        const { tncViewContainer,
        } = styles;

        const HtmlCode = '<h1> h1 Heading Tag</h1>' +
                     '<p> Sample Paragraph Tag </p>' +
                     '<img src="https://reactnativecode.com/wp-content/uploads/2017/05/react_thumb_install.png" alt="Image" width="250" height="150" >' ;


        return (
            <Container>
                <GoBackHeader
                    headerTitle={strings('tnc.tnc')}
                    goBackAction={() => this.props.navigation.goBack()}
                />
                <ScrollView>
                    <View style={tncViewContainer}>
                        <HTML
                            html={this.state.tnc}
                            imagesMaxWidth={Dimensions.get('window').width}
                        />
                    </View>
                </ScrollView>
                { this.renderSpinner() }
                <Toast
                    ref="toast"
                    style={{backgroundColor:'black'}}
                    position='bottom'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}

                />
            </Container>
        );
    }
}

const styles = {
    tncViewContainer: {
        flex: 1,
        padding: 20
    },

};

const mapStateToProps = state => {
    return {

    };
};

export default connect(mapStateToProps, {
 })(TNCComponent);
