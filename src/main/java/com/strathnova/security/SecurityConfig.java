package com.strathnova.security;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Gates {@code /admin/**} behind a Clerk-issued JWT, carried in a cookie rather than
 * an Authorization header since this is a server-rendered, browser-navigated app.
 * Everything else (the public site and its submission API) stays open, matching
 * behavior before this config existed.
 */
@Configuration
@EnableWebSecurity
@EnableConfigurationProperties(ClerkProperties.class)
public class SecurityConfig {

    private final ClerkProperties clerkProperties;

    public SecurityConfig(ClerkProperties clerkProperties) {
        this.clerkProperties = clerkProperties;
    }

    @Bean
    public FilterRegistrationBean<NoCacheFilter> noCacheFilter() {
        FilterRegistrationBean<NoCacheFilter> registration = new FilterRegistrationBean<>(new NoCacheFilter());
        registration.addUrlPatterns("/admin/*");
        return registration;
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withJwkSetUri(clerkProperties.getJwksUri()).build();
        decoder.setJwtValidator(JwtValidators.createDefaultWithIssuer(clerkProperties.getIssuerUri()));
        return decoder;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        AdminAuthenticationEntryPoint entryPoint = new AdminAuthenticationEntryPoint();

        http
                .csrf(csrf -> csrf.ignoringRequestMatchers("/admin/session", "/admin/logout", "/api/submissions", "/notes"))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/notes", "/strathnova", "/api/submissions",
                                "/css/**", "/js/**",
                                "/admin/login", "/admin/session", "/admin/logout").permitAll()
                        .requestMatchers("/admin/**").authenticated()
                        .anyRequest().permitAll())
                .oauth2ResourceServer(oauth2 -> oauth2
                        .bearerTokenResolver(new CookieBearerTokenResolver())
                        .jwt(jwt -> jwt.decoder(jwtDecoder()))
                        .authenticationEntryPoint(entryPoint))
                .exceptionHandling(ex -> ex.authenticationEntryPoint(entryPoint));

        return http.build();
    }
}
