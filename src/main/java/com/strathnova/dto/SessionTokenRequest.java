package com.strathnova.dto;

import jakarta.validation.constraints.NotBlank;

/** What the login page posts after Clerk confirms sign-in client-side. */
public class SessionTokenRequest {

    @NotBlank
    private String token;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
