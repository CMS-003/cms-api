#!bin/bash
mongodump -u root --authenticationDatabase admin -d cms-manager -o ./cms-manager-old
tar -zcvf manager.tar.gz ./manager