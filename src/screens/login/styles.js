import variables from '../../theme/variables/platform'

export default {
  container: {
    backgroundColor: '#FFF',
  },
  main: {
    flex: 1,
    padding: 12,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  textInput: {
    fontSize: 30,
    marginBottom: -6,
    marginLeft: 50,
  },
  button: {
    // alignSelf: 'stretch',
    // justifyContent: 'center',
    marginTop: 20,
    borderRadius: 7
  },
  text: {
    textAlign: 'center',
    fontSize: 14
  },
  textLink: {
    textAlign: 'center',
    color: variables.toolbarDefaultBg,
    paddingBottom: 15,
    fontSize: 14,
    maxWidth: 300
  },
  animated_button: {
    backgroundColor: '#ff5722' 
  },
  button_label: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold'
  }  
}