import React, { Component } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

import AsyncStorage from "@react-native-community/async-storage";
import ImagePicker from "react-native-image-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { distanceInWords } from "date-fns";
import pt from "date-fns/locale/pt";
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import socket from "socket.io-client";

import styles from "./styles";
import api from "../../services/api";

export default class Box extends Component {
  state = {
    box: {}
  };

  subscribeToNewFiles = (box) => {
    const io = socket("https://oministack-week.herokuapp.com");

    io.emit("connectRoom", box);

    io.on("file", data => {
      this.setState({
        box: {
          ...this.state.box,
          files: [data, ...this.state.box.files]
        }
      });
    });
  }

  async componentDidMount() {
    const boxId = await AsyncStorage.getItem("@RocketBox:box");
    this.subscribeToNewFiles(boxId);

    const response = await api.get(`boxes/${boxId}`);

    this.setState({ box: response.data });
  }

  openFile = async (file) => {
    try {
      const filePath = `${RNFS.DocumentDirectoryPath}/${file.title}`;
      await RNFS.downloadFile({
        fromURL: file.url,
        toFile: filePath
      });

      await FileViewer.open(filePath);
    } catch (err) {
      console.log("Arquivo não suportado");
    }
  }

  handleUpload = () => {
    ImagePicker.launchImageLibrary({}, async upload => {
      if (upload.error) {
        return console.log("ImagePicker error");
      }
      if (upload.didCancel) {
        return console.log("Canceled by user");
      }

      const data = new FormData();
      const [prefix, suffix] = upload.fileName.split(".");
      const ext = suffix.toLowerCase() === "heic" ? "jpg" : suffix;
      const fileName = `${prefix}.${ext}`;

      data.append("file", {
        uri: upload.uri,
        type: upload.type,
        name: fileName
      });

      try {
        await api.post(`boxes/${this.state.box._id}/files`, data);
      } catch (err) {
        console.log(err);
      }
    });
  }

  renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => this.openFile(item)}
      style={styles.file}
    >
      <View style={styles.fileInfo}>
        <Icon name="insert-drive-file" size={24} color="#A5CFFF" />
        <Text style={styles.fileTitle}>{item.title}</Text>
      </View>

      <Text style={styles.fileDate}>
        há {distanceInWords(item.createdAt, new Date(), { locale: pt })}
      </Text>
    </TouchableOpacity>
  );

  render() {
    const box = this.state.box;
    return (
      <View style={styles.container}>
        <Text style={styles.boxTitle}>{box.title}</Text>

        <FlatList
          style={styles.list}
          data={box.files}
          keyExtractor={file => file._id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={this.renderItem}
        />

        <TouchableOpacity
          style={styles.fab}
          onPress={this.handleUpload}
        >
          <Icon name="cloud-upload" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    );
  }
}
