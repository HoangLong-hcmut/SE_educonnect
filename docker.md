docker compose up -d


docker exec -it se_mysql mysql -uroot -p123456 --protocol=TCP  ### Chạy và tự lông chạy hết các lệnh trong mysql_init

docker exec -i se_mysql mysql -u root -p123456 < mysql_init/create.sql #### chạy riêng từng file sql 

SHOW DATABASES;
USE educonnect;
SHOW TABLES;
DESCRIBE Users;

SELECT * FROM Users;
