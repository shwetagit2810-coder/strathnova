package com.strathnova.repository;

import com.strathnova.model.LeadStatus;
import com.strathnova.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    List<Submission> findAllByOrderByCreatedAtDesc();

    List<Submission> findByStatusOrderByCreatedAtDesc(LeadStatus status);
}
