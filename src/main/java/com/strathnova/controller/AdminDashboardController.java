package com.strathnova.controller;

import com.strathnova.model.LeadStatus;
import com.strathnova.service.LeadService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.util.UriComponentsBuilder;

@Controller
public class AdminDashboardController {

    private static final String DEFAULT_TAB = "leads";

    private final LeadService leadService;

    public AdminDashboardController(LeadService leadService) {
        this.leadService = leadService;
    }

    @GetMapping("/admin/dashboard")
    public String dashboard(
            @RequestParam(defaultValue = DEFAULT_TAB) String tab,
            @RequestParam(required = false) String status,
            Model model) {
        LeadStatus statusFilter = parseStatus(status);

        model.addAttribute("activeTab", tab);
        model.addAttribute("statusFilter", statusFilter);
        if (DEFAULT_TAB.equals(tab)) {
            model.addAttribute("leads", leadService.findLeads(statusFilter));
        }
        return "admin/dashboard";
    }

    @PostMapping("/admin/leads/{id}/status")
    public String updateStatus(
            @PathVariable Long id,
            @RequestParam LeadStatus status,
            @RequestParam(required = false) String statusFilter) {
        leadService.updateStatus(id, status);

        UriComponentsBuilder redirect = UriComponentsBuilder.fromPath("/admin/dashboard").queryParam("tab", DEFAULT_TAB);
        if (statusFilter != null && !statusFilter.isBlank()) {
            redirect.queryParam("status", statusFilter);
        }
        return "redirect:" + redirect.build().toUriString();
    }

    private LeadStatus parseStatus(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }
        return LeadStatus.valueOf(status);
    }
}
