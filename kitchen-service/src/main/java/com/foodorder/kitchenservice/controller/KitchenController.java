package com.foodorder.kitchenservice.controller;

import com.foodorder.kitchenservice.dto.KitchenRequestDTO;
import com.foodorder.kitchenservice.dto.KitchenResponseDTO;
import com.foodorder.kitchenservice.service.KitchenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/kitchen")
@RequiredArgsConstructor
public class KitchenController {

    private final KitchenService kitchenService;

    @PostMapping("/process")
    public ResponseEntity<KitchenResponseDTO> processTicket(@RequestBody KitchenRequestDTO request) {
        KitchenResponseDTO response = kitchenService.processTicket(request);
        return ResponseEntity.ok(response);
    }
}
