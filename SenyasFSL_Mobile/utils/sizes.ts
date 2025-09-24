import { View, Text, useWindowDimensions } from "react-native";
const { width } = useWindowDimensions();

export const ProgressbarWidth = () => {
    return  width < 768 ? 280 : 600
};
export const ProgressbarHeight = () => {
    return width < 768 ? 20 : 30;
};
export const ProgressbarCP = () => {
    return width < 768 ? 70 : 150;
};
export const fslIconSize = ()=> {
    return width < 768 ? 400 : 500;
}
export const IconSize = ()=> {
    return width < 768 ? 50 : 80;
}