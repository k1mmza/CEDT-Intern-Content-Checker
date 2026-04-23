# Overview

Platform Type:
- Marketplace + SaaS + Real-time system

Core Requirements:
- Influencer discovery (fast filtering)
- Campaign management
- Real-time chat
- Analytics & reporting
- Payment system

---

# Frontend

## Core
- Next.js (React framework)
- React
- TypeScript
- Tailwind CSS

## State Management
- Zustand (client state)
- TanStack Query (server state)

## UI Components
- shadcn/ui

## Forms & Validation
- React Hook Form
- Zod

---

# Backend

## Main API
- NestJS (Node.js framework)

## Optional AI / Data Service
- FastAPI (Python)

Purpose:
- Matching algorithm
- Performance scoring
- Fraud detection

---

# Database

## Primary Database
- PostgreSQL

## ORM
- Prisma

---

# Search (Production)

- Elasticsearch

Purpose:
- Fast filtering (followers, engagement, category)
- Full-text search (hashtags, keywords)

---

# Real-time Features

## Chat & Notifications
- Socket.IO

Alternative:
- Firebase (Realtime)

---

# File Storage

- AWS S3

Used for:
- Content uploads
- Campaign assets

---

# Authentication

- NextAuth.js

Supports:
- Email/password
- OAuth (Google, etc.)

---

# Payments

- Stripe

Used for:
- Paying influencers
- Platform commission

---

# Analytics

- PostHog (product analytics)
- Google Analytics

---

# AI / Scoring System

## Option 1 (Simple)
- Node.js service

## Option 2 (Advanced)
- FastAPI + scikit-learn

Used for:
- Performance score
- Fake follower detection
- Influencer matching

---

# Infrastructure

## Hosting
- Vercel (Frontend)
- AWS (Backend + DB)

## Containerization
- Docker

## CI/CD
- GitHub Actions

---

# System Architecture

Frontend (Next.js)
    ↓
API (NestJS)
    ↓
--------------------------
| PostgreSQL (main DB)   |
| Elasticsearch (search) |
--------------------------
    ↓
Services:
- Matching Service (AI)
- Chat Service (Socket.IO)

---

# MVP Stack (Build Fast)

- Next.js
- Prisma + PostgreSQL
- Zustand
- TanStack Query
- NextAuth
- Socket.IO
- Stripe

Notes:
- Use DB filtering (no Elasticsearch yet)
- Manual scoring (no AI yet)

---

# Production Stack (Scale)

Add:
- Elasticsearch
- Redis (caching)
- Microservices architecture
- AI scoring service
- Queue system (BullMQ)

---

# Key Principles

- Optimize for fast filtering (<200ms)
- Keep backend scalable
- Separate concerns (API / AI / Realtime)
- Start simple → scale later

-----------------------------------------------------------------------------------------

# Overview

Goal:
- สร้าง platform demo / MVP โดยไม่ใช้ backend
- ใช้ mock data + browser storage
- รองรับ 3 roles: Agency / Brand / Influencer

Approach:
- Frontend-driven architecture
- Simulate backend behavior

---

# Core Stack

## Framework
- Next.js (App Router)
- React
- TypeScript

## Styling
- Tailwind CSS
- shadcn/ui

---

# State Management

## Global State
- Zustand

Use for:
- User session (role: agency / brand / influencer)
- Campaign data
- Selected influencers

## Server-like State (Mock)
- TanStack Query

Use for:
- Fetch mock data (simulate API)
- Cache data

---

# Data Layer (No Backend)

## Option 1: Local Mock Data
- JSON files (e.g. /mock/influencers.json)

## Option 2: Browser Storage
- localStorage (simple)
- IndexedDB (if data large)

---

# Authentication (Fake)

- Store user in Zustand or localStorage

Example:
- role: "agency" | "brand" | "influencer"
- name
- email

---

# Routing

- Next.js App Router

Routes:
- /dashboard
- /discover
- /campaigns
- /messages
- /profile

---

# Features Implementation

## 1. Discover Influencers
- Filter via frontend logic
- Use array.filter()

Data fields:
- platform
- followers
- engagementRate
- category

---

## 2. Create Campaign
- Form (React Hook Form + Zod)
- Save to Zustand / localStorage

---

## 3. Campaign List
- Read from global state
- Show cards

---

## 4. Chat (Mock)
- Store messages in state
- Simulate real-time with setInterval / state update

---

## 5. Influencer Apply
- Add campaignId to influencer state

---

## 6. Tracking
- Use fake metrics
- Random or predefined values

---

# Folder Structure

/src
  /app
    /dashboard
    /discover
    /campaigns
    /messages
  /components
  /features
    /campaign
    /influencer
    /chat
  /store
    useUserStore.ts
    useCampaignStore.ts
  /mock
    influencers.json
    campaigns.json
  /lib
    utils.ts

---

# UI Components

- InfluencerCard
- CampaignCard
- FilterSidebar
- ChatWindow
- StatsCard

---

# Data Example

## influencer.json
[
  {
    "id": "1",
    "name": "Mia",
    "platform": ["tiktok"],
    "followers": 120000,
    "engagementRate": 5.2,
    "category": ["beauty"]
  }
]

---

# MVP Limitations

- No real-time backend
- No real payment
- No real authentication
- Data resets (if no storage)

---

# Upgrade Path (Future)

- Replace mock with API (NestJS)
- Move state → backend
- Add database (PostgreSQL)
- Add search engine (Elasticsearch)

---

# Key UX Focus (Important)

- Fast filtering (discover page = core)
- Clear CTA (Add / Apply / Chat)
- Card-based UI
- Simple navigation