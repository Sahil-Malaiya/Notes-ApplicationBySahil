const API_URL = "/api/notes";

// Helper functions
function showError(input, message) {
    input.classList.add('is-invalid');
    let errorDiv = input.parentElement.querySelector('.invalid-feedback');
    if (errorDiv) errorDiv.textContent = message;
}
function clearError(input) {
    input.classList.remove('is-invalid');
    let errorDiv = input.parentElement.querySelector('.invalid-feedback');
    if (errorDiv) errorDiv.textContent = '';
}

// Fetch notes
async function fetchNotes() {
    try {
        const res = await fetch(API_URL);
        const notes = await res.json();
        renderNotes(notes);
    } catch (e) {
        console.error(e);
        renderNotes([]);
    }
}

// Render notes
function renderNotes(notes) {
    const container = document.getElementById('notesContainer');
    container.innerHTML = '';
    if (!Array.isArray(notes) || notes.length === 0) {
        container.innerHTML = `<div class="text-center text-muted">No notes yet.</div>`;
        return;
    }
    notes.forEach(note => {
        const col = document.createElement('div');
        col.className = 'col-md-6';
        col.innerHTML = `
            <div class="note-card card h-100">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${escape(note.title)}</h5>
                    <p class="card-text flex-grow-1">${escape(note.content)}</p>
                    <div class="card-actions">
                        <button class="btn btn-edit btn-sm" onclick="openEditModal('${escapeJS(note.id)}', '${escapeJS(note.title)}', '${escapeJS(note.content)}')">Edit</button>
                        <button class="btn btn-delete btn-sm" onclick="deleteNote('${escapeJS(note.id)}', this)">Delete</button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

// Escape functions
function escape(str) {
    return (str || '').replace(/[&<>"'`]/g, function(m) {
        return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'})[m];
    });
}
function escapeJS(str) {
    return (str || '').replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/"/g,'\\"').replace(/\n/g,'\\n');
}

// Add note
document.getElementById('noteForm').addEventListener('submit', async function(e){
    e.preventDefault();
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');
    let title = titleInput.value.trim();
    let content = contentInput.value.trim();
    let valid = true;
    if(!title){ showError(titleInput,'Title cannot be empty.'); valid=false; } else { clearError(titleInput); }
    if(!content){ showError(contentInput,'Content cannot be empty.'); valid=false; } else { clearError(contentInput); }
    if(!valid) return;
    try{
        await fetch(API_URL,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({title,content})
        });
        titleInput.value=''; contentInput.value='';
        fetchNotes();
        showAddAnimation();
    }catch(e){ console.error(e); }
});

// Add animation
function showAddAnimation(){
    setTimeout(()=>{
        const cards=document.querySelectorAll('.note-card');
        if(cards.length){ cards[0].style.boxShadow='0 0 36px #00c6ff99';
            setTimeout(()=>{ cards[0].style.boxShadow=''; },600);
        }
    },400);
}

// Edit modal
let editModal=new bootstrap.Modal(document.getElementById('editNoteModal'));
window.openEditModal=function(id,title,content){
    document.getElementById('editNoteId').value=id;
    document.getElementById('editNoteTitle').value=title;
    document.getElementById('editNoteContent').value=content;
    clearError(document.getElementById('editNoteTitle'));
    clearError(document.getElementById('editNoteContent'));
    editModal.show();
};

// Save edit
document.getElementById('editNoteForm').addEventListener('submit', async function(e){
    e.preventDefault();
    const id=document.getElementById('editNoteId').value;
    const titleInput=document.getElementById('editNoteTitle');
    const contentInput=document.getElementById('editNoteContent');
    let title=titleInput.value.trim();
    let content=contentInput.value.trim();
    let valid=true;
    if(!title){ showError(titleInput,'Title cannot be empty.'); valid=false; } else { clearError(titleInput); }
    if(!content){ showError(contentInput,'Content cannot be empty.'); valid=false; } else { clearError(contentInput); }
    if(!valid) return;
    try{
        await fetch(`${API_URL}/${id}`,{
            method:'PUT',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({title,content})
        });
        editModal.hide();
        fetchNotes();
        showEditAnimation(id);
    }catch(e){ console.error(e); }
});

// Edit animation
function showEditAnimation(noteId){
    setTimeout(()=>{
        const cards=document.querySelectorAll('.note-card');
        for(let card of cards){
            if(card.querySelector('button.btn-edit').getAttribute('onclick').includes(noteId)){
                card.style.transform='scale(1.04)';
                card.style.boxShadow='0 0 40px #4169e199';
                setTimeout(()=>{ card.style.transform=''; card.style.boxShadow=''; },600);
                break;
            }
        }
    },400);
}

// Delete
window.deleteNote=async function(id,btn){
    if(!confirm('Delete this note?')) return;
    try{
        const card=btn.closest('.note-card');
        card.style.transition='opacity 0.4s, transform 0.3s';
        card.style.opacity='0';
        card.style.transform='scale(0.8) translateY(30px)';
        setTimeout(async ()=>{
            await fetch(`${API_URL}/${id}`,{method:'DELETE'});
            fetchNotes();
        },350);
    }catch(e){ console.error(e); }
};

let allNotes = [];

async function fetchNotes() {
  try {
    const res = await fetch(API_URL);
    const notes = await res.json();
    allNotes = notes; // store all notes globally
    renderNotes(allNotes);
  } catch (e) {
    console.error(e);
    renderNotes([]);
  }
}

document.getElementById('searchBar').addEventListener('input', function() {
  const query = this.value.toLowerCase();
  const filtered = allNotes.filter(note =>
    note.title.toLowerCase().includes(query) ||
    note.content.toLowerCase().includes(query)
  );
  renderNotes(filtered);
});

// Initial load
fetchNotes();
