package com.foodorder.orderservice.messaging;

import jakarta.jms.Queue;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderMessageProducer {

    private final JmsTemplate jmsTemplate;
    private final Queue orderCreatedQueue;

    public void publishOrderCreatedEvent(Long orderId) {
        log.info("[OrderMessageProducer] Publishing order.created event for Order #{}", orderId);
        jmsTemplate.convertAndSend(orderCreatedQueue, orderId);
    }
}
