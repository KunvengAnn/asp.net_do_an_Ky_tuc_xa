using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Runtime.InteropServices;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;


namespace QuanLyKTX_Do_an
{
    public partial class api : System.Web.UI.Page
    {
        string conStr = LibConnection.AppSettingGet.ConnectionString; //connection;
      
        private class Reply
        {
            public bool ok;
            public string msg;
        }
        
        private class SinhVien
        {
            public string masv,tensv;
            public DateTime NgaySinh;
            public int gioiTinh;
            public string sdt;
            public string Lop;
        }

        private class HopDong : SinhVien
        {
            public string mahopdong, maphong;
            public string tenphong;
            public DateTime ngayBatDau, ngayKetThuc;
        }

        void DsHopDong()
        {
            Reply reply = new Reply();
            List<HopDong> LH = new List<HopDong>();
            try
            {
                DataTable dt = sqlGetData("SP_Hop_Dong", "DsHopDong");
                if(dt != null)
                {
                    reply.ok = true;
                    foreach(DataRow r in dt.Rows)
                    {
                        HopDong h = new HopDong();
                        h.mahopdong = r["Mahopdong"].ToString();
                        h.masv = r["Masv"].ToString();
                        h.tensv = r["Tensv"].ToString();
                        h.maphong = r["MaPhong"].ToString();
                        h.tenphong = r["TenPhong"].ToString();
                        h.ngayBatDau = Convert.ToDateTime(r["NgayBatDau"].ToString());
                        h.ngayKetThuc = Convert.ToDateTime(r["NgayKetThuc"].ToString());
                        LH.Add(h);
                    }
                }
                else
                {
                    reply.ok = false;
                    reply.msg = "ko có dữ liệu hợp đợng !";
                }
            }catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            var obj = new { reply,LH };
            string json = JsonConvert.SerializeObject(obj);
            this.Response.Write(json);
        }

        void DsMasv()
        {
            Reply reply = new Reply();
            List<SinhVien> Ls = new List<SinhVien>();
            try
            {
                DataTable dt = sqlGetData("SP_Hop_Dong", "DsAllMaSv");
                if (dt != null)
                {
                    reply.ok = true;
                    foreach (DataRow r in dt.Rows)
                    {
                        SinhVien s = new SinhVien();
                        s.masv = r["Masv"].ToString();
                        s.tensv = r["Tensv"].ToString();
                        s.gioiTinh = Convert.ToInt32(r["GioiTInh"]);
                        Ls.Add(s);
                    }
                }
                else
                {
                    reply.ok = false;
                    reply.msg = "ko có dữ masv va tensv !";
                }
            }
            catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            var obj = new { reply, Ls };
            string json = JsonConvert.SerializeObject(obj);
            this.Response.Write(json);
        }

        void DsAllSv()
        {
            Reply reply = new Reply();
            List<SinhVien> Lsv = new List<SinhVien>();
            try
            {
                DataTable dt = sqlGetData("SP_Hop_Dong", "DSallsv");
                if (dt != null)
                {
                    reply.ok = true;
                    foreach (DataRow r in dt.Rows)
                    {
                        SinhVien s = new SinhVien();
                        s.masv = r["Masv"].ToString();
                        s.tensv = r["Tensv"].ToString();
                        //s.gioiTinh = Convert.ToInt32(r["GioiTInh"]);
                        Lsv.Add(s);
                    }
                }
                else
                {
                    reply.ok = false;
                    reply.msg = "ko có dữ all sv !";
                }
            }
            catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            var obj = new { reply, Lsv };
            string json = JsonConvert.SerializeObject(obj);
            this.Response.Write(json);
        }
        private class Phong
        {
            public string maphong, tenphong;
            public string tenlaoiphong;
            public string maloaiphong;
            public double DonGiaPhong;
            public int SoNguoi;
        }

        public class HoaDonDienNouc
        {
            public string MaHD, MaPhong,TenPhong;
            public DateTime NgayLap;
            public double ThanhTienDien, ThanhTienNuoc;
            public double TongTien;
        }
        private class DienNuoc
        {
            public string MaDienNuoc, MaPhong;
            public int SoDienDau, SoDienCuoi;
            public int SoNuocDau, SoNuocCuoi;
            public DateTime NgayGhiSo;
        }


        public class ChiTietHoaDonDienNouc 
        {
            public string MaHD, MaDienNuoc, TenPhong;
            public int SoDienDau, SoDienCuoi;
            public int SoNuocDau, SoNuocCuoi;
            public double DonGiaDien, DonGiaNuoc, ThanhTienDien, ThanTienNuoc;
        }

