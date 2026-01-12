package com.example.springrest.domain.order.repository;

import com.example.springrest.domain.order.model.entity.Order;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OrderMapper {
    List<Order> findAll(@Param("custNm") String custNm,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate);

    Order findById(@Param("orderId") String orderId);

    int insert(Order order);

    int update(Order order);

    int delete(@Param("orderId") String orderId);
}
