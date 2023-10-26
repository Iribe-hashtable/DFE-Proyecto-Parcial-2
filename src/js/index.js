import { fetchAPI } from "./shared/fetch-api.js";

const divTasks = document.getElementById("task-list");
const save = document.getElementById('guardar');
const formulario = document.getElementsByTagName('form')[0];
getTasks();


divTasks.addEventListener('click', async e => {
    if (e.target.classList.contains('editar')) {
        console.log(e.target.getAttribute('data-id'));
        const result = await fetchAPI('/tasks/'+e.target.getAttribute('data-id'),'GET');

        document.getElementById('tipo').value='editar';
        document.getElementById("id").value=result.id;
        document.getElementById("title").value=result.title;
        document.getElementById("description").value=result.description;
        document.getElementById("status").checked=result.completed;
        document.getElementById("priority").value=result.priority;
        document.getElementById("category").value=result.tag;
        document.getElementById("date").value=result.dueDate;

    }
    if (e.target.classList.contains('borrar')) {
        console.log(e.target.getAttribute('data-id'));
        await deleteTask(e.target.getAttribute('data-id'));
    }
});

save.addEventListener('click', async e => {
    e.preventDefault();
    const tipo = document.getElementById('tipo').value;
    const idInput = document.getElementById("id").value;

    let titleInput = document.getElementById("title");
    let descriptionTextarea = document.getElementById("description");
    let statusCheckbox = document.getElementById("status");
    let prioritySelect = document.getElementById("priority");
    let categorySelect = document.getElementById("category");
    let dateInput = document.getElementById("date");

    if(
    titleInput.value!=='' ||
    descriptionTextarea.value!=='' ||
    statusCheckbox.checked!=='' ||
    prioritySelect.value!=='' ||
    categorySelect.value!=='' ||
    dateInput.value!==''
    ){
        const task = {
            title:titleInput.value,
            description:descriptionTextarea.value,
            completed:statusCheckbox.checked,
            priority:prioritySelect.value,
            tag:categorySelect.value,
            dueDate:(new Date(dateInput.value)).toISOString().substring(0,10),
        }
        if (tipo === 'editar') {
            console.log(task);
            await editTask(idInput,task);
            formulario.reset();
            return;
        }
        await addTask(task);
        formulario.reset();
    }


});

// 1. Listar Tareas
async function getTasks() {
    // Realiza una solicitud GET a la API y muestra las tareas en la interfaz
    const data = await fetchAPI('/tasks');
    data.forEach(task => {
        displayTasks(task);

    });
}

// 2. Agregar Tarea
async function addTask(taskData) {
    // Realiza una solicitud POST a la API para agregar una nueva tarea
    const result = await fetchAPI('/tasks','POST',taskData);
    displayTasks(result);
}

// 3. Editar Tarea
async function editTask(taskId, taskData) {
    // Realiza una solicitud PUT a la API para editar la tarea con el ID dado
    await fetchAPI('/tasks/'+taskId,'PUT',taskData);
    divTasks.innerHTML = "";
    getTasks();
}

// 4. Eliminar Tarea
async function deleteTask(taskId) {
    // Realiza una solicitud DELETE a la API para eliminar la tarea con el ID dado
    await fetchAPI('/tasks/'+taskId,'DELETE');
    divTasks.innerHTML = "";
    getTasks();
}

// 5. Mostrar Tareas
function displayTasks(tasks) {
    // Muestra las tareas en la interfaz de usuario según los requisitos dados

    const taskdiv = document.createElement("div");
    taskdiv.className += "w-96 h-96 p-4 bg-white rounded shadow-lg m-4";
    taskdiv.innerHTML = `
    <div class="mb-4">
        ID: <span class="font-medium text-gray-700">${tasks.id}</span>
    </div>
    <div class="mb-4">
        Título: <span class="font-medium text-gray-700">${tasks.title}</span>
    </div>
    <div class="mb-4">
        Descripción: <span class="font-medium text-gray-700">${tasks.description}</span>
    </div>
    <div class="mb-4">
        Estado: <span class="font-medium text-gray-700">${(tasks.completed) ? 'Completada' : 'Pendiente'}</span>
    </div>
    <div class="mb-4">
        Prioridad: <span class="font-medium text-gray-700">${tasks.priority}</span>
    </div>
    <div class="mb-4">
        Categoría: <span class="font-medium text-gray-700">${tasks.tag}</span>
    </div>
    <div class="mb-4">
        Fecha: <span class="font-medium text-gray-700">${tasks.dueDate}</span>
    </div>
    <div class="mb-4">
        <button data-id="${tasks.id}" id="editar" class="px-4 py-2 bg-blue-500 rounded-lg text-white mr-2 hover:bg-blue-600 focus:outline-none editar">Editar</button>
        <button data-id="${tasks.id}" id="eliminar" class="px-4 py-2 bg-red-500 rounded-lg text-white hover:bg-red-600 focus:outline-none borrar">Eliminar</button>
    </div>
    `;
    divTasks.appendChild(taskdiv);
}

// Escucha eventos para interactuar con la interfaz y realizar operaciones según las acciones del usuario

