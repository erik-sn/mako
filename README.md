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

In the root directory:
```bash
docker-compose up
```

3. Start node server:

Starting in the root directory:
```bash
cd frontend
npm i
npm run dev
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


