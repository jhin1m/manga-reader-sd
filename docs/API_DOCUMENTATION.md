# MyManga VN API v1 Documentation

Complete RESTful API documentation for the Laravel manga platform.

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

The API uses Laravel Sanctum for authentication. Include the bearer token in the Authorization header:

```
Authorization: Bearer {token}
```

For SPA authentication, you'll need to first get a CSRF token:

```
GET http://localhost:8000/sanctum/csrf-cookie
```

## Standard Response Format

### Success Response

```json
{
  "success": true,
  "message": "Success message",
  "data": {...},
  "meta": {
    "pagination": {...},
    "timestamp": "2024-01-01T00:00:00.000000Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": {...}
}
```

## Rate Limiting

- **General**: 60 requests per minute
- **Authenticated users**: Higher limits
- **Search endpoints**: Separate limits

## CORS

Configured for Next.js domains:

- `localhost:3000`, `localhost:3001`
- `*.vercel.app`, `*.netlify.app`
- Custom domains via `FRONTEND_URL` env variable

---

## Authentication Endpoints

### POST /auth/login

Login user and get access token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 15,
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Nguyễn Văn A",
      "email": "user@example.com",
      "avatar_full_url": "https://domain.example/storage/images/avatars/user-15.jpg",
      "total_points": 1500,
      "used_points": 300,
      "available_points": 1200,
      "achievements_points": 250,
      "created_at": "2024-01-15T10:30:00.000000Z",
      "updated_at": "2024-03-20T14:25:00.000000Z"
    },
    "token": "1|8fX3k9Lm2nP4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN",
    "token_type": "Bearer"
  }
}
```

**Validation Error (422):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password field is required."]
  }
}
```

**Authentication Error (401):**

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### POST /auth/register

Register new user account.

**Request Body:**

```json
{
  "name": "Nguyễn Văn B",
  "email": "newuser@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 42,
      "uuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "name": "Nguyễn Văn B",
      "email": "newuser@example.com",
      "avatar_full_url": "https://domain.example/storage/images/avatars/default.jpg",
      "total_points": 100,
      "used_points": 0,
      "available_points": 100,
      "achievements_points": 0,
      "created_at": "2024-03-28T16:30:00.000000Z",
      "updated_at": "2024-03-28T16:30:00.000000Z"
    },
    "token": "2|aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2yZ3",
    "token_type": "Bearer"
  }
}
```

**Validation Error (422):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email has already been taken."],
    "password": ["The password confirmation does not match."]
  }
}
```

---

### POST /auth/google

Authenticate with Google OAuth.

**Request Body:**

```json
{
  "access_token": "ya29.a0AfH6SMBx7K3m..."
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Google authentication successful",
  "data": {
    "user": {
      "id": 18,
      "uuid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "Trần Thị C",
      "email": "tran.c@gmail.com",
      "avatar_full_url": "https://lh3.googleusercontent.com/a/...",
      "total_points": 100,
      "used_points": 0,
      "available_points": 100,
      "achievements_points": 0,
      "created_at": "2024-03-28T16:45:00.000000Z",
      "updated_at": "2024-03-28T16:45:00.000000Z"
    },
    "token": "3|cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2yZ3aB",
    "token_type": "Bearer"
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "message": "Invalid Google access token"
}
```

---

### GET /auth/profile

Get authenticated user profile with achievements and pets.

**Headers:** `Authorization: Bearer {token}`

**Success Response (200):**

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 15,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "avatar_full_url": "https://domain.example/storage/images/avatars/user-15.jpg",
    "total_points": 1500,
    "used_points": 300,
    "available_points": 1200,
    "achievements_points": 250,
    "limit_pet_points": 1000,
    "limit_achievement_points": 1000,
    "created_at": "2024-01-15T10:30:00.000000Z",
    "updated_at": "2024-03-20T14:25:00.000000Z",
    "pet": {
      "id": 5,
      "uuid": "6e7f8a9b-0c1d-2e3f-4a5b-6c7d8e9f0a1b",
      "name": "Rồng Vàng",
      "description": "Pet huyền thoại với sức mạnh khổng lồ",
      "image": "/storage/images/pets/golden-dragon.png",
      "points": 500
    },
    "achievement": {
      "id": 8,
      "uuid": "7f8a9b0c-1d2e-3f4a-5b6c-7d8e9f0a1b2c",
      "name": "Veteran Reader",
      "description": "Đọc hơn 1000 chương",
      "icon": "🏆",
      "points": 200
    }
  }
}
```

---

### PUT /auth/profile

Update authenticated user profile.

**Headers:** `Authorization: Bearer {token}`

**Request Body (multipart/form-data):**

```
name=Nguyễn Văn A Updated
email=updated@example.com
password=newpassword123
password_confirmation=newpassword123
avatar=<file>
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 15,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Nguyễn Văn A Updated",
    "email": "updated@example.com",
    "avatar_full_url": "https://domain.example/storage/images/avatars/user-15-new.jpg",
    "total_points": 1500,
    "used_points": 300,
    "available_points": 1200,
    "achievements_points": 250,
    "created_at": "2024-01-15T10:30:00.000000Z",
    "updated_at": "2024-03-28T17:00:00.000000Z"
  }
}
```

**Validation Error (422):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email has already been taken."],
    "avatar": [
      "The avatar must be an image.",
      "The avatar must not be greater than 2048 kilobytes."
    ]
  }
}
```

---

### POST /auth/logout

Logout and revoke current access token.

**Headers:** `Authorization: Bearer {token}`

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

---

## Manga Endpoints

### GET /mangas

Get paginated list of mangas with filtering and sorting.

**Query Parameters:**

- `per_page` (int): Items per page (default: 20, max: 100)
- `page` (int): Page number
- `sort` (string): Sort field (-updated_at, views, rating, name)
- `filter[name]` (string): Search by name
- `filter[status]` (string): Filter by status (1=ongoing, 2=completed)
- `filter[genre_id]` (int): Filter by genre
- `include` (string): Include relationships (genres,artist,latest_chapter,group)

**Example Request:**

```
GET /api/v1/mangas?per_page=20&page=1&sort=-updated_at&include=genres,latest_chapter
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Mangas retrieved successfully",
  "data": [
    {
      "id": 42,
      "uuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "name": "One Piece",
      "name_alt": "Vua Hải Tặc",
      "slug": "one-piece",
      "pilot": "<p>Câu chuyện kể về Monkey D. Luffy, một cậu bé có ước mơ trở thành Vua Hải Tặc...</p>",
      "status": 1,
      "views": 1250000,
      "views_week": 45000,
      "views_day": 8500,
      "average_rating": 4.75,
      "total_ratings": 1523,
      "is_hot": true,
      "cover_full_url": "https://domain.example/storage/images/covers/manga-42.jpg",
      "created_at": "2023-01-10T08:15:00.000000Z",
      "updated_at": "2024-03-28T16:30:00.000000Z",
      "genres": [
        {
          "id": 7,
          "name": "Action",
          "slug": "action"
        },
        {
          "id": 12,
          "name": "Adventure",
          "slug": "adventure"
        }
      ],
      "latest_chapter": {
        "id": 1523,
        "name": "Chapter 1095",
        "slug": "chapter-1095",
        "order": 1095,
        "created_at": "2024-03-15T09:00:00.000000Z"
      }
    },
    {
      "id": 58,
      "uuid": "9a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d",
      "name": "Naruto",
      "name_alt": "Cửu Vĩ Hồ Ly",
      "slug": "naruto",
      "pilot": "<p>Naruto kể về cuộc phiêu lưu của Uzumaki Naruto...</p>",
      "status": 2,
      "views": 980000,
      "views_week": 12000,
      "views_day": 2500,
      "average_rating": 4.5,
      "total_ratings": 892,
      "is_hot": false,
      "cover_full_url": "https://domain.example/storage/images/covers/manga-58.jpg",
      "created_at": "2023-02-15T10:20:00.000000Z",
      "updated_at": "2024-03-20T14:15:00.000000Z",
      "genres": [
        {
          "id": 7,
          "name": "Action",
          "slug": "action"
        },
        {
          "id": 15,
          "name": "Fantasy",
          "slug": "fantasy"
        }
      ],
      "latest_chapter": {
        "id": 2847,
        "name": "Chapter 700",
        "slug": "chapter-700",
        "order": 700,
        "created_at": "2024-02-10T11:30:00.000000Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "current_page": 1,
      "last_page": 50,
      "per_page": 20,
      "total": 1000,
      "from": 1,
      "to": 20
    }
  }
}
```

---

### GET /mangas/recent

Get recently updated mangas.

**Query Parameters:**

- `per_page` (int): Items per page (default: 20)
- `genre_id` (int): Filter by genre ID
- `page` (int): Page number

**Example Request:**

```
GET /api/v1/mangas/recent?per_page=20&genre_id=7
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Recent mangas retrieved successfully",
  "data": [
    {
      "id": 42,
      "uuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "name": "One Piece",
      "name_alt": "Vua Hải Tặc",
      "slug": "one-piece",
      "status": 1,
      "views": 1250000,
      "average_rating": 4.75,
      "total_ratings": 1523,
      "is_hot": true,
      "cover_full_url": "https://domain.example/storage/images/covers/manga-42.jpg",
      "updated_at": "2024-03-28T16:30:00.000000Z",
      "latest_chapter": {
        "id": 1523,
        "name": "Chapter 1095",
        "slug": "chapter-1095",
        "created_at": "2024-03-15T09:00:00.000000Z"
      },
      "artist": {
        "id": 12,
        "name": "Oda Eiichiro",
        "slug": "oda-eiichiro"
      }
    }
  ],
  "meta": {
    "pagination": {
      "current_page": 1,
      "last_page": 15,
      "per_page": 20,
      "total": 300,
      "from": 1,
      "to": 20
    }
  }
}
```

---

### GET /mangas/hot

Get hot/trending mangas (is_hot=true).

**Query Parameters:**

- `per_page` (int): Items per page (default: 20)
- `page` (int): Page number

**Example Request:**

```
GET /api/v1/mangas/hot?per_page=10
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Hot mangas retrieved successfully",
  "data": [
    {
      "id": 42,
      "uuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "name": "One Piece",
      "name_alt": "Vua Hải Tặc",
      "slug": "one-piece",
      "status": 1,
      "views": 1250000,
      "views_week": 45000,
      "average_rating": 4.75,
      "is_hot": true,
      "cover_full_url": "https://domain.example/storage/images/covers/manga-42.jpg",
      "updated_at": "2024-03-28T16:30:00.000000Z"
    }
  ],
  "meta": {
    "pagination": {
      "current_page": 1,
      "last_page": 3,
      "per_page": 10,
      "total": 25,
      "from": 1,
      "to": 10
    }
  }
}
```

---

### GET /mangas/search

Search mangas by name.

**Query Parameters:**

- `q` (string, required): Search query (minimum: 2 characters)
- `per_page` (int): Items per page (default: 20)
- `page` (int): Page number

**Example Request:**

```
GET /api/v1/mangas/search?q=One Piece&per_page=20
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Search results retrieved successfully",
  "data": [
    {
      "id": 42,
      "uuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "name": "One Piece",
      "name_alt": "Vua Hải Tặc",
      "slug": "one-piece",
      "status": 1,
      "views": 1250000,
      "average_rating": 4.75,
      "cover_full_url": "https://domain.example/storage/images/covers/manga-42.jpg",
      "updated_at": "2024-03-28T16:30:00.000000Z"
    }
  ],
  "meta": {
    "pagination": {
      "current_page": 1,
      "last_page": 1,
      "per_page": 20,
      "total": 1,
      "from": 1,
      "to": 1
    },
    "search_query": "One Piece"
  }
}
```

**Validation Error (422):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "q": ["The q field is required.", "The q must be at least 2 characters."]
  }
}
```

