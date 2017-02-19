// PACKAGES
import { AppRegistry } from 'react-native';
import App from 'democracy/app';

/******************************************
 * APP INITIALIZATION
 *****************************************/
AppRegistry.registerComponent('democracy', () => App);
AppRegistry.runApplication('democracy', { rootTag: document.getElementById('react-app') });
