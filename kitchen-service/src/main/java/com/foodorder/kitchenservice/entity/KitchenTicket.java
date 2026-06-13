package com.foodorder.kitchenservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "kitchen_tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KitchenTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId;

    private String status;

    private LocalDateTime preparedAt;
}
