package com.foodorder.orderservice.config;

import jakarta.jms.Queue;
import org.apache.activemq.command.ActiveMQQueue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

@Configuration
public class JmsConfig {

    @Bean
    @Lazy
    public Queue orderCreatedQueue() {
        return new ActiveMQQueue("order.created");
    }
}
