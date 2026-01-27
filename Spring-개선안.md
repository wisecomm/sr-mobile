# 🔍 Spring Boot 구조 분석 및 개선 제안

> 분석일: 2026년 1월 27일

---

## ✅ 현재 잘 되어있는 부분

| 항목 | 평가 |
|------|------|
| **도메인 기반 패키지 구조** | `domain/{entity}/(controller/service/repository/model)` ✅ |
| **표준 API 응답 형식** | `ApiResponse<T>` 래퍼 클래스 사용 ✅ |
| **전역 예외 처리** | `GlobalExceptionHandler`로 중앙 집중 ✅ |
| **ErrorCode Enum** | 에러 코드 중앙 관리 ✅ |
| **JWT 인증** | Access/Refresh Token 분리 ✅ |
| **MyBatis + PageHelper** | 페이지네이션 처리 ✅ |
| **Swagger/OpenAPI** | API 문서 자동화 ✅ |
| **Jasypt 암호화** | 민감 설정 암호화 ✅ |
| **Flyway** | DB 마이그레이션 관리 ✅ |

---

## ⚠️ 개선이 필요한 부분

### 1. 단위 테스트 부재 (중요 🔴)

현재 `src/test` 폴더가 없거나 비어있음.

**권장 구조**:
```
src/test/java/com/example/springrest/
├── domain/
│   ├── user/
│   │   ├── controller/UserControllerTest.java
│   │   └── service/UserServiceTest.java
│   └── auth/
│       └── service/AuthServiceTest.java
└── global/
    └── security/JwtTokenProviderTest.java
```

**예시 코드**:
```java
@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    @WithMockUser
    void getAllUsers_ShouldReturnPagedUsers() throws Exception {
        // given
        PageResponse<UserInfo> response = PageResponse.of(...);
        when(userService.getAllUsers(anyInt(), anyInt(), any(), any(), any(), any()))
            .thenReturn(response);

        // when & then
        mockMvc.perform(get("/api/v1/mgmt/users"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.code").value("200"));
    }
}
```

---

### 2. DTO ↔ Entity 변환 로직 분산

현재 `UserService`에 `convertToEntity()` 같은 변환 로직이 직접 포함됨.

**개선안**: MapStruct 도입

```java
// domain/user/model/mapper/UserMapper.java
@Mapper(componentModel = "spring")
public interface UserMapper {
    UserInfo toEntity(UserInfoRequest request);
    UserResponse toResponse(UserInfo entity);
    
    @Mapping(target = "userPwd", ignore = true)
    UserInfo toEntityForUpdate(UserInfoRequest request);
}
```

**build.gradle 추가**:
```gradle
dependencies {
    implementation 'org.mapstruct:mapstruct:1.5.5.Final'
    annotationProcessor 'org.mapstruct:mapstruct-processor:1.5.5.Final'
    annotationProcessor 'org.projectlombok:lombok-mapstruct-binding:0.2.0'
}
```

---

### 3. 공통 CRUD 로직 중복

각 Service에서 CRUD 로직이 반복됨.

**개선안**: 제네릭 Base Service 도입

```java
// common/service/BaseService.java
public abstract class BaseService<T, ID, M extends BaseMapper<T, ID>> {
    
    protected abstract M getMapper();
    
    public PageResponse<T> findAll(int page, int size) {
        PageHelper.startPage(page, size);
        List<T> list = getMapper().findAll();
        PageInfo<T> pageInfo = new PageInfo<>(list);
        return PageResponse.of(pageInfo, list);
    }
    
    public T findById(ID id) {
        return getMapper().findById(id);
    }
    
    @Transactional
    public void create(T entity) {
        getMapper().insert(entity);
    }
    
    @Transactional
    public void update(T entity) {
        getMapper().update(entity);
    }
    
    @Transactional
    public void delete(ID id) {
        getMapper().delete(id);
    }
}

// common/repository/BaseMapper.java
public interface BaseMapper<T, ID> {
    List<T> findAll();
    T findById(ID id);
    void insert(T entity);
    void update(T entity);
    void delete(ID id);
}
```

---

### 4. 정렬 파라미터 SQL Injection 위험 (중요 🔴)

`UserService.camelToSnake()` 후 직접 SQL에 삽입됨.

**개선안**: 화이트리스트 방식으로 검증