---

### GET /mangas/{slug}

Get specific manga details with all relationships.

**Example Request:**

```
GET /api/v1/mangas/one-piece
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Manga retrieved successfully",
  "data": {
    "id": 42,
    "uuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "name": "One Piece",
    "name_alt": "Vua Hải Tặc",
    "slug": "one-piece",
    "pilot": "<p>Câu chuyện kể về Monkey D. Luffy, một cậu bé có ước mơ trở thành Vua Hải Tặc. Sau khi ăn trái ác quỷ Gomu Gomu no Mi, cơ thể Luffy trở nên co giãn như cao su. Cùng với băng hải tặc Mũ Rơm, Luffy bắt đầu cuộc hành trình tìm kiếm kho báu huyền thoại One Piece...</p>",
    "status": 1,
    "views": 1250000,
    "views_week": 45000,
    "views_day": 8500,
    "average_rating": 4.75,
    "total_ratings": 1523,
    "is_hot": true,
    "is_reviewed": 1,
    "cover_full_url": "https://domain.example/storage/images/covers/manga-42.jpg",
    "created_at": "2023-01-10T08:15:00.000000Z",
    "updated_at": "2024-03-28T16:30:00.000000Z",
    "genres": [
      {
        "id": 7,
        "uuid": "8f0e5f9c-2e3b-4d1a-9c7f-3e4b5c6d7e8f",
        "name": "Action",
        "slug": "action",
        "color": "#FF5733"
      },
      {
        "id": 12,
        "uuid": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
        "name": "Adventure",
        "slug": "adventure",
        "color": "#33FF57"
      },
      {
        "id": 18,
        "uuid": "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
        "name": "Comedy",
        "slug": "comedy",
        "color": "#3357FF"
      }
    ],
    "artist": {
      "id": 12,
      "uuid": "9d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a",
      "name": "Oda Eiichiro",
      "slug": "oda-eiichiro",
      "description": "Tác giả nổi tiếng của One Piece"
    },
    "group": {
      "id": 5,
      "uuid": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
      "name": "Team Việt Hóa",
      "slug": "team-viet-hoa"
    },
    "latest_chapter": {
      "id": 1523,
      "uuid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "Chapter 1095",
      "slug": "chapter-1095",
      "views": 125000,
      "order": 1095,
      "created_at": "2024-03-15T09:00:00.000000Z"
    },
    "first_chapter": {
      "id": 428,
      "uuid": "4a5b6c7d-8e9f-0a1b-2c3d-4e5f6a7b8c9d",
      "name": "Chapter 1",
      "slug": "chapter-1",
      "views": 500000,
      "order": 1,
      "created_at": "2023-01-10T08:30:00.000000Z"
    }
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "Manga not found"
}
```

---

### GET /mangas/{slug}/chapters

Get all chapters for a specific manga.

**Query Parameters:**

- `per_page` (int): Items per page (default: 50, max: 100)
- `sort` (string): Order (asc or desc, default: asc)
- `page` (int): Page number

**Example Request:**

