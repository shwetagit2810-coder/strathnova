package com.strathnova.controller;

import com.strathnova.security.ClerkProperties;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminLoginController {

    private final ClerkProperties clerkProperties;

    public AdminLoginController(ClerkProperties clerkProperties) {
        this.clerkProperties = clerkProperties;
    }

    @GetMapping("/admin/login")
    public String login(Model model) {
        model.addAttribute("clerkPublishableKey", clerkProperties.getPublishableKey());
        model.addAttribute("clerkScriptUrl", clerkProperties.getIssuerUri() + "/npm/@clerk/clerk-js@latest/dist/clerk.browser.js");
        return "admin/login";
    }
}
