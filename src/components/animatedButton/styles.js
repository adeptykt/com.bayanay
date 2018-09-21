import variables from '../../native-base-theme/variables/platform'

export default {
    button_container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: variables.brandPrimary,
        borderColor: variables.brandPrimary
    },
    button: {
        alignSelf: 'stretch',
        marginTop: 20,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#eee',
        height: 50
    },
    loader: {
        width: 16,
        height: 16,
        marginRight: 10
    },
    disabled: {
        backgroundColor: variables.btnDisabledBg
    }
}