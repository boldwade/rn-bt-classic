import { Image, TextInput } from "react-native";
// @ts-ignore
import logo from "./logo.png";
import styles from "../styles";
import React from "react";

export const FormInputs = () => {
    return (
        <>
            <Image source={logo} style={styles.logo} />
            <TextInput placeholder="Name" style={styles.input} />
            <TextInput placeholder="Email" style={styles.input} />
            <TextInput placeholder="Username" style={styles.input} />
            <TextInput placeholder="Password" style={styles.input} />
            <TextInput placeholder="Confirm Password" style={styles.input} />
            <TextInput placeholder="Password" style={styles.input} />
            <TextInput placeholder="Confirm Password" style={styles.input} />
        </>
    )
}
