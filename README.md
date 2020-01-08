# Chaos

> CPSC 490

- [Chaos](#chaos)
  - [Current screenshot](#current-screenshot)
  - [Setup](#setup)
    - [Setup frontend](#setup-frontend)
    - [Setup backend](#setup-backend)
  - [Development mode](#development-mode)
  - [Build production app](#build-production-app)

## Current screenshot

![Current Screenshot](./docs/screenshots/current.png)

## Setup

### Setup frontend

```
cd src/frontend
yarn install
```

### Setup backend

```
cd src/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Development mode

```
python3 manage.py --dev
```

## Build production app

```
python3 manage.py --build
```

View the built app in `dist/`.
