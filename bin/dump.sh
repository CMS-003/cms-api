#!bin/bash
mongodump -u root --authenticationDatabase admin -d manager -o ./
tar -zcvf manager.tar.gz ./manager