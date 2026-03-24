package com.arribot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
public class ArribotApplication {

    public static void main(String[] args) {
        SpringApplication.run(ArribotApplication.class, args);
    }
}
