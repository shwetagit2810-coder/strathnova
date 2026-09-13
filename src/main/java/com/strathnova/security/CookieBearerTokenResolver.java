package com.strathnova.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;

/**
 * Reads the Clerk session JWT from the {@value #COOKIE_NAME} cookie rather than an
 * {@code Authorization} header, since the admin portal is server-rendered pages
 * navigated by the browser, not an API client.
 */
public class CookieBearerTokenResolver implements BearerTokenResolver {

    public static final String COOKIE_NAME = "sn_session";

    @Override
    public String resolve(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }
        for (Cookie cookie : cookies) {
            if (COOKIE_NAME.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
