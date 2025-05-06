import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {configureReanimatedLogger,ReanimatedLogLevel} from "react-native-reanimated";
import { TodoProvider } from "./context/TodoProvider";
import TodoList from "./pages/TodoList";


configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false 
});

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider>
          <TodoProvider>
              <TodoList />
          </TodoProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