```
GET /api/v1/mangas/one-piece/chapters?per_page=50&sort=desc&page=1
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Manga chapters retrieved successfully",
  "data": [
    {
      "id": 1523,
      "uuid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "Chapter 1095",
      "slug": "chapter-1095",
      "views": 125000,
      "order": 1095,
      "chapter_number": 1095,
      "created_at": "2024-03-15T09:00:00.000000Z",
      "updated_at": "2024-03-15T09:00:00.000000Z"
    },
    {
      "id": 1522,
      "uuid": "5b6c7d8e-9f0a-1b2c-3d4e-5f6a7b8c9d0e",
      "name": "Chapter 1094",
      "slug": "chapter-1094",
      "views": 135000,
      "order": 1094,
      "chapter_number": 1094,
      "created_at": "2024-03-08T09:00:00.000000Z",
      "updated_at": "2024-03-08T09:00:00.000000Z"
    }
  ],
  "meta": {
    "pagination": {
      "current_page": 1,
      "last_page": 22,
      "per_page": 50,
      "total": 1095,
      "from": 1,
      "to": 50
    },
    "manga": {
      "id": 42,
      "name": "One Piece",
      "slug": "one-piece"
    }
  }
}
```

---

## Chapter Endpoints

### GET /chapters/{slug}

Get chapter details with content and navigation.

**Example Request:**

```
GET /api/v1/chapters/chapter-1095
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Chapter retrieved successfully",
  "data": {
    "id": 1523,
    "uuid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Chapter 1095",
    "slug": "chapter-1095",
    "views": 125000,
    "order": 1095,
    "chapter_number": 1095,
    "created_at": "2024-03-15T09:00:00.000000Z",
    "updated_at": "2024-03-15T09:00:00.000000Z",
    "content": [
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/1.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/2.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/3.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/4.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/5.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/6.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/7.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/8.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/9.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/10.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/11.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/12.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/13.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/14.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/15.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/16.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/17.jpg"
    ],
    "manga": {
      "id": 42,
      "uuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "name": "One Piece",
      "name_alt": "Vua Hải Tặc",
      "slug": "one-piece",
      "cover_full_url": "https://domain.example/storage/images/covers/manga-42.jpg"
    }
  },
  "meta": {
    "navigation": {
      "previous": {
        "id": 1522,
        "uuid": "5b6c7d8e-9f0a-1b2c-3d4e-5f6a7b8c9d0e",
        "slug": "chapter-1094",
        "name": "Chapter 1094",
        "order": 1094
      },
      "next": {
        "id": 1524,
        "uuid": "6c7d8e9f-0a1b-2c3d-4e5f-6a7b8c9d0e1f",
        "slug": "chapter-1096",
        "name": "Chapter 1096",
        "order": 1096
      }
    },
    "manga": {
      "id": 42,
      "name": "One Piece",
      "slug": "one-piece"
    }
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "Chapter not found"
}
```

---

### GET /chapters/{slug}/images

Get chapter images for reading interface.

**Example Request:**

```
GET /api/v1/chapters/chapter-1095/images
```

