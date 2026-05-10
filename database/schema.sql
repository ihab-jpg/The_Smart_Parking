-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: parkingdb
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `costumer`
--

DROP TABLE IF EXISTS `costumer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `costumer` (
  `CostumerID` int NOT NULL AUTO_INCREMENT,
  `FullName` varchar(30) NOT NULL,
  `CarType` varchar(50) NOT NULL,
  `CarPlateNB` varchar(8) NOT NULL,
  `DriverLicenseEXPdate` date NOT NULL,
  `Balance` int NOT NULL,
  PRIMARY KEY (`CostumerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `parkingfloor`
--

DROP TABLE IF EXISTS `parkingfloor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parkingfloor` (
  `ParkingFloorID` int NOT NULL AUTO_INCREMENT,
  `FloorNb` int NOT NULL,
  `TotalSize` int NOT NULL,
  `CapacityPercentage` int NOT NULL,
  `GeneralShape` varchar(10) DEFAULT NULL,
  `ParkingLotID` int NOT NULL,
  PRIMARY KEY (`ParkingFloorID`),
  KEY `ParkingLotID` (`ParkingLotID`),
  CONSTRAINT `parkingfloor_ibfk_1` FOREIGN KEY (`ParkingLotID`) REFERENCES `parkinglot` (`ParkingLotID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `parkingline`
--

DROP TABLE IF EXISTS `parkingline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parkingline` (
  `ParkingLineID` int NOT NULL AUTO_INCREMENT,
  `Letter` char(1) NOT NULL,
  `TotalSize` int NOT NULL,
  `CapacityPercentage` int NOT NULL,
  `ParkingFloorID` int NOT NULL,
  PRIMARY KEY (`ParkingLineID`),
  KEY `ParkingFloorID` (`ParkingFloorID`),
  CONSTRAINT `parkingline_ibfk_1` FOREIGN KEY (`ParkingFloorID`) REFERENCES `parkingfloor` (`ParkingFloorID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `parkinglot`
--

DROP TABLE IF EXISTS `parkinglot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parkinglot` (
  `ParkingLotID` int NOT NULL AUTO_INCREMENT,
  `ParkingName` varchar(50) NOT NULL,
  `Location` varchar(100) NOT NULL,
  `TotalSize` int NOT NULL,
  `CapacityPercentage` int NOT NULL,
  PRIMARY KEY (`ParkingLotID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `parkingspot`
--

DROP TABLE IF EXISTS `parkingspot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parkingspot` (
  `ParkingSpotID` int NOT NULL AUTO_INCREMENT,
  `Listing` varchar(20) NOT NULL,
  `Status` enum('Occupied','available') NOT NULL,
  `PermenantlyReserved` tinyint(1) NOT NULL DEFAULT '0',
  `ParkingLineID` int NOT NULL,
  `CostumerID` int NOT NULL,
  PRIMARY KEY (`ParkingSpotID`),
  KEY `ParkingLineID` (`ParkingLineID`),
  KEY `CostumerID` (`CostumerID`),
  CONSTRAINT `parkingspot_ibfk_1` FOREIGN KEY (`ParkingLineID`) REFERENCES `parkingline` (`ParkingLineID`),
  CONSTRAINT `parkingspot_ibfk_2` FOREIGN KEY (`CostumerID`) REFERENCES `costumer` (`CostumerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rating`
--

DROP TABLE IF EXISTS `rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rating` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `price` int NOT NULL,
  PRIMARY KEY (`ID`)
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

-- Dump completed on 2026-05-07 21:30:14