        void DsCT_HoaDonDienNuoc()
        {
            Reply reply = new Reply();
            List<ChiTietHoaDonDienNouc> LCT = new List<ChiTietHoaDonDienNouc>();
            try
            {
                DataTable dt = sqlGetData("SP_ChiTiet_HoaDon_DienNuoc", "DsCT_HD_DienNuoc");
                if (dt != null)
                {
                    reply.ok = true;
                    foreach (DataRow r in dt.Rows)
                    {
                        ChiTietHoaDonDienNouc CT = new ChiTietHoaDonDienNouc();
                        CT.MaHD = r[0].ToString();
                        CT.MaDienNuoc = r[1].ToString();
                        CT.SoDienDau = Convert.ToInt32(r[2]);
                        CT.SoDienCuoi = Convert.ToInt32(r[3]);
                        CT.SoNuocDau = Convert.ToInt32(r[4]);
                        CT.SoNuocCuoi = Convert.ToInt32(r[5]);
                        CT.DonGiaDien = Convert.ToInt32(r[6]);
                        CT.DonGiaNuoc = Convert.ToInt32(r[7]);
                        CT.ThanhTienDien = Convert.ToDouble(r[8]);
                        CT.ThanTienNuoc = Convert.ToDouble(r[9]);
                        LCT.Add(CT);
                    }
                }
                else
                {
                    reply.ok = true;
                    reply.msg = "ko có dữ CT HoaDon DienNuoc !";
                }
            }
            catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            var obj = new { reply, LCT };
            string json = JsonConvert.SerializeObject(obj);
            this.Response.Write(json);
        }

        void DeleteCT_HoaDon()
        {
            Reply reply = new Reply();
            try
            {
                Dictionary<string, KeyValuePair<SqlDbType, object>> parameters = new Dictionary<string, KeyValuePair<SqlDbType, object>>();

                // Add parameters to the dictionary 
                parameters.Add("@action", new KeyValuePair<SqlDbType, object>(SqlDbType.VarChar, "DeleteCT_HD_DienNuoc"));
                parameters.Add("@MaHD", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["MaHD"]));

                int n = SqlupdateDeleleAdd("SP_ChiTiet_HoaDon_DienNuoc", parameters);
                if (n > 0)
                {
                    reply.ok = true;
                }
                else
                {
                    reply.ok = false;
                    reply.msg = "error Delete ChitTietHoaDon!";
                }
            }
            catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            string json = JsonConvert.SerializeObject(reply);
            this.Response.Write(json);
        }

        void AddLoaiPhong()
        {
            Reply reply = new Reply();
            try
            {
                Dictionary<string, KeyValuePair<SqlDbType, object>> parameters = new Dictionary<string, KeyValuePair<SqlDbType, object>>();

                // Add parameters to the dictionary 
                parameters.Add("@action", new KeyValuePair<SqlDbType, object>(SqlDbType.VarChar, "AddLoaiPhong"));
                parameters.Add("@MaLoaiPhong", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["MaLoaiPhong"]));
                parameters.Add("@TenLoaiPhong", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["TenLoaiPhong"]));
                parameters.Add("@DonGiaPhong", new KeyValuePair<SqlDbType, object>(SqlDbType.Float, (object)Request["DonGiaLoaiPhong"]));

