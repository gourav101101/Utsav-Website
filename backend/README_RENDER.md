# Deploying the Utsav backend to Render

This file explains the exact steps and recommended settings to deploy the `backend/` folder as a Web Service on Render and connect it to MongoDB Atlas and your hosted frontend at https://utsavdecorandevents.firebaseapp.com/.

---

## 1) What Render needs
- Root Directory: `backend`
- Start Command: `npm start`
- Environment: Node 18+ (Render default is fine)

## 2) Required Environment Variables (set these in Render's dashboard)
- MONGODB_URI
  - Example (replace user/password):
    mongodb+srv://gourav:<PASSWORD>@cluster0.9goq9a5.mongodb.net/utsav?retryWrites=true&w=majority
- ADMIN_API_KEY
  - A strong secret string used by the backend to authorize admin actions.
- FRONTEND_URL
  - Set to your deployed frontend URL for CORS. For you:
    https://utsavdecorandevents.firebaseapp.com/
- (optional) DEBUG_ADMIN_AUTH=1
  - Enables masked admin auth debug logs (useful temporarily for troubleshooting).

## 3) Render service setup steps (concise)
1. Sign in to Render and click "New" → "Web Service".
2. Connect your GitHub repo and choose the branch (e.g., `main`).
3. In the "Root Directory" field enter: `backend`.
4. Build/Start commands:
   - Build Command: (none required for this Node app)
   - Start Command: `npm start`
5. Add environment variables listed above.
6. Create the service. Render will deploy and show logs in the dashboard.

## 4) CORS & FRONTEND_URL
The backend uses `FRONTEND_URL` to allow CORS from your frontend. Set `FRONTEND_URL` in Render to exactly:

  https://utsavdecorandevents.firebaseapp.com/

If you need to allow multiple origins (e.g., staging), consider adding them to the server's CORS logic.

## 5) Running the seed script (demo data)
To populate your Atlas DB with demo categories and products, either:

A) Run locally against the production DB (recommended safe approach):
```bash
export MONGODB_URI="mongodb+srv://gourav:<PASSWORD>@cluster0.9goq9a5.mongodb.net/utsav?retryWrites=true&w=majority"
export ADMIN_API_KEY="<YOUR_ADMIN_KEY>"
cd backend
npm install
npm run seed
```

B) Use Render's "Manual Job" / "Run" feature (if available) to run `npm run seed` once with the same environment variables set in Render.

## 6) Verifying admin endpoints
- After deploy, open Render logs and check the server started and lists the admin key presence.
- From your local machine, test:
```bash
curl -X GET https://<your-render-service>.onrender.com/api/categories
```
- To create a category (admin-protected):
```bash
curl -X POST https://<your-render-service>.onrender.com/api/categories \
  -H "Content-Type: application/json" \
  -H "x-admin-key: <YOUR_ADMIN_KEY>" \
  -d '{"name":"New Cat"}'
```

## 7) Troubleshooting
- 403 responses when creating/updating: Ensure `ADMIN_API_KEY` is set in Render and matches the `x-admin-key` header the client sends.
- Connection refused / DNS issues: Make sure your Atlas cluster allows connections from Render. As a quick test, set Atlas IP Access to 0.0.0.0/0 (temporary) or add Render's outbound IPs.
- Logs: Use Render's live logs. If you set `DEBUG_ADMIN_AUTH=1`, the server will print masked admin-key debug lines.

## 8) Security recommendations (next steps)
- Replace static admin key with a proper auth strategy (JWT or OAuth) for real production.
- Use a secret manager (Render's env vars are fine) and rotate keys periodically.
- Restrict Atlas IP access to only the ranges you need (or VPC peering if available).

---

If you want, I can:
- Create a ready-to-copy list of the exact environment variable values (without secrets) to paste into Render.
- Inspect Render logs after you create the service and help fix any startup issues.
- Run the seed for you if you paste the final Atlas URI (or run it locally and report results).
