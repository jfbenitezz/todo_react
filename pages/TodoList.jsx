import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native-paper";
import {
  FAB,
  Portal,
  Modal,
  TextInput,
  Button,
  Appbar
} from "react-native-paper";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { TodoContext } from "../context/TodoProvider";

export default function TodoList() {
  const [visible, setVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const { updateTodo, createTodo, todos, refreshTodos, deleteTodo, loading } =
    useContext(TodoContext);

  useEffect(() => {
    refreshTodos();
  }, []);

  const addItem = () => {
    setCurrentItem(null);
    setInputValue("");
    setVisible(true);
  };

  const saveItem = async () => {
    if (currentItem) {
      await updateTodo({ id: currentItem.id, name: inputValue });
    } else {
      await createTodo({ name: inputValue });
    }
    setVisible(false);
  };

  const editItem = (item) => {
    setCurrentItem(item);
    setInputValue(item.name);
    setVisible(true);
  };

  const deleteItem = async (id) => {
    await deleteTodo(id);
  };

  const renderItem = ({ item }) => {
    const renderRightActions = () => (
      <View style={styles.rightAction}>
        <Text style={styles.deleteText}>Delete</Text>
      </View>
    );

    return (
      <Swipeable
        friction={2}
        overshootRight={false}
        renderRightActions={renderRightActions}
        rightThreshold={80}
        onSwipeableOpen={(direction) => {
          if (direction === "right") {
            deleteItem(item.id);
          }
        }}
      >
        <View style={styles.item}>
          <Text>{item.name}</Text>
          <Button
            mode="contained-tonal"
            onPress={() => editItem(item)}
            style={styles.optionButton}
          >
            Edit
          </Button>
        </View>
      </Swipeable>
    );
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
        <Text>Loading data...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f0ebfc" }}>
      <Appbar.Header style={{ backgroundColor: "#6c5ce7" }}>
        <Appbar.Content title="TO DO" titleStyle={{ color: "white" }} />
      </Appbar.Header>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Today</Text>}
        contentContainerStyle={{ padding: 16 }}
      />

      <FAB style={styles.fab} icon="plus" color="white" onPress={addItem} />

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modalStyle}
        >
          <Text style={styles.modalTitle}>
            {currentItem ? "Edit Task" : "New Task"}
          </Text>

          <TextInput
            label="Task Title"
            value={inputValue}
            onChangeText={setInputValue}
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={saveItem}
            style={styles.saveButton}
            icon="content-save"
          >
            Save
          </Button>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 24,
    color: "#6c5ce7"
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 24,
    backgroundColor: "#6c5ce7"
  },
  input: {
    marginBottom: 16,
    backgroundColor: "white",
    color: "#000"        
  },
  saveButton: {
    marginTop: 8,
    borderRadius: 10,
    backgroundColor: "#6c5ce7"
  },
  modalStyle: {
    backgroundColor: "white",
    margin: 16,
    padding: 24,
    borderRadius: 20,
    elevation: 10
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#6c5ce7"
  },
  rightAction: {
    width: 80,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    marginBottom: 12
  },
  deleteText: {
    color: "white",
    fontWeight: "bold"
  }
});