**Headers:** `Authorization: Bearer {token}` (optional)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Chapter images retrieved successfully",
  "data": {
    "chapter": {
      "id": 1523,
      "uuid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "Chapter 1095",
      "slug": "chapter-1095",
      "views": 125000,
      "order": 1095,
      "created_at": "2024-03-15T09:00:00.000000Z",
      "manga": {
        "id": 42,
        "name": "One Piece",
        "slug": "one-piece"
      }
    },
    "images": [
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/1.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/2.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/3.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/4.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/5.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/6.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/7.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/8.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/9.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/10.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/11.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/12.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/13.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/14.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/15.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/16.jpg",
      "https://domain.example/dcn/7c9e6679-7425-40de-944b-e07fc1f90ae7/3fa85f64-5717-4562-b3fc-2c963f66afa6/17.jpg"
    ]
  }
}
```

**Note:** This endpoint automatically tracks reading history for authenticated users.

---

### POST /chapters/{slug}/views

Increment chapter and manga view counters.

**Headers:** `Authorization: Bearer {token}` (optional)

**Example Request:**

```
POST /api/v1/chapters/chapter-1095/views
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Views updated successfully",
  "data": {
    "chapter_views": 125001,
    "manga_views": 1250001
  }
}
```

---

## Taxonomy Endpoints

### Genres

#### GET /genres

Get all genres with manga counts.

**Query Parameters:**

- `per_page` (int): Items per page (default: 50)
- `page` (int): Page number

**Example Request:**

```
GET /api/v1/genres
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Genres retrieved successfully",
  "data": [
    {
      "id": 7,
      "uuid": "8f0e5f9c-2e3b-4d1a-9c7f-3e4b5c6d7e8f",
      "name": "Action",
      "slug": "action",
      "description": "Thể loại hành động kịch tính",
      "color": "#FF5733",
      "is_nsfw": false,
      "created_at": "2023-01-05T00:00:00.000000Z",
      "updated_at": "2023-01-05T00:00:00.000000Z",
      "mangas_count": 1250
    },
    {
      "id": 12,
      "uuid": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
      "name": "Adventure",
      "slug": "adventure",
      "description": "Phiêu lưu mạo hiểm",
      "color": "#33FF57",
      "is_nsfw": false,
      "created_at": "2023-01-05T00:00:00.000000Z",
      "updated_at": "2023-01-05T00:00:00.000000Z",
      "mangas_count": 980
    },
    {
      "id": 15,
      "uuid": "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
      "name": "Fantasy",
      "slug": "fantasy",
      "description": "Giả tưởng, phép thuật",
      "color": "#3357FF",
      "is_nsfw": false,
      "created_at": "2023-01-05T00:00:00.000000Z",
      "updated_at": "2023-01-05T00:00:00.000000Z",
      "mangas_count": 875
    }
  ],
  "meta": {
    "pagination": {
      "current_page": 1,
      "last_page": 1,
      "per_page": 50,
      "total": 25,
      "from": 1,
      "to": 25
    }
  }
}
```

---

#### GET /genres/{slug}

Get specific genre details.

**Example Request:**

```
GET /api/v1/genres/action
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Genre retrieved successfully",
  "data": {
    "id": 7,
    "uuid": "8f0e5f9c-2e3b-4d1a-9c7f-3e4b5c6d7e8f",
    "name": "Action",
    "slug": "action",
    "description": "Thể loại hành động kịch tính với các trận chiến gay cấn",
    "color": "#FF5733",
    "is_nsfw": false,
    "created_at": "2023-01-05T00:00:00.000000Z",
    "updated_at": "2023-01-05T00:00:00.000000Z",
    "mangas_count": 1250
  }
}
```

---

#### GET /genres/{slug}/mangas

Get mangas for a specific genre.

**Query Parameters:**

- `per_page` (int): Items per page (default: 20)
- `sort` (string): Sort order (-updated_at, views, rating, name)
- `page` (int): Page number

**Example Request:**

```
GET /api/v1/genres/action/mangas?per_page=20&sort=-updated_at
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Genre mangas retrieved successfully",
  "data": [
    {
      "id": 42,
      "uuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "name": "One Piece",
      "slug": "one-piece",
      "status": 1,
      "views": 1250000,
      "average_rating": 4.75,
      "cover_full_url": "https://domain.example/storage/images/covers/manga-42.jpg",
      "updated_at": "2024-03-28T16:30:00.000000Z",
      "latest_chapter": {
        "id": 1523,
        "name": "Chapter 1095",
        "slug": "chapter-1095",
        "created_at": "2024-03-15T09:00:00.000000Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "current_page": 1,
      "last_page": 63,
      "per_page": 20,
      "total": 1250,
      "from": 1,
      "to": 20
    },
    "genre": {
      "id": 7,
      "name": "Action",
      "slug": "action"
    }
  }
}
```

---

### Artists

#### GET /artists

Get all artists with optional search.

**Query Parameters:**

- `search` (string): Search by artist name
- `per_page` (int): Items per page (default: 50)
- `page` (int): Page number

**Example Request:**

```
GET /api/v1/artists?search=Oda
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Artists retrieved successfully",
  "data": [
    {
      "id": 12,
      "uuid": "9d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a",
      "name": "Oda Eiichiro",
      "slug": "oda-eiichiro",
      "description": "Tác giả nổi tiếng của One Piece",
      "created_at": "2023-01-08T00:00:00.000000Z",
      "updated_at": "2023-01-08T00:00:00.000000Z",
      "mangas_count": 3
    }
  ],
  "meta": {
    "pagination": {
      "current_page": 1,
      "last_page": 1,
      "per_page": 50,
      "total": 1,
      "from": 1,
      "to": 1
    }
  }
}
```

---

#### GET /artists/{slug}

Get specific artist details.

**Example Request:**

```
GET /api/v1/artists/oda-eiichiro
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Artist retrieved successfully",
  "data": {
    "id": 12,
    "uuid": "9d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a",
    "name": "Oda Eiichiro",
    "slug": "oda-eiichiro",
    "description": "Oda Eiichiro là tác giả manga Nhật Bản nổi tiếng, người sáng tạo ra series One Piece - một trong những manga bán chạy nhất mọi thời đại.",
    "created_at": "2023-01-08T00:00:00.000000Z",
    "updated_at": "2023-01-08T00:00:00.000000Z",
    "mangas_count": 3
  }
}
```

---

#### GET /artists/{slug}/mangas

Get mangas by a specific artist.

**Query Parameters:**

- `per_page` (int): Items per page (default: 20)
- `page` (int): Page number

**Example Request:**

```
GET /api/v1/artists/oda-eiichiro/mangas
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Artist mangas retrieved successfully",
  "data": [
    {
      "id": 42,
      "uuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "name": "One Piece",
      "slug": "one-piece",
      "status": 1,
      "views": 1250000,
      "average_rating": 4.75,
      "cover_full_url": "https://domain.example/storage/images/covers/manga-42.jpg",
      "updated_at": "2024-03-28T16:30:00.000000Z"
    }
  ],
  "meta": {
    "pagination": {
      "current_page": 1,
      "last_page": 1,
      "per_page": 20,
      "total": 3,
      "from": 1,
      "to": 3
    },
    "artist": {
      "id": 12,
      "name": "Oda Eiichiro",
      "slug": "oda-eiichiro"
    }
  }
}
```

---

### Groups

#### GET /groups

Get all translation groups.

**Query Parameters:**

- `per_page` (int): Items per page (default: 50)
- `page` (int): Page number

**Example Request:**

```
GET /api/v1/groups
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Groups retrieved successfully",
  "data": [
    {
      "id": 5,
      "uuid": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
      "name": "Team Việt Hóa",
      "slug": "team-viet-hoa",
      "description": "Nhóm dịch manga chuyên nghiệp",
      "created_at": "2023-02-12T00:00:00.000000Z",
      "updated_at": "2023-02-12T00:00:00.000000Z",
      "mangas_count": 87
    }
  ],
  "meta": {
    "pagination": {
      "current_page": 1,
      "last_page": 1,
      "per_page": 50,
      "total": 15,
      "from": 1,
      "to": 15
    }
  }
}
```

---

#### GET /groups/{slug}

Get specific group details.

**Example Request:**

```
GET /api/v1/groups/team-viet-hoa
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Group retrieved successfully",
  "data": {
    "id": 5,
    "uuid": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
    "name": "Team Việt Hóa",
    "slug": "team-viet-hoa",
    "description": "Nhóm dịch manga chuyên nghiệp với nhiều năm kinh nghiệm",
    "created_at": "2023-02-12T00:00:00.000000Z",
    "updated_at": "2023-02-12T00:00:00.000000Z",
    "mangas_count": 87
  }
}
```

---

#### GET /groups/{slug}/mangas

Get mangas by a translation group.

**Query Parameters:**

- `per_page` (int): Items per page (default: 20)
- `page` (int): Page number

**Example Request:**

```
GET /api/v1/groups/team-viet-hoa/mangas
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Group mangas retrieved successfully",
  "data": [
    {
      "id": 42,
      "uuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "name": "One Piece",
      "slug": "one-piece",
      "status": 1,
      "views": 1250000,
      "average_rating": 4.75,
      "cover_full_url": "https://domain.example/storage/images/covers/manga-42.jpg",
      "updated_at": "2024-03-28T16:30:00.000000Z"
    }
  ],
  "meta": {
    "pagination": {
      "current_page": 1,
      "last_page": 5,
      "per_page": 20,
      "total": 87,
      "from": 1,
      "to": 20
    },
    "group": {
      "id": 5,
      "name": "Team Việt Hóa",
      "slug": "team-viet-hoa"
    }
  }
}
```

---

### Doujinshis

#### GET /doujinshis

Get all doujinshi categories.

**Query Parameters:**

- `per_page` (int): Items per page (default: 50)
- `page` (int): Page number

**Example Request:**

```
GET /api/v1/doujinshis
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Doujinshis retrieved successfully",
  "data": [
    {
      "id": 3,
      "uuid": "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
      "name": "Fate Series",
      "slug": "fate-series",
      "description": "Doujinshi thuộc series Fate",
      "created_at": "2023-03-20T00:00:00.000000Z",
      "updated_at": "2023-03-20T00:00:00.000000Z",
      "mangas_count": 45
    }
  ],
  "meta": {
    "pagination": {
      "current_page": 1,
      "last_page": 1,
      "per_page": 50,
      "total": 20,
      "from": 1,
      "to": 20
    }
  }
}
```

---

#### GET /doujinshis/{slug}

Get specific doujinshi category details.

**Example Request:**

```
GET /api/v1/doujinshis/fate-series
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Doujinshi retrieved successfully",
  "data": {
    "id": 3,
    "uuid": "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
    "name": "Fate Series",
    "slug": "fate-series",
    "description": "Doujinshi thuộc series Fate/Stay Night và các series liên quan",
    "created_at": "2023-03-20T00:00:00.000000Z",
    "updated_at": "2023-03-20T00:00:00.000000Z",
    "mangas_count": 45
  }
}
```

---

#### GET /doujinshis/{slug}/mangas

Get mangas in a doujinshi category.

**Query Parameters:**

- `per_page` (int): Items per page (default: 20)
- `page` (int): Page number

**Example Request:**

```
GET /api/v1/doujinshis/fate-series/mangas
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Doujinshi mangas retrieved successfully",
  "data": [
    {
      "id": 156,
      "uuid": "3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f",
      "name": "Fate/Grand Order - Summer Servants",
      "slug": "fate-grand-order-summer-servants",
      "status": 2,
      "views": 50000,
      "average_rating": 4.2,
      "cover_full_url": "https://domain.example/storage/images/covers/manga-156.jpg",
      "updated_at": "2024-03-15T10:00:00.000000Z"
    }
  ],
  "meta": {
    "pagination": {
      "current_page": 1,
      "last_page": 3,
      "per_page": 20,
      "total": 45,
      "from": 1,
      "to": 20
    },
    "doujinshi": {
      "id": 3,
      "name": "Fate Series",
      "slug": "fate-series"
    }
  }
}
```

---

## User Features (Authenticated)

### Favorites

#### GET /user/favorites

Get user's favorite mangas with pagination.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**

- `per_page` (int): Items per page (default: 20)
- `page` (int): Page number

**Example Request:**

```
GET /api/v1/user/favorites?per_page=20
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Favorites retrieved successfully",
  "data": [
    {
      "id": 42,
      "uuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "name": "One Piece",
      "name_alt": "Vua Hải Tặc",
      "slug": "one-piece",
      "status": 1,
      "views": 1250000,
      "average_rating": 4.75,
      "cover_full_url": "https://domain.example/storage/images/covers/manga-42.jpg",
      "updated_at": "2024-03-28T16:30:00.000000Z",
      "latest_chapter": {
        "id": 1523,
        "name": "Chapter 1095",
        "slug": "chapter-1095",
        "created_at": "2024-03-15T09:00:00.000000Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "current_page": 1,
      "last_page": 2,
      "per_page": 20,
      "total": 35,
      "from": 1,
      "to": 20
    }
  }
}
```

---

#### POST /user/favorites

Add manga to user's favorites.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "manga_id": 42
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Manga added to favorites",
  "data": {
    "manga": {
      "id": 42,
      "uuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "name": "One Piece",
      "slug": "one-piece",
      "cover_full_url": "https://domain.example/storage/images/covers/manga-42.jpg"
    },
    "favorited": true
  }
}
```

