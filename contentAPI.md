## Friend Availability API

Base URL: /api/v1

## What this API is for

This API is for a friend-group app where someone can press “I’m free” inside a group.
Other people in the group can respond with quick options like:

- Free in 15 minutes
- Free in 30 minutes
- Free tonight

## The API stores groups, members and status

---

### Groups

## GET /groups

Returns groups the current user is a member of.

### Response

```json
{ "groupId": "G1", "name": "Game session?", "memberCount": 4 }
```

---

### POST /groups

Creates a new group

### Request

```json
{ "name": "Going out?" }


### Response

{ "groupId": "G2", "name": "Going out?", "memberCount": 1 }
```

---

### Post /groups/:groudid/members

Adds a user to a group

### Request

```json
{ "userId": "usr_2"}

### Response

{ "groupId": "G2", "userId": "usr_2"}


```

---

### Status

### PUT /status

Updates the current user´s availability status

### Request

```json
{ "status": "FREE_NOW"}

### Response

{ "userId": "usr_2", "status": "FREE_NOW", "updatedAt": " 2026-01-21-timezone"}
```

---

### GET /groups/:groupId/status

Returns the current availability status for all members in a group

### Response

```json
{ "userId": "usr_1", "displayName": "Kevin", "status": "FREE_NOW", "updatedAt": "2026-01-21-21T12:00:00Z"}

{ "userId": "usr_2", "displayName": "Modi", "status": "BUSY", "updatedAt": "2026-01-21-21T11:45:00Z"}
```
