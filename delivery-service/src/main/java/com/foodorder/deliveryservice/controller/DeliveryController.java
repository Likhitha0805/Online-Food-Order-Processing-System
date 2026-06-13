package com.foodorder.deliveryservice.controller;

import com.foodorder.deliveryservice.dto.DeliveryRequestDTO;
import com.foodorder.deliveryservice.dto.DeliveryResponseDTO;
import com.foodorder.deliveryservice.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/delivery")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;
    private final com.foodorder.deliveryservice.repository.DeliveryRepository deliveryRepository;
    private final com.foodorder.deliveryservice.repository.DeliveryPartnerRepository partnerRepository;

    @PostMapping("/process")
    public ResponseEntity<DeliveryResponseDTO> processDelivery(@RequestBody DeliveryRequestDTO request) {
        DeliveryResponseDTO response = deliveryService.processDelivery(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/pickup")
    public ResponseEntity<?> pickupOrder(@PathVariable Long id, @RequestBody java.util.Map<String, Long> payload) {
        Long partnerId = payload.get("partnerId");
        com.foodorder.deliveryservice.entity.Delivery delivery = deliveryRepository.findById(id).orElseThrow();
        delivery.setDeliveryPartnerId(partnerId);
        delivery.setStatus("PICKED_UP");
        delivery.setPickupTime(java.time.LocalDateTime.now());
        return ResponseEntity.ok(deliveryRepository.save(delivery));
    }

    @PutMapping("/{id}/arrive")
    public ResponseEntity<?> arriveAtCustomer(@PathVariable Long id) {
        com.foodorder.deliveryservice.entity.Delivery delivery = deliveryRepository.findById(id).orElseThrow();
        delivery.setStatus("ARRIVED");
        delivery.setArrivedTime(java.time.LocalDateTime.now());
        return ResponseEntity.ok(deliveryRepository.save(delivery));
    }

    @PutMapping("/{id}/deliver")
    public ResponseEntity<?> deliverOrder(@PathVariable Long id) {
        com.foodorder.deliveryservice.entity.Delivery delivery = deliveryRepository.findById(id).orElseThrow();
        delivery.setStatus("DELIVERED");
        delivery.setDeliveredAt(java.time.LocalDateTime.now());
        deliveryRepository.save(delivery);

        // Add Rs 20 to Partner Wallet
        if (delivery.getDeliveryPartnerId() != null) {
            com.foodorder.deliveryservice.entity.DeliveryPartner partner = partnerRepository.findById(delivery.getDeliveryPartnerId()).orElseThrow();
            com.foodorder.deliveryservice.entity.Wallet wallet = partner.getWallet();
            wallet.setBalance(wallet.getBalance() + 20.0);
            partnerRepository.save(partner);
        }

        return ResponseEntity.ok(delivery);
    }
}
