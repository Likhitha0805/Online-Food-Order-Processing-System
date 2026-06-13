package com.foodorder.deliveryservice.controller;

import com.foodorder.deliveryservice.entity.DeliveryPartner;
import com.foodorder.deliveryservice.entity.Wallet;
import com.foodorder.deliveryservice.entity.BankAccount;
import com.foodorder.deliveryservice.repository.DeliveryPartnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/partners")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PartnerController {

    private final DeliveryPartnerRepository partnerRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String phone = payload.get("phone");
        // Mock Login: Find or create partner
        DeliveryPartner partner = partnerRepository.findAll().stream()
                .filter(p -> p.getPhone().equals(phone))
                .findFirst()
                .orElseGet(() -> {
                    DeliveryPartner newPartner = new DeliveryPartner();
                    newPartner.setPhone(phone);
                    newPartner.setName("Partner_" + phone.substring(Math.max(0, phone.length() - 4)));
                    newPartner.setOnline(false);
                    
                    Wallet wallet = new Wallet();
                    wallet.setBalance(0.0);
                    newPartner.setWallet(wallet);
                    
                    return partnerRepository.save(newPartner);
                });
        return ResponseEntity.ok(partner);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        boolean isOnline = (boolean) payload.get("isOnline");
        String currentStore = (String) payload.getOrDefault("currentStore", null);

        DeliveryPartner partner = partnerRepository.findById(id).orElseThrow();
        partner.setOnline(isOnline);
        if (currentStore != null) {
            partner.setCurrentStore(currentStore);
        }
        return ResponseEntity.ok(partnerRepository.save(partner));
    }

    @GetMapping("/{id}/wallet")
    public ResponseEntity<?> getWallet(@PathVariable Long id) {
        DeliveryPartner partner = partnerRepository.findById(id).orElseThrow();
        return ResponseEntity.ok(partner.getWallet());
    }

    @PostMapping("/{id}/bank")
    public ResponseEntity<?> saveBankDetails(@PathVariable Long id, @RequestBody BankAccount bankAccount) {
        DeliveryPartner partner = partnerRepository.findById(id).orElseThrow();
        partner.getWallet().setBankAccount(bankAccount);
        partnerRepository.save(partner);
        return ResponseEntity.ok(partner.getWallet());
    }
}
