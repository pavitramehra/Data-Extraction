import pandas as pd
import cx_Oracle
import logging
logging.basicConfig(level=logging.DEBUG,filemode='w')
formatter=logging.Formatter('%(levelname)s:%(name)s:%(message)s')
logger=logging.getLogger(__name__)
logger.setLevel(logging.ERROR)
file_handler= logging.FileHandler('error1.log')
logger.addHandler(file_handler)

class main():
    def __init__(self):
        self.input_data=None
        self.cur=None
    def auth(self,db_username,db_password,db_hostname,db_port,db_sid):
        dsn = cx_Oracle.makedsn(
                    db_hostname, 
                    db_port, 
                    service_name=db_sid
        )
        conn=cx_Oracle.connect(user=db_username,password=db_password,dsn=dsn)
        self.cur=conn.cursor()
        
    def read(self,source_file):
        self.input_data=pd.read_excel(source_file)
        
    def write(self,destination_file):
        for key,value in self.input_data.iterrows():
            print(key,value[0])
            print("...........................................")
            query=""
            if(str(value[3])!="nan"):
                query=" ".join(["SELECT",str(value[2]),"FROM",str(value[1]),"WHERE",str(value[3])])
            else:
                query=" ".join(["SELECT",str(value[2]),"FROM",str(value[1])])
            print(query)
            ans=[]
            try:
                self.cur.execute(query)
                for res in self.cur:
                    print(res)
                l=list(res)
                ans.append(l)
                df=pd.DataFrame(ans)
                print(ans)
                string=str(destination_file)+value[0]+'.csv'
                df.to_csv(string)
            except cx_Oracle.DatabaseError as e:
                error, = e.args
                #print(error.message)
                #print(error.context)
                
                logger.error(error.message)
                #logger.error(error.context)
    def service(self,source_file,destination_file):
            read(source_file)
            write(destination_file)
                
            new=main()
            new.auth('CM_GA5_ARCH_V1','CM_GA5_ARCH_V1','10.1.63.118', '1521','balic2h')
            new.read('C:/Users/pavitra.mehra/Desktop/FILEDATA.xls')
            new.write('C:/Users/pavitra.mehra/Desktop/')