**Conflict Error (409):**

```json
{
  "success": false,
  "message": "Manga already in favorites"
}
```

---

#### DELETE /user/favorites/{manga_id}

Remove manga from user's favorites.

**Headers:** `Authorization: Bearer {token}`

**Example Request:**

```
DELETE /api/v1/user/favorites/42
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Manga removed from favorites",
  "data": {
    "manga_id": 42,
    "favorited": false
  }
}
```

---

### Reading History

#### GET /user/histories

Get user's reading history with last read chapter.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**

- `per_page` (int): Items per page (default: 20)
- `page` (int): Page number

**Example Request:**

```
GET /api/v1/user/histories?per_page=20
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Reading history retrieved successfully",
  "data": [
    {
      "manga": {
        "id": 42,
        "uuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
        "name": "One Piece",
        "slug": "one-piece",
        "status": 1,
        "cover_full_url": "https://domain.example/storage/images/covers/manga-42.jpg"
      },
      "last_read_chapter": {
        "id": 1523,
        "uuid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "name": "Chapter 1095",
        "slug": "chapter-1095",
        "order": 1095
      },
      "last_read_at": "2024-03-28T16:30:00.000000Z"
    },
    {
      "manga": {
        "id": 58,
        "uuid": "9a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d",
        "name": "Naruto",
        "slug": "naruto",
        "status": 2,
        "cover_full_url": "https://domain.example/storage/images/covers/manga-58.jpg"
      },
      "last_read_chapter": {
        "id": 2847,
        "uuid": "5b6c7d8e-9f0a-1b2c-3d4e-5f6a7b8c9d0e",
        "name": "Chapter 700",
        "slug": "chapter-700",
        "order": 700
      },
      "last_read_at": "2024-03-25T14:20:00.000000Z"
    }
  ],
  "meta": {
    "pagination": {
      "current_page": 1,
      "last_page": 3,
      "per_page": 20,
      "total": 52,
      "from": 1,
      "to": 20
    }
  }
}
```

---

#### DELETE /user/histories/{manga_id}

Remove manga from user's reading history.

**Headers:** `Authorization: Bearer {token}`

**Example Request:**

```
DELETE /api/v1/user/histories/42
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Manga removed from reading history",
  "data": {
    "manga_id": 42
  }
}
```

---

### Achievements & Pets

#### GET /user/achievements

Get user's achievements and progress.

**Headers:** `Authorization: Bearer {token}`

**Example Request:**

```
GET /api/v1/user/achievements
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Achievements retrieved successfully",
  "data": {
    "current_achievement": {
      "id": 8,
      "uuid": "7f8a9b0c-1d2e-3f4a-5b6c-7d8e9f0a1b2c",
      "name": "Veteran Reader",
      "description": "Đọc hơn 1000 chương",
      "icon": "🏆",
      "points": 200,
      "created_at": "2023-01-01T00:00:00.000000Z",
      "updated_at": "2023-01-01T00:00:00.000000Z"
    },
    "unlocked_achievements": [
      {
        "id": 1,
        "uuid": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
        "name": "Beginner",
        "description": "Đọc chapter đầu tiên",
        "icon": "🌟",
        "points": 10
      },
      {
        "id": 5,
        "uuid": "5b6c7d8e-9f0a-1b2c-3d4e-5f6a7b8c9d0e",
        "name": "Active Reader",
        "description": "Đọc 100 chương",
        "icon": "📚",
        "points": 50
      },
      {
        "id": 8,
        "uuid": "7f8a9b0c-1d2e-3f4a-5b6c-7d8e9f0a1b2c",
        "name": "Veteran Reader",
        "description": "Đọc hơn 1000 chương",
        "icon": "🏆",
        "points": 200
      }
    ],
    "achievements_points": 260,
    "limit_achievement_points": 1000
  }
}
```

---

#### GET /user/pets

Get user's pets and points information.

**Headers:** `Authorization: Bearer {token}`

**Example Request:**

```
GET /api/v1/user/pets
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Pets retrieved successfully",
  "data": {
    "current_pet": {
      "id": 5,
      "uuid": "6e7f8a9b-0c1d-2e3f-4a5b-6c7d8e9f0a1b",
      "name": "Rồng Vàng",
      "description": "Pet huyền thoại với sức mạnh khổng lồ",
      "image": "/storage/images/pets/golden-dragon.png",
      "points": 500,
      "created_at": "2023-06-15T00:00:00.000000Z",
      "updated_at": "2023-06-15T00:00:00.000000Z"
    },
    "owned_pets": [
      {
        "id": 1,
        "uuid": "1b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e",
        "name": "Mèo Xanh",
        "description": "Pet dễ thương cho người mới",
        "image": "/storage/images/pets/blue-cat.png",
        "points": 100
      },
      {
        "id": 3,
        "uuid": "3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a",
        "name": "Chó Vàng",
        "description": "Pet trung thành",
        "image": "/storage/images/pets/golden-dog.png",
        "points": 250
      },
      {
        "id": 5,
        "uuid": "6e7f8a9b-0c1d-2e3f-4a5b-6c7d8e9f0a1b",
        "name": "Rồng Vàng",
        "description": "Pet huyền thoại với sức mạnh khổng lồ",
        "image": "/storage/images/pets/golden-dragon.png",
        "points": 500
      }
    ],
    "total_points": 1500,
    "used_points": 850,
    "available_points": 650,
    "limit_pet_points": 1000
  }
}
```

---

## Social Features (Authenticated)

### Comments

#### GET /chapters/{slug}/comments

Get comments for a chapter with nested replies.

**Query Parameters:**

- `per_page` (int): Items per page (default: 20)
- `sort` (string): Order (asc, desc - default: desc)
- `page` (int): Page number

