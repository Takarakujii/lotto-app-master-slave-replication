-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 30, 2025 at 05:02 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lotto_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `bets`
--

CREATE TABLE `bets` (
  `bet_id` int(6) NOT NULL,
  `user_id` int(6) NOT NULL,
  `bet_amount` int(50) NOT NULL,
  `bet_number` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `draw_id` int(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bets`
--

INSERT INTO `bets` (`bet_id`, `user_id`, `bet_amount`, `bet_number`, `created_at`, `draw_id`) VALUES
(164, 12, 50, '16-17-18-19-20-25', '2025-03-28 15:07:33', 514),
(1223, 20, 50, '11-16-06-13-17-22', '2025-03-29 09:02:45', 1197);

-- --------------------------------------------------------

--
-- Table structure for table `draw`
--

CREATE TABLE `draw` (
  `draw_id` int(6) NOT NULL,
  `winning_number` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `draw`
--

INSERT INTO `draw` (`draw_id`, `winning_number`, `created_at`) VALUES
(363, '39-10-22-09-01-36', '2025-03-28 10:03:05'),
(1208, '40-06-39-30-42-17', '2025-03-30 10:24:53'),
(1209, '21-18-04-30-25-01', '2025-03-30 10:25:55');

-- --------------------------------------------------------

--
-- Table structure for table `pot`
--

CREATE TABLE `pot` (
  `pot_id` int(6) NOT NULL,
  `pot_amount` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pot`
--

INSERT INTO `pot` (`pot_id`, `pot_amount`) VALUES
(1, 1000250);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(6) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `birth_date` date NOT NULL,
  `user_balance` int(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `birth_date`, `user_balance`, `password`, `created_at`) VALUES
(1, 'testuser', 'test@example.com', '2000-01-01', 100, '03592efb9b1f5bfadb289e1f8d504feab89aaebf04695830b34c52b4105b216a', '2025-03-12 18:43:48'),
(3, 'paul', 'johnpaul@example.com', '2000-01-01', 1000, '42cdb8c6b59b559993f18d73d60d47d64c926a6eeaf34371927b00ce534e11a7', '2025-03-12 18:43:48'),
(4, 'testUserr', 'tersbnct@example.com', '1980-02-01', 0, '3d7b2bdc0412f66654fbf6c4ad90acef477fb3cec21e77c49e3a96272d6dfa51', '2025-03-12 18:43:48'),
(5, 'testUsefvrr', 'tersbnct@exampvfle.com', '1980-02-01', 0, '15230b306cd3fa5bbdd7e6e643a0a1cf163e4f2e746a42c7391af2b7c6617434', '2025-03-12 18:43:48'),
(6, 'popol', 'nathi@gmail.com', '2025-02-26', 0, '451b254ccd4aa59da8ceb6626980028466ada8457718c02aa1a858c62e2d4dd6', '2025-03-12 18:43:48'),
(7, 'niga', 'nig@gmail.cog', '2025-02-25', 0, 'cbf8e0c134f6fda4cd4087a623e8b7aae4d72bf21f2e0943c8205d52825259c3', '2025-03-12 18:43:48'),
(8, 'paul45', 'paul@gamil.com', '2025-03-20', 0, 'fbf6b7bf6457035be80954769e29a3506fc3555f509bbd11ed7e7b13fbd09ffb', '2025-03-12 18:43:48'),
(9, 'popo', 'popo@gg.com', '2025-03-01', 0, 'bc75334274ffde48bcbd538d179ed0a94f48e3251307a22239a7c4bc5c0d8dd7', '2025-03-12 18:43:48'),
(10, 'o', 'nika@gmail.com', '2025-04-05', 1521995, '91b8134bf9ba5bdc0c486416f5449d0583a57a499ba3369bff8dc3b558bfc16f', '2025-03-12 19:38:13'),
(11, 'pi', 'pigmail@Gmail.com', '2025-03-13', 0, '6a488ee8cbc6c1df5d9f7ed1c2ad21bf5893234fe599d803fb76b827eb13c220', '2025-03-15 00:34:27'),
(12, 'i', 'asas@gmail.com', '2025-02-28', 65623525, '10d296ace250e48c54825f3aceedf39a4cd80b516de6d3877a717005fd01af4e', '2025-03-15 00:37:47'),
(13, 'k', 'john@gmail.com', '2025-03-02', 0, 'ab8235812352dc346a730ee588112cde5b61af9d4e265fbe5e9c48134e731c8e', '2025-03-15 04:09:05'),
(14, '9', 'nathtti@gmail.com', '2025-02-28', 100, 'fb7f6b693f53b9d7bdd7503b8fdf454c27fe4d89b9130437b2ef060ecc756433', '2025-03-19 20:17:34'),
(15, 'johnpaul', 'johnpaul@gmail.com', '3456-04-01', 0, 'dfb867faa3d268f0b528868fb0e283f30911cc11375590c082e93d0369d87989', '2025-03-28 16:10:44'),
(16, 'jung', 'jungpaul@gmail.com', '0000-00-00', 0, '592767fddd8ce93ff3e5dee4bf92e34faad963c93fa203599fc1258acd329677', '2025-03-28 16:14:31'),
(17, 'aaa', 'aaa@gmail.com', '2003-10-12', 209588, '6c97f118bc015e1257196cfa420d0b4b17b2310dfa34a03e4a601a7d1fd83d7d', '2025-03-28 16:22:35'),
(18, 'Paul', 'papa@gmail.com', '3002-10-10', 1050, '35b6676a1469d3bd94c7f0f52c9a1edd623790c5aa1e197b018ca16be83b1900', '2025-03-29 07:25:23'),
(19, 'Pit', 'mamo@gmail.com', '5455-03-04', 500, '533e4f4673dbc7add03149a0771739a8c57af97088a68eaf1ce64dd8d065bdb7', '2025-03-29 07:26:56'),
(20, 'pap', 'pap@gmail.com', '1010-10-20', 0, 'c15ff56f29ace1f6e1b380ca52c47686271476a52fbbffe832a55ea811960521', '2025-03-29 08:08:34'),
(21, 'clap', 'clap@gmail.com', '2002-02-02', 100, 'dca6b05a4c891ed83c5ca11cf660e054ccc051616c18cfa2f94e3cbd726cabf7', '2025-03-29 08:11:20');

-- --------------------------------------------------------

--
-- Table structure for table `win_result`
--

CREATE TABLE `win_result` (
  `result_id` int(6) NOT NULL,
  `user_id` int(6) NOT NULL,
  `bet_id` int(6) NOT NULL,
  `draw_id` int(6) NOT NULL,
  `winning_prize` int(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `win_result`
--

INSERT INTO `win_result` (`result_id`, `user_id`, `bet_id`, `draw_id`, `winning_prize`, `created_at`) VALUES
(52, 12, 175, 533, 1002450, '2025-03-28 15:47:31'),

(1114, 17, 673, 659, 172, '2025-03-28 17:08:08');
INSERT INTO `win_result` (`result_id`, `user_id`, `bet_id`, `draw_id`, `winning_prize`, `created_at`) VALUES
(1115, 17, 685, 658, 172, '2025-03-28 17:08:08'),
(1340, 12, 1217, 1071, 500225, '2025-03-29 05:28:50'),
(1341, 12, 1218, 1071, 500225, '2025-03-29 05:28:50');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bets`
--
ALTER TABLE `bets`
  ADD PRIMARY KEY (`bet_id`),
  ADD KEY `fk_user_id` (`user_id`),
  ADD KEY `draw_id` (`draw_id`);

--
-- Indexes for table `draw`
--
ALTER TABLE `draw`
  ADD PRIMARY KEY (`draw_id`);

--
-- Indexes for table `pot`
--
ALTER TABLE `pot`
  ADD PRIMARY KEY (`pot_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `win_result`
--
ALTER TABLE `win_result`
  ADD PRIMARY KEY (`result_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `bet_id` (`bet_id`),
  ADD KEY `fk_draw_id` (`draw_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bets`
--
ALTER TABLE `bets`
  MODIFY `bet_id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1224;

--
-- AUTO_INCREMENT for table `draw`
--
ALTER TABLE `draw`
  MODIFY `draw_id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1210;

--
-- AUTO_INCREMENT for table `pot`
--
ALTER TABLE `pot`
  MODIFY `pot_id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `win_result`
--
ALTER TABLE `win_result`
  MODIFY `result_id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1342;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bets`
--
ALTER TABLE `bets`
  ADD CONSTRAINT `draw_id` FOREIGN KEY (`draw_id`) REFERENCES `draw` (`draw_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `win_result`
--
ALTER TABLE `win_result`
  ADD CONSTRAINT `bet_id` FOREIGN KEY (`bet_id`) REFERENCES `bets` (`bet_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_draw_id` FOREIGN KEY (`draw_id`) REFERENCES `draw` (`draw_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
