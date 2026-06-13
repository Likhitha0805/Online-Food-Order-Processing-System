package com.foodorder.camundaservice.delegate;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProcessPaymentDelegate implements JavaDelegate {

    private final RestTemplate restTemplate;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        Long orderId = (Long) execution.getVariable("orderId");
        log.info("[ProcessPaymentDelegate] Processing payment for Order #{}", orderId);

        // Fetch order details to get the amount
        String orderUrl = "http://localhost:8081/api/orders/" + orderId;
        ResponseEntity<Map> orderResponse = restTemplate.getForEntity(orderUrl, Map.class);
        
        if (orderResponse.getStatusCode().is2xxSuccessful() && orderResponse.getBody() != null) {
            Object amountObj = orderResponse.getBody().get("amount");
            BigDecimal amount = new BigDecimal(amountObj.toString());

            // Call Payment Service
            String paymentUrl = "http://localhost:8086/api/payments/process";
            Map<String, Object> paymentRequest = Map.of(
                    "orderId", orderId,
                    "amount", amount
            );

            ResponseEntity<Map> paymentResponse = restTemplate.postForEntity(paymentUrl, paymentRequest, Map.class);

            if (paymentResponse.getStatusCode().is2xxSuccessful() && paymentResponse.getBody() != null) {
                String paymentStatus = (String) paymentResponse.getBody().get("paymentStatus");
                execution.setVariable("paymentStatus", paymentStatus);
                log.info("[ProcessPaymentDelegate] Payment status for Order #{}: {}", orderId, paymentStatus);
            } else {
                log.error("[ProcessPaymentDelegate] Failed to process payment for Order #{}", orderId);
                execution.setVariable("paymentStatus", "FAILED");
            }
        } else {
            log.error("[ProcessPaymentDelegate] Failed to fetch details for Order #{}", orderId);
            execution.setVariable("paymentStatus", "FAILED");
        }
    }
}
