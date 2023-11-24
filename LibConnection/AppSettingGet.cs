using System.Configuration;

namespace QuanLyKTX_Do_an.LibConnection
{
    public class AppSettingGet
    {
        //Get connection from Web.config
        public static string ConnectionString
        {
            get
            {
                return ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;
            }
        }
    }
}