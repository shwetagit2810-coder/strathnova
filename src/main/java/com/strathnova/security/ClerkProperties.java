package com.strathnova.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** Clerk configuration for the admin portal, bound from the {@code clerk.*} properties. */
@ConfigurationProperties(prefix = "clerk")
public class ClerkProperties {

    private String publishableKey;
    private String issuerUri;
    private String jwksUri;

    public String getPublishableKey() {
        return publishableKey;
    }

    public void setPublishableKey(String publishableKey) {
        this.publishableKey = publishableKey;
    }

    public String getIssuerUri() {
        return issuerUri;
    }

    public void setIssuerUri(String issuerUri) {
        this.issuerUri = issuerUri;
    }

    public String getJwksUri() {
        return jwksUri;
    }

    public void setJwksUri(String jwksUri) {
        this.jwksUri = jwksUri;
    }
}
