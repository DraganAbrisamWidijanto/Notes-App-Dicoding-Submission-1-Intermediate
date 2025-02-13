// Custom Element untuk AppBar
class AppBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header>
                <h1>Notes App</h1>
            </header>
        `;
    }
}
customElements.define('app-bar', AppBar);

// Custom Element untuk Form Catatan
class NoteForm extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <form id="note-form">
                <input type="text" id="note-title" placeholder="Judul Catatan" required>
                <small id="title-error" class="error-message"></small>
                <textarea id="note-body" placeholder="Isi Catatan" required></textarea>
                <small id="body-error" class="error-message"></small>
                <button type="submit">Tambah Catatan</button>
            </form>
        `;
    }
}
customElements.define('note-form', NoteForm);

// Custom Element untuk Item Catatan dengan Shadow DOM dan Custom Attributes
class NoteItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    static get observedAttributes() {
        return ['data-title', 'data-body'];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data-title' || name === 'data-body') {
            this.render();
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const title = this.getAttribute('data-title') || 'Untitled';
        const body = this.getAttribute('data-body') || 'No content';
        
        this.shadowRoot.innerHTML = `
            <style>
                .note {
                    background: white;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s;
                }
                .note:hover {
                    transform: scale(1.05);
                }
            </style>
            <div class="note">
                <h2>${title}</h2>
                <p>${body}</p>
            </div>
        `;
    }
}
customElements.define('note-item', NoteItem);

// Realtime Validation
const noteTitle = document.getElementById('note-title');
const noteBody = document.getElementById('note-body');
const titleError = document.getElementById('title-error');
const bodyError = document.getElementById('body-error');

noteTitle.addEventListener('input', () => {
    if (noteTitle.value.length < 3) {
        titleError.textContent = "Judul harus minimal 3 karakter";
        noteTitle.style.borderColor = "red";
    } else {
        titleError.textContent = "";
        noteTitle.style.borderColor = "#0073e6";
    }
});

noteBody.addEventListener('input', () => {
    if (noteBody.value.length < 5) {
        bodyError.textContent = "Isi catatan harus minimal 5 karakter";
        noteBody.style.borderColor = "red";
    } else {
        bodyError.textContent = "";
        noteBody.style.borderColor = "#0073e6";
    }
});

// Fungsi untuk menampilkan daftar catatan
function displayNotes() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = ''; // Kosongkan daftar sebelum menampilkan
    notesData.forEach(note => {
        const noteItem = document.createElement('note-item');
        noteItem.setAttribute('data-title', note.title);
        noteItem.setAttribute('data-body', note.body);
        notesList.appendChild(noteItem);
    });
}

// Fungsi untuk menambah catatan
document.getElementById('note-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const title = noteTitle.value;
    const body = noteBody.value;
    
    if (title.length < 3 || body.length < 5) {
        return;
    }
    
    const noteItem = document.createElement('note-item');
    noteItem.setAttribute('data-title', title);
    noteItem.setAttribute('data-body', body);
    document.getElementById('notes-list').appendChild(noteItem);
    this.reset();
});

// Memanggil fungsi displayNotes saat halaman dimuat
window.addEventListener('load', displayNotes);
