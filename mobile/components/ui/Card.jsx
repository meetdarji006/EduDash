import { StyleSheet, View } from 'react-native';

const Card = ({ children, style, ...rest }) => {
    return (
        <View style={[styles.card, style && style]} {...rest}>
            {children}
        </View>
    )
}

export default Card

const styles = StyleSheet.create({
    card: {
        flex: 1,
        width : '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        marginTop: 28,
        // Modern "Glow" Shadow matching the Indigo Theme
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
});
