package com.example.springrest.domain.user.model.mapper;

import com.example.springrest.domain.user.model.dto.UserInfoRequest;
import com.example.springrest.domain.user.model.dto.UserInfoResponse;
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
    UserInfoResponse toResponse(UserInfo entity);

    /**
     * Entity List -> Response DTO List
     */
    List<UserInfoResponse> toResponseList(List<UserInfo> entities);

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

    /**
     * Entity -> Excel DTO
     */
    @Mapping(target = "userPwd", ignore = true) // 엑셀 다운로드 시 비밀번호 제외
    com.example.springrest.domain.user.model.dto.UserExcelDto toExcelDto(UserInfo entity);
}
