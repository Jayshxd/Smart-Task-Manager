package com.jayesh.taskmanagermongo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepo extends MongoRepository<Task, String> {

    List<Task> findByTags(String tags);

    List<Task> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);

    List<Task> findByPriority(String priority);

    List<Task> findByCompleted(boolean completed);
}
