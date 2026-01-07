// State
const state = {
    tasks: [],
    editingTaskId: null,
    currentFilter: 'all',
    currentSearch: '',
    editingNoteId: null
};

// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const noteForm = document.getElementById('noteForm');
const notesList = document.getElementById('noteList');
const logoutBtn = document.getElementById('logoutBtn');

const API_TASKS = 'http://localhost:3000/tasks';
const API_NOTES = 'http://localhost:3000/notes';

// Auth Helpers
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

function redirectToLogin() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

// Tasks Functions
async function fetchTasks() {
    try {
        const res = await fetch(API_TASKS, { headers: getAuthHeaders() });
        if (res.status === 401) throw new Error('Unauthorized');
        return await res.json();
    } catch (err) {
        console.error(err);
        redirectToLogin();
        return [];
    }
}

async function createTask(task) {
    try {
        const res = await fetch(API_TASKS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(task)
        });
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}

async function updateTask(id, updates) {
    try {
        await fetch(`${API_TASKS}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(updates)
        });
    } catch (err) {
        console.error(err);
    }
}

async function deleteTask(id) {
    try {
        await fetch(`${API_TASKS}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
    } catch (err) {
        console.error(err);
    }
}

function renderTasks(tasks) {
    taskList.innerHTML = '';
    if (!Array.isArray(tasks)) return;

    const filtered = tasks
        .filter(task => {
            if (state.currentFilter === 'completed') return task.completed;
            if (state.currentFilter === 'pending') return !task.completed;
            return true;
        })
        .filter(task => {
            if (!state.currentSearch) return true;
            return task.title.toLowerCase().includes(state.currentSearch) ||
                    task.description.toLowerCase().includes(state.currentSearch);
        });

    filtered.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task' + (task.completed ? ' completed' : '');
        li.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <small>Last updated: ${task.updated_at ? new Date(task.updated_at).toLocaleString() : 'N/A'}</small>
            <button onclick="toggleTask(${task.id}, ${task.completed})">Toggle</button>
            <button onclick="editTask(${task.id})">Edit</button>
            <button onclick="handleDeleteTask(${task.id})">Delete</button>
        `;
        taskList.appendChild(li);
    });
}

async function loadTasks() {
    state.tasks = await fetchTasks();
    renderTasks(state.tasks);
}

async function toggleTask(id, completed) {
    await updateTask(id, { completed: !completed });
    await loadTasks();
}

function editTask(id) {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;

    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    state.editingTaskId = id;
}

async function handleDeleteTask(id) {
    await deleteTask(id);
    await loadTasks();
}

// Notes Functions
async function fetchNotes() {
    try {
        const res = await fetch(API_NOTES, { headers: getAuthHeaders() });
        if (res.status === 401) throw new Error('Unauthorized');
        return await res.json();
    } catch (err) {
        console.error(err);
        redirectToLogin();
        return [];
    }
}

async function createNote(note) {
    try {
        await fetch(API_NOTES, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(note)
        });
    } catch (err) {
        console.error(err);
    }
}

async function updateNote(id, updates) {
    try {
        await fetch(`${API_NOTES}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(updates)
        });
    } catch (err) {
        console.error(err);
    }
}

async function deleteNote(id) {
    try {
        await fetch(`${API_NOTES}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
    } catch (err) {
        console.error(err);
    }
}

function renderNotes(notes) {
    notesList.innerHTML = '';
    if (!Array.isArray(notes)) return;

    notes.forEach(note => {
        const li = document.createElement('li');
        li.innerHTML = `
            <h4>${note.title}</h4>
            <p>${note.content || ''}</p>
            <button onclick="editNote(${note.id})">Edit</button>
            <button onclick="handleDeleteNote(${note.id})">Delete</button>
        `;
        notesList.appendChild(li);
    });
}

async function loadNotes() {
    const notes = await fetchNotes();
    renderNotes(notes);
}

function editNote(id) {
    const note = state.notes?.find(n => n.id === id);
    if (!note) return;

    document.getElementById('noteTitle').value = note.title;
    document.getElementById('noteContent').value = note.content;
    state.editingNoteId = id;
}

async function handleDeleteNote(id) {
    await deleteNote(id);
    await loadNotes();
}

// Search & Filter
function setSearch(value) {
    state.currentSearch = value.toLowerCase();
    renderTasks(state.tasks);
}

function setFilter(filter) {
    state.currentFilter = filter;
    renderTasks(state.tasks);
}

// Event Listeners
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    if (!title) return;

    if (state.editingTaskId) {
        await updateTask(state.editingTaskId, { title, description });
        state.editingTaskId = null;
    } else {
        await createTask({ title, description });
    }

    taskForm.reset();
    await loadTasks();
});

noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;

    if (!title) return;

    if (state.editingNoteId) {
        await updateNote(state.editingNoteId, { title, content });
        state.editingNoteId = null;
    } else {
        await createNote({ title, content });
    }

    noteForm.reset();
    await loadNotes();
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        redirectToLogin();
        return;
    }

    await loadTasks();
    await loadNotes();
});
