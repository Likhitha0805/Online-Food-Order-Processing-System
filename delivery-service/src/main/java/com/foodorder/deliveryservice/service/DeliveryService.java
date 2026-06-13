package com.foodorder.deliveryservice.service;

import com.foodorder.deliveryservice.dto.DeliveryRequestDTO;
import com.foodorder.deliveryservice.dto.DeliveryResponseDTO;
import com.foodorder.deliveryservice.entity.Delivery;
import com.foodorder.deliveryservice.repository.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final Random random = new Random();

    public DeliveryResponseDTO processDelivery(DeliveryRequestDTO request) {
        String driverName = "Driver-" + (100 + random.nextInt(900));

        Delivery delivery = new Delivery();
        delivery.setOrderId(request.getOrderId());
        delivery.setDriverName(driverName);
        delivery.setStatus("DELIVERED");
        delivery.setDeliveredAt(LocalDateTime.now());
        
        deliveryRepository.save(delivery);

        log.info("[DeliveryService] Order #{} - Assigned {} - DELIVERED", request.getOrderId(), driverName);

        return new DeliveryResponseDTO(request.getOrderId(), driverName, "DELIVERED");
    }
}
