package com.foodorder.orderservice.service;

import com.foodorder.orderservice.dto.*;
import com.foodorder.orderservice.entity.Order;
import com.foodorder.orderservice.messaging.OrderMessageProducer;
import com.foodorder.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderMessageProducer orderMessageProducer;

    @Transactional
    public OrderResponseDTO createOrder(OrderRequestDTO request) {
        // Step 1: Save Order as PLACED
        Order order = Order.builder()
                .customerName(request.getCustomerName())
                .itemName(request.getItemName())
                .amount(request.getAmount())
                .status("PLACED")
                .build();

        order = orderRepository.save(order);
        log.info("[OrderService] Order #{} created with status PLACED", order.getId());

        // Step 2: Publish orderId to the ActiveMQ queue (best-effort)
        try {
            orderMessageProducer.publishOrderCreatedEvent(order.getId());
        } catch (Exception e) {
            log.warn("[OrderService] ActiveMQ unavailable — order #{} saved but message not published: {}",
                    order.getId(), e.getMessage());
        }

        return mapToResponse(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponseDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        return mapToResponse(order);
    }

    @Transactional
    public OrderResponseDTO updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        
        order.setStatus(status);
        order = orderRepository.save(order);
        log.info("[OrderService] Order #{} status updated to {}", id, status);
        
        return mapToResponse(order);
    }

    private OrderResponseDTO mapToResponse(Order order) {
        return OrderResponseDTO.builder()
                .id(order.getId())
                .customerName(order.getCustomerName())
                .itemName(order.getItemName())
                .amount(order.getAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
