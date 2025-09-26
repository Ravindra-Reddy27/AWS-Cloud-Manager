# AWS Cloud Manager

A comprehensive, enterprise-grade AWS infrastructure management application built with React frontend and Flask backend. Provides real-time monitoring and control for EC2 instances, S3 storage, and VPC networking with a modern, AWS-themed user interface.

## Features

### EC2 Instance Management
- **Real-time Instance Monitoring**: View all EC2 instances with live status updates
- **Instance Control**: Start, stop, and terminate instances with one-click actions
- **Detailed Information**: Instance type, platform, IP addresses, and current state
- **Safety Confirmations**: Protection against accidental instance termination

### S3 Storage Management
- **Hierarchical File Browser**: Navigate folders and files like a desktop file explorer
- **Clickable Breadcrumb Navigation**: Jump to any folder level instantly
- **File Operations**: Delete individual files with confirmation dialogs
- **Folder Management**: Delete empty folders with safety validations
- **Bucket Operations**: Delete empty buckets with comprehensive warnings
- **Size and Metadata Display**: File sizes, modification dates, and item counts

### VPC Network Visualization
- **Network Topology Overview**: Visual representation of VPCs and subnets
- **Subnet Classification**: Automatic public/private subnet identification
- **IP Utilization Tracking**: Monitor IP address usage across networks
- **Expandable Subnet Details**: View availability zones, states, and configurations
- **Network Statistics**: Comprehensive metrics dashboard

### Premium User Interface
- **AWS-Themed Design**: Professional dark theme with signature AWS orange accents
- **Dynamic Background**: Custom AWS background with selective blur and logo spotlight
- **Glassmorphism Effects**: Modern translucent cards with backdrop blur
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Interactive Elements**: Hover effects, animations, and smooth transitions

## Technology Stack

### Backend
- **Flask**: Python web framework for REST API
- **Boto3**: Official AWS SDK for Python
- **Flask-CORS**: Cross-origin resource sharing support
- **Botocore**: Low-level AWS service access

### Frontend
- **React 18**: Modern JavaScript library with hooks
- **Lucide React**: Beautiful, customizable icon library
- **CSS-in-JS**: Inline styling with comprehensive design system
- **Responsive Design**: Mobile-first approach with flexible layouts

## Installation & Setup

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- AWS CLI configured with appropriate credentials
- Git (optional but recommended)

### AWS Configuration
1. Install AWS CLI:
   ```bash
   pip install awscli
   ```

2. Configure your credentials:
   ```bash
   aws configure
   ```
   Enter your:
   - AWS Access Key ID
   - AWS Secret Access Key
   - Default region (e.g., us-east-1)
   - Default output format (json)

### Backend Setup
1. Create project directory:
   ```bash
   mkdir aws-manager && cd aws-manager
   mkdir backend && cd backend
   ```

2. Create Python virtual environment:
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install Flask==2.3.3 Flask-CORS==4.0.0 boto3==1.28.57 botocore==1.31.57
   ```

4. Create `app.py` with the provided backend code

5. Run the backend server:
   ```bash
   python app.py
   ```

### Frontend Setup
1. Navigate to project root and create frontend:
   ```bash
   cd .. # Go back to aws-manager directory
   npx create-react-app frontend
   cd frontend
   ```

2. Install additional dependencies:
   ```bash
   npm install lucide-react
   ```

3. Place AWS background image:
   - Add `aws_background.jpg` to `public/` folder

4. Replace `src/App.js` with the provided frontend code

5. Start the development server:
   ```bash
   npm start
   ```

## Project Structure
```
aws-manager/
├── backend/
│   ├── venv/
│   ├── app.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   │   └── aws_background.jpg
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## API Endpoints

### EC2 Management
- `GET /api/ec2/instances` - List all EC2 instances
- `POST /api/ec2/start/<instance_id>` - Start an instance
- `POST /api/ec2/stop/<instance_id>` - Stop an instance
- `POST /api/ec2/terminate/<instance_id>` - Terminate an instance

### S3 Storage
- `GET /api/s3/buckets` - List all S3 buckets
- `GET /api/s3/buckets/<bucket_name>/objects` - List bucket contents
- `DELETE /api/s3/buckets/<bucket_name>/objects/<object_key>` - Delete file
- `DELETE /api/s3/buckets/<bucket_name>/folders/<folder_prefix>` - Delete folder
- `DELETE /api/s3/buckets/<bucket_name>` - Delete bucket

### VPC Networking
- `GET /api/vpc/list` - List all VPCs with subnets
- `GET /api/vpc/<vpc_id>/subnets` - Get VPC subnet details
- `GET /api/vpc/<vpc_id>/details` - Get detailed VPC information

## Required IAM Permissions

Your AWS user/role needs these permissions:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeInstances",
                "ec2:StartInstances",
                "ec2:StopInstances",
                "ec2:TerminateInstances",
                "ec2:DescribeVpcs",
                "ec2:DescribeSubnets",
                "ec2:DescribeRouteTables",
                "ec2:DescribeInternetGateways",
                "ec2:DescribeNatGateways",
                "ec2:DescribeSecurityGroups",
                "s3:ListAllMyBuckets",
                "s3:ListBucket",
                "s3:GetBucketLocation",
                "s3:DeleteObject",
                "s3:DeleteBucket"
            ],
            "Resource": "*"
        }
    ]
}
```

## Key Features Implemented

### Safety & Security
- **Confirmation Dialogs**: All destructive operations require user confirmation
- **Empty Validation**: Folders and buckets must be empty before deletion
- **Error Handling**: Comprehensive error messages and graceful failure handling
- **State Management**: Real-time UI updates reflecting AWS resource states

### User Experience
- **Intuitive Navigation**: Tab-based interface with clear visual hierarchy
- **Loading States**: Visual feedback during API operations
- **Responsive Design**: Seamless experience across all device sizes
- **Accessibility**: Proper contrast ratios and semantic HTML structure

### Performance
- **Optimized Rendering**: Efficient React component updates
- **Memory Management**: Proper cleanup of resources and event listeners
- **API Efficiency**: Minimal AWS API calls with intelligent caching

## Troubleshooting

### Common Issues
1. **AWS Credentials**: Verify with `aws sts get-caller-identity`
2. **Port Conflicts**: Backend runs on :5000, frontend on :3000
3. **CORS Issues**: Ensure Flask-CORS is properly configured
4. **Background Image**: Confirm `aws_background.jpg` is in `public/` folder

### Development Tips
- Use browser dev tools to monitor network requests
- Check backend console for AWS API errors
- Restart both servers after credential changes
- Clear browser cache if styling issues occur

## Security Considerations
- Never commit AWS credentials to version control
- Use IAM roles with minimal required permissions
- Consider AWS SSO for production environments
- Implement request rate limiting for production use

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- AWS SDK team for comprehensive API coverage
- React team for the excellent frontend framework
- Lucide React for beautiful, consistent icons
- Flask community for the lightweight, powerful backend framework
