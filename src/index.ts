import { v4 as uuidV4 } from 'uuid';
// brushing up on my TS skills by following along with this tutorial https://www.youtube.com/watch?v=jBmrduvKl5w
type Task = {// defines the shape of our Task type
  id: string,
  title: string,
  completed: boolean,
  createdAt: Date
}

const list = document.querySelector<HTMLUListElement>('#list'); // selects our list
const form = document.getElementById('new-task-form') as HTMLFormElement | null; // selects our form
const input = document.querySelector<HTMLInputElement>('#new-task-title'); // selects our input

const tasks: Task[] = loadTasks();// grabs tasks out of local storage for browser persistence.
tasks.forEach(addListItem);// builds our UI from the tasks array.

form?.addEventListener('submit', e => {// pushes new tasks into the array, wipes input field, and persists to local storage
  e.preventDefault();

  if(input?.value == '' || input?.value == null) return;

  const newTask = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date()
  }
  tasks.push(newTask);

  addListItem(newTask);
  saveTasks();
  input.value = "";
});

form?.addEventListener('click', e => {// event listener for our 'remove' todos that have been completed.
  const completedTasks = tasks.filter(task => {
    // TODO: bug where page needs to refresh to show new list
    return task.completed === false;
  });
  localStorage.setItem("TASKS", JSON.stringify(completedTasks));
  loadTasks();
});

function addListItem(task: Task) {
  // this is the whole task creation system. Grabs all our inputs and builds our tasks out the way we want em.
  const item = document.createElement('li');
  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    saveTasks();
  });
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  label.append(checkbox, task.title);
  item.append(label);
  list?.append(item);
}

function saveTasks() {
  // persisting in local storage.
  localStorage.setItem("TASKS", JSON.stringify(tasks));
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem("TASKS");
  if(taskJSON == null) return [];
  return JSON.parse(taskJSON)
}

