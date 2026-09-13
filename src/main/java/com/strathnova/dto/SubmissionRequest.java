package com.strathnova.dto;

import com.strathnova.model.SubmissionMode;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Map;

/** What the browser posts to /api/submissions, for either mode. */
public class SubmissionRequest {

    @NotNull
    private SubmissionMode mode;

    @NotBlank
    private String formType;

    private String name;

    @Email
    private String email;

    private String message;

    private Map<String, Object> details;

    public SubmissionMode getMode() {
        return mode;
    }

    public void setMode(SubmissionMode mode) {
        this.mode = mode;
    }

    public String getFormType() {
        return formType;
    }

    public void setFormType(String formType) {
        this.formType = formType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Map<String, Object> getDetails() {
        return details;
    }

    public void setDetails(Map<String, Object> details) {
        this.details = details;
    }
}