```java
// global/util/SortValidator.java
@Component
public class SortValidator {
    
    private static final Map<String, Set<String>> ALLOWED_COLUMNS = Map.of(
        "users", Set.of("user_id", "user_name", "email", "created_dt", "updated_dt"),
        "roles", Set.of("role_id", "role_name", "created_dt"),
        "boards", Set.of("board_id", "title", "created_dt", "view_count")
    );
    
    public String validateAndConvert(String table, String column, String direction) {
        if (column == null || column.isEmpty()) {
            return null;
        }
        
        String snakeCase = camelToSnake(column);
        Set<String> allowed = ALLOWED_COLUMNS.get(table);
        
        if (allowed == null || !allowed.contains(snakeCase)) {
            throw new IllegalArgumentException("Invalid sort column: " + column);
        }
        
        String dir = "desc".equalsIgnoreCase(direction) ? "desc" : "asc";
        return snakeCase + " " + dir;
    }
    
    private String camelToSnake(String str) {
        return str.replaceAll("([a-z])([A-Z]+)", "$1_$2").toLowerCase();
    }
}
```

---

### 5. Auth 도메인 의존성 정리

`auth` 도메인이 `user` 도메인의 Repository를 직접 사용하고 있을 가능성.

**권장**: 인터페이스를 통한 의존성 역전

```java
// domain/auth/service/UserDetailsProvider.java (인터페이스)
public interface UserDetailsProvider {
    Optional<AuthUser> findByUserId(String userId);
    List<String> getUserRoles(String userId);
}

// domain/user/service/UserDetailsProviderImpl.java (구현)
@Service
@RequiredArgsConstructor
public class UserDetailsProviderImpl implements UserDetailsProvider {
    private final UserInfoMapper userInfoMapper;
    private final UserRoleMapper userRoleMapper;
    
    @Override
    public Optional<AuthUser> findByUserId(String userId) {
        UserInfo user = userInfoMapper.findById(userId);
        return Optional.ofNullable(user).map(this::toAuthUser);
    }
}
```

---

### 6. MDC 로깅 추가

**JwtAuthenticationFilter 수정**:
```java
@Override
protected void doFilterInternal(...) {
    try {
        // 요청 ID 생성
        String requestId = UUID.randomUUID().toString().substring(0, 8);
        MDC.put("requestId", requestId);
        
        String token = resolveToken(request);
        if (token != null && jwtTokenProvider.validateToken(token)) {
            String userId = jwtTokenProvider.getUserId(token);
            MDC.put("userId", userId);
            // ... 기존 로직
        }
        
        filterChain.doFilter(request, response);
    } finally {
        MDC.clear();
    }
}
```

**log4j2.xml 패턴 수정**:
```xml
<PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss.SSS} [%t] [%X{requestId}] [%X{userId}] %-5level %logger{36} - %msg%n"/>
```

---

### 7. 파일 업로드 보안 강화

```java
// global/util/FileUploadValidator.java
@Component
public class FileUploadValidator {
    
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
        "jpg", "jpeg", "png", "gif", "pdf", "doc", "docx", "xls", "xlsx"
    );
    
    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    
    public String validateAndSanitize(MultipartFile file) {
        // 파일 크기 검증
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds limit");
        }
        
        // 확장자 검증
        String originalName = file.getOriginalFilename();
        String extension = getExtension(originalName).toLowerCase();
        
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("File type not allowed: " + extension);
        }
        
        // 안전한 파일명 생성
        return UUID.randomUUID() + "." + extension;
    }
    
    private String getExtension(String filename) {
        int lastDot = filename.lastIndexOf('.');
        return lastDot > 0 ? filename.substring(lastDot + 1) : "";
    }
}
```

**application.yml 수정**:
```yaml
app:
  file:
    upload-dir: ${FILE_UPLOAD_DIR:/var/app/uploads}  # 웹루트 외부
    allowed-extensions: jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx
    max-size: 52428800  # 50MB
```

---

### 8. 환경변수 오버라이드 지원

**application.yml**:
```yaml
spring:
  datasource:
    url: ${DB_URL:jdbc:postgresql://localhost:5432/srdb}
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:ENC(암호화된값)}

jwt:
  secret: ${JWT_SECRET:default-dev-secret-key-32-chars-minimum}
  expiration: ${JWT_EXPIRATION:1800000}
  refresh-expiration: ${JWT_REFRESH_EXPIRATION:604800000}

app:
  cors:
    allowed-origins: ${CORS_ORIGINS:http://localhost:3000}
```

---

### 9. API 응답 일관성 개선

