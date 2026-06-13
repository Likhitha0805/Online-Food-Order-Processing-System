package com.foodorder.paymentservice.service;

import com.foodorder.paymentservice.dto.PaymentRequestDTO;
import com.foodorder.paymentservice.dto.PaymentResponseDTO;
import com.foodorder.paymentservice.entity.Payment;
import com.foodorder.paymentservice.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final Random random = new Random();

    @Transactional
    public PaymentResponseDTO processPayment(PaymentRequestDTO request) {
        // Generate random payment result (80% SUCCESS, 20% FAILED)
        String status = (random.nextInt(100) < 80) ? "SUCCESS" : "FAILED";

        // Save payment record into MySQL
        Payment payment = Payment.builder()
                .orderId(request.getOrderId())
                .amount(request.getAmount())
                .paymentStatus(status)
                .build();
        paymentRepository.save(payment);

        // Log the result
        log.info("[PaymentService] Order #{} - Payment {}", request.getOrderId(), status);

        return PaymentResponseDTO.builder()
                .orderId(request.getOrderId())
                .paymentStatus(status)
                .build();
    }
}
