package com.foodorder.camundaservice.delegate;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProcessDeliveryDelegate implements JavaDelegate {

    private final RestTemplate restTemplate;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        Long orderId = (Long) execution.getVariable("orderId");
        log.info("[ProcessDeliveryDelegate] Processing delivery for Order #{}", orderId);

        String deliveryUrl = "http://localhost:8084/api/delivery/process";
        Map<String, Object> deliveryRequest = Map.of("orderId", orderId);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(deliveryUrl, deliveryRequest, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                String driverName = (String) response.getBody().get("driverName");
                log.info("[ProcessDeliveryDelegate] Delivery assigned to {} for Order #{}", driverName, orderId);
            } else {
                log.error("[ProcessDeliveryDelegate] Delivery failed to process Order #{}", orderId);
            }
        } catch (Exception e) {
            log.error("[ProcessDeliveryDelegate] Exception while calling Delivery Service for Order #{}", orderId, e);
        }
    }
}
