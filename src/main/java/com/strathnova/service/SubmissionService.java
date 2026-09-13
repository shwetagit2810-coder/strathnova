package com.strathnova.service;

import com.strathnova.dto.SubmissionRequest;
import com.strathnova.model.Submission;

public interface SubmissionService {

    Submission save(SubmissionRequest request);
}
