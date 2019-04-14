import React, { Component } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

import AsyncStorage from "@react-native-community/async-storage";

import logo from "../../assets/logo.png";
import api from "../../services/api";
import styles from "./styles";

export default class Main extends Component {
  constructor() {
    super();
    this.state = { newBox: "" };

    this.handleSignIn = async() => {
      const response = await api.post("boxes", {
        title: this.state.newBox
      });
  
      await AsyncStorage.setItem("@RocketBox:box", response.data._id);
  
      this.props.navigation.navigate("Box");
    };
  }

  async componentDidMount() {
    const box = await AsyncStorage.getItem("@RocketBox:box");

    if (box) {
      this.props.navigation.navigate("Box");
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={logo} />
        <TextInput
          style={styles.input}
          placeholder="Crie um box"
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
          underlineColorAndroid="transparent"
          value={this.state.newBox}
          onChangeText={text => this.setState({newBox: text})}
        />

        <TouchableOpacity onPress={this.handleSignIn} style={styles.button}>
          <Text style={styles.buttonText}>Criar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
