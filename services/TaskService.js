// RemoteTaskAPI.js

const API_ROOT = "https://unidb.openlab.uninorte.edu.co";
const API_KEY = "todo-jfbenitez-123";
const COLLECTION = "todo";

const TaskAPI = {
  /**
   * Fetches all tasks from the remote store.
   * @returns {Promise<Array<Object>>}
   */
  async fetchTasks() {
    const endpoint = `${API_ROOT}/${API_KEY}/data/${COLLECTION}/all?format=json`;

    try {
      const res = await fetch(endpoint);
      if (res.status !== 200) {
        throw new Error(`Unexpected status code: ${res.status}`);
      }

      const parsed = await res.json();
      const entries = parsed.data ?? [];

      return entries.map(({ entry_id, data }) => ({
        id: entry_id,
        ...data
      }));
    } catch (error) {
      console.error("fetchTasks error:", error);
      throw error;
    }
  },

  /**
   * Creates a new task remotely.
   * @param {Object} taskData 
   * @returns {Promise<boolean>}
   */
  async createTask(taskData) {
    const endpoint = `${API_ROOT}/${API_KEY}/data/store`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          table_name: COLLECTION,
          data: taskData
        })
      });

      if (res.status === 200) {
        return true;
      } else {
        const debug = await res.text();
        console.error(`createTask failed ${res.status}:`, debug);
        return null;
      }
    } catch (error) {
      console.error("createTask error:", error);
      return null;
    }
  },

  /**
   * Updates an existing task.
   * @param {Object} task 
   * @returns {Promise<boolean>}
   */
  async modifyTask(task) {
    if (!task.id) throw new Error("Missing task ID");

    const { id, ...fields } = task;
    const endpoint = `${API_ROOT}/${API_KEY}/data/${COLLECTION}/update/${id}`;

    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({ data: fields })
      });

      if (res.status === 200) {
        return true;
      } else {
        const debug = await res.text();
        console.error(`modifyTask failed ${res.status}:`, debug);
        return false;
      }
    } catch (error) {
      console.error("modifyTask error:", error);
      return false;
    }
  },

  /**
   * Deletes a single task.
   * @param {string|{id: string}} taskOrId 
   * @returns {Promise<boolean>}
   */
  async removeTask(taskOrId) {
    const id = typeof taskOrId === "string" ? taskOrId : taskOrId.id;
    if (!id) throw new Error("Missing task ID");

    const endpoint = `${API_ROOT}/${API_KEY}/data/${COLLECTION}/delete/${id}`;

    try {
      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json; charset=UTF-8" }
      });

      if (res.status === 200) {
        return true;
      } else {
        const debug = await res.text();
        console.error(`removeTask failed ${res.status}:`, debug);
        return false;
      }
    } catch (error) {
      console.error("removeTask error:", error);
      return false;
    }
  },

  /**
   * Deletes all stored tasks.
   * @returns {Promise<boolean>}
   */
  async purgeTasks() {
    try {
      const allTasks = await this.fetchTasks();
      for (const task of allTasks) {
        await this.removeTask(task.id);
      }
      return true;
    } catch (error) {
      console.error("purgeTasks error:", error);
      return false;
    }
  }
};

export default TaskAPI;
