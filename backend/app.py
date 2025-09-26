from flask import Flask, jsonify, request
from flask_cors import CORS
import boto3
from botocore.exceptions import ClientError, NoCredentialsError
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Initialize AWS clients
def get_aws_clients():
    try:
        # It's better to initialize the clients with a specific region,
        # but for this example, we'll let boto3 use its default configuration.
        ec2 = boto3.client('ec2')
        s3 = boto3.client('s3')
        return ec2, s3
    except NoCredentialsError:
        return None, None

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "AWS Manager API is running"})

@app.route('/api/ec2/instances', methods=['GET'])
def get_ec2_instances():
    try:
        ec2, _ = get_aws_clients()
        if not ec2:
            return jsonify({"error": "AWS credentials not configured"}), 400
        
        response = ec2.describe_instances()
        instances = []
        
        for reservation in response['Reservations']:
            for instance in reservation['Instances']:
                # Get instance name from tags
                name = "No Name"
                if 'Tags' in instance:
                    for tag in instance['Tags']:
                        if tag['Key'] == 'Name':
                            name = tag['Value']
                            break
                
                instance_data = {
                    'InstanceId': instance['InstanceId'],
                    'Name': name,
                    'State': instance['State']['Name'],
                    'InstanceType': instance['InstanceType'],
                    'PublicIpAddress': instance.get('PublicIpAddress', 'N/A'),
                    'PrivateIpAddress': instance.get('PrivateIpAddress', 'N/A'),
                    'LaunchTime': instance['LaunchTime'].isoformat() if 'LaunchTime' in instance else 'N/A',
                    'Platform': instance.get('Platform', 'Linux'),
                    'VpcId': instance.get('VpcId', 'N/A'),
                    'SubnetId': instance.get('SubnetId', 'N/A')
                }
                instances.append(instance_data)
        
        return jsonify(instances)
    
    except ClientError as e:
        return jsonify({"error": f"AWS Error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Server Error: {str(e)}"}), 500

@app.route('/api/ec2/start/<instance_id>', methods=['POST'])
def start_instance(instance_id):
    try:
        ec2, _ = get_aws_clients()
        if not ec2:
            return jsonify({"error": "AWS credentials not configured"}), 400
        
        response = ec2.start_instances(InstanceIds=[instance_id])
        return jsonify({
            "message": f"Instance {instance_id} start initiated",
            "status": "success"
        })
    
    except ClientError as e:
        return jsonify({"error": f"AWS Error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Server Error: {str(e)}"}), 500

@app.route('/api/ec2/stop/<instance_id>', methods=['POST'])
def stop_instance(instance_id):
    try:
        ec2, _ = get_aws_clients()
        if not ec2:
            return jsonify({"error": "AWS credentials not configured"}), 400
        
        response = ec2.stop_instances(InstanceIds=[instance_id])
        return jsonify({
            "message": f"Instance {instance_id} stop initiated",
            "status": "success"
        })
    
    except ClientError as e:
        return jsonify({"error": f"AWS Error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Server Error: {str(e)}"}), 500

@app.route('/api/ec2/terminate/<instance_id>', methods=['POST'])
def terminate_instance(instance_id):
    try:
        ec2, _ = get_aws_clients()
        if not ec2:
            return jsonify({"error": "AWS credentials not configured"}), 400
        
        response = ec2.terminate_instances(InstanceIds=[instance_id])
        return jsonify({
            "message": f"Instance {instance_id} termination initiated",
            "status": "success"
        })
    
    except ClientError as e:
        return jsonify({"error": f"AWS Error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Server Error: {str(e)}"}), 500

