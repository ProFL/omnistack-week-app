import React from "react";
import { ActivityIndicator, Modal, Text, View } from "react-native";

import styles from "./styles";

const Loader = props => {
  const { loading, text, ...attributes } = props;

  return (
    <Modal 
      transparent={true}
      animationType="none"
      visible={loading}
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator size="large" color="#7159c1" loading={loading} />
          <Text>{text}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default Loader;
