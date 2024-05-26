re:	clean up

clean:
	docker-compose down -t 2 --remove-orphans

up: 
	docker-compose up -d 

build: clean
	docker-compose build