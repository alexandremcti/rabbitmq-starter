# rabbitmq-starter
Project to studies with Rabbitmq

## Overview

In this project, I practice the basic concepts from event driven architecture, message broker, amqp and include the lib Testcontainers for performing integration tests with RabbitMq.

For performing tests, you must install <a hef="https://docs.docker.com/get-docker/">docker</a> and <a href="https://docs.docker.com/compose/install/linux/">docker compose</a> if you do not have in the machine.

After this, add the docker in the permission group of current user and restart the machine:

``` shell
sudo groupadd docker
sudo gpasswd -a $USER docker
sudo systemctl restart docker
```
