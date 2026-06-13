package com.foodorder.camundaservice.messaging;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.RuntimeService;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderCreatedConsumer {

    private final RuntimeService runtimeService;

    @JmsListener(destination = "order.created")
    public void consumeOrderCreatedEvent(Long orderId) {
        log.info("[CamundaService] Received order.created event for Order #{}", orderId);
        
        Map<String, Object> variables = new HashMap<>();
        variables.put("orderId", orderId);
        
        runtimeService.startProcessInstanceByKey("OrderFulfillmentProcess", variables);
        log.info("[CamundaService] Started BPMN process OrderFulfillmentProcess for Order #{}", orderId);
    }
}
