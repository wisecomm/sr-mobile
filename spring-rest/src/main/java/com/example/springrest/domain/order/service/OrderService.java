package com.example.springrest.domain.order.service;

import com.example.springrest.domain.order.model.dto.OrderRequest;
import com.example.springrest.domain.order.model.entity.Order;
import com.example.springrest.domain.order.repository.OrderMapper;
import com.example.springrest.global.model.dto.PageResponse;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 주문 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderMapper orderMapper;

    public PageResponse<Order> getAllOrders(int page, int size, String custNm, String startDate, String endDate,
            String sort) {
        PageHelper.startPage(page, size);

        if (startDate != null && !startDate.isEmpty()) {
            startDate = startDate + " 00:00:00";
        }
        if (endDate != null && !endDate.isEmpty()) {
            endDate = endDate + " 23:59:59";
        }

        // Convert sort format if needed (e.g. from "camelCase,asc" to "snake_case asc")
        // Assuming sort comes as "colId,direction"
        String sortClause = null;
        if (sort != null && !sort.isEmpty()) {
            String[] parts = sort.split(",");
            if (parts.length == 2) {
                // Simple conversion: camelCase to snake_case mapping could be done here if
                // needed
                // For now, assume colId matches DB column or rely on frontend to send correct
                // column name
                // To be safe against SQL injection, validate parts[1] is asc/desc
                String col = parts[0];
                String dir = parts[1].toLowerCase();
                if ("asc".equals(dir) || "desc".equals(dir)) {
                    sortClause = camelToSnake(col) + " " + dir;
                }
            }
        }

        List<Order> orders = orderMapper.findAll(custNm, startDate, endDate, sortClause);
        PageInfo<Order> pageInfo = new PageInfo<>(orders);

        return PageResponse.of(pageInfo, orders);
    }

    public Order getOrderById(String orderId) {
        return orderMapper.findById(orderId);
    }

    @Transactional
    public void createOrder(OrderRequest request) {
        if (orderMapper.findById(request.getOrderId()) != null) {
            throw new IllegalArgumentException("이미 존재하는 주문 번호입니다: " + request.getOrderId());
        }
        Order order = convertToEntity(request);
        orderMapper.insert(order);
    }

    @Transactional
    public void updateOrder(OrderRequest request) {
        Order order = convertToEntity(request);
        orderMapper.update(order);
    }

    @Transactional
    public void deleteOrder(String orderId) {
        orderMapper.delete(orderId);
    }

    private Order convertToEntity(OrderRequest request) {
        return Order.builder()
                .orderId(request.getOrderId())
                .custNm(request.getCustNm())
                .orderNm(request.getOrderNm())
                .orderStatus(request.getOrderStatus())
                .useYn(request.getUseYn() != null ? request.getUseYn() : "1")
                .build();
    }

    private String camelToSnake(String str) {
        String result = str.replaceAll("([a-z])([A-Z]+)", "$1_$2").toLowerCase();
        return result;
    }
}
