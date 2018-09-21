
const React = require('react-native');

const { StyleSheet, Platform } = React;

export default {
  container: {
    backgroundColor: '#FFF',
  },
  text: {
    alignSelf: 'center',
    marginBottom: 7,
  },
  textBonus: {
    fontWight: 'bold',
  },
  mb: {
    marginBottom: 15,
  },
  header : {
    marginLeft: -5,
    marginTop: 5,
    marginBottom: (Platform.OS==='ios') ? -7 : 0,
    lineHeight: 24,
    color: '#5357b6'
  },
  modalImage: {
    resizeMode: 'contain',
    height: 200
  },
  bold: {
    fontWeight: '600'
  },
  negativeMargin: {
    marginBottom: -10
  }  
};
