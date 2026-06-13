package com.foodorder.deliveryservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId;

    private String driverName;

    private String status;

    private Long deliveryPartnerId;

    private LocalDateTime pickupTime;

    private LocalDateTime arrivedTime;

    private LocalDateTime deliveredAt;

    private String cancelReason;
}