@app.route('/api/s3/buckets', methods=['GET'])
def get_s3_buckets():
    try:
        _, s3 = get_aws_clients()
        if not s3:
            return jsonify({"error": "AWS credentials not configured"}), 400
        
        response = s3.list_buckets()
        buckets = []
        
        for bucket in response['Buckets']:
            # Get bucket region
            try:
                bucket_location = s3.get_bucket_location(Bucket=bucket['Name'])
                region = bucket_location['LocationConstraint'] or 'us-east-1'
            except:
                region = 'Unknown'
            
            # Get accurate object count and size by paginating
            object_count = 0
            total_size = 0
            
            try:
                paginator = s3.get_paginator('list_objects_v2')
                pages = paginator.paginate(Bucket=bucket['Name'])
                for page in pages:
                    object_count += page.get('KeyCount', 0)
                    if 'Contents' in page:
                        total_size += sum(obj['Size'] for obj in page['Contents'])
            except ClientError:
                # Handle cases where listing is denied, e.g., permission errors
                object_count = 'N/A'
                total_size = 0

            # Format size
            if isinstance(object_count, str) or total_size == 0:
                size_str = "Empty"
            elif total_size < 1024:
                size_str = f"{total_size} B"
            elif total_size < 1024*1024:
                size_str = f"{total_size/1024:.1f} KB"
            elif total_size < 1024*1024*1024:
                size_str = f"{total_size/(1024*1024):.1f} MB"
            else:
                size_str = f"{total_size/(1024*1024*1024):.1f} GB"
            
            bucket_data = {
                'Name': bucket['Name'],
                'CreationDate': bucket['CreationDate'].isoformat(),
                'Region': region,
                'Size': size_str,
                'ObjectCount': object_count
            }
            buckets.append(bucket_data)
        
        return jsonify(buckets)
    
    except ClientError as e:
        return jsonify({"error": f"AWS Error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Server Error: {str(e)}"}), 500

@app.route('/api/s3/buckets/<bucket_name>/objects', methods=['GET'])
def get_bucket_objects(bucket_name):
    try:
        _, s3 = get_aws_clients()
        if not s3:
            return jsonify({"error": "AWS credentials not configured"}), 400
        
        prefix = request.args.get('prefix', '')
        delimiter = '/'
        
        response = s3.list_objects_v2(
            Bucket=bucket_name,
            Prefix=prefix,
            Delimiter=delimiter,
            MaxKeys=1000
        )
        
        folders = []
        files = []
        
        # Process folders (common prefixes)
        if 'CommonPrefixes' in response:
            for prefix_info in response['CommonPrefixes']:
                folder_prefix = prefix_info['Prefix']
                folder_name = folder_prefix.rstrip('/').split('/')[-1]

                # --- START: Corrected Logic ---
                # Calculate item count and size for each folder
                item_count = 0
                total_size = 0
                try:
                    paginator = s3.get_paginator('list_objects_v2')
                    pages = paginator.paginate(Bucket=bucket_name, Prefix=folder_prefix)
                    for page in pages:
                        if 'Contents' in page:
                            # Don't count the folder's own 0-byte object marker
                            # which is sometimes present.
                            for obj in page['Contents']:
                                if obj['Key'] != folder_prefix:
                                    item_count += 1
                                    total_size += obj['Size']
                except ClientError:
                    # If we can't list contents (e.g., permissions), mark as not accessible
                    item_count = "N/A"
                    total_size = 0
                
                # Format size
                if isinstance(item_count, str) or total_size == 0:
                    size_str = "—"
                elif total_size < 1024:
                    size_str = f"{total_size} B"
                elif total_size < 1024*1024:
                    size_str = f"{total_size/1024:.1f} KB"
                elif total_size < 1024*1024*1024:
                    size_str = f"{total_size/(1024*1024):.1f} MB"
                else:
                    size_str = f"{total_size/(1024*1024*1024):.1f} GB"

                folders.append({
                    'Name': folder_name,
                    'FullPath': folder_prefix,
                    'Type': 'folder',
                    'FileCount': item_count,  # Added this field
                    'Size': size_str           # Added this field
                })
                # --- END: Corrected Logic ---
        
        # Process files
        if 'Contents' in response:
            for obj in response['Contents']:
                # Skip if it's just the folder itself (a 0-byte object)
                if obj['Key'] == prefix:
                    continue
                
                file_name = obj['Key'].split('/')[-1]
                if file_name:  # Skip empty names
                    # Format file size
                    size = obj['Size']
                    if size < 1024:
                        size_str = f"{size} B"
                    elif size < 1024*1024:
                        size_str = f"{size/1024:.1f} KB"
                    elif size < 1024*1024*1024:
                        size_str = f"{size/(1024*1024):.1f} MB"
                    else:
                        size_str = f"{size/(1024*1024*1024):.1f} GB"
                    
                    files.append({
                        'Name': file_name,
                        'FullPath': obj['Key'],
                        'Size': size_str,
                        'LastModified': obj['LastModified'].isoformat(),
                        'Type': 'file'
                    })
        
        return jsonify({
            'folders': folders,
            'files': files,
            'currentPrefix': prefix
        })
    
    except ClientError as e:
        return jsonify({"error": f"AWS Error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Server Error: {str(e)}"}), 500

