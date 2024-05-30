# Siasa React Front-end

This repository contains the front-end for the microservices of the degree project: "PROPOSAL FOR AN INFORMATION SYSTEM FOR THE AUTOMATION OF ACADEMIC SERVICES IN THE EXTENSION OF THE UNIVERSITY OF CUNDINAMARCA FACATATIVÁ", which consists of several microservices that, interacting with each other, comply with the requirements of the problem posed.

## General description

This front-end is a crucial component of the SIASA architecture, a project whose main objective is to qualify for the title of Systems and Computer Engineer.

## Frontend Status

The development of the frontend is in an advanced phase and is estimated to be close to completion. Currently, most of the main functionalities and components have already been successfully implemented. However, it's worth noting that the frontend has reached its stable version 2.5.2, indicating that it has undergone rigorous testing and is ready for production use.

Authentication is a fundamental requirement for the application as it will allow users to access specific functionalities based on their roles. This functionality is directly related to the advancement of the backend, as both must work together to ensure a secure and efficient authentication system.

Once the authentication implementation is complete, we can proceed with configuring the login system and managing user roles. This process will be done in close collaboration with the backend development, as both parties must be synchronized to ensure consistency and integrity of the system.

## Docker Compose for SIASA Microservices

To implement the SIASA backend and frontend infrastructure, you can use the provided Docker Compose configuration. This configuration includes all the services and settings required to run the microservices smoothly.

### Prerequisites

Before using Docker Compose, make sure you have Docker and Docker Compose installed on your machine. You can download them from the [Docker official website](https://www.docker.com/get-started).

### Docker Compose configuration

The Docker Compose file ([docker-compose.yml](https://github.com/CpuJP/SiasaMicroservices/blob/main/docker-compose.yml)) in the repository of Juan Giraldo (back-end developer) contains the necessary specifications to configure the SIASA microservices infrastructure as well as the frontend in React. Defines the services, networks, and configurations required for a smooth deployment.

#### Use

1. Clone the repository:
   ```bash
   git clone https://github.com/CpuJP/SiasaMicroservices.git
   ```
   
2. Navigate to the directory containing the docker-compose.yml file
   ```bash
   cd SiasaMicroservices
   ```

#### Frontend visualization

To see the frontend in action, you can deploy the system using the docker-compose.yml file provided in the repository. Once you have cloned the repository and navigated to the corresponding directory, simply run the following command in your terminal:

Run the following command to start the SIASA container
   ```bash
   docker-compose up -d
   ```

This command will start the Docker containers required to run both the frontend and backend of the application. Once the containers are up and running, you can access the frontend by opening your web browser and navigating to http://localhost:3000.

Once the page loads, you will be able to interact with the user interface and explore the different functionalities and features implemented so far. This visualization will give you a clear idea of how the frontend looks and works in its current state of development.








## Contribution

If you want to contribute to the development or improve this front-end, we invite you to do so. Please follow these guidelines:

1. Open an issue to discuss your ideas or problems.
2. Fork the repository.
3. Create a new branch with a descriptive name.
4. Make your changes and make sure you maintain high code quality.
5. Open a Pull Request and provide a concise description of your changes.

## Contact

If you have questions, comments or concerns, please do not hesitate to contact us at [email](crisfer.montejo2320@gmail.com) or in the issues section of this repository.
