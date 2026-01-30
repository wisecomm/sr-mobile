package com.example.springrest.domain.order.service;

import com.example.springrest.domain.order.model.dto.OrderRequest;
import com.example.springrest.domain.order.model.dto.OrderResponse;
import com.example.springrest.domain.order.model.entity.Order;
import com.example.springrest.domain.order.model.mapper.OrderDtoMapper;
import com.example.springrest.domain.order.repository.OrderMapper;
import com.example.springrest.global.util.SortValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;

/**
 * OrderService 단위 테스트
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("OrderService 테스트")
class OrderServiceTest {

    @Mock
    private OrderMapper orderMapper;

    @Mock
    private OrderDtoMapper orderDtoMapper;

    @Mock
    private SortValidator sortValidator;

    private OrderService orderService;

    private Order testOrder;
    private OrderRequest testRequest;
    private OrderResponse testResponse;

    @BeforeEach
    void setUp() {
        // Manually create OrderService and inject mocks
        orderService = new OrderService(orderMapper, orderDtoMapper, sortValidator);
        
        testOrder = Order.builder()
                .orderId("ORD001")
                .orderNm("테스트 주문")
                .custNm("홍길동")
                .orderStatus("PENDING")
                .orderAmt(10000L)
                .orderDate(LocalDateTime.now())
                .useYn("1")
                .build();

        testRequest = new OrderRequest();
        testRequest.setOrderId("ORD001");
        testRequest.setOrderNm("테스트 주문");
        testRequest.setCustNm("홍길동");
        testRequest.setOrderStatus("PENDING");
        testRequest.setOrderAmt(10000L);
        testRequest.setUseYn("1");

        testResponse = OrderResponse.builder()
                .orderId("ORD001")
                .orderNm("테스트 주문")
                .custNm("홍길동")
                .orderStatus("PENDING")
                .orderAmt(10000L)
                .useYn("1")
                .build();
    }

    @Nested
    @DisplayName("주문 조회")
    class GetOrders {

        @Test
        @DisplayName("주문 ID로 조회 성공")
        void getOrderById_Success() {
            // given
            given(orderMapper.findById("ORD001")).willReturn(testOrder);
            given(orderDtoMapper.toResponse(testOrder)).willReturn(testResponse);

            // when
            OrderResponse result = orderService.getOrderById("ORD001");

            // then
            assertThat(result).isNotNull();
            assertThat(result.getOrderId()).isEqualTo("ORD001");
            assertThat(result.getCustNm()).isEqualTo("홍길동");

            then(orderMapper).should().findById("ORD001");
        }

        @Test
        @DisplayName("존재하지 않는 주문 ID로 조회시 null 반환")
        void getOrderById_NotFound() {
            // given
            given(orderMapper.findById("INVALID")).willReturn(null);
            given(orderDtoMapper.toResponse(null)).willReturn(null);

            // when
            OrderResponse result = orderService.getOrderById("INVALID");

            // then
            assertThat(result).isNull();
        }
    }

    @Nested
    @DisplayName("주문 생성")
    class CreateOrder {

        @Test
        @DisplayName("주문 생성 성공")
        void createOrder_Success() {
            // given
            given(orderMapper.findById("ORD001")).willReturn(null);
            given(orderDtoMapper.toEntity(testRequest)).willReturn(testOrder);
            given(orderMapper.insert(testOrder)).willReturn(1);

            // when
            assertThatCode(() -> orderService.createOrder(testRequest))
                    .doesNotThrowAnyException();

            // then
            then(orderMapper).should().insert(testOrder);
        }

        @Test
        @DisplayName("중복 주문번호로 생성시 예외 발생")
        void createOrder_DuplicateId() {
            // given
            given(orderMapper.findById("ORD001")).willReturn(testOrder);

            // when & then
            assertThatThrownBy(() -> orderService.createOrder(testRequest))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("이미 존재하는 주문 번호");
        }
    }

    @Nested
    @DisplayName("주문 수정")
    class UpdateOrder {

        @Test
        @DisplayName("주문 수정 성공")
        void updateOrder_Success() {
            // given
            given(orderDtoMapper.toEntity(testRequest)).willReturn(testOrder);
            given(orderMapper.update(testOrder)).willReturn(1);

            // when
            assertThatCode(() -> orderService.updateOrder(testRequest))
                    .doesNotThrowAnyException();

            // then
            then(orderMapper).should().update(testOrder);
        }
    }

    @Nested
    @DisplayName("주문 삭제")
    class DeleteOrder {

        @Test
        @DisplayName("주문 삭제 성공")
        void deleteOrder_Success() {
            // given
            given(orderMapper.delete("ORD001")).willReturn(1);

            // when
            assertThatCode(() -> orderService.deleteOrder("ORD001"))
                    .doesNotThrowAnyException();

            // then
            then(orderMapper).should().delete("ORD001");
        }
    }
}
