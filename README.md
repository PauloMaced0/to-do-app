# Task Management: An AWS-Powered To-Do Application

The design, development, and deployment of a task management web application on the Amazon Web Services (AWS) platform are presented here. The main objective of the project was to create a scalable and safe application by fusing present cloud technology with basic software development techniques. The system features a fully orchestrated environment driven by Infrastructure as Code (IaC) principles through Terraform, utilizing services like the Virtual Private Cloud (VPC), Elastic Container Service (ECS), Relational Database Service (RDS), and AWS Cognito for authentication.

The implementation of Continuous Integration and Continuous Deployment (CI/CD) pipelines is a crucial component of this endeavour. Implementing CI/CD gave essential practical expertise with automated provisioning, version-controlled infrastructure changes, and rapid, iterative delivery processes. In the end, this project fosters a greater understanding of AWS services, agile techniques, and DevOps processes by demonstrating the process of converting theoretical concepts into a functional cloud-native application.

## Demo 

![](assets/demo.gif)

---

## Implementation

### Architecture

![ToDo Application - AWS Architecture](/assets/AWSArch.png)

The system is built on several AWS services working together:

- **VPC & Networking** (public and private subnets across AZs, Internet/NAT Gateways, Route Tables)  
- **Security Groups** (for ALB, ECS, RDS, API Gateway)  
- **Application Load Balancer (ALB)**  
- **Elastic Container Service (ECS on Fargate)** with images in **ECR**  
- **Relational Database Service (RDS)**  
- **API Gateway with VPC Link** (entry point for REST APIs)  
- **AWS Cognito** for authentication  
- **CloudFront + S3** for frontend hosting  

This architecture ensures scalability, security, and separation of responsibilities between frontend, backend, and database.

---

## Components and Connections

- VPC isolates resources.  
- Public subnets: ALB, Internet/NAT Gateways.  
- Private subnets: ECS tasks, RDS, API Gateway VPC Link.  
- ALB routes traffic to ECS tasks.  
- ECS tasks interact with RDS (secured by security groups).  
- API Gateway authenticates requests with Cognito JWT, then routes to ALB.  
- CloudFront serves static frontend from S3 with OAC (Origin Access Control).  

**Limitation**: RDS is single-AZ, so availability could be improved with multi-AZ deployment.

---

## Data Flow

1. User accesses frontend → delivered by CloudFront from S3.  
2. Authentication → AWS Cognito, issues JWT.  
3. Requests → API Gateway → ALB → ECS → RDS.  
4. Responses flow back through the same chain to the client.  

This ensures secure, token-based communication and proper network isolation.

---

## Application Functionalities

- **User Authentication & Profile**  
  - Cognito Hosted UI for sign-in  
  - Profile management: view/edit attributes (name, phone, stats)  

- **Task Management**  
  - CRUD operations on tasks  
  - Filtering (completed/uncompleted) and sorting (date, priority, status)  
  - Real-time updates on the frontend  

- **Integration Flow**  
  1. Authenticate with Cognito  
  2. Store user in backend database  
  3. Navigate between Profile and Reminders pages  
  4. Perform task operations (create, edit, delete, complete)  

---

## Deployment

### Infrastructure as Code (Terraform)
- Defines VPC, subnets, security groups, ECS, RDS, etc.  
- Provides version-controlled, auditable, and reusable infrastructure.  

### CI/CD Workflows
- Triggered on merges to main branch.  
- Runs Terraform to apply infra changes.  
- Deploys updated ECS containers with new images.  
- Manual verification via CloudWatch (no automated tests yet).  

### Benefits
- Repeatable and consistent deployments.  
- Version control for infra and app changes.  
- Faster iterations with minimal manual intervention.  
- Provides a strong foundation for future automated testing.  

---

# Conclusion

The project successfully developed a cloud-native task management application on AWS. Key achievements:

- **Scalable backend & responsive frontend**  
- **Secure authentication with Cognito**  
- **IaC with Terraform for reproducible infrastructure**  
- **CI/CD pipelines** for automated deployment  

### Lessons Learned
- Practical experience gained with DevOps workflows, IaC, and cloud-native design.  

### Limitations & Future Improvements
- RDS currently runs in single-AZ → should move to multi-AZ for resilience.  
- Authentication flow could be refined further.  
- Automated tests should be integrated into CI/CD for stronger reliability.  

**Overall**, the project provided valuable experience in combining AWS and DevOps practices to build a reliable and scalable application.

---
---

## AWS cli helpful commands for cognito
- aws cognito-idp sign-up --client-id hf90tv2s5rfo6eld1i7umhajb --username 'email@gmail.com' --password 'password'
- aws cognito-idp confirm-sign-up --client-id 1gleav19hr5b64lmb6gfe2rdal --username 'email@gmail.com' --confirmation-code 216620
- aws cognito-idp initiate-auth --client-id hf90tv2s5rfo6eld1i7umhajb --auth-flow USER_PASSWORD_AUTH --auth-parameters 'USERNAME=emailgmail.com,PASSWORD=password'
- curl 'https://965cvkw509.execute-api.eu-west-1.amazonaws.com/health' -H 'Authorization: Bearer eyJraW...'
