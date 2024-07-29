#!bin/bash
tar -xzvf manager.tar.gz
mongorestore -u root --authenticationDatabase admin -d manager