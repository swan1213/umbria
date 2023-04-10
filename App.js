/**
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';

import Navigation from './src/navigation';

const App = () => {
  console.disableYellowBox = true;
  return (
    <SafeAreaView style={styles.root}>      
        <Navigation/>   
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root:{
    flex: 1,
    backgroundColor:'#f9fbfc',
  }
});

export default App;
