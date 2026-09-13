package com.strathnova.controller;

import com.strathnova.dto.SubmissionRequest;
import com.strathnova.model.Submission;
import com.strathnova.service.SubmissionService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    private static final Logger log = LoggerFactory.getLogger(SubmissionController.class);

    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @PostMapping
    public ResponseEntity<Long> create(@Valid @RequestBody SubmissionRequest request) {
        log.info("Incoming submission: mode={}, formType={}, name={}, email={}, details={}",
                request.getMode(), request.getFormType(), request.getName(), request.getEmail(), request.getDetails());
        Submission saved = submissionService.save(request);
        log.info("Saved submission id={}", saved.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.getId());
    }
}