**Example Request:**

```
GET /api/v1/chapters/chapter-1095/comments?per_page=20&sort=desc
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Comments retrieved successfully",
  "data": [
    {
      "id": 789,
      "uuid": "4c5d6e7f-8a9b-0c1d-2e3f-4a5b6c7d8e9f",
      "content": "Chapter này hay quá! Cảm ơn team đã dịch nhanh như vậy!",
      "commentable_type": "App\\Models\\Chapter",
      "commentable_id": 1523,
      "parent_id": null,
      "created_at": "2024-03-28T10:15:00.000000Z",
      "updated_at": "2024-03-28T10:15:00.000000Z",
      "user": {
        "id": 15,
        "uuid": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Nguyễn Văn A",
        "avatar_full_url": "https://domain.example/storage/images/avatars/user-15.jpg"
      },
      "replies": [
        {
          "id": 792,
          "uuid": "5d6e7f8a-9b0c-1d2e-3f4a-5b6c7d8e9f0a",
          "content": "Mình cũng thấy vậy, plot twist cuối chương quá bất ngờ!",
          "parent_id": 789,
          "created_at": "2024-03-28T10:20:00.000000Z",
          "user": {
            "id": 22,
            "uuid": "6e7f8a9b-0c1d-2e3f-4a5b-6c7d8e9f0a1b",
            "name": "Trần Thị B",
            "avatar_full_url": "https://domain.example/storage/images/avatars/user-22.jpg"
          },
          "replies_count": 0,
          "can_edit": false,
          "can_delete": false
        }
      ],
      "replies_count": 5,
      "can_edit": true,
      "can_delete": true
    },
    {
      "id": 785,
      "uuid": "3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f",
      "content": "Cuối cùng cũng có chapter mới rồi! Chờ lâu quá 😊",
      "commentable_type": "App\\Models\\Chapter",
      "commentable_id": 1523,
      "parent_id": null,
      "created_at": "2024-03-28T09:45:00.000000Z",
      "updated_at": "2024-03-28T09:45:00.000000Z",
      "user": {
        "id": 18,
        "uuid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "name": "Lê Văn C",
        "avatar_full_url": "https://domain.example/storage/images/avatars/user-18.jpg"
      },
      "replies": [],
      "replies_count": 0,
      "can_edit": false,
      "can_delete": false
    }
  ],
  "meta": {
    "pagination": {
      "current_page": 1,
      "last_page": 5,
      "per_page": 20,
      "total": 95,
      "from": 1,
      "to": 20
    },
    "chapter": {
      "id": 1523,
      "name": "Chapter 1095",
      "slug": "chapter-1095"
    }
  }
}
```

---

#### POST /chapters/{slug}/comments

Add comment to a chapter (or reply to another comment).

**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "content": "Chapter này hay quá! Cảm ơn team đã dịch!",
  "parent_id": null
}
```

**Request Body (Reply):**

```json
{
  "content": "Mình cũng thấy vậy!",
  "parent_id": 789
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Comment created successfully",
  "data": {
    "id": 798,
    "uuid": "7f8a9b0c-1d2e-3f4a-5b6c-7d8e9f0a1b2c",
    "content": "Chapter này hay quá! Cảm ơn team đã dịch!",
    "commentable_type": "App\\Models\\Chapter",
    "commentable_id": 1523,
    "parent_id": null,
    "created_at": "2024-03-28T17:00:00.000000Z",
    "updated_at": "2024-03-28T17:00:00.000000Z",
    "user": {
      "id": 15,
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Nguyễn Văn A",
      "avatar_full_url": "https://domain.example/storage/images/avatars/user-15.jpg"
    },
    "replies": [],
    "replies_count": 0,
    "can_edit": true,
    "can_delete": true
  }
}
```

**Validation Error (422):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "content": [
      "The content field is required.",
      "The content must be at least 3 characters."
    ]
  }
}
```

---

#### PUT /comments/{id}

Update your own comment.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "content": "Updated comment content - thay đổi ý kiến rồi!"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Comment updated successfully",
  "data": {
    "id": 798,
    "uuid": "7f8a9b0c-1d2e-3f4a-5b6c-7d8e9f0a1b2c",
    "content": "Updated comment content - thay đổi ý kiến rồi!",
    "commentable_type": "App\\Models\\Chapter",
    "commentable_id": 1523,
    "parent_id": null,
    "created_at": "2024-03-28T17:00:00.000000Z",
    "updated_at": "2024-03-28T17:15:00.000000Z",
    "user": {
      "id": 15,
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Nguyễn Văn A",
      "avatar_full_url": "https://domain.example/storage/images/avatars/user-15.jpg"
    },
    "can_edit": true,
    "can_delete": true
  }
}
```

**Forbidden Error (403):**

```json
{
  "success": false,
  "message": "You can only edit your own comments"
}
```

---

#### DELETE /comments/{id}

Delete your own comment.

**Headers:** `Authorization: Bearer {token}`

**Example Request:**

```
DELETE /api/v1/comments/798
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Comment deleted successfully",
  "data": null
}
```

**Note:** If the comment has replies, it will be soft-deleted (content replaced with "[Comment deleted by user]").

**Forbidden Error (403):**

```json
{
  "success": false,
  "message": "You can only delete your own comments"
}
```

---

### Ratings

#### POST /mangas/{slug}/rating

Rate a manga (or update existing rating).

**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "rating": 4.5
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Rating saved successfully",
  "data": {
    "rating": {
      "id": 456,
      "uuid": "5d6e7f8a-9b0c-1d2e-3f4a-5b6c7d8e9f0a",
      "rating": 4.5,
      "created_at": "2024-03-10T14:20:00.000000Z",
      "updated_at": "2024-03-28T17:20:00.000000Z",
      "user": {
        "id": 15,
        "name": "Nguyễn Văn A"
      }
    },
    "manga_stats": {
      "average_rating": 4.76,
      "total_ratings": 1524
    }
  }
}
```

**Validation Error (422):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "rating": [
      "The rating field is required.",
      "The rating must be between 1 and 5."
    ]
  }
}
```

**Note:**

- Rating scale is 1-5 (can use decimals like 4.5)
- If user has already rated, this endpoint updates the existing rating
- Manga's average_rating and total_ratings are automatically recalculated

---

## Chapter Reports

### GET /chapter-reports/types

Get available chapter report types.

**Example Request:**

```
GET /api/v1/chapter-reports/types
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Report types retrieved successfully",
  "data": {
    "broken_images": "Ảnh bị lỗi/không load được",
    "missing_images": "Thiếu ảnh",
    "wrong_order": "Sai thứ tự ảnh",
    "wrong_chapter": "Sai chapter/nhầm chapter",
    "duplicate": "Chapter trùng lặp",
    "other": "Lỗi khác"
  }
}
```

---

### POST /chapters/{slug}/reports

Submit a chapter error report.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "report_type": "broken_images",
  "description": "Ảnh số 5 và 7 không hiển thị được"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Chapter report submitted successfully",
  "data": {
    "id": 234,
    "user_id": 15,
    "chapter_id": 1523,
    "manga_id": 42,
    "report_type": "broken_images",
    "report_type_label": "Ảnh bị lỗi/không load được",
    "description": "Ảnh số 5 và 7 không hiển thị được",
    "created_at": "2024-03-28T11:30:00.000000Z",
    "updated_at": "2024-03-28T11:30:00.000000Z",
    "user": {
      "id": 15,
      "name": "Nguyễn Văn A"
    },
    "chapter": {
      "id": 1523,
      "name": "Chapter 1095",
      "slug": "chapter-1095"
    },
    "manga": {
      "id": 42,
      "name": "One Piece",
      "slug": "one-piece"
    }
  }
}
```

