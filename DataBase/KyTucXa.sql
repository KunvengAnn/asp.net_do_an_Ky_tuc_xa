USE [master]
GO
/****** Object:  Database [QuanlyKyTucXa]    Script Date: 11/28/2023 2:09:46 PM ******/
CREATE DATABASE [QuanlyKyTucXa]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'QuanlyKyTucXa', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\QuanlyKyTucXa.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'QuanlyKyTucXa_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\QuanlyKyTucXa_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [QuanlyKyTucXa] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [QuanlyKyTucXa].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [QuanlyKyTucXa] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [QuanlyKyTucXa] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [QuanlyKyTucXa] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [QuanlyKyTucXa] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [QuanlyKyTucXa] SET ARITHABORT OFF 
GO
ALTER DATABASE [QuanlyKyTucXa] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [QuanlyKyTucXa] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [QuanlyKyTucXa] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [QuanlyKyTucXa] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [QuanlyKyTucXa] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [QuanlyKyTucXa] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [QuanlyKyTucXa] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [QuanlyKyTucXa] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [QuanlyKyTucXa] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [QuanlyKyTucXa] SET  DISABLE_BROKER 
GO
ALTER DATABASE [QuanlyKyTucXa] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [QuanlyKyTucXa] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [QuanlyKyTucXa] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [QuanlyKyTucXa] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [QuanlyKyTucXa] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [QuanlyKyTucXa] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [QuanlyKyTucXa] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [QuanlyKyTucXa] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [QuanlyKyTucXa] SET  MULTI_USER 
GO
ALTER DATABASE [QuanlyKyTucXa] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [QuanlyKyTucXa] SET DB_CHAINING OFF 
GO
ALTER DATABASE [QuanlyKyTucXa] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [QuanlyKyTucXa] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [QuanlyKyTucXa] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [QuanlyKyTucXa] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [QuanlyKyTucXa] SET QUERY_STORE = ON
GO
ALTER DATABASE [QuanlyKyTucXa] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [QuanlyKyTucXa]
GO
/****** Object:  Table [dbo].[ChiTiet_HoaDon_Dien_Nuoc]    Script Date: 11/28/2023 2:09:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ChiTiet_HoaDon_Dien_Nuoc](
	[MaHD] [nvarchar](50) NOT NULL,
	[MaDienNuoc] [nvarchar](50) NOT NULL,
	[DonGiaDien] [float] NOT NULL,
	[DonGiaNuoc] [float] NOT NULL,
	[ThanhTienDien] [float] NOT NULL,
	[ThanTienNuoc] [float] NOT NULL,
 CONSTRAINT [PK_ChiTiet_HoaDon_Dien_Nuoc] PRIMARY KEY CLUSTERED 
(
	[MaHD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Dien_Nuoc]    Script Date: 11/28/2023 2:09:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Dien_Nuoc](
	[MaDienNuoc] [nvarchar](50) NOT NULL,
	[MaPhong] [nvarchar](50) NOT NULL,
	[SoDienDau] [int] NOT NULL,
	[SoDienCuoi] [int] NOT NULL,
	[SoNuocDau] [int] NOT NULL,
	[SoNuocCuoi] [int] NOT NULL,
	[NgayGhiSo] [date] NOT NULL,
 CONSTRAINT [PK_Dien_Nuoc] PRIMARY KEY CLUSTERED 
(
	[MaDienNuoc] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Hoa_Don_Dien_Nuoc]    Script Date: 11/28/2023 2:09:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Hoa_Don_Dien_Nuoc](
	[MaHD] [nvarchar](50) NOT NULL,
	[MaPhong] [nvarchar](50) NOT NULL,
	[NgayLap] [date] NOT NULL,
	[TongTien] [float] NOT NULL,
 CONSTRAINT [PK_Hoa_Don_Dien_Nuoc] PRIMARY KEY CLUSTERED 
(
	[MaHD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Hop_Dong]    Script Date: 11/28/2023 2:09:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Hop_Dong](
	[Mahopdong] [nvarchar](50) NOT NULL,
	[Masv] [nvarchar](50) NOT NULL,
	[MaPhong] [nvarchar](50) NOT NULL,
	[NgayBatDau] [date] NOT NULL,
	[NgayKetThuc] [date] NOT NULL,
 CONSTRAINT [PK_Hop_Dong] PRIMARY KEY CLUSTERED 
(
	[Mahopdong] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LoaiPhong]    Script Date: 11/28/2023 2:09:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LoaiPhong](
	[MaLoaiPhong] [nvarchar](50) NOT NULL,
	[TenLoaiPhong] [nvarchar](50) NOT NULL,
	[DonGiaPhong] [float] NOT NULL,
 CONSTRAINT [PK_MaLoaiPhong] PRIMARY KEY CLUSTERED 
(
	[MaLoaiPhong] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Phong]    Script Date: 11/28/2023 2:09:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Phong](
	[MaPhong] [nvarchar](50) NOT NULL,
	[TenPhong] [nvarchar](50) NOT NULL,
	[MaLoaiPhong] [nvarchar](50) NOT NULL,
	[SoNguoi] [int] NOT NULL,
 CONSTRAINT [PK_Phong] PRIMARY KEY CLUSTERED 
(
	[MaPhong] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Sinh_Vien]    Script Date: 11/28/2023 2:09:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Sinh_Vien](
	[Masv] [nvarchar](50) NOT NULL,
	[Tensv] [nvarchar](50) NOT NULL,
	[Ngaysinh] [date] NOT NULL,
	[GioiTInh] [bit] NOT NULL,
	[Sdt] [nvarchar](12) NULL,
	[Lop] [nvarchar](50) NULL,
 CONSTRAINT [PK_Sinh_Vien] PRIMARY KEY CLUSTERED 
(
	[Masv] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[ChiTiet_HoaDon_Dien_Nuoc] ([MaHD], [MaDienNuoc], [DonGiaDien], [DonGiaNuoc], [ThanhTienDien], [ThanTienNuoc]) VALUES (N'mh01', N'MDN01', 5000, 7000, 70000, 378000)
GO
INSERT [dbo].[Dien_Nuoc] ([MaDienNuoc], [MaPhong], [SoDienDau], [SoDienCuoi], [SoNuocDau], [SoNuocCuoi], [NgayGhiSo]) VALUES (N'MDN01', N'Mp01', 456, 470, 346, 400, CAST(N'2023-11-25' AS Date))
GO
INSERT [dbo].[Hoa_Don_Dien_Nuoc] ([MaHD], [MaPhong], [NgayLap], [TongTien]) VALUES (N'mh01', N'Mp01', CAST(N'2023-11-28' AS Date), 448000)
INSERT [dbo].[Hoa_Don_Dien_Nuoc] ([MaHD], [MaPhong], [NgayLap], [TongTien]) VALUES (N'test', N'Mp02', CAST(N'2023-11-28' AS Date), 1900)
GO
INSERT [dbo].[Hop_Dong] ([Mahopdong], [Masv], [MaPhong], [NgayBatDau], [NgayKetThuc]) VALUES (N'mh01', N'Ma01', N'Mp01', CAST(N'2022-11-13' AS Date), CAST(N'2023-11-11' AS Date))
INSERT [dbo].[Hop_Dong] ([Mahopdong], [Masv], [MaPhong], [NgayBatDau], [NgayKetThuc]) VALUES (N'mh02', N'Ma02', N'Mp02', CAST(N'2023-11-27' AS Date), CAST(N'2024-11-27' AS Date))
GO
INSERT [dbo].[LoaiPhong] ([MaLoaiPhong], [TenLoaiPhong], [DonGiaPhong]) VALUES (N'Ml01', N'moi', 1200000)
INSERT [dbo].[LoaiPhong] ([MaLoaiPhong], [TenLoaiPhong], [DonGiaPhong]) VALUES (N'Ml02 ', N'moi', 1200000)
GO
INSERT [dbo].[Phong] ([MaPhong], [TenPhong], [MaLoaiPhong], [SoNguoi]) VALUES (N'Mp01', N'k1-101', N'Ml01', 1)
INSERT [dbo].[Phong] ([MaPhong], [TenPhong], [MaLoaiPhong], [SoNguoi]) VALUES (N'Mp02', N'k1-102', N'Ml02 ', 1)
GO
INSERT [dbo].[Sinh_Vien] ([Masv], [Tensv], [Ngaysinh], [GioiTInh], [Sdt], [Lop]) VALUES (N'Ma01', N'Nguyen Van A', CAST(N'2000-02-13' AS Date), 1, N'0123468', N'K56kdt')
INSERT [dbo].[Sinh_Vien] ([Masv], [Tensv], [Ngaysinh], [GioiTInh], [Sdt], [Lop]) VALUES (N'Ma02', N'Nguyen Van B', CAST(N'2023-11-08' AS Date), 0, N'05648523', N'k56ktt')
INSERT [dbo].[Sinh_Vien] ([Masv], [Tensv], [Ngaysinh], [GioiTInh], [Sdt], [Lop]) VALUES (N'test', N'test1', CAST(N'2023-11-23' AS Date), 1, N'0455611', N'test1')
GO
ALTER TABLE [dbo].[ChiTiet_HoaDon_Dien_Nuoc]  WITH CHECK ADD  CONSTRAINT [FK_ChiTiet_HoaDon_Dien_Nuoc_ChiTiet_HoaDon_Dien_Nuoc] FOREIGN KEY([MaDienNuoc])
REFERENCES [dbo].[Dien_Nuoc] ([MaDienNuoc])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ChiTiet_HoaDon_Dien_Nuoc] CHECK CONSTRAINT [FK_ChiTiet_HoaDon_Dien_Nuoc_ChiTiet_HoaDon_Dien_Nuoc]
GO
ALTER TABLE [dbo].[ChiTiet_HoaDon_Dien_Nuoc]  WITH CHECK ADD  CONSTRAINT [FK_ChiTiet_HoaDon_Dien_Nuoc_Dien_Nuoc] FOREIGN KEY([MaHD])
REFERENCES [dbo].[Hoa_Don_Dien_Nuoc] ([MaHD])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ChiTiet_HoaDon_Dien_Nuoc] CHECK CONSTRAINT [FK_ChiTiet_HoaDon_Dien_Nuoc_Dien_Nuoc]
GO
ALTER TABLE [dbo].[Hoa_Don_Dien_Nuoc]  WITH CHECK ADD  CONSTRAINT [FK_Hoa_Don_Dien_Nuoc_Phong] FOREIGN KEY([MaPhong])
REFERENCES [dbo].[Phong] ([MaPhong])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Hoa_Don_Dien_Nuoc] CHECK CONSTRAINT [FK_Hoa_Don_Dien_Nuoc_Phong]
GO
ALTER TABLE [dbo].[Hop_Dong]  WITH CHECK ADD  CONSTRAINT [FK_Hop_Dong_Phong] FOREIGN KEY([MaPhong])
REFERENCES [dbo].[Phong] ([MaPhong])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Hop_Dong] CHECK CONSTRAINT [FK_Hop_Dong_Phong]
GO
ALTER TABLE [dbo].[Hop_Dong]  WITH CHECK ADD  CONSTRAINT [FK_Hop_Dong_Sinh_Vien] FOREIGN KEY([Masv])
REFERENCES [dbo].[Sinh_Vien] ([Masv])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Hop_Dong] CHECK CONSTRAINT [FK_Hop_Dong_Sinh_Vien]
GO
ALTER TABLE [dbo].[Phong]  WITH CHECK ADD  CONSTRAINT [FK_Phong_LoaiPhong] FOREIGN KEY([MaLoaiPhong])
REFERENCES [dbo].[LoaiPhong] ([MaLoaiPhong])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Phong] CHECK CONSTRAINT [FK_Phong_LoaiPhong]
GO
/****** Object:  StoredProcedure [dbo].[SP_ChiTiet_HoaDon_DienNuoc]    Script Date: 11/28/2023 2:09:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_ChiTiet_HoaDon_DienNuoc]
	@action varchar(50) = null,
	@MaHD nvarchar(50) = null,
	@MaDienNuoc nvarchar(50) = null,
	@DonGiaDien float = null,
	@DonGiaNuoc float = null,
	@ThanhTienDien float = null,
	@ThanhTienNuoc float = null
	
AS
BEGIN
	IF(@action='DsCT_HD_DienNuoc')
	BEGIN
		SELECT CT.MaHD,CT.MaDienNuoc,DN.SoDienDau,DN.SoDienCuoi,DN.SoNuocDau,DN.SoNuocCuoi,CT.DonGiaDien,CT.DonGiaNuoc,CT.ThanhTienDien,CT.ThanTienNuoc FROM ChiTiet_HoaDon_Dien_Nuoc CT
		INNER JOIN Dien_Nuoc DN ON DN.MaDienNuoc=CT.MaDienNuoc;
	END
	ELSE IF(@action='AddCT_HD_DienNuoc')
	BEGIN
		DECLARE @TongTien float = 0;
		SELECT @ThanhTienDien=(SoDienCuoi-SoDienDau),@ThanhTienNuoc=(SoNuocCuoi-SoNuocDau) FROM Dien_Nuoc WHERE MaDienNuoc=@MaDienNuoc ;
		
		INSERT INTO ChiTiet_HoaDon_Dien_Nuoc(MaHD,MaDienNuoc,DonGiaDien,DonGiaNuoc,ThanhTienDien,ThanTienNuoc)
		VALUES(@MaHD,@MaDienNuoc,@DonGiaDien,@DonGiaNuoc,(@ThanhTienDien*@DonGiaDien),(@ThanhTienNuoc*@DonGiaNuoc));

		SELECT @TongTien=SUM((@ThanhTienDien*@DonGiaDien)+(@ThanhTienNuoc*@DonGiaNuoc)) FROM ChiTiet_HoaDon_Dien_Nuoc WHERE MaHD=@MaHD
		UPDATE Hoa_Don_Dien_Nuoc SET TongTien=@TongTien WHERE MaHD=@MaHD;
	END
	ELSE IF(@action='UpdateCT_HD_DienNuoc')
	BEGIN
		UPDATE ChiTiet_HoaDon_Dien_Nuoc SET MaDienNuoc=@MaDienNuoc,DonGiaDien=@DonGiaDien,DonGiaNuoc=@DonGiaNuoc WHERE MaHD=@MaHD;
		
		SELECT @ThanhTienDien=(SoDienCuoi-SoDienDau)*(@DonGiaDien),@ThanhTienNuoc=(SoNuocCuoi-SoNuocDau)*(@DonGiaNuoc) FROM Dien_Nuoc WHERE MaDienNuoc=@MaDienNuoc ;
		
		UPDATE ChiTiet_HoaDon_Dien_Nuoc SET ThanhTienDien=@ThanhTienDien,ThanTienNuoc=@ThanhTienNuoc;

		SELECT @TongTien=SUM(@ThanhTienDien+@ThanhTienNuoc) FROM ChiTiet_HoaDon_Dien_Nuoc WHERE MaHD=@MaHD
		UPDATE Hoa_Don_Dien_Nuoc SET TongTien=@TongTien WHERE MaHD=@MaHD;
	END
	ELSE IF(@action='DeleteCT_HD_DienNuoc')
	BEGIN
		DELETE FROM ChiTiet_HoaDon_Dien_Nuoc WHERE MaHD=@MaHD;
	END
	ELSE IF(@action='MaHDDienNuoc')
	BEGIN
		SELECT DN.MaDienNuoc,DN.MaPhong,DN.NgayGhiSo FROM Dien_Nuoc DN
		LEFT JOIN ChiTiet_HoaDon_Dien_Nuoc CH ON DN.MaDienNuoc=CH.MaDienNuoc
		WHERE CH.MaDienNuoc is null;
	END
END
GO
/****** Object:  StoredProcedure [dbo].[SP_Dien_Nuoc]    Script Date: 11/28/2023 2:09:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--DienNuoc=======
CREATE PROCEDURE [dbo].[SP_Dien_Nuoc]
	@action varchar(50) = null,
	@MaDienNuoc nvarchar(50) = null,
	@MaPhong nvarchar(50) = null,
	@SoDienDau int = null,
	@SoDienCuoi int = null,
	@SoNuocDau int = null,
	@SoNuocCuoi int = null,
	@NgayGhiSo date = null
	
AS
BEGIN
	IF(@action='DsDienNuoc')
	BEGIN
		SELECT MaDienNuoc,MaPhong,SoDienDau,SoDienCuoi,SoNuocDau,SoNuocCuoi,NgayGhiSo FROM Dien_Nuoc ;
	END
	ELSE IF(@action='AddDienNuoc')
	BEGIN
		INSERT INTO Dien_Nuoc(MaDienNuoc,MaPhong,SoDienDau,SoDienCuoi,SoNuocDau,SoNuocCuoi,NgayGhiSo)
		VALUES(@MaDienNuoc,@MaPhong,@SoDienDau,@SoDienCuoi,@SoNuocDau,@SoNuocCuoi,GETDATE());
	END
	ELSE IF(@action='UpdateDienNuoc')
	BEGIN
		UPDATE Dien_Nuoc SET MaPhong=@MaPhong,SoDienDau=@SoDienDau,SoDienCuoi=@SoDienCuoi,SoNuocDau=@SoNuocDau,SoNuocCuoi=@SoNuocCuoi
		WHERE MaDienNuoc=@MaDienNuoc;
	END
	ELSE IF(@action='DeleteDienNuoc')
	BEGIN
		DELETE FROM Dien_Nuoc WHERE MaDienNuoc=@MaDienNuoc;
	END
END
GO
/****** Object:  StoredProcedure [dbo].[SP_Hoa_Don_DienNuoc]    Script Date: 11/28/2023 2:09:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_Hoa_Don_DienNuoc]
	@action varchar(50) = null,
	@MaHD nvarchar(50) = null,
	@MaPhong nvarchar(50) = null,
	@NgayLap date = null,
	@TongTien float = null
	
AS
BEGIN
	IF(@action='DsHD_DienNuoc')
	BEGIN
		SELECT HDN.MaHD,HDN.MaPhong,ph.TenPhong,HDN.NgayLap,CHD.ThanhTienDien,CHD.ThanTienNuoc, HDN.TongTien FROM Hoa_Don_Dien_Nuoc HDN
		INNER JOIN ChiTiet_HoaDon_Dien_Nuoc CHD ON CHD.MaHD=HDN.MaHD 
		INNER JOIN Phong ph On ph.MaPhong=HDN.MaPhong;
	END
	ELSE IF(@action='AddHD_DienNuoc')
	BEGIN
		if exists(SELECT MaHD,MaPhong FROM Hoa_Don_Dien_Nuoc WHERE MaHD=@MaHD)
		begin
			RaisError(N'Mã Hóa Đơn này bị trùng đổi khác đi!',16,1);
		end

			INSERT INTO Hoa_Don_Dien_Nuoc(MaHD,MaPhong,NgayLap,TongTien)
			VALUES(@MaHD,@MaPhong,GETDATE(), 0);
	END
	ELSE IF(@action='UpdateHD_DienNuoc')
	BEGIN
		UPDATE Hoa_Don_Dien_Nuoc SET MaPhong=@MaPhong,NgayLap=@NgayLap WHERE MaHD=@MaHD;
	END
	ELSE IF(@action='DeleteHD_DienNuoc')
	BEGIN
		DELETE FROM Hoa_Don_Dien_Nuoc WHERE MaHD=@MaHD;
	END
END
GO
/****** Object:  StoredProcedure [dbo].[SP_Hop_Dong]    Script Date: 11/28/2023 2:09:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_Hop_Dong]
	@action varchar(50) = null,
	@MaHopDong nvarchar(50) = null,
	@Masv nvarchar(50) = null,
	@MaPhong nvarchar(50) = null,
	@NgayBatDua date = null,
	@NgayKetThuc date = null
AS
BEGIN
	IF(@action = 'addHopDong')
    BEGIN
		if exists(SELECT Mahopdong,MaPhong FROM Hop_Dong WHERE Mahopdong=@MaHopDong)
		begin
			RaisError(N'Mã hợp đồng bị trùng rồi!',16,1);
		end
		--check xem phòng muốn add có người ở ko nếu ko add thoải mái đi 
        DECLARE @SoNguoiTrongPhong INT;
        SELECT @SoNguoiTrongPhong = SoNguoi FROM Phong WHERE MaPhong = @MaPhong;

        IF (@SoNguoiTrongPhong = 0)
        BEGIN
            -- soNgười=0 add thoải mái 
            INSERT INTO Hop_Dong (MaHopDong, Masv, MaPhong, NgayBatDau, NgayKetThuc)
            VALUES (@MaHopDong, @Masv, @MaPhong, @NgayBatDua, @NgayKetThuc);
			UPDATE Phong SET SoNguoi+= 1 WHERE MaPhong = @MaPhong;
        END
		--và khi có người đang ở cần check Female hay Male=1 
        ELSE IF (@SoNguoiTrongPhong <= 5)
            BEGIN
                -- Check giớiTính trong phòng đang ở nam hay nữ ..
                DECLARE @GioiTinhNguoiDauTien bit; --

				SELECT TOP 1 
					@GioiTinhNguoiDauTien = Sv.GioiTinh
				FROM Sinh_Vien Sv
				INNER JOIN Hop_Dong HD ON Sv.Masv = HD.Masv
				WHERE HD.MaPhong = @MaPhong
				ORDER BY Sv.GioiTinh;

                IF (@GioiTinhNguoiDauTien = 0) --0Female
                BEGIN
					--kiểm tra có thỏa mãn đk ko đang ở là nữ phải nữ giống nhau mới vào được 
					if EXISTS(SELECT Masv FROM Sinh_Vien WHERE Masv = @Masv AND GioiTinh != 0)
					begin
					RaisError(N'ko giống giớiTính nhau ko vào được phải là nữ mới vào được!',16,1);
					end
					else 
						begin
							-- nếu như nhau vào ok 
							INSERT INTO Hop_Dong (MaHopDong, Masv, MaPhong, NgayBatDau, NgayKetThuc)
							VALUES (@MaHopDong, @Masv, @MaPhong, @NgayBatDua, @NgayKetThuc)
							UPDATE Phong SET SoNguoi+= 1 WHERE MaPhong = @MaPhong;
						end
                END
                ELSE
                BEGIN -- Male
				     --kiểm tra có thỏa mãn đk ko đang ở là nam phải nam giống nhau mới vào được 
					 if EXISTS(SELECT Masv FROM Sinh_Vien WHERE Masv = @Masv AND GioiTinh !=1) --1 Male
					 begin
						 RaisError(N'ko giống giớiTính nhau ko vào được phải là nam ok!',16,1);
					 end
					 else 
						begin
							--ok add
							INSERT INTO Hop_Dong (MaHopDong, Masv, MaPhong, NgayBatDau, NgayKetThuc)
							VALUES (@MaHopDong, @Masv, @MaPhong, @NgayBatDua, @NgayKetThuc);
							UPDATE Phong SET SoNguoi += 1 WHERE MaPhong = @MaPhong;
						end
                END
	     END
		 Else IF(@SoNguoiTrongPhong>5)
		 begin
			RaisError(N'Đủ người rời phòng này 6 người! ',16,1);
		 end
    END
	IF(@action='DsHopDong')
	begin 
		SELECT Hp.Mahopdong,Hp.Masv,Sv.Tensv,Hp.MaPhong,ph.TenPhong,Hp.NgayBatDau,Hp.NgayKetThuc FROM Hop_Dong Hp
		INNER JOIN Sinh_Vien Sv ON Sv.Masv=Hp.Masv INNER JOIN Phong ph ON ph.MaPhong=Hp.MaPhong;
	end
	ELSE IF(@action='updateHopDong')
	begin
		--check xem phòng muốn add có người ở ko nếu ko add thoải mái đi 
        SELECT @SoNguoiTrongPhong = SoNguoi FROM Phong WHERE MaPhong = @MaPhong;

        IF (@SoNguoiTrongPhong = 0)
        BEGIN
            -- soNgười=0 add thoải mái 
           	UPDATE Hop_Dong SET Masv=@Masv,MaPhong=@MaPhong,NgayBatDau=@NgayBatDua,NgayKetThuc=@NgayKetThuc
			WHERE Mahopdong=@MaHopDong;
			UPDATE Phong SET SoNguoi-= 1 WHERE MaPhong = @MaPhong;
			UPDATE Phong SET SoNguoi+= 1 WHERE MaPhong = @MaPhong;
        END
		--và khi có người đang ở cần check Female hay Male=1 
        ELSE IF (@SoNguoiTrongPhong <= 5)
            BEGIN
                -- Check giớiTính trong phòng đang ở nam hay nữ ..

				SELECT TOP 1 
					@GioiTinhNguoiDauTien = Sv.GioiTinh
				FROM Sinh_Vien Sv
				INNER JOIN Hop_Dong HD ON Sv.Masv = HD.Masv
				WHERE HD.MaPhong = @MaPhong
				ORDER BY Sv.GioiTinh;

                IF (@GioiTinhNguoiDauTien = 0) --0Female
                BEGIN
					--kiểm tra có thỏa mãn đk ko đang ở là nữ phải nữ giống nhau mới vào được 
					if EXISTS(SELECT Masv FROM Sinh_Vien WHERE Masv = @Masv AND GioiTinh != 0)
					begin
					RaisError(N'ko giống giớiTính nhau ko vào được phải là nữ mới vào được!',16,1);
					end
					else 
						begin
							-- nếu như nhau vào ok 
							UPDATE Hop_Dong SET Masv=@Masv,MaPhong=@MaPhong,NgayBatDau=@NgayBatDua,NgayKetThuc=@NgayKetThuc 
							WHERE Mahopdong=@MaHopDong;
							UPDATE Phong SET SoNguoi-= 1 WHERE MaPhong = @MaPhong;
							UPDATE Phong SET SoNguoi+= 1 WHERE MaPhong = @MaPhong;
						end
                END
                ELSE
                BEGIN -- Male
				     --kiểm tra có thỏa mãn đk ko đang ở là nữ phải nữ giống nhau mới vào được 
					 if EXISTS(SELECT Masv FROM Sinh_Vien WHERE Masv = @Masv AND GioiTinh !=1) --1 Male
					 begin
						 RaisError(N'ko giống giớiTính nhau ko vào được phải là !',16,1);
					 end
					 else 
						begin
							--ok update
							UPDATE Hop_Dong SET Masv=@Masv,MaPhong=@MaPhong,NgayBatDau=@NgayBatDua,NgayKetThuc=@NgayKetThuc
							WHERE Mahopdong=@MaHopDong;
							UPDATE Phong SET SoNguoi-= 1 WHERE MaPhong = @MaPhong;
							UPDATE Phong SET SoNguoi+= 1 WHERE MaPhong = @MaPhong;
						end
                END
	     END
	end
	ELSE IF(@action='DeleteHopDong')
	begin
		DELETE FROM Hop_Dong WHERE Mahopdong=@MaHopDong;
		UPDATE Phong SET SoNguoi-=1 WHERE MaPhong=@MaPhong;

	end
	else if(@action='DsAllMaSv')
	begin
		SELECT Sv.Masv,Tensv,Sv.GioiTInh FROM Sinh_Vien Sv
		LEFT JOIN Hop_Dong Hp ON Sv.Masv = Hp.Masv
		WHERE Hp.Masv is null; 
	end
	else if(@action='DSallsv')
	begin
		SELECT Masv,Tensv,GioiTInh FROM Sinh_Vien;
	end
	else if(@action='DsAllMaPhong')
	begin
		SELECT MaPhong,TenPhong FROM Phong ;

	end
END
GO
/****** Object:  StoredProcedure [dbo].[SP_LoaiPhong]    Script Date: 11/28/2023 2:09:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_LoaiPhong]
	@action varchar(50) = null,
	@MaLoaiPhong nvarchar(50) = null,
	@TenLoaiPhong nvarchar(50) = null,
	@DonGiaPhong float = null
	
AS
BEGIN
	IF(@action='DsLoaiPhong')
	BEGIN
		SELECT MaLoaiPhong,TenLoaiPhong,DonGiaPhong FROM LoaiPhong;
	END
	ELSE IF(@action='AddLoaiPhong')
	BEGIN
		if exists(SELECT MaLoaiPhong,TenLoaiPhong FROM LoaiPhong WHERE MaLoaiPhong=@MaLoaiPhong)
		begin
			RaisError(N'Mã loại này bị trùng đổi khác đi!',16,1);
		end

		INSERT INTO LoaiPhong(MaLoaiPhong,TenLoaiPhong,DonGiaPhong)
		VALUES(@MaLoaiPhong,@TenLoaiPhong,@DonGiaPhong);
	END
	ELSE IF(@action='UpdateLoaiPhong')
	BEGIN
		UPDATE LoaiPhong SET TenLoaiPhong=@TenLoaiPhong,DonGiaPhong=@DonGiaPhong
		WHERE MaLoaiPhong=@MaLoaiPhong;
	END
	ELSE IF(@action='DeleteLoaiPhong')
	BEGIN
		DELETE FROM LoaiPhong
		WHERE MaLoaiPhong=@MaLoaiPhong;
	END
	ELSE IF(@action='DsMaLoaiPhong')
	BEGIN
		SELECT MaLoaiPhong,TenLoaiPhong,DonGiaPhong FROM LoaiPhong;
	END
END
GO
/****** Object:  StoredProcedure [dbo].[SP_Phong]    Script Date: 11/28/2023 2:09:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_Phong]
	@action varchar(50) = null,
	@Maphong nvarchar(50) = null,
	@TenPhong nvarchar(50) = null,
	@MaLoaiPhong nvarchar(50) = null,
	@SoNguoi int = null
	
AS
BEGIN
	IF(@action='DsPhong')
	BEGIN
		SELECT ph.MaPhong,ph.TenPhong,ph.MaLoaiPhong,Lp.TenLoaiPhong,ph.SoNguoi FROM Phong ph
		LEFT JOIN LoaiPhong Lp ON ph.MaLoaiPhong=Lp.MaLoaiPhong;
	END
	ELSE IF(@action='AddPhong')
	BEGIN
		if exists(SELECT MaPhong,TenPhong FROM Phong WHERE MaPhong=@Maphong)
		begin
			RaisError(N'Mã Phòng này bị trùng đổi mã khác đi!',16,1);
		end

		INSERT INTO Phong(MaPhong,TenPhong,MaLoaiPhong,SoNguoi)
		VALUES(@Maphong,@TenPhong,@MaLoaiPhong,0);
	END
	ELSE IF(@action='UpdatePhong')
	BEGIN
		UPDATE Phong SET TenPhong=@TenPhong,MaLoaiPhong=@MaLoaiPhong
	    WHERE MaPhong=@Maphong;
	END
	ELSE IF(@action='DeletePhong')
	BEGIN
		SELECT @SoNguoi=SoNguoi FROM Phong WHERE MaPhong=@Maphong;
		if(@SoNguoi>0)
		begin
			RaisError(N'ko xóa được đang có người ở phòng này!!',16,1);
		end

		DELETE FROM Phong WHERE MaPhong=@Maphong;
	END
END
GO
/****** Object:  StoredProcedure [dbo].[SP_Sinh_Vien]    Script Date: 11/28/2023 2:09:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_Sinh_Vien]
	@action varchar(50) = null,
	@Masv nvarchar(50) = null,
	@Tensv nvarchar(50) = null,
	@NgaySinh date = null,
	@GioiTinh bit = null,
	@sdt nvarchar(12) = null,
	@lop nvarchar(50) = null
AS
BEGIN
	IF(@action='addSinhvien')
	begin
		SELECT @Tensv=Tensv FROM Sinh_Vien WHERE Masv=@Masv;
		if exists(SELECT Masv FROM Sinh_Vien WHERE Masv=@Masv)
		begin
			RaisError(N'Mã sinh viên bị trùng! Tên sinh viên: %s!',16,1,@Tensv);
		end

		INSERT INTO Sinh_Vien(Masv,Tensv,Ngaysinh,GioiTInh,Sdt,Lop)
		VALUES(@Masv,@Tensv,@NgaySinh,@GioiTinh,@sdt,@lop);
	end
	IF(@action='DsSinhVien')
	begin 
		SELECT Masv,Tensv,Ngaysinh,GioiTInh,Sdt,Lop FROM Sinh_Vien;
	end
	ELSE IF(@action='updateSV')
	begin
		UPDATE Sinh_Vien SET Tensv=@Tensv,Ngaysinh=@NgaySinh,GioiTInh=@GioiTinh,Sdt=@sdt,
		Lop=@lop WHERE Masv=@Masv;
	end
	ELSE IF(@action='DeleteSV')
	begin
		DELETE FROM Sinh_Vien WHERE Masv = @Masv;
	end
END
GO
USE [master]
GO
ALTER DATABASE [QuanlyKyTucXa] SET  READ_WRITE 
GO
