-- MySQL dump 10.16  Distrib 10.1.37-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: ticket_manager
-- ------------------------------------------------------
-- Server version	10.1.37-MariaDB-0+deb9u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `project_config`
--

DROP TABLE IF EXISTS `project_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_config` (
  `id` int(6) unsigned NOT NULL,
  `ip_addr` varchar(20) DEFAULT NULL,
  `port` varchar(10) DEFAULT NULL,
  `qr_code` text,
  KEY `id` (`id`),
  CONSTRAINT `project_config_ibfk_1` FOREIGN KEY (`id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_config`
--

LOCK TABLES `project_config` WRITE;
/*!40000 ALTER TABLE `project_config` DISABLE KEYS */;
INSERT INTO `project_config` VALUES (2,'192.168.0.107','3002',NULL);
/*!40000 ALTER TABLE `project_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_handlers`
--

DROP TABLE IF EXISTS `project_handlers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_handlers` (
  `id` int(6) unsigned NOT NULL,
  `username` varchar(100) NOT NULL,
  KEY `id` (`id`),
  KEY `username` (`username`),
  CONSTRAINT `project_handlers_ibfk_1` FOREIGN KEY (`id`) REFERENCES `projects` (`id`),
  CONSTRAINT `project_handlers_ibfk_2` FOREIGN KEY (`username`) REFERENCES `users` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_handlers`
--

LOCK TABLES `project_handlers` WRITE;
/*!40000 ALTER TABLE `project_handlers` DISABLE KEYS */;
INSERT INTO `project_handlers` VALUES (2,'abinp'),(2,'ahmednr123');
/*!40000 ALTER TABLE `project_handlers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `description` text,
  `birthday` datetime DEFAULT NULL,
  `repo_name` varchar(100) NOT NULL,
  `repo_type` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `repo_name` (`repo_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (2,'Consumer Application [Chillar]','0','2019-01-24 15:32:41','empty','consumer_chlr');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_handlers`
--

DROP TABLE IF EXISTS `ticket_handlers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ticket_handlers` (
  `id` int(10) unsigned NOT NULL,
  `username` varchar(100) NOT NULL,
  KEY `id` (`id`),
  KEY `username` (`username`),
  CONSTRAINT `ticket_handlers_ibfk_1` FOREIGN KEY (`id`) REFERENCES `tickets` (`id`),
  CONSTRAINT `ticket_handlers_ibfk_2` FOREIGN KEY (`username`) REFERENCES `users` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_handlers`
--

LOCK TABLES `ticket_handlers` WRITE;
/*!40000 ALTER TABLE `ticket_handlers` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticket_handlers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_hierarchy`
--

DROP TABLE IF EXISTS `ticket_hierarchy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ticket_hierarchy` (
  `id` int(10) unsigned NOT NULL,
  `child_id` int(10) unsigned NOT NULL,
  KEY `id` (`id`),
  KEY `child_id` (`child_id`),
  CONSTRAINT `ticket_hierarchy_ibfk_1` FOREIGN KEY (`id`) REFERENCES `tickets` (`id`),
  CONSTRAINT `ticket_hierarchy_ibfk_2` FOREIGN KEY (`child_id`) REFERENCES `tickets` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_hierarchy`
--

LOCK TABLES `ticket_hierarchy` WRITE;
/*!40000 ALTER TABLE `ticket_hierarchy` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticket_hierarchy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tickets` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `description` text,
  `documentation` text,
  `priority` int(11) NOT NULL,
  `birthday` datetime NOT NULL,
  `deathday` datetime DEFAULT NULL,
  `parent` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tokens`
--

DROP TABLE IF EXISTS `tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tokens` (
  `token` text,
  `username` varchar(100) DEFAULT NULL,
  `label` varchar(100) DEFAULT NULL,
  `birthdate` datetime DEFAULT NULL,
  `deathdate` datetime DEFAULT NULL,
  KEY `username` (`username`),
  CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tokens`
--

LOCK TABLES `tokens` WRITE;
/*!40000 ALTER TABLE `tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_ssh`
--

DROP TABLE IF EXISTS `user_ssh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_ssh` (
  `username` varchar(100) DEFAULT NULL,
  `ssh_pub` text,
  `name` varchar(100) NOT NULL,
  `added_on` datetime NOT NULL,
  PRIMARY KEY (`name`),
  KEY `username` (`username`),
  CONSTRAINT `user_ssh_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_ssh`
--

LOCK TABLES `user_ssh` WRITE;
/*!40000 ALTER TABLE `user_ssh` DISABLE KEYS */;
INSERT INTO `user_ssh` VALUES ('abinp','ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDlKjghIDeIMntE2cDvHz4qE16THnWbOF48fE4rFssoKhhT+OXrLUyPafgslYIUmhW2/gFw0vuavK+ercaItzt13OkGygo0N5Czvrc+Kh8QhjjFv/A3IlRDlCkG2fP2qDDKQohg1th1YjXb62iZICIqkAt0eL5xRksAlb1zj57laDCRz0IfK4lBigeAEKD+pHg95oasD2duTY3RoCKxSvkX9dODtAhemnRvpoCTqMjpge7vwOfYTON1beX3JHJ5Zp/5GK92/Krz0vuaEbDiDm9n0pzJBzroErHHWs6KVrks9C1LBdaRZiPQ5xoGId3N7uNqJ9w4rcpR8pdCDXCYgt8J abinp1012@gmail.com\n','first_key','2019-01-21 17:01:54'),('ahmednr123','ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDELYY2ZpuzFOeZbNaSu8WLUgAxs2yQa8M0R98pJZcYlxK/3bSP9krTPWa7ZhVWRQkNljAUo6Y7S1CTc/L4rVgY62HNOaKsfQIxVrjttEjOdrx1zd2ZYdz/lq++W5Z5k2peae2LQxv7jy+3VUPCvTeeuAzdVx4XafEaT42Ot7Bl/bNLBhCDsaRWIuLq4SPBxMkFz+6YSFK/kBuuLOc3cc4Tn4yTN1pfHCx6Rl5yBWlzltgjMg3CrhAmLmXaezg8j+J8EKZ8i+OFF0RTSYRzgO75cQQQZRYnsRxvr93Z0ZApfgV43l/vA292yj3GLDK2AQ41Kpt/YaSzbLKaJ3vFd8QT ahmednr123@gmail.com\n','my_first_key','2019-01-21 16:18:03');
/*!40000 ALTER TABLE `user_ssh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(256) NOT NULL,
  `type` varchar(64) DEFAULT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('abinp','abinp1012@gmail.com','d7bbe985baefe8c5:ce2bf64766ac16ac6a78da33fa6fb1c04f5d1498fa579a14fa8a2a3c17cdd055','user','Abin P','8197998510'),('ahmednr123','ahmednr123@gmail.com','66611171ea32a744:13a785718ac7b62abf4593fe5fa8d4b0902a1285caafc6f9f311e33bc6d7a044','superuser','Ahmed Noor','8710073068');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-01-25 14:51:45
