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


        void DeleteHopDong()
        {
            Reply reply = new Reply();
            try
            {
                Dictionary<string, KeyValuePair<SqlDbType, object>> parameters = new Dictionary<string, KeyValuePair<SqlDbType, object>>();

                // Add parameters to the dictionary 
                parameters.Add("@action", new KeyValuePair<SqlDbType, object>(SqlDbType.VarChar, "DeleteHopDong"));
                parameters.Add("@MaHopDong", new KeyValuePair<SqlDbType, object>(SqlDbType.NVarChar, (object)Request["MahopDong"]));

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

            }
        }
    }
}