package com.example.springrest.global.util;

import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.SimpleStringPBEConfig;

public class JasyptUtilsTest {

    public static void main(String[] args) {
        String plainPassword = "변경할_새_비밀번호"; // 여기에 실제 비밀번호 입력
        PooledPBEStringEncryptor encryptor = new PooledPBEStringEncryptor();
        SimpleStringPBEConfig config = new SimpleStringPBEConfig();

        // 중요: application.yml의 설정과 정확히 일치해야 합니다.
        config.setPassword("sospringapp"); // 암호화 키 (Master Password)
        config.setAlgorithm("PBEWithMD5AndDES"); // 알고리즘
        config.setKeyObtentionIterations("1000");
        config.setPoolSize("1");
        config.setProviderName("SunJCE");
        config.setSaltGeneratorClassName("org.jasypt.salt.RandomSaltGenerator");
        config.setStringOutputType("base64");

        encryptor.setConfig(config);
        String encryptedNormal = encryptor.encrypt(plainPassword);
        System.out.println("----------------------------------------------");
        System.out.println("Original: " + plainPassword);
        System.out.println("Encrypted: ENC(" + encryptedNormal + ")");
        System.out.println("----------------------------------------------");
    }

}
