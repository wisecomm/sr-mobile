package com.example.springrest.domain.user.service;

import com.example.springrest.domain.user.model.dto.UserInfoRequest;
import com.example.springrest.domain.user.model.dto.UserResponse;
import com.example.springrest.domain.user.model.entity.UserInfo;
import com.example.springrest.domain.user.model.entity.UserRoleMap;
import com.example.springrest.domain.user.model.mapper.UserMapper;
import com.example.springrest.domain.user.repository.UserInfoMapper;
import com.example.springrest.domain.user.repository.UserRoleMapper;
import com.example.springrest.global.model.dto.PageResponse;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import org.apache.poi.ss.usermodel.Workbook;

import com.example.springrest.global.common.service.BaseService;

/**
 * 사용자 정보 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService extends BaseService<UserInfo, String, UserInfoMapper> {

    private final UserInfoMapper userInfoMapper;

    @Override
    protected UserInfoMapper getMapper() {
        return userInfoMapper;
    }

    private final UserRoleMapper userRoleMapper;
    private final PasswordEncoder passwordEncoder;

    private final UserMapper userMapper;

    public PageResponse<UserResponse> getAllUsers(int page, int size, String userName, String startDate, String endDate,
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

        List<UserInfo> users = userInfoMapper.findAll(userName, startDate, endDate, sortClause);
        List<UserResponse> userResponses = userMapper.toResponseList(users);

        // PageHelper returns a Page<E> which extends ArrayList<E>. If we map it to a
        // new list, we lose page info unless we manually copy it.
        // Better approach with PageHelper:
        PageInfo<UserInfo> originalPageInfo = new PageInfo<>(users);

        PageInfo<UserResponse> responsePageInfo = new PageInfo<>();
        responsePageInfo.setList(userResponses);
        responsePageInfo.setTotal(originalPageInfo.getTotal());
        responsePageInfo.setPageNum(originalPageInfo.getPageNum());
        responsePageInfo.setPageSize(originalPageInfo.getPageSize());
        responsePageInfo.setPages(originalPageInfo.getPages());
        // Copy other necessary fields if PageResponse uses them.

        return PageResponse.of(responsePageInfo, userResponses);
    }

    private String camelToSnake(String str) {
        String result = str.replaceAll("([a-z])([A-Z]+)", "$1_$2").toLowerCase();
        return result;
    }

    // getUserById uses UserResponse, so we keep logic but use super.findById
    // internally if we want,
    // but here we already use userInfoMapper.findById directly or via super.
    public UserResponse getUserById(String userId) {
        UserInfo user = super.findById(userId); // Use BaseService method
        return userMapper.toResponse(user);
    }

    @Transactional
    public void createUser(UserInfoRequest request) {
        if (super.findById(request.getUserId()) != null) {
            throw new IllegalArgumentException("이미 존재하는 사용자 ID입니다: " + request.getUserId());
        }
        UserInfo user = userMapper.toEntity(request);
        user.setUserPwd(passwordEncoder.encode(request.getUserPwd()));
        // Use BaseService create
        super.create(user);
    }

    @Transactional
    public void updateUser(UserInfoRequest request) {
        // Update logic via MapStruct
        UserInfo user = userMapper.toEntityForUpdate(request);

        if (request.getUserPwd() != null && !request.getUserPwd().isEmpty()) {
            user.setUserPwd(passwordEncoder.encode(request.getUserPwd()));
        }

        // Use BaseService update
        super.update(user);
    }

    @Transactional
    public void deleteUser(String userId) {
        userRoleMapper.deleteByUserId(userId);
        super.delete(userId);
    }

    @Transactional
    public void assignRoles(String userId, List<String> roleIds) {
        userRoleMapper.deleteByUserId(userId);
        for (String roleId : roleIds) {
            UserRoleMap mapping = UserRoleMap.builder()
                    .userId(userId)
                    .roleId(roleId)
                    .useYn("1")
                    .build();
            userRoleMapper.insert(mapping);
        }
    }

    public List<String> getUserRoleIds(String userId) {
        return userRoleMapper.findByUserId(userId).stream()
                .map(UserRoleMap::getRoleId)
                .toList();
    }

    public void downloadExcel(jakarta.servlet.http.HttpServletResponse response, String userName, String startDate,
            String endDate) throws java.io.IOException {
        if (startDate != null && !startDate.isEmpty()) {
            startDate = startDate + " 00:00:00";
        }
        if (endDate != null && !endDate.isEmpty()) {
            endDate = endDate + " 23:59:59";
        }

        List<UserInfo> users = userInfoMapper.findAll(userName, startDate, endDate, null);

        List<com.example.springrest.domain.user.model.dto.UserExcelDto> excelData = users.stream()
                .map(userMapper::toExcelDto)
                .collect(java.util.stream.Collectors.toList());

        Workbook workbook = com.example.springrest.common.excel.ExcelUtils
                .toExcel(excelData, com.example.springrest.domain.user.model.dto.UserExcelDto.class);

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        String fileName = java.net.URLEncoder.encode("사용자목록.xlsx", "UTF-8").replaceAll("\\+", "%20");
        response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");

        workbook.write(response.getOutputStream());
        workbook.close();
    }

    @Transactional
    public void uploadExcel(org.springframework.web.multipart.MultipartFile file) throws java.io.IOException {
        List<com.example.springrest.domain.user.model.dto.UserExcelDto> excelList = com.example.springrest.common.excel.ExcelUtils
                .fromExcel(file, com.example.springrest.domain.user.model.dto.UserExcelDto.class);

        for (com.example.springrest.domain.user.model.dto.UserExcelDto dto : excelList) {
            UserInfoRequest request = UserInfoRequest.builder()
                    .userId(dto.getUserId())
                    .userName(dto.getUserName())
                    .userEmail(dto.getUserEmail())
                    .userNick(dto.getUserNick())
                    .useYn(dto.getUseYn())
                    .userPwd(dto.getUserPwd() != null && !dto.getUserPwd().isEmpty() ? dto.getUserPwd() : "test1234")
                    .build();

            if (userInfoMapper.findById(dto.getUserId()) != null) {
                updateUser(request);
            } else {
                createUser(request);
            }
        }
    }
}
