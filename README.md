This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Networking to MongoDB Atlas

Followed these instructions to create a static outbound IP address:
https://cloud.google.com/run/docs/configuring/static-outbound-ip

### Run these gcloud commands:

Create subnet

```bash
gcloud compute networks subnets create psp-subnet \
--range=10.124.0.0/28 --network=default --region=us-central1
```

```bash
Created [https://www.googleapis.com/compute/v1/projects/repsp123/regions/us-central1/subnetworks/psp-subnet].
NAME        REGION       NETWORK  RANGE          STACK_TYPE  IPV6_ACCESS_TYPE  INTERNAL_IPV6_PREFIX  EXTERNAL_IPV6_PREFIX
psp-subnet  us-central1  default  10.124.0.0/28  IPV4_ONLY
```

Create router

```bash
gcloud compute routers create psp-router \
 --network=default \
 --region=us-central1
```

```bash
Creating router [psp-router]...done.
NAME REGION NETWORK
psp-router us-central1 default
```

Create origin ip

```bash
gcloud compute addresses create psp-origin-ip --region=us-central1
Created [https://www.googleapis.com/compute/v1/projects/repsp123/regions/us-central1/addresses/psp-origin-ip].
```

gcloud compute routers nats create psp-nat \
 --router=psp-router \
 --region=us-central1 \
 --nat-custom-subnet-ip-ranges=psp-subnet \
 --nat-external-ip-pool=psp-origin-ip

Create NAT

```bash
Creating NAT [psp-nat] in router [psp-router]...done.
```

```bash
gcloud run deploy thepsp \
--image=us-central1-docker.pkg.dev/repsp123/firebaseapphosting-images/thepsp@sha256:b2a65ba4fb355fd67dad22f100ccb2000f811784daa392e1a2ecf1d9205b5663 \
--network=default \
--subnet=psp-subnet \
--region=us-central1 \
--vpc-egress=all-traffic
```

Deploy Container

```bash
Deploying container to Cloud Run service [thepsp] in project [repsp123] region [us-central1]
✓ Deploying... Done.
 ✓ Creating Revision...
Done.
Service [thepsp] revision [thepsp-build-2024-12-28-004] has been deployed and is serving 100 percent of traffic.
Service URL: https://thepsp-1081890506539.us-central1.run.app
The revision can be reached directly at https://t-2178295864---thepsp-xm6jid22bq-uc.a.run.app
```
