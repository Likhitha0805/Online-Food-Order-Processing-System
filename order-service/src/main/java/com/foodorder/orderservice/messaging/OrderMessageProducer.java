package com.foodorder.orderservice.messaging;

import jakarta.jms.Queue;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class OrderMessageProducer {

    private final JmsTemplate jmsTemplate;
    private final Queue orderCreatedQueue;

    @Autowired
    public OrderMessageProducer(@Lazy JmsTemplate jmsTemplate, @Lazy Queue orderCreatedQueue) {
        this.jmsTemplate = jmsTemplate;
        this.orderCreatedQueue = orderCreatedQueue;
    }

    public void publishOrderCreatedEvent(Long orderId) {
        log.info("[OrderMessageProducer] Publishing order.created event for Order #{}", orderId);
        jmsTemplate.convertAndSend(orderCreatedQueue, orderId);
    }
}
