package com.example.auto_service.service;

import com.example.auto_service.model.ServiceOrder;
import com.example.auto_service.model.ServiceStatus;
import com.example.auto_service.model.PaymentMethod;
import com.example.auto_service.repository.ServiceOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceOrderService {
    private final ServiceOrderRepository repository;

    public List<ServiceOrder> findAll() {
        return repository.findAll();
    }

    public ServiceOrder save(ServiceOrder serviceOrder) {
        return repository.save(serviceOrder);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Transactional
    public ServiceOrder updateStatus(Long id, ServiceStatus status) {
        ServiceOrder order = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);

        if (status == ServiceStatus.COMPLETED && !order.isMessageWasSent()) {
            // Aqui você implementaria o envio de mensagem
            order.setMessageWasSent(true);
        }

        return repository.save(order);
    }

    @Transactional
    public ServiceOrder updatePayment(Long id, PaymentMethod paymentMethod) {
        ServiceOrder order = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setPaymentMethod(paymentMethod);
        return repository.save(order);
    }
}