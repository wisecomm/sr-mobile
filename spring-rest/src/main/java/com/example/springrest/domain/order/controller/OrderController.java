package com.example.springrest.domain.order.controller;

import com.example.springrest.domain.order.model.dto.OrderRequest;
import com.example.springrest.domain.order.model.entity.Order;
import com.example.springrest.domain.order.service.OrderService;
import com.example.springrest.global.model.dto.PageResponse;
import com.example.springrest.global.model.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/mgmt/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ApiResponse<PageResponse<Order>> getOrders(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String custNm,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return ApiResponse.success(orderService.getAllOrders(page, size, custNm, startDate, endDate));
    }

    @GetMapping("/{orderId}")
    public ApiResponse<Order> getOrder(@PathVariable String orderId) {
        return ApiResponse.success(orderService.getOrderById(orderId));
    }

    @PostMapping
    public ApiResponse<Void> createOrder(@RequestBody OrderRequest request) {
        orderService.createOrder(request);
        return ApiResponse.success();
    }

    @PutMapping("/{orderId}")
    public ApiResponse<Void> updateOrder(@PathVariable String orderId, @RequestBody OrderRequest request) {
        request.setOrderId(orderId);
        orderService.updateOrder(request);
        return ApiResponse.success();
    }

    @DeleteMapping("/{orderId}")
    public ApiResponse<Void> deleteOrder(@PathVariable String orderId) {
        orderService.deleteOrder(orderId);
        return ApiResponse.success();
    }
}