@app.route('/api/s3/buckets/<bucket_name>/objects/<path:object_key>', methods=['DELETE'])
def delete_object(bucket_name, object_key):
    try:
        _, s3 = get_aws_clients()
        if not s3:
            return jsonify({"error": "AWS credentials not configured"}), 400
        
        # Delete the object
        s3.delete_object(Bucket=bucket_name, Key=object_key)
        
        return jsonify({
            "message": f"Object {object_key} deleted successfully",
            "status": "success"
        })
    
    except ClientError as e:
        return jsonify({"error": f"AWS Error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Server Error: {str(e)}"}), 500

@app.route('/api/s3/buckets/<bucket_name>/folders/<path:folder_prefix>', methods=['DELETE'])
def delete_folder(bucket_name, folder_prefix):
    try:
        _, s3 = get_aws_clients()
        if not s3:
            return jsonify({"error": "AWS credentials not configured"}), 400
        
        # Ensure folder_prefix ends with /
        if not folder_prefix.endswith('/'):
            folder_prefix += '/'
        
        # Check if folder has any objects
        response = s3.list_objects_v2(Bucket=bucket_name, Prefix=folder_prefix, MaxKeys=1)
        
        if 'Contents' in response and len(response['Contents']) > 0:
            # Check if the only object is the folder itself
            if len(response['Contents']) == 1 and response['Contents'][0]['Key'] == folder_prefix:
                # Delete the folder marker
                s3.delete_object(Bucket=bucket_name, Key=folder_prefix)
                return jsonify({
                    "message": f"Folder {folder_prefix} deleted successfully",
                    "status": "success"
                })
            else:
                return jsonify({
                    "error": "Cannot delete folder: Folder is not empty",
                    "status": "error"
                }), 400
        
        # If no objects found, folder might not exist or already be empty
        return jsonify({
            "message": f"Folder {folder_prefix} deleted successfully",
            "status": "success"
        })
    
    except ClientError as e:
        return jsonify({"error": f"AWS Error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Server Error: {str(e)}"}), 500

@app.route('/api/s3/buckets/<bucket_name>', methods=['DELETE'])
def delete_bucket(bucket_name):
    try:
        _, s3 = get_aws_clients()
        if not s3:
            return jsonify({"error": "AWS credentials not configured"}), 400
        
        # Check if bucket is empty
        response = s3.list_objects_v2(Bucket=bucket_name, MaxKeys=1)
        
        if 'Contents' in response and len(response['Contents']) > 0:
            return jsonify({
                "error": "Cannot delete bucket: Bucket is not empty",
                "status": "error"
            }), 400
        
        # Delete the bucket
        s3.delete_bucket(Bucket=bucket_name)
        
        return jsonify({
            "message": f"Bucket {bucket_name} deleted successfully",
            "status": "success"
        })
    
    except ClientError as e:
        return jsonify({"error": f"AWS Error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Server Error: {str(e)}"}), 500

@app.route('/api/vpc/vpcs', methods=['GET'])
def get_vpcs():
    """
    Retrieves detailed information about all Virtual Private Clouds (VPCs).
    """
    try:
        ec2, _ = get_aws_clients()
        if not ec2:
            return jsonify({"error": "AWS credentials not configured"}), 400
        
        response = ec2.describe_vpcs()
        vpcs = []
        
        for vpc in response['Vpcs']:
            # Determine the VPC name from its tags
            name = "No Name"
            if 'Tags' in vpc:
                for tag in vpc['Tags']:
                    if tag['Key'] == 'Name':
                        name = tag['Value']
                        break
            
            vpc_data = {
                'VpcId': vpc['VpcId'],
                'Name': name,
                'State': vpc['State'],
                'CidrBlock': vpc['CidrBlock'],
                'IsDefault': vpc['IsDefault'],
                'Tenancy': vpc['InstanceTenancy'],
            }
            vpcs.append(vpc_data)
            
        return jsonify(vpcs)
    
    except ClientError as e:
        # Handle specific AWS client errors
        return jsonify({"error": f"AWS Error: {str(e)}"}), 500
    except Exception as e:
        # Handle other potential server-side errors
        return jsonify({"error": f"Server Error: {str(e)}"}), 500

if __name__ == '__main__':
    print("Starting AWS Manager API...")
    print("Make sure your AWS credentials are configured!")
    print("Server running on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