**Validation Error (422):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "report_type": [
      "The report type field is required.",
      "The selected report type is invalid."
    ],
    "description": ["The description must not be greater than 1000 characters."]
  }
}
```

---

### GET /user/chapter-reports

Get user's submitted chapter reports.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**

- `per_page` (int): Items per page (default: 20)
- `page` (int): Page number

**Example Request:**

```
GET /api/v1/user/chapter-reports?per_page=20
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "User chapter reports retrieved successfully",
  "data": [
    {
      "id": 234,
      "user_id": 15,
      "chapter_id": 1523,
      "manga_id": 42,
      "report_type": "broken_images",
      "report_type_label": "Ảnh bị lỗi/không load được",
      "description": "Ảnh số 5 và 7 không hiển thị được",
      "created_at": "2024-03-28T11:30:00.000000Z",
      "updated_at": "2024-03-28T11:30:00.000000Z",
      "chapter": {
        "id": 1523,
        "name": "Chapter 1095",
        "slug": "chapter-1095"
      },
      "manga": {
        "id": 42,
        "name": "One Piece",
        "slug": "one-piece"
      }
    },
    {
      "id": 198,
      "user_id": 15,
      "chapter_id": 1520,
      "manga_id": 42,
      "report_type": "missing_images",
      "report_type_label": "Thiếu ảnh",
      "description": "Chapter thiếu ảnh từ trang 10 trở đi",
      "created_at": "2024-03-20T09:15:00.000000Z",
      "updated_at": "2024-03-20T09:15:00.000000Z",
      "chapter": {
        "id": 1520,
        "name": "Chapter 1092",
        "slug": "chapter-1092"
      },
      "manga": {
        "id": 42,
        "name": "One Piece",
        "slug": "one-piece"
      }
    }
  ],
  "meta": {
    "pagination": {
      "current_page": 1,
      "last_page": 1,
      "per_page": 20,
      "total": 12,
      "from": 1,
      "to": 12
    }
  }
}
```

---

## Data Models

Complete resource structures used throughout the API.

### User Resource

```json
{
  "id": 15,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "avatar_full_url": "https://domain.example/storage/images/avatars/user-15.jpg",
  "total_points": 1500,
  "used_points": 300,
  "available_points": 1200,
  "achievements_points": 250,
  "limit_pet_points": 1000,
  "limit_achievement_points": 1000,
  "created_at": "2024-01-15T10:30:00.000000Z",
  "updated_at": "2024-03-20T14:25:00.000000Z",
  "pet": {
    "id": 5,
    "uuid": "6e7f8a9b-0c1d-2e3f-4a5b-6c7d8e9f0a1b",
    "name": "Rồng Vàng",
    "description": "Pet huyền thoại với sức mạnh khổng lồ",
    "image": "/storage/images/pets/golden-dragon.png",
    "points": 500
  },
  "achievement": {
    "id": 8,
    "uuid": "7f8a9b0c-1d2e-3f4a-5b6c-7d8e9f0a1b2c",
    "name": "Veteran Reader",
    "description": "Đọc hơn 1000 chương",
    "icon": "🏆",
    "points": 200
  }
}
```

**Fields:**

- `id`: Unique numeric identifier
- `uuid`: Universal unique identifier (string)
- `available_points`: Computed field (total_points - used_points)
- `pet`, `achievement`: Only included when relationships are loaded

---

### Manga Resource

```json
{
  "id": 42,
  "uuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "name": "One Piece",
  "name_alt": "Vua Hải Tặc",
  "slug": "one-piece",
  "pilot": "<p>Câu chuyện kể về Monkey D. Luffy...</p>",
  "status": 1,
  "views": 1250000,
  "views_week": 45000,
  "views_day": 8500,
  "average_rating": 4.75,
  "total_ratings": 1523,
  "is_hot": true,
  "is_reviewed": 1,
  "cover_full_url": "https://domain.example/storage/images/covers/manga-42.jpg",
  "created_at": "2023-01-10T08:15:00.000000Z",
  "updated_at": "2024-03-28T16:30:00.000000Z",
  "genres": [
    {
      "id": 7,
      "uuid": "8f0e5f9c-2e3b-4d1a-9c7f-3e4b5c6d7e8f",
      "name": "Action",
      "slug": "action",
      "color": "#FF5733"
    }
  ],
  "artist": {
    "id": 12,
    "uuid": "9d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a",
    "name": "Oda Eiichiro",
    "slug": "oda-eiichiro"
  },
  "group": {
    "id": 5,
    "uuid": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
    "name": "Team Việt Hóa",
    "slug": "team-viet-hoa"
  },
  "latest_chapter": {
    "id": 1523,
    "uuid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Chapter 1095",
    "slug": "chapter-1095",
    "order": 1095,
    "created_at": "2024-03-15T09:00:00.000000Z"
  },
  "first_chapter": {
    "id": 428,
    "name": "Chapter 1",
    "slug": "chapter-1",
    "order": 1
  }
}
```

**Fields:**

- `status`: 1 = ongoing, 2 = completed
- `pilot`: HTML content (description)
- `is_reviewed`: Only reviewed mangas (is_reviewed=1) appear in API
- `genres`, `artist`, `group`, `latest_chapter`, `first_chapter`: Only included when relationships are loaded

---

### Chapter Resource

```json
{
  "id": 1523,
  "uuid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "Chapter 1095",
  "slug": "chapter-1095",
  "views": 125000,
  "order": 1095,
  "chapter_number": 1095,
  "created_at": "2024-03-15T09:00:00.000000Z",
  "updated_at": "2024-03-15T09:00:00.000000Z",
  "content": [
    "https://domain.example/dcn/manga-uuid/chapter-uuid/1.jpg",
    "https://domain.example/dcn/manga-uuid/chapter-uuid/2.jpg",
    "https://domain.example/dcn/manga-uuid/chapter-uuid/3.jpg"
  ],
  "manga": {
    "id": 42,
    "uuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "name": "One Piece",
    "slug": "one-piece",
    "cover_full_url": "https://domain.example/storage/images/covers/manga-42.jpg"
  }
}
```

**Fields:**

- `chapter_number`: Extracted from chapter name
- `content`: Array of image URLs (only on /chapters/{slug} and /chapters/{slug}/images endpoints)
- `images`: Alias for content field (only on /chapters/{slug}/images endpoint)
- `manga`: Only included when relationship is loaded

---

### Genre Resource

```json
{
  "id": 7,
  "uuid": "8f0e5f9c-2e3b-4d1a-9c7f-3e4b5c6d7e8f",
  "name": "Action",
  "slug": "action",
  "description": "Thể loại hành động kịch tính",
  "color": "#FF5733",
  "is_nsfw": false,
  "created_at": "2023-01-05T00:00:00.000000Z",
  "updated_at": "2023-01-05T00:00:00.000000Z",
  "mangas_count": 1250
}
```

**Fields:**

- `color`: Hex color code for UI display
- `is_nsfw`: Boolean flag for adult content
- `mangas_count`: Only included with withCount()

---

### Artist Resource

```json
{
  "id": 12,
  "uuid": "9d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a",
  "name": "Oda Eiichiro",
  "slug": "oda-eiichiro",
  "description": "Tác giả nổi tiếng của One Piece",
  "created_at": "2023-01-08T00:00:00.000000Z",
  "updated_at": "2023-01-08T00:00:00.000000Z",
  "mangas_count": 3
}
```

---

### Group Resource

```json
{
  "id": 5,
  "uuid": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  "name": "Team Việt Hóa",
  "slug": "team-viet-hoa",
  "description": "Nhóm dịch manga chuyên nghiệp",
  "created_at": "2023-02-12T00:00:00.000000Z",
  "updated_at": "2023-02-12T00:00:00.000000Z",
  "mangas_count": 87
}
```

---

### Doujinshi Resource

```json
{
  "id": 3,
  "uuid": "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
  "name": "Fate Series",
  "slug": "fate-series",
  "description": "Doujinshi thuộc series Fate",
  "created_at": "2023-03-20T00:00:00.000000Z",
  "updated_at": "2023-03-20T00:00:00.000000Z",
  "mangas_count": 45
}
```

---

### Comment Resource

```json
{
  "id": 789,
  "uuid": "4c5d6e7f-8a9b-0c1d-2e3f-4a5b6c7d8e9f",
  "content": "Chapter này hay quá! Cảm ơn team đã dịch!",
  "commentable_type": "App\\Models\\Chapter",
  "commentable_id": 1523,
  "parent_id": null,
  "created_at": "2024-03-28T10:15:00.000000Z",
  "updated_at": "2024-03-28T10:15:00.000000Z",
  "user": {
    "id": 15,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Nguyễn Văn A",
    "avatar_full_url": "https://domain.example/storage/images/avatars/user-15.jpg"
  },
  "replies": [],
  "replies_count": 5,
  "can_edit": true,
  "can_delete": true
}
```

**Fields:**

- `parent_id`: null for top-level comments, numeric ID for replies
- `can_edit`, `can_delete`: Only included for authenticated users
- `replies`: Only included when relationship is loaded
- `replies_count`: Count of nested replies

---

### Rating Resource

```json
{
  "id": 456,
  "uuid": "5d6e7f8a-9b0c-1d2e-3f4a-5b6c7d8e9f0a",
  "rating": 4.5,
  "created_at": "2024-03-10T14:20:00.000000Z",
  "updated_at": "2024-03-10T14:20:00.000000Z",
  "user": {
    "id": 15,
    "name": "Nguyễn Văn A"
  },
  "manga": {
    "id": 42,
    "name": "One Piece",
    "slug": "one-piece"
  }
}
```

**Fields:**

- `rating`: Decimal value between 1.0 and 5.0

---

### Pet Resource

```json
{
  "id": 5,
  "uuid": "6e7f8a9b-0c1d-2e3f-4a5b-6c7d8e9f0a1b",
  "name": "Rồng Vàng",
  "description": "Pet huyền thoại với sức mạnh khổng lồ",
  "image": "/storage/images/pets/golden-dragon.png",
  "points": 500,
  "created_at": "2023-06-15T00:00:00.000000Z",
  "updated_at": "2023-06-15T00:00:00.000000Z"
}
```

---

### Achievement Resource

```json
{
  "id": 8,
  "uuid": "7f8a9b0c-1d2e-3f4a-5b6c-7d8e9f0a1b2c",
  "name": "Veteran Reader",
  "description": "Đọc hơn 1000 chương",
  "icon": "🏆",
  "points": 200,
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z"
}
```

---

### Chapter Report Resource

```json
{
  "id": 234,
  "user_id": 15,
  "chapter_id": 1523,
  "manga_id": 42,
  "report_type": "broken_images",
  "report_type_label": "Ảnh bị lỗi/không load được",
  "description": "Ảnh số 5 và 7 không hiển thị được",
  "created_at": "2024-03-28T11:30:00.000000Z",
  "updated_at": "2024-03-28T11:30:00.000000Z",
  "user": {
    "id": 15,
    "name": "Nguyễn Văn A"
  },
  "chapter": {
    "id": 1523,
    "name": "Chapter 1095",
    "slug": "chapter-1095"
  },
  "manga": {
    "id": 42,
    "name": "One Piece",
    "slug": "one-piece"
  }
}
```

**Report Types:**

- `broken_images`: Ảnh bị lỗi/không load được
- `missing_images`: Thiếu ảnh
- `wrong_order`: Sai thứ tự ảnh
- `wrong_chapter`: Sai chapter/nhầm chapter
- `duplicate`: Chapter trùng lặp
- `other`: Lỗi khác

---

## Error Codes

Complete error response examples for all HTTP status codes.

### 400 Bad Request

Invalid request data or malformed request.

```json
{
  "success": false,
  "message": "Invalid request data"
}
```

---

### 401 Unauthorized

Authentication required or invalid token.

```json
{
  "success": false,
  "message": "Unauthenticated"
}
```

**Common causes:**

- Missing Authorization header
- Invalid or expired token
- Token revoked after logout

---

### 403 Forbidden

Access denied - authenticated but not authorized.

```json
{
  "success": false,
  "message": "You can only edit your own comments"
}
```

**Common scenarios:**

- Trying to edit/delete another user's comment
- Accessing admin-only resources
- Insufficient permissions

---

### 404 Not Found

Requested resource does not exist.

```json
{
  "success": false,
  "message": "Manga not found"
}
```

**Common causes:**

- Invalid slug or ID
- Manga/Chapter deleted or not yet published
- Typo in the endpoint URL

---

### 409 Conflict

Resource already exists or conflicting state.

```json
{
  "success": false,
  "message": "Manga already in favorites"
}
```

**Common scenarios:**

- Adding duplicate favorite
- Duplicate rating submission

---

### 422 Validation Error

Invalid input data with field-specific errors.

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": [
      "The email field is required.",
      "The email must be a valid email address."
    ],
    "password": [
      "The password must be at least 8 characters.",
      "The password confirmation does not match."
    ],
    "rating": ["The rating must be between 1 and 5."],
    "content": [
      "The content field is required.",
      "The content must be at least 3 characters."
    ]
  }
}
```

