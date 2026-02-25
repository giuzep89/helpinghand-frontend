# Helping Hand API Documentation

## Table of Contents

- [Introduction](#introduction)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Error Responses](#error-responses)
- [Endpoints](#endpoints)
  - [Authentication](#authentication-endpoints)
  - [Posts](#posts-endpoints)
  - [Chats & Messages](#chats--messages-endpoints)
  - [Users](#users-endpoints)
- [Enums Reference](#enums-reference)

---

## Introduction

HelpingHand is a REST API for a community platform where users can request help, organize activities, and message each other.

The API uses JSON for request and response bodies, and JWT (JSON Web Token) for authentication.

---

## Base URL

```
http://localhost:8080
```

---

## Authentication

Most endpoints require authentication via a Bearer token in the Authorization header.

**Header format:**
```
Authorization: Bearer <your_jwt_token>
```

To obtain a token, use the [Login](#post-authlogin) endpoint.

**Public endpoints (no authentication required):**
- `POST /auth/register`
- `POST /auth/login`
- `GET /users/{username}/profile-picture`

---

## Error Responses

The API uses standard HTTP status codes and returns error messages in plain text or JSON format.

| Status Code | Description |
|-------------|-------------|
| `400` | Bad Request - Invalid input or validation error |
| `401` | Unauthorized - Missing or invalid token |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found - Resource does not exist |
| `409` | Conflict - Resource already exists |
| `500` | Internal Server Error |

**Validation error response example:**
```json
{
  "description": "Description is required",
  "helpType": "Please select a help type"
}
```

---

## Endpoints

---

## Authentication Endpoints

### POST /auth/register

Register a new user account.

**Authentication:** Not required

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `email` | string | Yes | Valid email format |
| `username` | string | Yes | Minimum 6 characters |
| `password` | string | Yes | Minimum 8 characters |
| `age` | integer | Yes | Minimum 18, maximum 150 |
| `location` | string | No | Maximum 100 characters |
| `competencies` | string | No | Maximum 1000 characters |

**Example Request:**
```json
{
  "email": "john.doe@example.com",
  "username": "john_doe",
  "password": "securepassword123",
  "age": 25
}
```

**Success Response:** `201 Created`

**Headers:**
```
Location: /users/john_doe
```

**Response Body:**
```json
{
  "id": 6,
  "username": "john_doe",
  "email": "john.doe@example.com",
  "age": 25,
  "location": null,
  "competencies": null,
  "prizes": [],
  "hasProfilePicture": false
}
```

**Error Responses:**
- `400 Bad Request` - Validation errors
- `409 Conflict` - Username already exists

---

### POST /auth/login

Authenticate a user and receive a JWT token.

**Authentication:** Not required

**Request Body:**

| Field | Type | Required |
|-------|------|----------|
| `username` | string | Yes |
| `password` | string | Yes |

**Example Request:**
```json
{
  "username": "john_doe",
  "password": "securepassword123"
}
```

**Success Response:** `200 OK`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response Body:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The token is returned both in the `Authorization` header and the response body.

**Error Response:**
- `401 Unauthorized` - Invalid username or password

---

## Posts Endpoints

### GET /posts

Get a paginated feed of posts from the authenticated user and their friends.

**Authentication:** Required

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 0 | Page number (zero-indexed) |
| `size` | integer | 20 | Number of posts per page |

**Example Request:**
```
GET /posts?page=0&size=10
```

**Success Response:** `200 OK`

```json
{
  "content": [
    {
      "id": 1,
      "displayTitle": "I need some help with gardening!",
      "description": "Need help pruning my rose bushes this weekend.",
      "location": "Amsterdam",
      "authorUsername": "maria_visser",
      "createdAt": "2025-01-15T10:30:00",
      "postType": "HELP_REQUEST",
      "helpType": "GARDENING",
      "helpFound": false
    },
    {
      "id": 2,
      "displayTitle": "Going for a sports activity: anyone joining?",
      "description": "Weekly running group in Vondelpark",
      "location": "Vondelpark, Amsterdam",
      "authorUsername": "piet_jansen",
      "createdAt": "2025-01-14T09:00:00",
      "postType": "ACTIVITY",
      "activityType": "SPORTS",
      "eventDate": "2025-02-01T08:00:00",
      "currentParticipants": 3
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10
  },
  "totalElements": 25,
  "totalPages": 3,
  "first": true,
  "last": false
}
```

---

### POST /posts/help-requests

Create a new help request.

**Authentication:** Required

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `description` | string | Yes | Max 300 characters |
| `location` | string | No | - |
| `helpType` | string | Yes | See [HelpType enum](#helptype) |

**Example Request:**
```json
{
  "description": "I need someone to help me with my tax return this year.",
  "location": "Utrecht",
  "helpType": "TAXES"
}
```

**Success Response:** `201 Created`

**Headers:**
```
Location: /posts/help-requests/15
```

**Response Body:**
```json
{
  "id": 15,
  "displayTitle": "I need some help with taxes!",
  "description": "I need someone to help me with my tax return this year.",
  "location": "Utrecht",
  "authorUsername": "john_doe",
  "createdAt": "2025-01-20T14:30:00",
  "postType": "HELP_REQUEST",
  "helpType": "TAXES",
  "helpFound": false
}
```

---

### POST /posts/activities

Create a new activity.

**Authentication:** Required

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `description` | string | Yes | Max 300 characters |
| `location` | string | Yes | - |
| `activityType` | string | Yes | See [ActivityType enum](#activitytype) |
| `eventDate` | string | Yes | ISO 8601 format, must be in the future |

**Example Request:**
```json
{
  "description": "Join us for a museum visit to the Rijksmuseum!",
  "location": "Rijksmuseum, Amsterdam",
  "activityType": "CULTURE",
  "eventDate": "2025-02-15T14:00:00"
}
```

**Success Response:** `201 Created`

**Headers:**
```
Location: /posts/activities/16
```

**Response Body:**
```json
{
  "id": 16,
  "displayTitle": "Going for a cultural activity: anyone joining?",
  "description": "Join us for a museum visit to the Rijksmuseum!",
  "location": "Rijksmuseum, Amsterdam",
  "authorUsername": "john_doe",
  "createdAt": "2025-01-20T15:00:00",
  "postType": "ACTIVITY",
  "activityType": "CULTURE",
  "eventDate": "2025-02-15T14:00:00",
  "currentParticipants": 1
}
```

---

### DELETE /posts/{id}

Delete a post. Only the post author can delete their own posts.

**Authentication:** Required

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Post ID |

**Success Response:** `204 No Content`

**Error Responses:**
- `403 Forbidden` - User is not the author
- `404 Not Found` - Post does not exist

---

### PATCH /posts/help-requests/{id}/help-found

Mark a help request as resolved and award prizes to helpers.

**Authentication:** Required (must be the post author)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Help request ID |

**Request Body:**

An array of user IDs who helped and should receive a prize:

```json
[1, 3, 5]
```

**Success Response:** `200 OK`

```json
{
  "id": 1,
  "displayTitle": "I need some help with gardening!",
  "description": "Need help pruning my rose bushes this weekend.",
  "location": "Amsterdam",
  "authorUsername": "maria_visser",
  "createdAt": "2025-01-15T10:30:00",
  "postType": "HELP_REQUEST",
  "helpType": "GARDENING",
  "helpFound": true
}
```

**Notes:**
- Each helper receives a prize corresponding to the help type (e.g., "GARDENING" help type awards the "Thumbs Are Green All Over" prize)
- Prizes accumulate if a user helps with the same type multiple times

---

### POST /posts/activities/{id}/join

Join an activity as a participant.

**Authentication:** Required

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Activity ID |

**Success Response:** `200 OK`

```json
{
  "id": 2,
  "displayTitle": "Going for a sports activity: anyone joining?",
  "description": "Weekly running group in Vondelpark",
  "location": "Vondelpark, Amsterdam",
  "authorUsername": "piet_jansen",
  "createdAt": "2025-01-14T09:00:00",
  "postType": "ACTIVITY",
  "activityType": "SPORTS",
  "eventDate": "2025-02-01T08:00:00",
  "currentParticipants": 4
}
```

---

### DELETE /posts/admin/{id}

Delete any post (admin only).

**Authentication:** Required (ADMIN role)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Post ID |

**Success Response:** `204 No Content`

**Error Response:**
- `403 Forbidden` - User does not have ADMIN role

---

## Chats & Messages Endpoints

### GET /chats

Get all chats for the authenticated user.

**Authentication:** Required

**Success Response:** `200 OK`

```json
[
  {
    "id": 1,
    "otherUserUsername": "maria_visser",
    "lastMessageContent": "Thanks for the help!",
    "lastMessageTime": "2025-01-19T16:45:00"
  },
  {
    "id": 2,
    "otherUserUsername": "piet_jansen",
    "lastMessageContent": "See you at the run tomorrow!",
    "lastMessageTime": "2025-01-18T20:30:00"
  }
]
```

**Notes:**
- The `otherUserUsername` field shows the other participant in the chat (not the authenticated user)
- Chats are returned with the most recent message info for preview

---

### POST /chats

Create a new chat with another user.

**Authentication:** Required

**Request Body:**

The recipient's user ID (as a raw number):

```json
3
```

**Success Response:** `201 Created`

**Headers:**
```
Location: /chats/5
```

**Response Body:**
```json
{
  "id": 5,
  "otherUserUsername": "anna_smit",
  "lastMessageContent": null,
  "lastMessageTime": null
}
```

**Notes:**
- If a chat already exists between the two users, the existing chat is returned
- Cannot create a chat with yourself

---

### GET /chats/{id}

Get a specific chat by ID.

**Authentication:** Required (must be a participant)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Chat ID |

**Success Response:** `200 OK`

```json
{
  "id": 1,
  "otherUserUsername": "maria_visser",
  "lastMessageContent": "Thanks for the help!",
  "lastMessageTime": "2025-01-19T16:45:00"
}
```

---

### GET /chats/{chatId}/messages

Get all messages in a chat.

**Authentication:** Required (must be a participant)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `chatId` | integer | Chat ID |

**Success Response:** `200 OK`

```json
[
  {
    "id": 1,
    "senderUsername": "john_doe",
    "content": "Hi! I saw you needed help with gardening?",
    "timestamp": "2025-01-19T14:00:00",
    "isMe": true
  },
  {
    "id": 2,
    "senderUsername": "maria_visser",
    "content": "Yes! Would you be available this Saturday?",
    "timestamp": "2025-01-19T14:05:00",
    "isMe": false
  },
  {
    "id": 3,
    "senderUsername": "john_doe",
    "content": "Absolutely, I'll be there at 10am!",
    "timestamp": "2025-01-19T14:10:00",
    "isMe": true
  }
]
```

**Notes:**
- The `isMe` field indicates whether the authenticated user sent the message (useful for frontend rendering)

---

### POST /chats/{chatId}/messages

Send a message in a chat.

**Authentication:** Required (must be a participant)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `chatId` | integer | Chat ID |

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `content` | string | Yes | Max 1000 characters |

**Example Request:**
```json
{
  "content": "Thanks for the help!"
}
```

**Success Response:** `201 Created`

**Headers:**
```
Location: /chats/1/messages/15
```

**Response Body:**
```json
{
  "id": 15,
  "senderUsername": "john_doe",
  "content": "Thanks for the help!",
  "timestamp": "2025-01-19T16:45:00",
  "isMe": true
}
```

---

## Users Endpoints

### GET /users

Search for users by username.

**Authentication:** Required

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query (case-insensitive, partial match) |

**Example Request:**
```
GET /users?q=jan
```

**Success Response:** `200 OK`

```json
[
  {
    "id": 1,
    "username": "jan_de_bakker",
    "email": "jan@example.com",
    "age": 45,
    "location": "Amsterdam",
    "competencies": "Gardening, plumbing, electrical work",
    "prizes": [
      "GARDENING",
      "PLUMBING"
    ],
    "hasProfilePicture": true
  },
  {
    "id": 5,
    "username": "janine_vos",
    "email": "janine@example.com",
    "age": 32,
    "location": "Rotterdam",
    "competencies": "Languages, translation",
    "prizes": [],
    "hasProfilePicture": false
  }
]
```

**Notes:**
- The authenticated user is excluded from search results

---

### GET /users/{username}

Get a user's profile.

**Authentication:** Required

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `username` | string | Username |

**Success Response:** `200 OK`

```json
{
  "id": 1,
  "username": "jan_de_bakker",
  "email": "jan@example.com",
  "age": 45,
  "location": "Amsterdam",
  "competencies": "Gardening, plumbing, electrical work",
  "prizes": [
    "GARDENING",
    "PLUMBING"
  ],
  "hasProfilePicture": true
}
```

---

### PUT /users/{username}

Update a user's profile.

**Authentication:** Required (own profile only)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `username` | string | Username |

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `age` | integer | No | Positive, max 150 |
| `location` | string | No | Max 100 characters |
| `competencies` | string | No | Max 1000 characters |

**Example Request:**
```json
{
  "age": 30,
  "location": "Rotterdam",
  "competencies": "Programming, web development, teaching"
}
```

**Success Response:** `200 OK`

```json
{
  "id": 6,
  "username": "john_doe",
  "email": "john.doe@example.com",
  "age": 30,
  "location": "Rotterdam",
  "competencies": "Programming, web development, teaching",
  "prizes": [],
  "hasProfilePicture": false
}
```

**Error Response:**
- `403 Forbidden` - Attempting to update another user's profile

---

### GET /users/{username}/friends

Get a user's friends list.

**Authentication:** Required (own friends list only)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `username` | string | Username |

**Success Response:** `200 OK`

```json
[
  {
    "id": 2,
    "username": "maria_visser",
    "email": "maria@example.com",
    "age": 38,
    "location": "Utrecht",
    "competencies": "Cooking, gardening",
    "prizes": ["GARDENING"],
    "hasProfilePicture": true
  },
  {
    "id": 3,
    "username": "piet_jansen",
    "email": "piet@example.com",
    "age": 55,
    "location": "Den Haag",
    "competencies": "Sports, fitness coaching",
    "prizes": [],
    "hasProfilePicture": false
  }
]
```

---

### POST /users/{username}/friends

Add a friend.

**Authentication:** Required (own friends list only)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `username` | string | Username |

**Request Body:**

The friend's user ID (as a raw number):

```json
4
```

**Success Response:** `200 OK`

Returns the added friend's profile:

```json
{
  "id": 4,
  "username": "anna_smit",
  "email": "anna@example.com",
  "age": 28,
  "location": "Eindhoven",
  "competencies": "IT Support, programming",
  "prizes": ["IT"],
  "hasProfilePicture": false
}
```

---

### DELETE /users/{username}/friends/{friendId}

Remove a friend.

**Authentication:** Required (own friends list only)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `username` | string | Username |
| `friendId` | integer | Friend's user ID |

**Success Response:** `204 No Content`

---

### POST /users/{username}/profile-picture

Upload a profile picture.

**Authentication:** Required (own profile only)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `username` | string | Username |

**Request:**

Content-Type: `multipart/form-data`

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `file` | file | Yes | JPEG or PNG, max 5MB |

**Success Response:** `200 OK`

```json
{
  "id": 6,
  "username": "john_doe",
  "email": "john.doe@example.com",
  "age": 30,
  "location": "Rotterdam",
  "competencies": "Programming, web development",
  "prizes": [],
  "hasProfilePicture": true
}
```

---

### GET /users/{username}/profile-picture

Get a user's profile picture.

**Authentication:** Not required (public endpoint)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `username` | string | Username |

**Success Response:** `200 OK`

**Headers:**
```
Content-Type: image/jpeg
```
or
```
Content-Type: image/png
```

**Response Body:** Binary image data

**Error Response:**
- `404 Not Found` - User has no profile picture

---

### DELETE /users/{username}/profile-picture

Remove a profile picture.

**Authentication:** Required (own profile only)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `username` | string | Username |

**Success Response:** `204 No Content`

---

### GET /users/admin/all

Get a paginated list of all users (admin only).

**Authentication:** Required (ADMIN role)

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 0 | Page number (zero-indexed) |
| `size` | integer | 20 | Number of users per page |

**Success Response:** `200 OK`

```json
{
  "content": [
    {
      "id": 1,
      "username": "jan_de_bakker",
      "email": "jan@example.com",
      "age": 45,
      "location": "Amsterdam",
      "competencies": "Gardening, plumbing",
      "prizes": ["GARDENING", "PLUMBING"],
      "hasProfilePicture": true
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20
  },
  "totalElements": 50,
  "totalPages": 3
}
```

---

### DELETE /users/admin/{id}

Delete a user and all their data (admin only).

**Authentication:** Required (ADMIN role)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | User ID |

**Success Response:** `204 No Content`

**Notes:**
- This performs a cascading delete, removing:
  - All posts by the user
  - All chats the user is part of
  - All messages in those chats
  - Friend relationships

---

## Enums Reference

### HelpType

Available values for help request types:

| Value | Display Name | Associated Prize |
|-------|--------------|------------------|
| `GARDENING` | gardening | Thumbs Are Green All Over |
| `TAXES` | taxes | Knows How To Fudge The Numbers |
| `COMPANY` | company | Drank All My Coffee |
| `PLUMBING` | plumbing | No Leaks Can Defeat Them |
| `PAINTING` | painting | Gave Those Walls A Nice Coat |
| `MOVING` | moving | Took All My Things Away |
| `IT` | IT Support | Certified Nerd |
| `BUREAUCRACY` | bureaucracy | Knows Their Way Around The Government |
| `LANGUAGE` | language | Master Of Tongues |
| `GROCERIES` | groceries | Pusher Of Carts |
| `PETSITTING` | pet sitting | A Cat AND A Dog Person |
| `TRANSPORT` | transport | Brings Me Around Like I'm Royalty |
| `REPAIRS` | repairs | A True Fixer-Upper |
| `HOUSE_CHORES` | house chores | Finally Stuff Gets Done |

### ActivityType

Available values for activity types:

| Value | Display Name |
|-------|--------------|
| `SPORTS` | sports |
| `CULTURE` | cultural |
| `VOLUNTEERING` | volunteering |
| `SOCIAL` | social |
| `EDUCATIONAL` | educational |

### User Roles

| Role | Description |
|------|-------------|
| `ROLE_USER` | Standard user (assigned on registration) |
| `ROLE_ADMIN` | Administrator with elevated privileges |

---

## Test Users

The following test users are available in the development database (password: `password123`):

| Username | Roles |
|----------|-------|
| `jan_de_bakker` | ROLE_ADMIN, ROLE_USER |
| `maria_visser` | ROLE_USER |
| `piet_jansen` | ROLE_USER |
| `anna_smit` | ROLE_USER |
| `kees_de_vries` | ROLE_USER |