package com.jayesh.taskmanagermongo;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/task")
public class TaskController {

    private final TaskRepo taskRepo;

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task savedTask = taskRepo.save(task);
        return new ResponseEntity<>(savedTask, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskRepo.findAll();
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @GetMapping("/tag/{tag}")
    public ResponseEntity<List<Task>> getTasksByTag(@PathVariable String tag) {
        List<Task> tasks = taskRepo.findByTags(tag);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable String id,@RequestBody Task task) {
        Optional<Task> originalTask = taskRepo.findById(id);
        if(originalTask.isPresent()) {
            Task updatedTask = originalTask.get();
            updatedTask.setTitle(task.getTitle());
            updatedTask.setTags(task.getTags());
            updatedTask.setDescription(task.getDescription());
            updatedTask.setSteps(task.getSteps());
            Task savedTask = taskRepo.save(updatedTask);
            return new ResponseEntity<>(savedTask, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Task> updateTaskDetails(@PathVariable String id,@RequestBody Task task) {
        Optional<Task> originalTask = taskRepo.findById(id);
        if(originalTask.isPresent()) {
            Task updatedTask = originalTask.get();
            if(updatedTask.getDescription() != null) {
                updatedTask.setDescription(updatedTask.getDescription());
            }
            if(updatedTask.getSteps() != null) {
                updatedTask.setSteps(updatedTask.getSteps());
            }
            if(updatedTask.getTags() != null) {
                updatedTask.setTags(updatedTask.getTags());
            }
            if(updatedTask.getTitle() != null) {
                updatedTask.setTitle(updatedTask.getTitle());
            }
            Task savedTask = taskRepo.save(updatedTask);
            return new ResponseEntity<>(savedTask, HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable String id){
        if(taskRepo.existsById(id)) {
            taskRepo.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
