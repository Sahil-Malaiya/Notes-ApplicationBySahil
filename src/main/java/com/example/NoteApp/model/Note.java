package com.example.NoteApp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "notes")
public class Note {

    @Id
    private String id;
    private String title;
    private String content;

    public Note() {}

    public Note(String title, String content) {
        this.title = title;
        this.content = content;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {     // <-- ye method jaruri hai
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {   // <-- ye bhi jaruri hai
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
