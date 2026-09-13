package com.strathnova.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class StrathnovaController {

    @GetMapping("/strathnova")
    public String strathnova() {
        return "strathnova";
    }
}