**Field-specific validation rules:**

- **Email**: Required, valid email format, unique (registration)
- **Password**: Minimum 8 characters, must match confirmation
- **Name**: Maximum 255 characters
- **Rating**: Numeric, between 1 and 5
- **Content** (comments): Minimum 3 characters, maximum 1000 characters
- **Search query**: Minimum 2 characters
- **Avatar**: Must be image file, maximum 2MB

---

### 429 Too Many Requests

Rate limit exceeded.

```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```

**Rate limits:**

- General API: 60 requests per minute
- Authenticated users: Higher limits
- Search endpoints: Separate rate limiting

---

### 500 Internal Server Error

Server-side error occurred.

```json
{
  "success": false,
  "message": "Internal server error"
}
```

**Note:** These errors are logged and should be reported if persistent.

---

## Caching

The API implements caching for performance:

- **Manga lists**: 5 minutes
- **Individual manga**: 10 minutes
- **Genres/Artists/Groups**: 10 minutes
- **Chapter content**: 10 minutes
- **Search results**: 5 minutes

Cache is automatically invalidated when content is updated.

---

## Image Handling

All image URLs are fully qualified and optimized for web delivery:

- **Manga covers**: Optimized to 500x662px
- **User avatars**: Optimized to 400x400px
- **Chapter images**: Served from S3 with proper CDN headers

---

For production, update CORS configuration in Laravel to include your production domain.
