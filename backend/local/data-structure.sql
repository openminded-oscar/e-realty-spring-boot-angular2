-- MySQL dump 10.13  Distrib 8.0.39, for Linux (aarch64)
--
-- Host: localhost    Database: realperfect
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tbl_confirmation_doc_photo`
--

DROP TABLE IF EXISTS `tbl_confirmation_doc_photo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_confirmation_doc_photo` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_interest`
--

DROP TABLE IF EXISTS `tbl_interest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_interest` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `realty_obj_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_object_review`
--

DROP TABLE IF EXISTS `tbl_object_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_object_review` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date_time` datetime(6) DEFAULT NULL,
  `realty_obj_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_object_supported_operations`
--

DROP TABLE IF EXISTS `tbl_object_supported_operations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_object_supported_operations` (
  `object_id` bigint NOT NULL,
  `operation_type` varchar(255) NOT NULL,
  PRIMARY KEY (`object_id`,`operation_type`),
  CONSTRAINT `FK16tnlrynom365bg9klwmdkds6` FOREIGN KEY (`object_id`) REFERENCES `tbl_realty_object` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_realter`
--

DROP TABLE IF EXISTS `tbl_realter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_realter` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `surname` varchar(255) DEFAULT NULL,
  `photo_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKlq595qvh62e511pxd09isdjey` (`photo_id`),
  CONSTRAINT `FKlq595qvh62e511pxd09isdjey` FOREIGN KEY (`photo_id`) REFERENCES `tbl_user_photo` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_realty_object`
--

DROP TABLE IF EXISTS `tbl_realty_object`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_realty_object` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `apt_number` int DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `number_of_street` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `building_type` varchar(255) DEFAULT NULL,
  `confirmed` bit(1) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `dwelling_type` varchar(255) DEFAULT NULL,
  `floor` int DEFAULT NULL,
  `foundation_year` int DEFAULT NULL,
  `has_cellar` bit(1) DEFAULT NULL,
  `has_garage` bit(1) DEFAULT NULL,
  `has_loft` bit(1) DEFAULT NULL,
  `has_repairing` bit(1) DEFAULT NULL,
  `living_area` decimal(19,2) DEFAULT NULL,
  `other_info` varchar(255) DEFAULT NULL,
  `price` decimal(19,2) DEFAULT NULL,
  `realter_aware` bit(1) DEFAULT NULL,
  `rooms_amount` int DEFAULT NULL,
  `total_area` decimal(19,2) DEFAULT NULL,
  `total_floors` int DEFAULT NULL,
  `realty_object_id` bigint DEFAULT NULL,
  `owner_id` bigint DEFAULT NULL,
  `realter_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7ujvwekhjj7mip1e53tmlwtjc` (`realty_object_id`),
  KEY `FKghvmecgfl56awhev42qtql1cd` (`owner_id`),
  KEY `FK4puv7o3577yfw40g3y06ta5e9` (`realter_id`),
  CONSTRAINT `FK4puv7o3577yfw40g3y06ta5e9` FOREIGN KEY (`realter_id`) REFERENCES `tbl_realter` (`id`),
  CONSTRAINT `FK7ujvwekhjj7mip1e53tmlwtjc` FOREIGN KEY (`realty_object_id`) REFERENCES `tbl_confirmation_doc_photo` (`id`),
  CONSTRAINT `FKghvmecgfl56awhev42qtql1cd` FOREIGN KEY (`owner_id`) REFERENCES `tbl_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_realty_object_photo`
--

DROP TABLE IF EXISTS `tbl_realty_object_photo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_realty_object_photo` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) DEFAULT NULL,
  `photo_type` varchar(255) DEFAULT NULL,
  `realty_object_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3xdtttxddk5yolmyhxlgqhyav` (`realty_object_id`),
  CONSTRAINT `FK3xdtttxddk5yolmyhxlgqhyav` FOREIGN KEY (`realty_object_id`) REFERENCES `tbl_realty_object` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_realty_owner`
--

DROP TABLE IF EXISTS `tbl_realty_owner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_realty_owner` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKdi2alf1dspyvn8pmueyecmga6` (`user_id`),
  CONSTRAINT `FKdi2alf1dspyvn8pmueyecmga6` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_realty_searcher`
--

DROP TABLE IF EXISTS `tbl_realty_searcher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_realty_searcher` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKmkntj7n1w7jkfw59qv3onh5er` (`user_id`),
  CONSTRAINT `FKmkntj7n1w7jkfw59qv3onh5er` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_role`
--

DROP TABLE IF EXISTS `tbl_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_role` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_user`
--

DROP TABLE IF EXISTS `tbl_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `google_user_id_token_subject` varchar(255) DEFAULT NULL,
  `login` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `surname` varchar(255) DEFAULT NULL,
  `realter_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKrj96m2s4qg3gfls7bskw7t9dw` (`realter_id`),
  CONSTRAINT `FKrj96m2s4qg3gfls7bskw7t9dw` FOREIGN KEY (`realter_id`) REFERENCES `tbl_realter` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_user_photo`
--

DROP TABLE IF EXISTS `tbl_user_photo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_user_photo` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_user_role`
--

DROP TABLE IF EXISTS `tbl_user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_user_role` (
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FK6phlytlf1w3h9vutsu019xor5` (`role_id`),
  CONSTRAINT `FK6phlytlf1w3h9vutsu019xor5` FOREIGN KEY (`role_id`) REFERENCES `tbl_role` (`id`),
  CONSTRAINT `FKggc6wjqokl2vlw89y22a1j2oh` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-26 11:22:38
