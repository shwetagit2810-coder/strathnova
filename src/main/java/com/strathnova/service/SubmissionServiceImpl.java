package com.strathnova.service;

import com.strathnova.dto.SubmissionRequest;
import com.strathnova.model.Submission;
import com.strathnova.repository.SubmissionRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class SubmissionServiceImpl implements SubmissionService {

    private final SubmissionRepository submissionRepository;

    public SubmissionServiceImpl(SubmissionRepository submissionRepository) {
        this.submissionRepository = submissionRepository;
    }

    @Override
    public Submission save(SubmissionRequest request) {
        Map<String, Object> details = new LinkedHashMap<>();
        details.put("name", request.getName());
        details.put("email", request.getEmail());
        details.put("message", request.getMessage());
        if (request.getDetails() != null) {
            details.putAll(request.getDetails());
        }
        Submission submission = new Submission(request.getMode(), request.getFormType(), details);
        return submissionRepository.save(submission);
    }
}
