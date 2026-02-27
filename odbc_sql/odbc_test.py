import pyodbc

server = "sqlmi-datahub-dev.public.4daf3b0b0385.database.chinacloudapi.cn"
port = 3342
user = "frank.fu"
password = "wp4w2o6T#^"
database = "datahubdev" 

conn_str = (
    "DRIVER={ODBC Driver 18 for SQL Server};"
    f"SERVER={server},{port};"
    f"DATABASE={database};"
    f"UID={user};PWD={password};"
    "Encrypt=yes;"
    "TrustServerCertificate=yes;" 
    "Connection Timeout=30;"
)

cn = pyodbc.connect(conn_str)
cur = cn.cursor()
cur.execute("SELECT @@VERSION")
print(cur.fetchone()[0])
cn.close()