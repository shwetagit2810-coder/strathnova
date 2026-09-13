package com.strathnova.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * The admin pages change per-request (session state, lead statuses) and are
 * security-sensitive, so they must never be served from the browser cache -
 * without this, a stale /admin/login response (e.g. from before Clerk config
 * changes) can silently keep being reused instead of hitting the server again.
 */
public class NoCacheFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Expires", "0");
        filterChain.doFilter(request, response);
    }
}
