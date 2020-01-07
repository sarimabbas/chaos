# Chaos

> CPSC 490

## Current screenshot

![Current Screenshot](./docs/screenshots/current.png)

## Setup

### Setup backend

```
cd src/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Setup frontend

```
cd src/frontend
yarn install
```

## Development mode

```
cd src
source backend/venv/bin/activate
python3 manage.py --dev
```

## Build production app

```
cd src
source backend/venv/bin/activate
python3 manage.py --build
```

View the built app in `dist/`.