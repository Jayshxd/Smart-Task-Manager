package com.jayesh.taskmanagermongo;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/task")
public class TaskController {

    private final TaskRepo taskRepo;

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        if (task.getPriority() == null) {
            task.setPriority("MEDIUM");
        }
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
            updatedTask.setCompleted(task.isCompleted());
            updatedTask.setPriority(task.getPriority());
            updatedTask.setDueDate(task.getDueDate());
            updatedTask.setFocusTimeMinutes(task.getFocusTimeMinutes());
            updatedTask.setPomodoroCount(task.getPomodoroCount());
            updatedTask.setUpdatedAt(LocalDateTime.now());
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
            if(task.getDescription() != null) {
                updatedTask.setDescription(task.getDescription());
            }
            if(task.getSteps() != null) {
                updatedTask.setSteps(task.getSteps());
            }
            if(task.getTags() != null) {
                updatedTask.setTags(task.getTags());
            }
            if(task.getTitle() != null) {
                updatedTask.setTitle(task.getTitle());
            }
            if(task.getPriority() != null) {
                updatedTask.setPriority(task.getPriority());
            }
            if(task.getDueDate() != null) {
                updatedTask.setDueDate(task.getDueDate());
            }
            updatedTask.setCompleted(task.isCompleted());
            updatedTask.setFocusTimeMinutes(task.getFocusTimeMinutes());
            updatedTask.setPomodoroCount(task.getPomodoroCount());
            updatedTask.setUpdatedAt(LocalDateTime.now());
            Task savedTask = taskRepo.save(updatedTask);
            return new ResponseEntity<>(savedTask, HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<Task> toggleTaskComplete(@PathVariable String id) {
        Optional<Task> originalTask = taskRepo.findById(id);
        if(originalTask.isPresent()) {
            Task updatedTask = originalTask.get();
            updatedTask.setCompleted(!updatedTask.isCompleted());
            updatedTask.setUpdatedAt(LocalDateTime.now());
            Task savedTask = taskRepo.save(updatedTask);
            return new ResponseEntity<>(savedTask, HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable String id) {
        Optional<Task> task = taskRepo.findById(id);
        return task.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Task>> searchTasks(@RequestParam String q) {
        List<Task> tasks = taskRepo.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(q, q);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<Task>> getTasksByPriority(@PathVariable String priority) {
        List<Task> tasks = taskRepo.findByPriority(priority.toUpperCase());
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @GetMapping("/completed")
    public ResponseEntity<List<Task>> getCompletedTasks() {
        List<Task> tasks = taskRepo.findByCompleted(true);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Task>> getPendingTasks() {
        List<Task> tasks = taskRepo.findByCompleted(false);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
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
