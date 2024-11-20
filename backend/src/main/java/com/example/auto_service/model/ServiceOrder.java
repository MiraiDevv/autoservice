package com.example.auto_service.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "service_orders")
public class ServiceOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String clientName;
    private String phoneNumber;
    private String carModel;
    private String serviceType;
    private Double serviceValue;

    @Enumerated(EnumType.STRING)
    private ServiceStatus status = ServiceStatus.PENDING;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    private boolean messageWasSent = false;
}