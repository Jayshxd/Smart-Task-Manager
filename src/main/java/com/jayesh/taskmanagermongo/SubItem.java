package com.jayesh.taskmanagermongo;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.lang.annotation.Documented;

@Data
public class SubItem {
    private String stepName;
    private boolean isCompleted;
}
