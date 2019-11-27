import React, { Component } from 'react';
import { View, Text, YellowBox, AsyncStorage } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
// Redux Controller
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './controllers/reducers';
// TokenManager
import { tokenManagerCheckLogin } from './controllers/actions';
import { ASYNCTORAGE_APP_SHOW_WELCOME } from './utility/constants';
import { createRootNavigator } from './routers'; // Root Router


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signedIn: false,
            checkedSignIn: false
        };
    }

    componentDidMount() {
        // do stuff while splash screen is shown
        // After having done stuff (such as async tasks) hide the splash screen
        SplashScreen.hide();

        tokenManagerCheckLogin()
            .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
            .catch(err => alert("An error occurred"));

        AsyncStorage.setItem(ASYNCTORAGE_APP_SHOW_WELCOME, 'true');
    }

    render() {
        console.log('First Init Root Component App.js');

        const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

        YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated']);
        const { checkedSignIn, signedIn } = this.state;

        // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
        if (!checkedSignIn) {
          return null;
        }

        //console.log(`result of login ${signedIn}`);

        // const Layout = createRootNavigator(signedIn);
        const Layout = createRootNavigator(signedIn);
        return (
                <Provider store={store}>
                    <Layout />
                </Provider>
        );
    }
}

export default App;
