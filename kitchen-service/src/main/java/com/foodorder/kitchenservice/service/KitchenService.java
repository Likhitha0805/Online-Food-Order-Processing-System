package com.foodorder.kitchenservice.service;

import com.foodorder.kitchenservice.dto.KitchenRequestDTO;
import com.foodorder.kitchenservice.dto.KitchenResponseDTO;
import com.foodorder.kitchenservice.entity.KitchenTicket;
import com.foodorder.kitchenservice.repository.KitchenTicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class KitchenService {

    private final KitchenTicketRepository kitchenTicketRepository;

    public KitchenResponseDTO processTicket(KitchenRequestDTO request) {
        log.info("[KitchenService] Processing Order #{}", request.getOrderId());

        KitchenTicket ticket = new KitchenTicket();
        ticket.setOrderId(request.getOrderId());
        ticket.setStatus("PREPARING");
        ticket.setPreparedAt(LocalDateTime.now());
        
        kitchenTicketRepository.save(ticket);
        
        // Simulate preparation time
        try {
            Thread.sleep(2000); // Simulate 2 seconds preparation
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        ticket.setStatus("READY");
        kitchenTicketRepository.save(ticket);

        log.info("[KitchenService] Order #{} - Food READY", request.getOrderId());

        return new KitchenResponseDTO(request.getOrderId(), "READY");
    }
}
