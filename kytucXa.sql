USE [QuanlyKyTucXa]
GO
/****** Object:  StoredProcedure [dbo].[SP_Sinh_Vien]    Script Date: 11/23/2023 8:08:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[SP_Sinh_Vien]
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

--==========================================
ALTER PROCEDURE [dbo].[SP_Hop_Dong]
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

--Phong========
ALTER PROCEDURE [dbo].[SP_Phong]
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

--LoaiPhong=====
ALTER PROCEDURE [dbo].[SP_LoaiPhong]
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
GO ;

--=======Hoadon_DienNuoc
ALTER PROCEDURE [dbo].[SP_Hoa_Don_DienNuoc]
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
GO ;

--=======Hoadon_DienNuoc
ALTER PROCEDURE [dbo].[SP_ChiTiet_HoaDon_DienNuoc]
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
GO ;

EXEC SP_ChiTiet_HoaDon_DienNuoc
    @action = 'AddCT_HD_DienNuoc',
	@MaHD = 'Mh01',
	@MaDienNuoc = 'MDN01' ,
	@DonGiaDien = '2000' ,
	@DonGiaNuoc = '5000' ,
	@ThanhTienDien = '',
	@ThanhTienNuoc =  ''

select * from Sinh_Vien