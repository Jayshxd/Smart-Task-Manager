package com.jayesh.taskmanagermongo;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document("tasks")
public class Task {
    @Id
    private String id;

    private String title;
    private String description;

    private List<String> tags;

    private List<SubItem> steps;

    private boolean completed;
    private String priority; // LOW, MEDIUM, HIGH, URGENT
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int focusTimeMinutes; // Total focus time spent on this task
    private int pomodoroCount; // Number of pomodoro sessions completed
}
