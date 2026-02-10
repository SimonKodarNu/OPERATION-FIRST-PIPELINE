# Operation First Pipeline

![CI/CD Pipeline](https://github.com/simonkodarnu/operation-first-pipeline/actions/workflows/pipeline.yml/badge.svg)

**Live Deployment:** [](https://operation-first-pipeline.onrender.com/)

## About
Week 4 Boiler Room Hackathon - Building a complete CI/CD pipeline. This project demonstrates an automated DevOps workflow using GitHub Actions, Docker, and Trivy security scanning.

## Architecture
```mermaid
graph LR
    A[Code Push] --> B[GitHub Actions]
    B --> C{Tests Pass?}
    C -- Yes --> D[Docker Build]
    D --> E[Trivy Security Scan]
    E --> F[Deploy to Render]
    C -- No --> X[Fail Pipeline]