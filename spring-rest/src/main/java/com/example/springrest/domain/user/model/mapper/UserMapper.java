package com.example.springrest.domain.user.model.mapper;

import com.example.springrest.domain.user.model.dto.UserInfoRequest;
import com.example.springrest.domain.user.model.dto.UserResponse;
import com.example.springrest.domain.user.model.entity.UserInfo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

/**
 * 사용자 정보 매퍼 (MapStruct)
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    /**
     * Entity -> Response DTO
     */
    UserResponse toResponse(UserInfo entity);

    /**
     * Entity List -> Response DTO List
     */
    List<UserResponse> toResponseList(List<UserInfo> entities);

    /**
     * Request DTO -> Entity (Create)
     */
    @Mapping(target = "roles", ignore = true) // Request에 없고 Entity에만 있는 필드 (IGNORE 정책으로 생략 가능하나 명시)
    UserInfo toEntity(UserInfoRequest request);

    /**
     * Request DTO -> Entity (Update)
     * 비밀번호는 서비스에서 암호화 후 처리하므로 매핑 제외
     */
    @Mapping(target = "userPwd", ignore = true)
    @Mapping(target = "roles", ignore = true)
    UserInfo toEntityForUpdate(UserInfoRequest request);
}
