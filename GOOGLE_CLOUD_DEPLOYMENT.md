# Google Cloud Deployment Guide

## Prerequisites

1. Google Cloud Project
2. Google Cloud CLI installed
3. Docker installed (for Cloud Run)
4. Active billing enabled on Google Cloud

## Option 1: Deploy to Cloud Run (Recommended)

Cloud Run is ideal for this React app - serverless, auto-scaling, and cost-effective.

### Step 1: Install Google Cloud CLI

**Windows:**
```powershell
# Download and run the installer from:
# https://cloud.google.com/sdk/docs/install

# Or use Chocolatey:
choco install google-cloud-sdk
```

### Step 2: Initialize and Authenticate

```powershell
gcloud init
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### Step 3: Set Environment Variables

Create/update `.env.local` with your credentials:
```
VITE_GEMINI_API_KEY=your_gemini_key
VITE_AGORA_AI_REST_KEY=your_agora_key
VITE_AGORA_AI_REST_SECRET=your_agora_secret
VITE_AGORA_APP_ID=your_agora_app_id
VITE_AGORA_PROJECT_ID=your_agora_project_id
```

### Step 4: Enable Required APIs

```powershell
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Step 5: Build and Deploy

```powershell
# Build the Docker image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/mindbloom:latest

# Deploy to Cloud Run
gcloud run deploy mindbloom `
  --image gcr.io/YOUR_PROJECT_ID/mindbloom:latest `
  --platform managed `
  --region us-central1 `
  --allow-unauthenticated `
  --set-env-vars="VITE_GEMINI_API_KEY=YOUR_KEY,VITE_AGORA_AI_REST_KEY=YOUR_KEY,VITE_AGORA_AI_REST_SECRET=YOUR_SECRET"
```

### Step 6: View Your App

After deployment, you'll get a URL like:
```
https://mindbloom-xxxxx-uc.a.run.app
```

---

## Option 2: Deploy to App Engine

Good for traditional server-based hosting with persistent storage.

### Step 1: Initialize App Engine

```powershell
gcloud app create --region=us-central
```

### Step 2: Configure App Engine

Update `app.yaml` with your environment variables:

```yaml
env_variables:
  VITE_GEMINI_API_KEY: "your_key"
  VITE_AGORA_AI_REST_KEY: "your_key"
  VITE_AGORA_AI_REST_SECRET: "your_secret"
```

### Step 3: Deploy

```powershell
gcloud app deploy
```

View your app:
```powershell
gcloud app browse
```

---

## Option 3: Deploy to Cloud Storage + Cloud CDN (Static Only)

If you just need to serve the built app without server-side functions.

### Step 1: Create Storage Bucket

```powershell
gsutil mb gs://mindbloom-YOUR_PROJECT_ID
```

### Step 2: Upload Build

```powershell
gsutil -m cp -r build/* gs://mindbloom-YOUR_PROJECT_ID/
```

### Step 3: Make Public and Setup CDN

```powershell
gsutil iam ch serviceAccount:cloud-cdn@cloud.gserviceaccount.com:objectViewer gs://mindbloom-YOUR_PROJECT_ID
```

---

## Option 4: Deploy to Compute Engine (VM)

For full control and custom setup.

### Step 1: Create VM Instance

```powershell
gcloud compute instances create mindbloom-vm `
  --zone=us-central1-a `
  --machine-type=e2-micro `
  --image-family=debian-11 `
  --image-project=debian-cloud `
  --tags=http-server,https-server
```

### Step 2: SSH into VM

```powershell
gcloud compute ssh mindbloom-vm --zone=us-central1-a
```

### Step 3: Install Node.js and Deploy

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
git clone https://github.com/AryannGoel/Hackfest.git
cd Hackfest
npm install
npm run build
npm install -g pm2
pm2 start "serve -s build"
pm2 startup
pm2 save
```

---

## Environment Variables Management

### Using Google Secret Manager (Recommended for Production)

```powershell
# Create secrets
echo -n "your_gemini_key" | gcloud secrets create GEMINI_API_KEY --data-file=-
echo -n "your_agora_key" | gcloud secrets create AGORA_REST_KEY --data-file=-

# Grant Cloud Run permission
gcloud secrets add-iam-policy-binding GEMINI_API_KEY `
  --member=serviceAccount:YOUR_PROJECT_ID@appspot.gserviceaccount.com `
  --role=roles/secretmanager.secretAccessor
```

---

## Monitoring and Logs

### View Logs

```powershell
# Cloud Run logs
gcloud run logs read mindbloom --limit=50

# App Engine logs
gcloud app logs read
```

### Setup Monitoring

```powershell
gcloud monitoring metrics-descriptors list
```

---

## Cost Estimation

| Service | Monthly Cost (Estimate) |
|---------|------------------------|
| Cloud Run | $0 - $10 (free tier included) |
| App Engine | $0 - $25 |
| Cloud Storage | $0.20 per GB |
| Compute Engine | $20 - $30 |

---

## Troubleshooting

### Secret Not Loading
```powershell
gcloud secrets list
gcloud secrets versions access latest --secret="GEMINI_API_KEY"
```

### Build Fails
```powershell
gcloud builds log <BUILD_ID> --limit=100
```

### Container Won't Start
```powershell
# Test locally
docker build -t mindbloom:test .
docker run -p 3000:3000 mindbloom:test
```

---

## Recommended: Cloud Run Setup

**Why Cloud Run?**
- ✅ Pay only for execution time
- ✅ Auto-scales from 0 to 1000s of instances
- ✅ No servers to manage
- ✅ Fast deployment
- ✅ Easy environment variable management

**Estimated Cost:** $0-5/month for small usage

---

## Next Steps

1. Create a Google Cloud Project: https://console.cloud.google.com
2. Set up billing
3. Install Google Cloud CLI
4. Follow Option 1 (Cloud Run) for fastest deployment
5. Monitor your app in Cloud Console

Need help? Check the [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
