import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Task from "./Task";
import TaskForm from "./TaskForm";
import axios from "axios";
import loadingImg from "../assets/loader.gif";
import { URL } from "../App";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTask, setCompletedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskId, setTaskId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    completed: false,
  });

  const { name } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getTasks = async () => {
    setIsLoading(true);

    try {
      const { data } = await axios.get(URL + "api/tasks/");
      setTasks(data);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);
  const createTask = async (e) => {
    e.preventDefault();

    if (name === "") {
      return toast.error("First Enter the Task");
    }
    try {
      await axios.post(URL + `api/tasks/`, formData);
      toast.success("Task Added Successfully");
      setFormData({ ...formData, name: "" });
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteTasks = async (id) => {
    try {
      await axios.delete(`${URL}api/tasks/${id}`);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("First Add the Task");
    }
    try {
      await axios.put(`${URL}api/tasks/${taskId}`, formData);
      setFormData({ ...formData, name: "" });
      setIsEditing(false);
      getTasks();
      return toast.success("Updated Successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getSingleTask = async (task) => {
    setFormData({ name: task.name, completed: false });
    setTaskId(task._id);
    setIsEditing(true);
  };

  const setToComplete = async (task) => {
    const newFormData = {
      name: task.name,
      completed: true,
    };

    try {
      await axios.put(`${URL}api/tasks/${task._id}`, newFormData);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const cTask = tasks.filter((task) => {
      return task.completed === true;
    });
    setCompletedTasks(cTask);
  }, [tasks]);

  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm
        name={name}
        handleInputChange={handleInputChange}
        createTask={createTask}
        isEditing={isEditing}
        updateTask={updateTask}
      />
      {tasks.length > 0 && (
        <div className="--flex-between --pb">
          <p>
            <b>Total Tasks:</b>
            {tasks.length}
          </p>
          <p>
            <b>Completed Tasks:</b>
            {completedTask.length}
          </p>
        </div>
      )}
      <hr />
      {isLoading && (
        <div className="--flex-center">
          <img src={loadingImg} alt="Loading" />
        </div>
      )}
      {!isLoading && tasks.length === 0 ? (
        <p className="--py">No task added. Please add a task</p>
      ) : (
        <>
          {tasks.map((task, index) => {
            return (
              <Task
                key={task._id}
                task={task}
                index={index}
                deleteTask={deleteTasks}
                getSingleTask={getSingleTask}
                setToComplete={setToComplete}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default TaskList;
