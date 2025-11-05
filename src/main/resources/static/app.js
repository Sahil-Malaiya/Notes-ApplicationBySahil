const API_URL = "/api/notes";
let allNotes = [];

document.addEventListener("DOMContentLoaded", () => {
    fetchNotes();

    // 🔍 Search Event
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", e => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
            renderNotes(allNotes);
            return;
        }
        const filtered = allNotes.filter(note =>
            (note.title && note.title.toLowerCase().includes(query)) ||
            (note.content && note.content.toLowerCase().includes(query))
        );
        renderNotes(filtered);
    });
});

async function fetchNotes() {
    try {
        const res = await fetch(API_URL);
        allNotes = await res.json();

        // Sort notes by title alphabetically
        allNotes.sort((a, b) =>
            (a.title || "").localeCompare(b.title || "", undefined, { sensitivity: "base" })
        );

        renderNotes(allNotes);
    } catch (err) {
        console.error("Error fetching notes:", err);
    }
}

function renderNotes(notes) {
    const container = document.getElementById("notesContainer");
    container.innerHTML = "";
    if (!notes || notes.length === 0) {
        container.innerHTML = `<div class="text-center text-muted">No notes found.</div>`;
        return;
    }

    notes.forEach(note => {
        const col = document.createElement("div");
        col.className = "col-md-6";
        col.innerHTML = `
            <div class="note-card card h-100">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${note.title || ""}</h5>
                    <p class="card-text flex-grow-1">${note.content || ""}</p>
                    <div class="card-actions">
                        <button class="btn btn-edit btn-sm" onclick="openEditModal('${note.id}', '${note.title}', '${note.content}')">Edit</button>
                        <button class="btn btn-delete btn-sm" onclick="deleteNote('${note.id}', this)">Delete</button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

document.getElementById("noteForm").addEventListener("submit", async e => {
    e.preventDefault();
    const title = document.getElementById("noteTitle").value.trim();
    const content = document.getElementById("noteContent").value.trim();

    if (!title || !content) return alert("Please fill in both title and content!");

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
    });

    document.getElementById("noteTitle").value = "";
    document.getElementById("noteContent").value = "";
    fetchNotes();
});

let editModal = new bootstrap.Modal(document.getElementById("editNoteModal"));

window.openEditModal = (id, title, content) => {
    document.getElementById("editNoteId").value = id;
    document.getElementById("editNoteTitle").value = title;
    document.getElementById("editNoteContent").value = content;
    editModal.show();
};

document.getElementById("editNoteForm").addEventListener("submit", async e => {
    e.preventDefault();
    const id = document.getElementById("editNoteId").value;
    const title = document.getElementById("editNoteTitle").value.trim();
    const content = document.getElementById("editNoteContent").value.trim();

    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
    });

    editModal.hide();
    fetchNotes();
});

window.deleteNote = async (id, btn) => {
    if (!confirm("Delete this note?")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchNotes();
};
