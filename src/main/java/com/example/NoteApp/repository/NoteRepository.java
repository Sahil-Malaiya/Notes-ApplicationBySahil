package com.example.NoteApp.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.NoteApp.model.Note;
import java.util.List;

public interface NoteRepository extends MongoRepository<Note, String> {
}
