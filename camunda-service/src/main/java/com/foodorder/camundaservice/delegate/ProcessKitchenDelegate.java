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
public class ProcessKitchenDelegate implements JavaDelegate {

    private final RestTemplate restTemplate;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        Long orderId = (Long) execution.getVariable("orderId");
        log.info("[ProcessKitchenDelegate] Processing kitchen order for Order #{}", orderId);

        String kitchenUrl = "http://localhost:8083/api/kitchen/process";
        Map<String, Object> kitchenRequest = Map.of("orderId", orderId);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(kitchenUrl, kitchenRequest, Map.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("[ProcessKitchenDelegate] Kitchen processed Order #{}", orderId);
            } else {
                log.error("[ProcessKitchenDelegate] Kitchen failed to process Order #{}", orderId);
            }
        } catch (Exception e) {
            log.error("[ProcessKitchenDelegate] Exception while calling Kitchen Service for Order #{}", orderId, e);
        }
    }
}
