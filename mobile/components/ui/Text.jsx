import { Text as RNText, StyleSheet } from 'react-native';
import React from 'react';

const Text = ({ children, style, ...rest }) => {
    // 1. Flatten the styles so we can read the fontWeight
    const flatStyle = StyleSheet.flatten(style || {});
    // console.log("Flat Style:", flatStyle);
    // 2. Determine which font family to use based on the weight
    let fontFamily = "Outfit"; // Default (Regular)

    // Check if the style asks for bold
    if (flatStyle.fontWeight == 'bold' || flatStyle.fontWeight == '700' || flatStyle.fontWeight == '800') {
        fontFamily = "Outfit_700";
    }
    if (flatStyle.fontWeight == 'thin' || flatStyle.fontWeight == '300' || flatStyle.fontWeight == '200') {
        fontFamily = "Outfit_300";
    }
    // Check if the style asks for medium (optional)
    else if (flatStyle.fontWeight == '500' || flatStyle.fontWeight == '600') {
        fontFamily = "Outfit_500";
    }

    // 3. Remove fontWeight from the final style to avoid conflicts
    // (We handled the weight by switching the font file)
    const { fontWeight, ...restStyle } = flatStyle;

    return (
        <RNText
            {...rest}
            style={[
                { fontFamily }, // Apply our calculated font family
                restStyle       // Apply colors, sizes, margins, etc.
            ]}
        >
            {children}
        </RNText>
    );
};

export default Text;
