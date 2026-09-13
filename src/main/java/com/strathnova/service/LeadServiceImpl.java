package com.strathnova.service;

import com.strathnova.model.LeadStatus;
import com.strathnova.model.Submission;
import com.strathnova.repository.SubmissionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class LeadServiceImpl implements LeadService {

    private final SubmissionRepository submissionRepository;

    public LeadServiceImpl(SubmissionRepository submissionRepository) {
        this.submissionRepository = submissionRepository;
    }

    @Override
    public List<Submission> findLeads(LeadStatus statusFilter) {
        if (statusFilter == null) {
            return submissionRepository.findAllByOrderByCreatedAtDesc();
        }
        return submissionRepository.findByStatusOrderByCreatedAtDesc(statusFilter);
    }

    @Override
    public void updateStatus(Long id, LeadStatus newStatus) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No submission with id " + id));
        submission.setStatus(newStatus);
        submissionRepository.save(submission);
    }
}
