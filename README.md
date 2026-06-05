# SARS Control Center

SARS Control Center adalah platform komando infrastruktur dan ketahanan global untuk memantau, mengelola, dan merespons kondisi sistem kritikal secara real-time. Aplikasi ini menggabungkan backend API, dashboard web, shared libraries, dan konfigurasi infrastruktur untuk deployment modern.

## Ringkasan

- `apps/api`: Fastify + tRPC API server yang menyediakan endpoint health, metrics, audit, dan layanan backend untuk dashboard.
- `apps/web`: Next.js dashboard frontend untuk operasi, visualisasi, dan kontrol sistem.
- `packages`: shared packages untuk konfigurasi, schema, tipe TypeScript, UI components, dan utilitas umum.
- `infrastructure`: konfigurasi Docker Compose, Kubernetes, dan Terraform untuk deployment lokal dan cloud.
- `docs`: dokumentasi API, keputusan arsitektur, serta runbook setup dan deployment.

> Repo ini juga memuat folder `ars-platform/` dan `platform/` sebagai bagian dari konsolidasi kode yang sedang berjalan.

## Fitur Utama

- Dashboard operasi berbasis Next.js
- API service dengan Fastify, tRPC, dan Prisma/Drizzle ORM
- Shared Zod schema untuk validasi objek di backend dan frontend
- Infrastrukur Docker lokal dan manifest Kubernetes
- Pendekatan monorepo dengan Turbo dan shared workspace packages

## Struktur Repository

```
apps/                 # Aplikasi utama
  api/                # Backend API
  web/                # Frontend dashboard
packages/             # Shared libraries dan konfigurasi
  config/             # ESLint, TypeScript, Tailwind config
  schemas/            # Zod schema bersama
  types/              # TypeScript type definitions
  ui/                 # Shared React UI components
  utils/              # Utility helpers
infrastructure/       # Docker, K8s, Terraform
docs/                 # Dokumentasi dan runbooks
ars-platform/         # Folder platform tambahan
platform/             # Folder platform tambahan
```

## Persyaratan

- Node.js `>= 22.0.0`
- npm `>= 10`
- Docker Desktop (untuk layanan lokal seperti PostgreSQL dan Redis)
- Git

## Setup Lokal

```bash
cd sars-platform
npm install
cp .env.example .env

docker compose -f infrastructure/docker/docker-compose.yml up -d
npm run db:migrate
npm run dev
```

## Perintah Penting

| Perintah | Keterangan |
|---|---|
| `npm run dev` | Jalankan semua layanan pada mode development |
| `npm run build` | Build seluruh aplikasi dan package |
| `npm run lint` | Jalankan ESLint di seluruh monorepo |
| `npm run test` | Jalankan suite test |
| `npm run format` | Format kode dengan Prettier |
| `npm run db:migrate` | Jalankan migrasi database |
| `npm run db:seed` | Seed data awal ke database |

## Dokumentasi Tambahan

- `docs/api/overview.md` - dokumentasi endpoint API dan format error
- `docs/architecture/` - ADR dan keputusan desain arsitektur
- `docs/runbooks/getting-started.md` - panduan setup dan penggunaan

## Tips Pengembangan

- Gunakan port `3000` untuk frontend dan port `4000` atau sesuai env untuk API.
- Pastikan `.env` di-copy dari `.env.example` sebelum menjalankan layanan.
- Jika ada perubahan package atau shared schema, jalankan `npm install` lagi.

## Catatan

Proyek ini adalah monorepo yang mengintegrasikan beberapa aplikasi dan konfigurasi infrastruktur. Pelajari dokumen `docs/` untuk detail lebih lanjut sebelum men-deploy ke environment staging/production.
