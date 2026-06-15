package com.foodorder.camundaservice.delegate;

import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.Expression;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@Slf4j
public class UpdateOrderStatusDelegate implements JavaDelegate {

    @Autowired
    private RestTemplate restTemplate;

    @org.springframework.beans.factory.annotation.Value("${service.order.url}")
    private String orderServiceUrl;

    private Expression status;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        Long orderId = (Long) execution.getVariable("orderId");
        String statusValue = (String) status.getValue(execution);

        log.info("[UpdateOrderStatusDelegate] Updating Order #{} to status {}", orderId, statusValue);

        String url = orderServiceUrl + "/api/orders/" + orderId + "/status?status=" + statusValue;
        
        try {
            restTemplate.put(url, null);
            log.info("[UpdateOrderStatusDelegate] Successfully updated Order #{} status to {}", orderId, statusValue);
        } catch (Exception e) {
            log.error("[UpdateOrderStatusDelegate] Failed to update Order #{} status to {}", orderId, statusValue, e);
        }
    }
}
