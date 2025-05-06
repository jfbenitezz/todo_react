import React, { useEffect, useState, createContext } from "react";
import TaskAPI from "../services/TaskService.js"; 

// Create the context
export const TodoContext = createContext({
  todos: [],
  loading: false,
  error: null,
  refreshTodos: () => {},
  createTodo: async (data) => {},
  updateTodo: async (id, data) => {},
  deleteTodo: async (id) => {}
});

// Provider component
export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await TaskAPI.fetchTasks(); // ← renamed
      setTodos(data);
    } catch (err) {
      setError("Failed to fetch Todo.");
      console.error("Failed to fetch Todo:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const createTodo = async (todoData) => {
    setLoading(true);
    try {
      await TaskAPI.createTask(todoData); // ← renamed
      fetchTodos();
    } catch (err) {
      setError("Failed to create Todo.");
      console.error("Create Todo failed:", err);
    } finally {
      setLoading(false);
    }
    return null;
  };

  const updateTodo = async (todo) => {
    setLoading(true);
    try {
      await TaskAPI.modifyTask(todo); // ← renamed
      await fetchTodos();
    } catch (err) {
      setError("Failed to update Todo.");
      console.error("Update Todo failed:", err);
    } finally {
      setLoading(false);
    }
    return false;
  };

  const deleteTodo = async (id) => {
    setLoading(true);
    try {
      const success = await TaskAPI.removeTask(id); // ← renamed
      if (success) {
        setTodos((prev) => prev.filter((p) => p.id !== id));
        return true;
      }
    } catch (err) {
      console.error("Delete Todo failed:", err);
    } finally {
      setLoading(false);
    }
    return false;
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        error,
        refreshTodos: fetchTodos,
        createTodo,
        updateTodo,
        deleteTodo
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export default TodoProvider;