현재 일부 예외에서 HTTP 200을 반환하고 있음 (`GlobalExceptionHandler`).

**개선안**: HTTP 상태 코드와 응답 코드 일치

```java
// 현재 (문제)
@ExceptionHandler(IllegalArgumentException.class)
public ResponseEntity<ApiResponse<Void>> handleIllegalArgumentException(...) {
    return ResponseEntity
        .status(HttpStatus.OK)  // ❌ 200 OK
        .body(ApiResponse.error("400", ...));
}

// 개선 후
@ExceptionHandler(IllegalArgumentException.class)
public ResponseEntity<ApiResponse<Void>> handleIllegalArgumentException(...) {
    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)  // ✅ 400 Bad Request
        .body(ApiResponse.error("400", ...));
}
```

---

### 10. Flyway 마이그레이션 네이밍 규칙

**권장 네이밍**:
```
db/migration/
├── V1.0.0__initial_schema.sql
├── V1.0.1__add_user_roles_table.sql
├── V1.1.0__add_boards_module.sql
├── V1.1.1__add_board_files_table.sql
└── R__seed_master_data.sql  # Repeatable migration (시드 데이터)
```

**버전 규칙**:
- `V{major}.{minor}.{patch}__description.sql`
- Major: 대규모 스키마 변경
- Minor: 새 기능/테이블 추가
- Patch: 버그 수정, 인덱스 추가

---

## 📊 우선순위 정리

| 순위 | 작업 | 난이도 | 예상 시간 | 중요도 |
|------|------|--------|----------|--------|
| 1 | 정렬 파라미터 SQL Injection 방지 | 쉬움 | 30분 | 🔴 높음 |
| 2 | 단위 테스트 추가 | 중간 | 2시간 | 🔴 높음 |
| 3 | API 응답 HTTP 상태 코드 일치 | 쉬움 | 15분 | 🔴 높음 |
| 4 | 파일 업로드 보안 강화 | 중간 | 1시간 | 🟡 중간 |
| 5 | MDC 로깅 추가 | 쉬움 | 30분 | 🟡 중간 |
| 6 | DTO/Entity Mapper 분리 (MapStruct) | 중간 | 1시간 | 🟡 중간 |
| 7 | 환경변수 오버라이드 지원 | 쉬움 | 20분 | 🟡 중간 |
| 8 | Auth 도메인 의존성 정리 | 중간 | 1시간 | 🟢 낮음 |
| 9 | Base Service 추상화 | 어려움 | 2시간 | 🟢 낮음 |
| 10 | Flyway 네이밍 규칙 적용 | 쉬움 | 10분 | 🟢 낮음 |

---

## 🎯 목표 패키지 구조

```
com.example.springrest/
├── Application.java
├── common/
│   ├── excel/
│   │   └── ExcelHelper.java
│   ├── repository/
│   │   └── BaseMapper.java
│   └── service/
│       └── BaseService.java
├── domain/
│   ├── auth/
│   │   ├── controller/AuthController.java
│   │   ├── model/
│   │   │   └── dto/LoginRequest.java
│   │   └── service/
│   │       ├── AuthService.java
│   │       └── UserDetailsProvider.java  # 인터페이스
│   ├── user/
│   │   ├── controller/UserController.java
│   │   ├── model/
│   │   │   ├── dto/
│   │   │   ├── entity/
│   │   │   ├── enums/
│   │   │   └── mapper/UserMapper.java  # MapStruct
│   │   ├── repository/UserInfoMapper.java
│   │   └── service/
│   │       ├── UserService.java
│   │       └── UserDetailsProviderImpl.java
│   ├── role/
│   ├── menu/
│   ├── boards/
│   └── order/
└── global/
    ├── config/
    │   ├── JwtProperties.java
    │   ├── MyBatisConfig.java
    │   ├── SecurityConfig.java
    │   └── SwaggerConfig.java
    ├── exception/
    │   ├── AuthenticationException.java
    │   ├── ErrorCode.java
    │   ├── GlobalExceptionHandler.java
    │   └── InvalidTokenException.java
    ├── filter/
    │   └── MdcLoggingFilter.java  # ✨ 추가
    ├── model/
    │   └── dto/
    │       ├── ApiResponse.java
    │       └── PageResponse.java
    ├── security/
    │   ├── JwtAuthenticationFilter.java
    │   └── JwtTokenProvider.java
    └── util/
        ├── FileUploadValidator.java  # ✨ 추가
        └── SortValidator.java        # ✨ 추가
```
