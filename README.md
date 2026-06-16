# FastAPI Blog

A full-stack blog application with a FastAPI backend and a vanilla ES module frontend (React via CDN, no build step).

## Features

- JWT authentication (login / register)
- Protected blog CRUD — create, read, update, delete
- SQLite database via SQLAlchemy
- Frontend served directly by FastAPI as static files

## Project Structure

```
fastapi-project/
├── call_api.py               # Uvicorn entry point
├── requirements.txt
└── CRUD/
    ├── main.py               # FastAPI app, router registration, static file mount
    ├── models.py             # SQLAlchemy models (User, Blog)
    ├── schemas.py            # Pydantic request/response schemas
    ├── database.py           # DB engine and session
    ├── hashing.py            # bcrypt password hashing
    ├── JWTtoken.py           # JWT creation and decoding
    ├── routers/
    │   ├── authentication.py # POST /login
    │   ├── blog.py           # GET/POST/PUT/DELETE /blog
    │   └── user.py           # POST /user, GET /user/{id}
    ├── repo/
    │   ├── blog.py           # Blog DB operations
    │   └── user.py           # User DB operations
    └── static/
        ├── index.html        # HTML shell + CSS
        └── js/
            ├── App.js        # Root React component
            ├── api.js        # All fetch calls
            └── components/
                ├── Auth.js       # Login + Register tabs
                └── BlogList.js   # Blog list, create form, BlogCard (edit/delete)
```

## Setup

**1. Create and activate a virtual environment**

```bash
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
```

**2. Install dependencies**

```bash
pip install -r requirements.txt
```

**3. Run the server**

```bash
python call_api.py
```

The app is available at `http://127.0.0.1:8000`.

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/login` | No | Get a JWT token |
| POST | `/user/` | No | Create a new user |
| GET | `/user/{id}` | No | Get a user by ID |
| GET | `/blog/` | Yes | List all blogs |
| POST | `/blog/` | Yes | Create a blog |
| GET | `/blog/{id}` | Yes | Get a blog by ID |
| PUT | `/blog/{id}` | Yes | Update a blog |
| DELETE | `/blog/{id}` | Yes | Delete a blog |

Interactive API docs are available at `http://127.0.0.1:8000/docs`.

## Tech Stack

- **Backend** — FastAPI, SQLAlchemy, Pydantic v2, python-jose (JWT), passlib + bcrypt
- **Frontend** — React 18 (via esm.sh), htm (JSX-like templates), native ES modules
