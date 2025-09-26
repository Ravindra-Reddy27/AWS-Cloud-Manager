# AWS Cloud Manager

Enterprise-grade AWS infrastructure management tool with **React frontend** and **Flask backend**. Manage EC2, S3, and VPCs in real-time through a modern, AWS-themed interface.

---

## Features

### EC2 Management
- Real-time instance monitoring
- Start, stop, terminate instances
- Detailed info: type, IPs, state
- Safety confirmations for destructive actions

### S3 Storage
- Hierarchical file browser with breadcrumb navigation
- File & folder operations with confirmations
- Delete empty buckets with warnings
- Display file sizes, dates, and counts

### VPC Networking
- Visual network topology overview
- Public/private subnet classification
- IP utilization tracking
- Expandable subnet details & network stats

### Premium UI
- AWS-themed dark design with glassmorphism
- Dynamic background with logo spotlight
- Responsive layout and interactive elements

---

## Technology Stack

**Backend:** Flask, Boto3, Botocore, Flask-CORS  
**Frontend:** React 18, Lucide React, CSS-in-JS, Responsive Design

---

## Installation

### Prerequisites
- Python ≥ 3.8  
- Node.js ≥ 16  
- AWS CLI configured  
- Git (optional)

### AWS CLI Setup
```bash
pip install awscli
aws configure
mkdir -p aws-manager/backend && cd aws-manager/backend
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
pip install Flask==2.3.3 Flask-CORS==4.0.0 boto3==1.28.57 botocore==1.31.57
python app.py
cd ../
npx create-react-app frontend
cd frontend
npm install lucide-react
# Place aws_background.jpg in public/
npm start
aws-manager/
├── backend/
│   ├── venv/
│   ├── app.py
│   └── requirements.txt
├── frontend/
│   ├── public/aws_background.jpg
│   ├── src/App.js
│   └── package.json
└── README.md
API Endpoints

EC2

GET /api/ec2/instances

POST /api/ec2/start/<id>

POST /api/ec2/stop/<id>

POST /api/ec2/terminate/<id>

S3

GET /api/s3/buckets

GET /api/s3/buckets/<bucket>/objects

DELETE /api/s3/buckets/<bucket>/objects/<key>

DELETE /api/s3/buckets/<bucket>/folders/<prefix>

DELETE /api/s3/buckets/<bucket>

VPC

GET /api/vpc/list

GET /api/vpc/<vpc_id>/subnets

GET /api/vpc/<vpc_id>/details
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ec2:*",
                "s3:*"
            ],
            "Resource": "*"
        }
    ]
}
Key Features

Safety & Security: Confirmations, empty validations, error handling

User Experience: Intuitive navigation, loading states, responsive, accessible

Performance: Optimized React rendering, memory management, API efficiency

Troubleshooting

Verify AWS credentials: aws sts get-caller-identity

Backend port: 5000, Frontend port: 3000

CORS: Ensure Flask-CORS is enabled

Background image: in public/

Security

Never commit AWS credentials

Use minimal IAM permissions

Consider AWS SSO in production

Implement rate limiting for production use

Contributing

Fork repo

Create feature branch

Commit changes

Push branch

Open Pull Request

License

MIT License - see LICENSE file

Acknowledgments

AWS SDK team

React team

Lucide React

Flask community


This version keeps everything **professional, concise, and readable**, while retaining all necessary instructions and structure.  

If you want, I can also **make an even shorter “one-page” README** that’s ultra-clean and minimal for GitHub. Do you want me to do that?

Is this conversation helpful so far?
