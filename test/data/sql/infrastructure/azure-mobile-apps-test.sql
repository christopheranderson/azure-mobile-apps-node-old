USE [master]
GO

DROP DATABASE [azure-mobile-apps-test]
GO

CREATE DATABASE [azure-mobile-apps-test]
GO

DROP LOGIN [azure-mobile-apps-test]
GO

/* For security reasons the login is created disabled and with a random password. */
/****** Object:  Login [azure-mobile-apps-test]    Script Date: 6/23/2015 3:37:06 PM ******/
CREATE LOGIN [azure-mobile-apps-test] WITH PASSWORD=N'Blah1234', DEFAULT_DATABASE=[azure-mobile-apps-test], DEFAULT_LANGUAGE=[us_english], CHECK_EXPIRATION=OFF, CHECK_POLICY=OFF
GO

USE [azure-mobile-apps-test]
GO

/****** Object:  User [azure-mobile-apps-test]    Script Date: 6/23/2015 3:36:29 PM ******/
CREATE USER [azure-mobile-apps-test] FOR LOGIN [azure-mobile-apps-test] WITH DEFAULT_SCHEMA=[dbo]
GO
sys.sp_addrolemember @rolename = N'db_owner', @membername = N'azure-mobile-apps-test'
GO
/****** Object:  Table [dbo].[integration]    Script Date: 6/23/2015 3:36:30 PM ******/

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[integration](
	[id] [varchar](50) NOT NULL,
	[string] [varchar](50) NULL,
	[number] [float] NULL,
	[bool] [bit] NULL,
 CONSTRAINT [PK_integration] PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF)
)

GO
/****** Object:  Table [dbo].[query]    Script Date: 6/23/2015 3:36:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[query](
	[id] [varchar](50) NOT NULL,
	[string] [varchar](50) NULL,
	[number] [float] NULL,
	[bool] [bit] NULL,
 CONSTRAINT [PK_query] PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF)
)

GO

INSERT [dbo].[query] ([id], [string], [number], [bool]) VALUES (N'1', N'one', 1, 1)
GO
INSERT [dbo].[query] ([id], [string], [number], [bool]) VALUES (N'2', N'two', 2, 0)
GO
INSERT [dbo].[query] ([id], [string], [number], [bool]) VALUES (N'3', N'three', 3, 1)
GO
INSERT [dbo].[query] ([id], [string], [number], [bool]) VALUES (N'4', N'four', 4, 0)
GO
INSERT [dbo].[query] ([id], [string], [number], [bool]) VALUES (N'5', N'five', 5, 1)
GO
INSERT [dbo].[query] ([id], [string], [number], [bool]) VALUES (N'6', N'six', 6, 0)
GO
