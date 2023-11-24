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
GO ;

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
        ELSE IF (@SoNguoiTrongPhong > 0)
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
                BEGIN
				     --kiểm tra có thỏa mãn đk ko đang ở là nữ phải nữ giống nhau mới vào được 
					 if EXISTS(SELECT Masv FROM Sinh_Vien WHERE Masv = @Masv AND GioiTinh !=1) --1 Male
					 begin
						 RaisError(N'ko giống giớiTính nhau ko vào được phải là !',16,1);
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
    END
	IF(@action='DsHopDong')
	begin 
		SELECT Hp.Mahopdong,Hp.Masv,Sv.Tensv,Hp.MaPhong,ph.TenPhong,Hp.NgayBatDau,Hp.NgayKetThuc FROM Hop_Dong Hp
		INNER JOIN Sinh_Vien Sv ON Sv.Masv=Hp.Masv INNER JOIN Phong ph ON ph.MaPhong=Hp.MaPhong;
	end
	ELSE IF(@action='updateHopDong')
	begin
		UPDATE Hop_Dong SET Masv=@Masv,MaPhong=@MaPhong,NgayBatDau=@NgayBatDua,NgayKetThuc=@NgayKetThuc WHERE Mahopdong=@MaHopDong;
	end
	ELSE IF(@action='DeleteHopDong')
	begin
		DELETE FROM Hop_Dong WHERE Mahopdong=@MaHopDong;
		UPDATE Phong SET SoNguoi-=1 WHERE MaPhong=@MaPhong;

	end
	else if(@action='DsAllMaSv')
	begin
		SELECT Sv.Masv,Tensv FROM Sinh_Vien Sv
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


EXEC SP_Hop_Dong
    @action = 'addHopDong',
    @MaHopDong = 'Mh02',
    @Masv = 'test',
    @MaPhong = 'Mp01',
    @NgayBatDua = '2022-02-15',
    @NgayKetThuc = '2022-02-15';

select * from Sinh_Vien