                int n = SqlupdateDeleleAdd("SP_LoaiPhong", parameters);
                if (n > 0)
                {
                    reply.ok = true;
                }
                else
                {
                    reply.ok = false;
                    reply.msg = "error add LoaiPhong!";
                }
            }
            catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            string json = JsonConvert.SerializeObject(reply);
            this.Response.Write(json);
        }

        void DsHD_DienNuoc()
        {
            Reply reply = new Reply();
            List<HoaDonDienNouc> LH = new List<HoaDonDienNouc>();
            try
            {
                DataTable dt = sqlGetData("SP_Hoa_Don_DienNuoc", "DsHD_DienNuoc");
                if (dt != null)
                {
                    reply.ok = true;
                    foreach (DataRow r in dt.Rows)
                    {
                        HoaDonDienNouc Ho = new HoaDonDienNouc();
                        Ho.MaHD = r["MaHD"].ToString();
                        Ho.MaPhong = r["MaPhong"].ToString();
                        Ho.TenPhong = r["TenPhong"].ToString();
                        Ho.NgayLap = DateTime.Parse(r["NgayLap"].ToString());
                        Ho.ThanhTienDien = Convert.ToDouble(r["ThanhTienDien"]);
                        Ho.ThanhTienNuoc = Convert.ToDouble(r["ThanTienNuoc"]);
                        Ho.TongTien = Convert.ToDouble(r["TongTien"]);
                        LH.Add(Ho);
                    }
                }
                else
                {
                    reply.ok = true;
                    reply.msg = "ko có dữ HoaDon DienNuoc !";
                }
            }
            catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            var obj = new { reply, LH };
            string json = JsonConvert.SerializeObject(obj);
            this.Response.Write(json);
        }

        void getOnlyMaNuoc()
        {
            Reply reply = new Reply();
            List<DienNuoc> LN = new List<DienNuoc>();
            try
            {
                DataTable dt = sqlGetData("SP_ChiTiet_HoaDon_DienNuoc", "MaHDDienNuoc");
                if (dt != null)
                {
                    reply.ok = true;
                    foreach (DataRow r in dt.Rows)
                    {
                        DienNuoc d = new DienNuoc();
                        d.MaDienNuoc = r[0].ToString();
                        d.MaPhong = r[1].ToString();
                        d.NgayGhiSo = Convert.ToDateTime(r[2].ToString());
                        LN.Add(d);
                    }
                }
                else
                {
                    reply.ok = false;
                    reply.msg = "ko có dữ MaDienNuoc!";
                }
            }
            catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            var obj = new { reply, LN };
            string json = JsonConvert.SerializeObject(obj);
            this.Response.Write(json);
        }

        void AddHoaDonDienNuoc()
        {
            Reply reply = new Reply();
            try
            {
                Dictionary<string, KeyValuePair<SqlDbType, object>> parameters = new Dictionary<string, KeyValuePair<SqlDbType, object>>();

                // Add parameters to the dictionary 
                parameters.Add("@action", new KeyValuePair<SqlDbType, object>(SqlDbType.VarChar, "AddHD_DienNuoc"));
                parameters.Add("@MaHD", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["MaHD"]));
                parameters.Add("@MaPhong", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["Maphong"]));

                int n = SqlupdateDeleleAdd("SP_Hoa_Don_DienNuoc", parameters);
                if (n > 0)
                {
                    reply.ok = true;
                }
                else
                {
                    reply.ok = false;
                    reply.msg = "error add DienNuoc!";
                }
            }
            catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            string json = JsonConvert.SerializeObject(reply);
            this.Response.Write(json);
        }

        void UpdateLoaiPhong()
        {
            Reply reply = new Reply();
            try
            {
                Dictionary<string, KeyValuePair<SqlDbType, object>> parameters = new Dictionary<string, KeyValuePair<SqlDbType, object>>();

                // Add parameters to the dictionary 
                parameters.Add("@action", new KeyValuePair<SqlDbType, object>(SqlDbType.VarChar, "UpdateLoaiPhong"));
                parameters.Add("@MaLoaiPhong", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["MaLoaiPhong"]));
                parameters.Add("@TenLoaiPhong", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["TenLoaiPhong"]));
                parameters.Add("@DonGiaPhong", new KeyValuePair<SqlDbType, object>(SqlDbType.Float, (object)Request["DonGiaLoaiPhong"]));

                int n = SqlupdateDeleleAdd("SP_LoaiPhong", parameters);
                if (n > 0)
                {
                    reply.ok = true;
                }
                else
                {
                    reply.ok = false;
                    reply.msg = "error Update LoaiPhong!";
                }
            }
            catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            string json = JsonConvert.SerializeObject(reply);
            this.Response.Write(json);
        }

        void DeleteLoaiPhong()
        {
            Reply reply = new Reply();
            try
            {
                Dictionary<string, KeyValuePair<SqlDbType, object>> parameters = new Dictionary<string, KeyValuePair<SqlDbType, object>>();

                // Add parameters to the dictionary 
                parameters.Add("@action", new KeyValuePair<SqlDbType, object>(SqlDbType.VarChar, "DeleteLoaiPhong"));
                parameters.Add("@MaLoaiPhong", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["MaLoaiPhong"]));

                int n = SqlupdateDeleleAdd("SP_LoaiPhong", parameters);
                if (n > 0)
                {
                    reply.ok = true;
                }
                else
                {
                    reply.ok = false;
                    reply.msg = "error Delete LoaiPhong!";
                }
            }
            catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            string json = JsonConvert.SerializeObject(reply);
            this.Response.Write(json);
        }

        void DsLoaiPhong()
        {
            Reply reply = new Reply();
            List<Phong> Lph = new List<Phong>();
            try
            {
                DataTable dt = sqlGetData("SP_LoaiPhong", "DsLoaiPhong");
                if (dt != null)
                {
                    reply.ok = true;
                    foreach (DataRow r in dt.Rows)
                    {
                        Phong ph = new Phong();
                        ph.maloaiphong = r[0].ToString();
                        ph.tenlaoiphong = r[1].ToString();
                        ph.DonGiaPhong = Convert.ToDouble(r[2]);
                        Lph.Add(ph);
                    }
                }
                else
                {
                    reply.ok = true;
                    reply.msg = "ko có dữ LoaiPhong !";
                }
            }
            catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            var obj = new { reply, Lph };
            string json = JsonConvert.SerializeObject(obj);
            this.Response.Write(json);
        }

        void DsDienNuoc()
        {
            Reply reply = new Reply();
            List<DienNuoc> Ld = new List<DienNuoc>();
            try
            {
                DataTable dt = sqlGetData("SP_Dien_Nuoc", "DsDienNuoc");
                if (dt != null)
                {
                    reply.ok = true;
                    foreach (DataRow r in dt.Rows)
                    {
                        DienNuoc d = new DienNuoc();
                        d.MaDienNuoc = r["MaDienNuoc"].ToString();
                        d.MaPhong = r["MaPhong"].ToString();
                        d.SoDienDau = Convert.ToInt32(r["SoDienDau"]);
                        d.SoDienCuoi = Convert.ToInt32(r["SoDienCuoi"]);
                        d.SoNuocDau = Convert.ToInt32(r["SoNuocDau"]);
                        d.SoNuocCuoi = Convert.ToInt32(r["SoNuocCuoi"]);
                        d.NgayGhiSo = Convert.ToDateTime(r["NgayGhiSo"].ToString());
                        Ld.Add(d);
                    }
                }
                else
                {
                    reply.ok = true;
                    reply.msg = "ko có dữ Phong !";
                }
            }
            catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            var obj = new { reply, Ld };
            string json = JsonConvert.SerializeObject(obj);
            this.Response.Write(json);
        }

        void UpdateDienNuoc()
        {
            Reply reply = new Reply();
            try
            {
                Dictionary<string, KeyValuePair<SqlDbType, object>> parameters = new Dictionary<string, KeyValuePair<SqlDbType, object>>();

                // Add parameters to the dictionary 
                parameters.Add("@action", new KeyValuePair<SqlDbType, object>(SqlDbType.VarChar, "UpdateDienNuoc"));
                parameters.Add("@MaDienNuoc", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["MaDienNuoc"]));
                parameters.Add("@MaPhong", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["MaPhong"]));
                parameters.Add("@SoDienDau", new KeyValuePair<SqlDbType, object>(SqlDbType.Int, (object)Request["SoDienDau"]));
                parameters.Add("@SoDienCuoi", new KeyValuePair<SqlDbType, object>(SqlDbType.Int, (object)Request["SoDienCuoi"]));
                parameters.Add("@SoNuocDau", new KeyValuePair<SqlDbType, object>(SqlDbType.Int, (object)Request["SoNuocDau"]));
                parameters.Add("@SoNuocCuoi", new KeyValuePair<SqlDbType, object>(SqlDbType.Int, (object)Request["SoNuocCuoi"]));

                int n = SqlupdateDeleleAdd("SP_Dien_Nuoc", parameters);
                if (n > 0)
                {
                    reply.ok = true;
                }
                else
                {
                    reply.ok = false;
                    reply.msg = "error Update DienNuoc!";
                }
            }
            catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            string json = JsonConvert.SerializeObject(reply);
            this.Response.Write(json);
        }

        void DeleteDienNuoc()
        {
            Reply reply = new Reply();
            try
            {
                Dictionary<string, KeyValuePair<SqlDbType, object>> parameters = new Dictionary<string, KeyValuePair<SqlDbType, object>>();

                // Add parameters to the dictionary 
                parameters.Add("@action", new KeyValuePair<SqlDbType, object>(SqlDbType.VarChar, "DeleteDienNuoc"));
                parameters.Add("@MaDienNuoc", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["MaDienNuoc"]));

                int n = SqlupdateDeleleAdd("SP_Dien_Nuoc", parameters);
                if (n > 0)
                {
                    reply.ok = true;
                }
                else
                {
                    reply.ok = false;
                    reply.msg = "error Delete DienNuoc!";
                }
            }
            catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            string json = JsonConvert.SerializeObject(reply);
            this.Response.Write(json);
        }

        void AddCT_HoaDonDienNuoc()
        {
            Reply reply = new Reply();
            try
            {
                Dictionary<string, KeyValuePair<SqlDbType, object>> parameters = new Dictionary<string, KeyValuePair<SqlDbType, object>>();

                // Add parameters to the dictionary 
                parameters.Add("@action", new KeyValuePair<SqlDbType, object>(SqlDbType.VarChar, "AddCT_HD_DienNuoc"));
                parameters.Add("@MaHD", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["MaHoadon"]));
                parameters.Add("@MaDienNuoc", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["MaDienNuoc"]));
                parameters.Add("@DonGiaDien", new KeyValuePair<SqlDbType, object>(SqlDbType.Float, (object)Request["DonGiaDien"]));
                parameters.Add("@DonGiaNuoc", new KeyValuePair<SqlDbType, object>(SqlDbType.Float, (object)Request["DonGiaNuoc"]));

                int n = SqlupdateDeleleAdd("SP_ChiTiet_HoaDon_DienNuoc", parameters);
                if (n > 0)
                {
                    reply.ok = true;
                }
                else
                {
                    reply.ok = false;
                    reply.msg = "error add Chi Tiet HoaDon!";
                }
            }
            catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            string json = JsonConvert.SerializeObject(reply);
            this.Response.Write(json);
        }

        void AddDienNuoc()
        {
            Reply reply = new Reply();
            try
            {
                Dictionary<string, KeyValuePair<SqlDbType, object>> parameters = new Dictionary<string, KeyValuePair<SqlDbType, object>>();

                // Add parameters to the dictionary 
                parameters.Add("@action", new KeyValuePair<SqlDbType, object>(SqlDbType.VarChar, "AddDienNuoc"));
                parameters.Add("@MaDienNuoc", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["MaDienNuoc"]));
                parameters.Add("@MaPhong", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["MaPhong"]));
                parameters.Add("@SoDienDau", new KeyValuePair<SqlDbType, object>(SqlDbType.Int, (object)Request["SoDienDau"]));
                parameters.Add("@SoDienCuoi", new KeyValuePair<SqlDbType, object>(SqlDbType.Int, (object)Request["SoDienCuoi"]));
                parameters.Add("@SoNuocDau", new KeyValuePair<SqlDbType, object>(SqlDbType.Int, (object)Request["SoNuocDau"]));
                parameters.Add("@SoNuocCuoi", new KeyValuePair<SqlDbType, object>(SqlDbType.Int, (object)Request["SoNuocCuoi"]));

                int n = SqlupdateDeleleAdd("SP_Dien_Nuoc", parameters);
                if (n > 0)
                {
                    reply.ok = true;
                }
                else
                {
                    reply.ok = false;
                    reply.msg = "error add DienNuoc!";
                }
            }
            catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            string json = JsonConvert.SerializeObject(reply);
            this.Response.Write(json);
        }

        void DsPhong()
        {
            Reply reply = new Reply();
            List<Phong> Lp = new List<Phong>();
            try
            {
                DataTable dt = sqlGetData("SP_Phong", "DsPhong");
                if (dt != null)
                {
                    reply.ok = true;
                    foreach (DataRow r in dt.Rows)
                    {
                        Phong phong = new Phong();
                        phong.maphong = r["MaPhong"].ToString();
                        phong.tenphong = r["TenPhong"].ToString();
                        phong.tenlaoiphong = r["TenLoaiPhong"].ToString();
                        phong.maloaiphong = r["MaLoaiPhong"].ToString();
                        phong.SoNguoi = Convert.ToInt32(r["SoNguoi"]);
                        Lp.Add(phong);
                    }
                }
                else
                {
                    reply.ok = false;
                    reply.msg = "ko có dữ Phong !";
                }
            }
            catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            var obj = new { reply, Lp };
            string json = JsonConvert.SerializeObject(obj);
            this.Response.Write(json);
        }

        void DsMaLoaiPhong()
        {
            Reply reply = new Reply();
            List<Phong> Lml = new List<Phong>();
            try
            {
                DataTable dt = sqlGetData("SP_LoaiPhong", "DsMaLoaiPhong");
                if (dt != null)
                {
                    reply.ok = true;
                    foreach (DataRow r in dt.Rows)
                    {
                        Phong p = new Phong();
                        p.maloaiphong = r[0].ToString();
                        p.tenlaoiphong = r[1].ToString();
                        p.DonGiaPhong = Convert.ToDouble(r[2]);
                        Lml.Add(p);
                    }
                }
                else
                {
                    reply.ok = false;
                    reply.msg = "ko có dữ MaLoaiPhong!";
                }
            }
            catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            var obj = new { reply, Lml };
            string json = JsonConvert.SerializeObject(obj);
            this.Response.Write(json);
        }

        void AddPhong()
        {
            Reply reply = new Reply();
            try
            {
                Dictionary<string, KeyValuePair<SqlDbType, object>> parameters = new Dictionary<string, KeyValuePair<SqlDbType, object>>();

                // Add parameters to the dictionary 
                parameters.Add("@action", new KeyValuePair<SqlDbType, object>(SqlDbType.VarChar, "AddPhong"));
                parameters.Add("@Maphong", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["MaPhong"]));
                parameters.Add("@TenPhong", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["TenPhong"]));
                parameters.Add("@MaLoaiPhong", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["MaLoaiPhong"]));

                int n = SqlupdateDeleleAdd("SP_Phong", parameters);
                if (n > 0)
                {
                    reply.ok = true;
                }
                else
                {
                    reply.ok = false;
                    reply.msg = "error add Phong!";
                }
            }
            catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            string json = JsonConvert.SerializeObject(reply);
            this.Response.Write(json);
        }

        void UpdatePhong()
        {
            Reply reply = new Reply();
            try
            {
                Dictionary<string, KeyValuePair<SqlDbType, object>> parameters = new Dictionary<string, KeyValuePair<SqlDbType, object>>();

                // Add parameters to the dictionary 
                parameters.Add("@action", new KeyValuePair<SqlDbType, object>(SqlDbType.VarChar, "UpdatePhong"));
                parameters.Add("@Maphong", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["MaPhong"]));
                parameters.Add("@TenPhong", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["TenPhong"]));
                parameters.Add("@MaLoaiPhong", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["MaLoaiPhong"]));

                int n = SqlupdateDeleleAdd("SP_Phong", parameters);
                if (n > 0)
                {
                    reply.ok = true;
                }
                else
                {
                    reply.ok = false;
                    reply.msg = "error Update Phong!";
                }
            }
            catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            string json = JsonConvert.SerializeObject(reply);
            this.Response.Write(json);
        }

        void DeletePhong()
        {
            Reply reply = new Reply();
            try
            {
                Dictionary<string, KeyValuePair<SqlDbType, object>> parameters = new Dictionary<string, KeyValuePair<SqlDbType, object>>();

                // Add parameters to the dictionary 
                parameters.Add("@action", new KeyValuePair<SqlDbType, object>(SqlDbType.VarChar, "DeletePhong"));
                parameters.Add("@Maphong", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["MaPhong"]));

                int n = SqlupdateDeleleAdd("SP_Phong", parameters);
                if (n > 0)
                {
                    reply.ok = true;
                }
                else
                {
                    reply.ok = false;
                    reply.msg = "error Delete Phong!";
                }
            }
            catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            string json = JsonConvert.SerializeObject(reply);
            this.Response.Write(json);
        }

        void DsMaPhong()
        {
            Reply reply = new Reply();
            List<Phong> Lp = new List<Phong>();
            try
            {
                DataTable dt = sqlGetData("SP_Hop_Dong", "DsAllMaPhong");
                if (dt != null)
                {
                    reply.ok = true;
                    foreach (DataRow r in dt.Rows)
                    {
                        Phong phong = new Phong();
                        phong.maphong = r["MaPhong"].ToString();
                        phong.tenphong = r["TenPhong"].ToString();
                        Lp.Add(phong);
                    }
                }
                else
                {
                    reply.ok = false;
                    reply.msg = "ko có dữ Maphong va tenPhong !";
                }
            }
            catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            var obj = new { reply, Lp };
            string json = JsonConvert.SerializeObject(obj);
            this.Response.Write(json);
        }
        void AddHopDong()
        {
            Reply reply = new Reply();
            try
            {
                Dictionary<string, KeyValuePair<SqlDbType, object>> parameters = new Dictionary<string, KeyValuePair<SqlDbType, object>>();

                // Add parameters to the dictionary 
                parameters.Add("@action", new KeyValuePair<SqlDbType, object>(SqlDbType.VarChar, "addHopDong"));
                parameters.Add("@MaHopDong", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["mahopdong"]));
                parameters.Add("@Masv", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["masv"]));
                parameters.Add("@MaPhong", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["maphong"]));
                parameters.Add("@NgayBatDua", new KeyValuePair<SqlDbType, object>(SqlDbType.Date, (object)Request["ngaybatdau"]));
                parameters.Add("@NgayKetThuc", new KeyValuePair<SqlDbType, object>(SqlDbType.Date, (object)Request["ngayKetThuc"]));

                int n = SqlupdateDeleleAdd("SP_Hop_Dong", parameters);
                if (n > 0)
                {
                    reply.ok = true;
                }
                else
                {
                    reply.ok = false;
                    reply.msg = "error add sinhvien!";
                }
            }
            catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            string json = JsonConvert.SerializeObject(reply);
            this.Response.Write(json);
        }

        void UpdateHopDong()
        {
            Reply reply = new Reply();
            try
            {
                Dictionary<string, KeyValuePair<SqlDbType, object>> parameters = new Dictionary<string, KeyValuePair<SqlDbType, object>>();

                // Add parameters to the dictionary 
                parameters.Add("@action", new KeyValuePair<SqlDbType, object>(SqlDbType.VarChar, "updateHopDong"));
                parameters.Add("@MaHopDong", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["MahopDong"]));
                parameters.Add("@Masv", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["Masv"]));
                parameters.Add("@MaPhong", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["MaPhong"]));
                parameters.Add("@NgayBatDua", new KeyValuePair<SqlDbType, object>(SqlDbType.Date, (object)Request["ngayBayDau"]));
                parameters.Add("@NgayKetThuc", new KeyValuePair<SqlDbType, object>(SqlDbType.Date, (object)Request["ngayKetThuc"]));

                int n = SqlupdateDeleleAdd("SP_Hop_Dong", parameters);
                if (n > 0)
                {
                    reply.ok = true;
                }
                else
                {
                    reply.ok = false;
                    reply.msg = "error Delete sinhvien!";
                }
            }
            catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            string json = JsonConvert.SerializeObject(reply);
            this.Response.Write(json);
        }

        void DeleteHopDong()
        {
            Reply reply = new Reply();
            try
            {
                Dictionary<string, KeyValuePair<SqlDbType, object>> parameters = new Dictionary<string, KeyValuePair<SqlDbType, object>>();

                // Add parameters to the dictionary 
                parameters.Add("@action", new KeyValuePair<SqlDbType, object>(SqlDbType.VarChar, "DeleteHopDong"));
                parameters.Add("@MaHopDong", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["MahopDong"]));
                parameters.Add("@MaPhong", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["Maphong"]));

                int n = SqlupdateDeleleAdd("SP_Hop_Dong", parameters);
                if (n > 0)
                {
                    reply.ok = true;
                }
                else
                {
                    reply.ok = false;
                    reply.msg = "error Delete sinhvien!";
                }
            }
            catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            string json = JsonConvert.SerializeObject(reply);
            this.Response.Write(json);
        }
        private DataTable sqlGetData(string _cmd,string _action)
        {
            SqlConnection cn = new SqlConnection(conStr);
            cn.Open();
            SqlCommand cm = new SqlCommand(_cmd, cn);
            cm.CommandType = CommandType.StoredProcedure;
            cm.Parameters.Add("@action", SqlDbType.VarChar, 50).Value = _action;

            SqlDataReader dr = cm.ExecuteReader();
            DataTable dt = new DataTable();
            dt.Load(dr); 
            cm.Dispose();
            cn.Close();
            cn.Dispose();
            return dt;
        }

        void DsSinhVien()
        {
            Reply reply = new Reply();
            List<SinhVien> Ls = new List<SinhVien>();
            try
            {
                DataTable dt = sqlGetData("SP_Sinh_Vien", "DsSinhVien");
                if(dt.Rows.Count > 0)
                {
                    reply.ok = true;
                    foreach(DataRow r in dt.Rows)
                    {
                        SinhVien s = new SinhVien();
                        s.masv = r["Masv"].ToString();
                        s.tensv = r["Tensv"].ToString();
                        s.NgaySinh = Convert.ToDateTime(r["Ngaysinh"].ToString());
                        s.gioiTinh =Convert.ToInt32(r["GioiTInh"]);
                        s.sdt = r["Sdt"].ToString();
                        s.Lop = r["Lop"].ToString();
                        Ls.Add(s);
                    }
                }
                else
                {
                    reply.ok = false;
                    reply.msg = "ko có dữ liệu sinh viện!!";
                }
            }
            catch(Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            var obj = new { reply, Ls };
            string json = JsonConvert.SerializeObject(obj);
            this.Response.Write(json);
        }

        public int SqlupdateDeleleAdd(string _sql, Dictionary<string, KeyValuePair<SqlDbType, object>> parameters)
        {
            SqlConnection cn = new SqlConnection(conStr);
            cn.Open();
            string sql = _sql;
            SqlCommand cm = new SqlCommand(sql, cn);
            cm.CommandType = CommandType.StoredProcedure;

            if (parameters != null)
            {
                foreach (var parameter in parameters)
                {
                    cm.Parameters.Add(parameter.Key, parameter.Value.Key).Value = parameter.Value.Value;
                }
            }
            return cm.ExecuteNonQuery();
        }

        void UpdateSv()
        {
            Reply reply = new Reply();
            try
            {
                Dictionary<string, KeyValuePair<SqlDbType, object>> parameters = new Dictionary<string, KeyValuePair<SqlDbType, object>>();

                // Add parameters to the dictionary 
                parameters.Add("@action", new KeyValuePair<SqlDbType, object>(SqlDbType.VarChar, "updateSV"));
                parameters.Add("@Masv", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["masv"]));
                parameters.Add("@Tensv", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["tensv"]));
                parameters.Add("@NgaySinh", new KeyValuePair<SqlDbType, object>(SqlDbType.Date, (object)Request["ngaysinh"]));
                parameters.Add("@GioiTinh", new KeyValuePair<SqlDbType, object>(SqlDbType.Int, (object)Request["gioiTinh"]));
                parameters.Add("@sdt", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["sdt"]));
                parameters.Add("@lop", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["lop"]));

                int n = SqlupdateDeleleAdd("SP_Sinh_Vien", parameters);
                if (n > 0)
                {
                    reply.ok = true;
                }
                else
                {
                    reply.ok = false;
                    reply.msg = "error Update sinhvien!";
                }
            }
            catch(Exception ex)
            {
                reply.ok=false;
                reply.msg = ex.Message;
            }
            string json = JsonConvert.SerializeObject(reply);
            this.Response.Write(json);
        }
        void addSv()
        {
            Reply reply = new Reply();
            try
            {
                Dictionary<string, KeyValuePair<SqlDbType, object>> parameters = new Dictionary<string, KeyValuePair<SqlDbType, object>>();

                // Add parameters to the dictionary 
                parameters.Add("@action", new KeyValuePair<SqlDbType, object>(SqlDbType.VarChar, "addSinhvien"));
                parameters.Add("@Masv", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["masv"]));
                parameters.Add("@Tensv", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["tensv"]));
                parameters.Add("@NgaySinh", new KeyValuePair<SqlDbType, object>(SqlDbType.Date, (object)Request["ngaysinh"]));
                parameters.Add("@GioiTinh", new KeyValuePair<SqlDbType, object>(SqlDbType.Int, (object)Request["gioiTinh"]));
                parameters.Add("@sdt", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["sdt"]));
                parameters.Add("@lop", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["lop"]));

                int n = SqlupdateDeleleAdd("SP_Sinh_Vien", parameters);
                if (n > 0)
                {
                    reply.ok = true;
                }
                else
                {
                    reply.ok = false;
                    reply.msg = "error add sinhvien!";
                }
            }
            catch (Exception ex)
            {
                reply.ok = false;
                reply.msg = ex.Message;
            }
            string json = JsonConvert.SerializeObject(reply);
            this.Response.Write(json);
        }

        void DeleteSv()
        {
            Reply reply = new Reply();
            try
            {
                Dictionary<string, KeyValuePair<SqlDbType, object>> parameters = new Dictionary<string, KeyValuePair<SqlDbType, object>>();

                // Add parameters to the dictionary 
                parameters.Add("@action", new KeyValuePair<SqlDbType, object>(SqlDbType.VarChar, "DeleteSV"));
                parameters.Add("@Masv", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["masv"]));

                int n = SqlupdateDeleleAdd("SP_Sinh_Vien", parameters);
                if(n > 0)
                {
                    reply.ok = true;
                }
                else
                {
                    reply.ok= false;
                    reply.msg = "error Delete sinhvien!";
                }
            }
            catch (Exception ex)
            {
                reply.ok=false; 
                reply.msg = ex.Message;
            }
            string json = JsonConvert.SerializeObject(reply);
            this.Response.Write(json);
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            string action = Request["action"];
            switch (action)
            {
                case "DsSinhVien":
                    DsSinhVien();
                        break;
                case "DeleteSV":
                    DeleteSv();
                    break;
                case "updateSV":
                    UpdateSv();
                    break;
                case "addSinhvien":
                    addSv();
                    break;
                case "DsHopDong":
                    DsHopDong();
                    break;
                case "addHopDong":
                    AddHopDong();
                    break;
                case "DsAllMaSv":
                    DsMasv();
                    break;
                case "DsAllMaPhong":
                    DsMaPhong();
                    break;
                case "DeleteHopDong":
                    DeleteHopDong();
                    break;
                case "DSallsv":
                    DsAllSv();
                    break;
                case "updateHopDong":
                    UpdateHopDong();
                    break;
                case "DsPhong":
                    DsPhong();
                    break;
                case "DsDienNuoc":
                    DsDienNuoc();
                    break;
                case "AddDienNuoc":
                    AddDienNuoc();
                    break;
                case "DsLoaiPhong":
                    DsLoaiPhong();
                    break;
                case "DsHD_DienNuoc":
                    DsHD_DienNuoc();
                    break;
                case "AddHD_DienNuoc":
                    AddHoaDonDienNuoc();
                    break;
                case "MaHDDienNuoc":
                    getOnlyMaNuoc();
                    break;
                case "AddCT_HD_DienNuoc":
                    AddCT_HoaDonDienNuoc();
                    break;
                case "DeleteDienNuoc":
                    DeleteDienNuoc();
                    break;
                case "UpdateDienNuoc":
                    UpdateDienNuoc();
                    break;
                case "DsMaLoaiPhong":
                    DsMaLoaiPhong();
                    break;
                case "AddPhong":
                    AddPhong();
                    break;
                case "UpdatePhong":
                    UpdatePhong();
                    break;
                case "DeletePhong":
                    DeletePhong();
                    break;
                case "DsCT_HD_DienNuoc":
                    DsCT_HoaDonDienNuoc();
                    break;
                case "AddLoaiPhong":
                    AddLoaiPhong();
                    break;
                case "UpdateLoaiPhong":
                    UpdateLoaiPhong();
                    break;
                case "DeleteLoaiPhong":
                    DeleteLoaiPhong();
                    break;
                case "DeleteCT_HD_DienNuoc":
                    DeleteCT_HoaDon();
                    break;

            }
        }
    }
}