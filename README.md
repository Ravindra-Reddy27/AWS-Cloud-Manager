# AWS Cloud Manager

**AWS Cloud Manager** is an enterprise-grade application for managing AWS infrastructure with a React frontend and Flask backend. It enables real-time monitoring and control of EC2 instances, S3 storage, and VPC networks through a modern AWS-themed interface.

---

## Features

### EC2 Management
- View all EC2 instances with live status
- Start, stop, and terminate instances safely
- Instance details: type, IP, platform, and state

### S3 Storage
- Navigate buckets and folders like a desktop explorer
- Delete files, empty folders, and buckets safely
- View size, metadata, and item counts

### VPC Networking
- Visualize VPCs and subnets
- Track public/private subnets and IP usage
- View subnet details and network metrics

### UI & UX
- AWS-themed professional design
- Glassmorphism and dynamic background
- Responsive and interactive layout

---

## Technology Stack

**Backend:** Flask, Boto3, Botocore, Flask-CORS  
**Frontend:** React 18, Lucide React, CSS-in-JS  

---

## Setup

### Prerequisites
- Python ≥ 3.8  
- Node.js ≥ 16  
- AWS CLI configured  
- Git (optional)

### Backend
```bash
mkdir aws-manager && cd aws-manager
mkdir backend && cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate
pip install Flask==2.3.3 Flask-CORS==4.0.0 boto3==1.28.57 botocore==1.31.57
python app.py
