---
layout: single
title:  "SQL DB 관련 개념"
categories: DataBase/SQL
tags: [SQL]
---

## 프로시저란?

일련의 명령어들을 모아놓은 것
명령어 집합은 하나의 단위로 작동하며, 반복적으로 수행되어야 하는 작업들을 효율적으로 처리할 수 있다.

예를 들어, 다음과 같은 상황이 주어진 경우에 더 효율적으로 처리할 수 있다.
상황 : SELECT 문을 한번 실행한 이후 그 결과에 따라 INSERT 또는 UPDATE 문을 실행할지 결정하는 코드를 구현해야 한다. 
자바에서는 SELECT 문을 실행하고 결과를 DataSet 에 담아 if 문으로 실행해야한다. 프로시저를 이용하면 이러한 과정이 간소화된다. 하나의 프로시저 안에서 SELECT 문을 실행하고 결과를 변수에 담아 비교할 수 있다. 프로시저를 사용하면 DataSet에 결과를 담을 필요 없어진다.
아래 프로시저 코드는 내 설명을 Chat-GPT로 구현한 결과이다. 프로시저에서는 아래와 같이 하나의 SQL 파일에서 구현이 가능하다.
```SQL
// 프로시저 선언
CREATE PROCEDURE ProcessData
AS
BEGIN
    DECLARE @result INT;

    -- SELECT 문 실행
    SELECT @result = SomeColumn
    FROM SomeTable
    WHERE SomeCondition;

    -- 결과에 따라 INSERT 또는 UPDATE 문 실행
    IF @result IS NULL
    BEGIN
        -- INSERT 문 실행
        INSERT INTO AnotherTable (Column1, Column2)
        VALUES (Value1, Value2);
    END
    ELSE
    BEGIN
        -- UPDATE 문 실행
        UPDATE AnotherTable
        SET Column1 = NewValue1, Column2 = NewValue2
        WHERE SomeCondition;
    END
END
```

## ETL이란?

추출 Extract, 변환 Transform, 적재 Load

한 곳에 저장된 데이터를 필요에 의해 다른 곳으로 이동하는 것.

## SSIS 서비스란?

SQL Server Integration Services
데이터를 ETL 하여 데이터 웨어하우스 구축 및 데이터 통합을 위한 고성능 솔루션 제공

## 정규화란?

데이터베이스 설계 과정에서 중복 데이터를 최소화하고 데이터 일관성을 유지하기 위한 중요한 원칙 중 하나.
정규화는 데이터베이스 테이블을 여러 테이블로 분할하고, 
이러한 테이블 간의 관계를 정의함으로써 데이터를 더 효율적으로 저장하고 관리하는 방법이다.

### 정규화의 목적
1. 중복데이터 제거
2. 데이터 무결성 유지

데이터베이스의 무결성을 유지하는 것은 매우 중요하다. 정규화는 이를 달성하기 위해 데이터를 더 작은 단위로 분리하고, 각 테이블간의 관계를 활용한다. 

### 제 1 정규형 : 1NF
 - 원자값 : 각 열을 더 이상 분해할 수 없는 값을 가져야 함.
 - 고유한 식별자 : 각 행은 Primary Key 를 가져야 함. 이 Primary Key 를 통해 각 행을 고유하게 식별할 수 있어야 한다.
 - 중복데이터 제거

### 제 2 정규형 : 2NF
 - 1NF 만족
 - 부분 종속성 제거 : 테이블의 모든 컬럼이 완전 함수적 종속을 만족해야 한다. 

### 제 3 정규형 : 3NF
 - 2NF 만족
 - 기본키 의존 : 기본키가 아닌 속성들은 기본키에 의존해야 한다.
 정규화의 세 번째 단계로, 2NF를 만족하면서 이행 종속성을 제거하는 것이 목적

### BCNF

### 제 4 정규형 : 4NF
 보통 정규화는 BCNF까지만 하는 경우가 많다. 그 이상 정규화를 하면 정규화의 단점이 보일 수도 있다.
 - 다치 종속성
 - 후보 키의 독립성

### 제 5 정규형 : 5NF
 조인 종속성을 처리하기 위해 추가적인 단계로, 복잡성과 성능 문제로 현실적으로 잘 사용되지 않는다.
 - 4NF 만족
 - 조인 종속성 : 조인 종속성이 없어야 하고, 조인 연산을 했을 때 손실이 없어야 한다.

### 정규화의 단점
테이블의 분해로 인해 데이터베이스 내의 JOIN 연산이 많아져, 쿼리 성능이 저하될 수 있다. 
특히 대규모 데이터베이스에서는 조인 비용이 높아질 수 있다.
따라서 처리 성능이 중요한 데이터에 대해 '반정규화(De-normalization)' 하기도 한다.

## 반 정규화란? 

데이터베이스의 성능 향상을 위하여, 데이터 중복을 허용하고 조인을 줄이는 데이터베이스 성능 향상 방법이다. 
반정규화는 조회(Select) 속도를 향상시키지만, 데이터 모델의 유연성은 낮아진다.   