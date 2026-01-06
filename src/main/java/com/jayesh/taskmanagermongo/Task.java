package com.jayesh.taskmanagermongo;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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
}
