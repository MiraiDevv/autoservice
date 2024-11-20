package com.example.auto_service.controller;

import com.example.auto_service.model.ServiceOrder;
import com.example.auto_service.model.ServiceStatus;
import com.example.auto_service.model.PaymentMethod;
import com.example.auto_service.service.ServiceOrderService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceOrderController {
    private final ServiceOrderService service;

    @Data
    public static class CreateServiceOrderRequest {
        private String clientName;
        private String phoneNumber;
        private String carModel;
        private String serviceType;
        private Double serviceValue;
    }

    @GetMapping
    public List<ServiceOrder> findAll() {
        return service.findAll();
    }

    @PostMapping
    public ServiceOrder create(@RequestBody CreateServiceOrderRequest request) {
        ServiceOrder serviceOrder = new ServiceOrder();
        serviceOrder.setClientName(request.getClientName());
        serviceOrder.setPhoneNumber(request.getPhoneNumber());
        serviceOrder.setCarModel(request.getCarModel());
        serviceOrder.setServiceType(request.getServiceType());
        serviceOrder.setServiceValue(request.getServiceValue());
        serviceOrder.setStatus(ServiceStatus.PENDING);
        serviceOrder.setMessageWasSent(false);
        return service.save(serviceOrder);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/status")
    public ServiceOrder updateStatus(
            @PathVariable Long id,
            @RequestParam ServiceStatus status) {
        return service.updateStatus(id, status);
    }

    @PutMapping("/{id}/payment")
    public ServiceOrder updatePayment(
            @PathVariable Long id,
            @RequestParam PaymentMethod paymentMethod) {
        return service.updatePayment(id, paymentMethod);
    }
}