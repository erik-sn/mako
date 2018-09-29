# Mako

System to build, manage and deploy classifiers.

## Get in contact & view progress

- [Join Slack](https://join.slack.com/t/mako-app/shared_invite/enQtMzgyMDA5MjQ3NTY4LTAyOTk5NDI0ZDYzYjhmYzY5YmM1NmU3NDljYWI0OThiNzkwOTAxZjI5ZTA4YzIzNjcyNTYzNmNlNzkyYWQ1ODc)
- [Trello feature board](https://trello.com/b/sFrWSZjs/features)
- [Trello development board](https://trello.com/b/APQNIYqL/development)
    

## Target feature set

- User authentication through registration, or OAuth2 through google & github
- User interface to allow non-technical users to build categories of data and train
machine learning classifiers
- Provide tools to support data collection
    - Integrated Jupyter notebook hosting
    - Image catalogue
    - Google image parser
    - Image manipulation
    - visualization

- Allow technical users to upload their own classifiers of any type
- API access to classifiers through owner defined JSON interfaces
- Versioning & rollback capability on classifiers & APIs
- Micro-service architecture approach to hosting these APIs - each endpoint should live
in its own "pod". It should be able to be updated, restarted and scale independently without
affecting any other part of the system
- APIs have the capability to accept user feedback and retrain themselves
on either feedback thresholds, time intervals, or on the owner's instruction
- APIs keep metrics on their usage, performance and behavior over time
- more TBD

### Setting up Development environment

1. Pre-install requirements:
    
    - Docker
    - Node 8+
    
2. Start API server:

Fill out the `.env.template` file with variables and then copy it as `.env`
in the root directory - this file is git ignored.

Then in the api directory:
```bash
docker-compose up
```

browse to http://localhost:8000/api/v1/

3. Start node server:

Starting in the root directory in a new terminal:
```bash
cd frontend
npm i
npm run dev
```

and browse to http://localhost:3000


### Kubernetes environment

**Warning: This environment is not ready for production (hard coded variables, secrets,
etc.). Only used for development purposes right now**

Primary prerequisites:

1. [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/)
2. [Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
2. [Telepresence](https://www.telepresence.io/reference/install)

```
minikube start

# open the kubernetes dashboard in your browser
minikube dashboard

# build starting API & web docker containers
bash build.sh

# Launch all services into the minikube Kubernetes cluster
kubectl apply -R -f k8s

# retrieve the URL of the API gateway
minikube service ambassador --url  # open this in your browser
```

##### Local development in Kubernetes cluster

All services in the Kubernetes environment are behind an API gateway,
[Ambassador](https://www.getambassador.io/#get-started). Instead of making
a code change, rebuilding docker containers, and then applying changes
to the K8S cluster, we can write our code locally and have it apply inside
the K8S pod it is running in. This will simulate an exact production
environment.

To do this we use Telepresence. Below is an example command to proxy our
local api service into the K8S service. From the root directory:

```
telepresence --swap-deployment mako-api --expose 8000  --docker-run  -it -p 8000:8000 -v $(pwd)/api:/code --entrypoint "/bin/bash" mako_api:latest
# or run this in the bash script in the repo
bash dev.sh
```

### Contributing

Join & ask in slack! General guidelines:

1. All work is subject to reviews before merge
2. Work in feature branches
3. Rebase your branch on top of master, we will try to maintain a clean git history
4. Utilize linters & styling tools. TSlint & Prettier for the frontend, PEP8 for Python


### Technologies

- Backend API: Django, DRF, Postgres, Redis, Celery
- Frontend: React, Redux, TypeScript
- ML: Pytorch


