package com.example.springrest.domain.auth.model;

import com.example.springrest.domain.user.model.enums.UserRole;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class AuthUser {
    private String userId;
    private String userPwd;
    private String userName;
    private String email;
    private List<UserRole> roles;
    private LocalDateTime lastLoginDt;
}
