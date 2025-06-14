# Coding Interview

## Table of Content

-   [About](#about)
-   [Setup](#setup)
-   [Demo](#demo)
-   [Credits](#credits)

## About

### Tech Stack

-   Front end: Next.js w/ TypeScript & Tailwind CSS
-   Back end: Flask, Express.js, PostgreSQL

## Setup

### Project Structure

```
only relevant directories/files are listed

coding-interview
├─client
| ├─app
| ├─components
| └─lib
├─server
| ├─http
| └─ws
└─README.md
```

### Front End

```
# Install packages
npm install

# Run
npm run dev
```

### Back End (HTTP)

```
# Create a virtual environment
python3 -m venv .venv # Linux
py -3 -m venv .venv # Windows

# Activate the virtual environment
. .venv/bin/activate # Linux
.venv\Scripts\activate # Windows

# Deactivate the virtual environment
deactivate

# Save installed packages
pip freeze > requirements.txt

# Install packages
pip install -r requirements.txt

# Run
python app.py
```

### Back End (WS)

```
# Install packages
npm install

# Run
node app.js
```

## Demo

## Credits

-   Front end: Leo Lu
-   Back end: Sam Wang, Leo Lu
