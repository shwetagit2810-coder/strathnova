package com.strathnova.service;

import com.strathnova.model.LeadStatus;
import com.strathnova.model.Submission;

import java.util.List;

/** Read/update operations over submissions viewed as leads in the admin portal. */
public interface LeadService {

    List<Submission> findLeads(LeadStatus statusFilter);

    void updateStatus(Long id, LeadStatus newStatus);
}
