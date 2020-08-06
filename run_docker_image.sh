#!/usr/bin/env bash
endpoint_url=${CONFIGSERVER_NAME:-http://configserver}
profiles=${PROFILES:-test}
app_name=${SPRING_APPLICATION_NAME:-unleash}
config_user=${CONFIGSERVER_USER:-test}
password=${CONFIGSERVER_PASSWORD:-test}
NODE_ENV=production CONFIGSERVER_NAME=$endpoint_url APP=$app_name PROFILES=$profiles CONFIGSERVER_PASSWORD=$password CLOUD_CONFIG_USER=$config_user npm run start
