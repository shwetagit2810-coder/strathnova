package com.strathnova;

import java.util.TimeZone;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StrathnovaApplication {

	public static void main(String[] args) {
		// The JDK on this machine resolves the default zone to the deprecated
		// "Asia/Calcutta" alias, which the target PostgreSQL server's tzdata
		// doesn't recognize, causing every connection to fail at startup.
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
		SpringApplication.run(StrathnovaApplication.class, args);
	}

}
