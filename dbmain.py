import pandas as pd
import cx_Oracle
import logging


class main():
    def __init__(self):
        self.input_data=None
        self.cursor=None
        self.database=None
        self.user_connected="Not connected"
        self.db_username=None
        self.service_connected="Not Imported"
        logging.basicConfig(level=logging.DEBUG,filemode='w')
        formatter=logging.Formatter('%(levelname)s:%(name)s:%(message)s')
        self.logger=logging.getLogger(__name__)
        self.logger.setLevel(logging.ERROR)
        file_handler= logging.FileHandler('error1.log')
        self.logger.addHandler(file_handler)
    def auth(self,db_username,db_password,db_hostname,db_port,db_sid):
        dsn = cx_Oracle.makedsn(
                    db_hostname, 
                    db_port, 
                    service_name=db_sid
        )
        try:
            self.database=cx_Oracle.connect(user=db_username,password=db_password,dsn=dsn)
            self.cursor=self.database.cursor()
            self.user_connected="Connected"
        
        except cx_Oracle.DatabaseError as e:
                error, = e.args
                self.user_connected="Not connected"
                if error.code == 1017:
                    self.logger.error(error.message)
                else:
                    self.logger.error(error.message)
           
        
    def read(self,source_file):
        try:
            self.input_data=pd.read_excel(source_file)

        except:
            self.logger.error("Cant read the excel file")
            self.service_connected="Not imported"
        
    def write(self,destination_file):
            try:
                for key,value in self.input_data.iterrows():
                    query=""
                    substr="LIKE"
                    if(str(value[3]).find(substr)!=-1):
                        condition_string=value[3].split(',')
                        new="'%"+condition_string[2]+"%'"
                        condition_string[2]=new
                        value[3]=" ".join([condition_string[0],condition_string[1],condition_string[2]])
                        query=" ".join(["SELECT",str(value[2]),"FROM",str(value[1]),"WHERE",str(value[3])])
                    elif(str(value[3])!="nan"):
                        query=" ".join(["SELECT",str(value[2]),"FROM",str(value[1]),"WHERE",str(value[3])])
                    else:
                        query=" ".join(["SELECT",str(value[2]),"FROM",str(value[1])])
                    header=list(value[2].split(','))
                    ans=[]
                    try:
                        self.cursor.execute(query)
                        for res in self.cursor:
                            l=list(res)
                            ans.append(l)
                        df=pd.DataFrame(ans)
                        df.columns=header
                        string=str(destination_file)+value[0]+'.csv'
                        try:
                            df.to_csv(string,index=False)
                            self.service_connected="Imported"
                        except:
                            self.error.log("Cant find directory")
                            self.service_connected="Not Imported"
                      
                    except cx_Oracle.DatabaseError as e:
                        error, = e.args
                        self.service_connected="Not Imported"
                        self.logger.error(error.message)
            except:
                self.logger.error("Not able to perform read operation")
                self.service_connected="Not imported"
                
    def service(self,source_file,destination_file): #return import status
            self.read(source_file)
            self.write(destination_file)
            return self.service_connected

    def get_status(self): #connected or not
        return self.user_connected

   
       

    def get_db_name(self):
        return self.db_username
                



