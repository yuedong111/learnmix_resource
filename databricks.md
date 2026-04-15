What is Databricks?
Databricks is a unified, open analytics platform for building, deploying, sharing, and maintaining enterprise-grade data, analytics, and AI solutions at scale. The Databricks Data Intelligence Platform integrates with cloud storage and security in your cloud account, and manages and deploys cloud infrastructure for you.

Databricks data intelligence platform

Databricks uses generative AI with the data lakehouse to understand the unique semantics of your data. Then, it automatically optimizes performance and manages infrastructure to match your business needs.

Natural language processing learns your business's language, so you can search and discover data by asking a question in your own words. Natural language assistance helps you write code, troubleshoot errors, and find answers in documentation.

Managed open source integration
Databricks is committed to the open source community and manages updates of open source integrations with the Databricks Runtime releases. The following technologies are open source projects originally created by Databricks employees:

Delta Lake and Delta Sharing
MLflow
Apache Spark and Structured Streaming
Redash
Unity Catalog
Common use cases
The following use cases highlight some of the ways customers use Databricks to accomplish tasks essential to processing, storing, and analyzing the data that drives critical business functions and decisions.

Build an enterprise data lakehouse
The data lakehouse combines enterprise data warehouses and data lakes to accelerate, simplify, and unify enterprise data solutions. Data engineers, data scientists, analysts, and production systems can all use the data lakehouse as their single source of truth, providing access to consistent data and reducing the complexities of building, maintaining, and syncing many distributed data systems. See What is a data lakehouse?.

ETL and data engineering
Whether you're generating dashboards or powering artificial intelligence applications, data engineering provides the backbone for data-centric companies by making sure data is available, clean, and stored in data models for efficient discovery and use. Databricks combines the power of Apache Spark with Delta and custom tools to provide an unrivaled ETL experience. Use SQL, Python, and Scala to compose ETL logic and orchestrate scheduled job deployment with a few clicks.

Lakeflow Spark Declarative Pipelines further simplifies ETL by intelligently managing dependencies between datasets and automatically deploying and scaling production infrastructure to ensure timely and accurate data delivery to your specifications.

Databricks provides tools for data ingestion, including Auto Loader, an efficient and scalable tool for incrementally and idempotently loading data from cloud object storage and data lakes into the data lakehouse.

Machine learning, AI, and data science
Databricks machine learning expands the core functionality of the platform with a suite of tools tailored to the needs of data scientists and ML engineers, including MLflow and Databricks Runtime for Machine Learning.

Large language models and generative AI
Databricks Runtime for Machine Learning includes libraries like Hugging Face Transformers that allow you to integrate existing pre-trained models or other open source libraries into your workflow. The Databricks MLflow integration makes it easy to use the MLflow tracking service with transformer pipelines, models, and processing components. Integrate OpenAI models or solutions from partners like John Snow Labs in your Databricks workflows.

With Databricks, customize a LLM on your data for your specific task. With the support of open source tooling, such as Hugging Face and DeepSpeed, you can efficiently take a foundation LLM and start training with your own data for more accuracy for your domain and workload.

In addition, Databricks provides AI functions that SQL data analysts can use to access LLMs, including from OpenAI, directly within their data pipelines and workflows. See Enrich data using AI Functions.

Data warehousing, analytics, and BI
Databricks combines user-friendly UIs with cost-effective compute resources and infinitely scalable, affordable storage to provide a powerful platform for running analytic queries. Administrators configure scalable compute clusters as SQL warehouses, allowing end users to execute queries without worrying about any of the complexities of working in the cloud. SQL users can run queries against data in the lakehouse using the SQL query editor or in notebooks. Notebooks support Python, R, and Scala in addition to SQL, and allow users to embed the same visualizations available in dashboards alongside links, images, and commentary written in markdown.

Data governance and secure data sharing
Unity Catalog provides a unified data governance model for the data lakehouse. Cloud administrators configure and integrate coarse access control permissions for Unity Catalog, and then Databricks administrators can manage permissions for teams and individuals. Privileges are managed with access control lists (ACLs) through either user-friendly UIs or SQL syntax, making it easier for database administrators to secure access to data without needing to scale on cloud-native identity access management (IAM) and networking.

Unity Catalog makes running secure analytics in the cloud simple, and provides a division of responsibility that helps limit the reskilling or upskilling necessary for both administrators and end users of the platform. See What is Unity Catalog?.

The lakehouse makes data sharing within your organization as simple as granting query access to a table or view. For sharing outside of your secure environment, Unity Catalog features a managed version of Delta Sharing.

DevOps, CI/CD, and task orchestration
The development lifecycles for ETL pipelines, ML models, and analytics dashboards each present their own unique challenges. Databricks allows all of your users to leverage a single data source, which reduces duplicate efforts and out-of-sync reporting. By additionally providing a suite of common tools for versioning, automating, scheduling, deploying code and production resources, you can simplify your overhead for monitoring, orchestration, and operations.

Jobs schedule Databricks notebooks, SQL queries, and other arbitrary code. Declarative Automation Bundles allow you to define, deploy, and run Databricks resources such as jobs and pipelines programmatically. Git folders let you sync Databricks projects with a number of popular git providers.

For CI/CD best practices and recommendations, see Best practices and recommended CI/CD workflows on Databricks. For a complete overview of tools for developers, see Develop on Databricks.

Real-time and streaming analytics
Databricks leverages Apache Spark Structured Streaming to work with streaming data and incremental data changes. Structured Streaming integrates tightly with Delta Lake, and these technologies provide the foundations for both Lakeflow Spark Declarative Pipelines and Auto Loader. See Structured Streaming concepts.

Online transactional processing
Lakebase is an online transactional processing (OLTP) database that is fully integrated with the Databricks Data Intelligence Platform. This fully managed Postgres database allows you to create and manage OLTP databases stored in Databricks-managed storage. See What is Lakebase Provisioned?.

Databricks components
This article introduces fundamental components you need to understand in order to use Databricks effectively.

Accounts and workspaces
In Databricks, a workspace is a Databricks deployment in the cloud that functions as an environment for your team to access Databricks assets. Your organization can choose to have either multiple workspaces or just one, depending on its needs.

A Databricks account represents a single entity that can include multiple workspaces. Accounts enabled for Unity Catalog can be used to manage users and their access to data centrally across all of the workspaces in the account. Billing and support are also handled at the account level.

Billing: Databricks units (DBUs)
Databricks bills based on Databricks units (DBUs), which are units of processing capability per hour based on VM instance type.

See the Databricks on AWS pricing estimator.

Authentication and authorization
This section describes concepts that you need to know when you manage Databricks identities and their access to Databricks assets.

User
A unique individual who has access to the system. User identities are represented by email addresses. See Manage users.

Service principal
A service identity for use with jobs, automated tools, and systems such as scripts, apps, and CI/CD platforms. Service principals are represented by an application ID. See Service principals.

Group
A collection of identities. Groups simplify identity management, making it easier to assign access to workspaces, data, and other securable objects. All Databricks identities can be assigned as members of groups. See Groups.

Access control list (ACL)
A list of permissions attached to the workspace, cluster, job, table, or experiment. An ACL specifies which users or system processes are granted access to the objects, as well as what operations are allowed on the assets. Each entry in a typical ACL specifies a subject and an operation. See Access control lists.

Personal access token (PAT)
A personal access token is a string used to authenticate REST API calls, Technology partners connections, and other tools. See Authenticate with Databricks personal access tokens (legacy).

Databricks interfaces
This section describes the interfaces for accessing your assets in Databricks.

UI
The Databricks UI is a graphical interface for interacting with features, such as workspace folders and their contained objects, data objects, and computational resources.

Databricks One
Databricks One is a simplified Databricks interface designed for business users. It provides a single entry point to view AI/BI dashboards, ask data questions using Genie, and use Databricks Apps, without navigating technical workspace concepts. See What is Databricks One?.

REST API
The Databricks REST API provides endpoints for modifying or requesting information about Databricks account and workspace objects. See account reference and workspace reference.

SQL REST API
The SQL REST API allows you to automate tasks on SQL objects. See SQL API.

CLI
The Databricks CLI is hosted on GitHub. The CLI is built on top of the Databricks REST API.

Data management
This section describes the tools and logical objects used to organize and govern data on Databricks. See Database objects in Databricks.

Unity Catalog
Unity Catalog is a unified governance solution for data and AI assets on Databricks that provides centralized access control, auditing, lineage, and data discovery capabilities across Databricks workspaces. See What is Unity Catalog?.

Catalog
Catalogs are the highest level container for organizing and isolating data on Databricks. You can share catalogs across workspaces within the same region and account. See What are catalogs in Databricks?.

Schema
Schemas, also known as databases, are contained within catalogs and provide a more granular level of organization. They contain database objects and AI assets, such as volumes, tables, functions, and models. See What are schemas in Databricks?.

Table
Tables organize and govern access to structured data. You query tables with Apache Spark SQL and Apache Spark APIs. See Databricks tables.

View
A view is a read-only object derived from one or more tables and views. Views save queries that are defined against tables. See What is a view?.

Volume
Volumes represent a logical volume of storage in a cloud object storage location and organize and govern access to non-tabular data. Databricks recommends using volumes for managing all access to non-tabular data on cloud object storage. See What are Unity Catalog volumes?.

Delta tables
By default, all tables created in Databricks are Delta tables. Delta tables are based on the Delta Lake open source project, a framework for high-performance ACID table storage over cloud object stores. A Delta table stores data as a directory of files on cloud object storage and registers table metadata to the metastore within a catalog and schema.

Metastore
Unity Catalog provides an account-level metastore that registers metadata about data, AI, and permissions about catalogs, schemas, and tables. See Metastore.

Databricks provides a legacy Hive metastore for customers that have not adopted Unity Catalog. See Hive metastore table access control (legacy).

Catalog Explorer
Catalog Explorer allows you to explore and manage data and AI assets, including schemas (databases), tables, models, volumes (non-tabular data), functions, and registered ML models. You can use it to find data objects and owners, understand data relationships across tables, and manage permissions and sharing. See What is Catalog Explorer?.

DBFS root
important
Storing and accessing data using DBFS root or DBFS mounts is a deprecated pattern and not recommended by Databricks. Instead, Databricks recommends using Unity Catalog to manage access to all data. See What is Unity Catalog?.

The DBFS root is a storage location available to all users by default. See What is DBFS?.

Computation management
This section describes concepts that you need to know to run computations in Databricks.

Cluster
A set of computation resources and configurations on which you run notebooks and jobs. There are two types of clusters: all-purpose and job. See Compute.

You create an all-purpose cluster using the UI, CLI, or REST API. You can manually terminate and restart an all-purpose cluster. Multiple users can share such clusters to do collaborative interactive analysis.
The Databricks job scheduler creates a job cluster when you run a job on a new job cluster and terminates the cluster when the job is complete. You cannot restart an job cluster.
Pool
A set of idle, ready-to-use instances that reduce cluster start and auto-scaling times. When attached to a pool, a cluster allocates its driver and worker nodes from the pool. See Pool configuration reference.

If the pool does not have sufficient idle resources to accommodate the cluster's request, the pool expands by allocating new instances from the instance provider. When an attached cluster is terminated, the instances it used are returned to the pool and can be reused by a different cluster.

Databricks runtime
The set of core components that run on the clusters managed by Databricks. See Compute. Databricks has the following runtimes:

Databricks Runtime includes Apache Spark but also adds a number of components and updates that substantially improve the usability, performance, and security of big data analytics.
Databricks Runtime for Machine Learning is built on Databricks Runtime and provides prebuilt machine learning infrastructure that is integrated with all of the capabilities of the Databricks workspace. It contains multiple popular libraries, including TensorFlow, Keras, PyTorch, and XGBoost.
Jobs & Pipelines UI
The Jobs & Pipelines workspace UI provides entry to the Jobs, Lakeflow Spark Declarative Pipelines, and Lakeflow Connect UIs, which are tools that allow you to orchestrate and schedule workflows.

Jobs
A non-interactive mechanism for orchestrating and scheduling notebooks, libraries, and other tasks. See Lakeflow Jobs

Pipelines
Lakeflow Spark Declarative Pipelines provide a declarative framework for building reliable, maintainable, and testable data processing pipelines. See Lakeflow Spark Declarative Pipelines.

Workload
Workload is the amount of processing capability needed to perform a task or group of tasks. Databricks identifies two types of workloads: data engineering (job) and data analytics (all-purpose).

Data engineering An (automated) workload runs on a job cluster which the Databricks job scheduler creates for each workload.
Data analytics An (interactive) workload runs on an all-purpose cluster. Interactive workloads typically run commands within a Databricks notebook. However, running a job on an existing all-purpose cluster is also treated as an interactive workload.
Execution context
The state for a read–eval–print loop (REPL) environment for each supported programming language. The languages supported are Python, R, Scala, and SQL.

Data engineering
Data engineering tools aid collaboration among data scientists, data engineers, data analysts, and machine learning engineers.

Workspace
A workspace is an environment for accessing all of your Databricks assets. A workspace organizes objects (notebooks, libraries, dashboards, and experiments) into folders and provides access to data objects and computational resources.

Notebook
A web-based interface for creating data science and machine learning workflows that can contain runnable commands, visualizations, and narrative text. See Databricks notebooks.

Library
A package of code available to the notebook or job running on your cluster. Databricks runtimes include many libraries, and you can also upload your own. See Install libraries.

Git folder (formerly Repos)
A folder whose contents are co-versioned together by syncing them to a remote Git repository. Databricks Git folders integrate with Git to provide source and version control for your projects.

AI and machine learning
Databricks provides an integrated end-to-end environment with managed services for developing and deploying AI and machine learning applications.

Mosaic AI
The brand name for products and services from Databricks Mosaic AI Research, a team of researchers and engineers responsible for Databricks biggest breakthroughs in generative AI. Mosaic AI products include the ML and AI features in Databricks. See Mosaic Research.

Machine learning runtime
To help you develop ML and AI models, Databricks provides a Databricks Runtime for Machine Learning, which automates compute creation with pre-built machine learning and deep learning infrastructure including the most common ML and DL libraries. It also has built-in, pre-configured GPU support including drivers and supporting libraries. Browse to information about the latest runtime releases from Databricks Runtime release notes versions and compatibility.

Experiment
A collection of MLflow runs for developing agents, LLM applications, and ML models. See Organize training runs with MLflow experiments.

Features
Features are an important component of ML models. A feature store enables feature sharing and discovery across your organization and also ensures that the same feature computation code is used for model training and inference. See Databricks Feature Store.

Generative AI models
Databricks supports the exploration, development, and deployment of generative AI models, including:

AI playground, a chat-like environment in the workspace where you can test, prompt, and compare LLMs. See Chat with LLMs and prototype generative AI apps using AI Playground.
A built-in set of pre-configured foundation models that you can query:
See Pay-per-token Foundation Model APIs.
See [Recommended] Deploy foundation models from Unity Catalog for foundation models you can serve with a single click.
Third-party hosted LLMs, called external models. These models are meant to be used as-is.
Capabilities to customize a foundation model to optimize its performance for your specific application (often called fine-tuning). See Foundation Model Fine-tuning.
Model registry
Databricks provides a hosted version of MLflow Model Registry in Unity Catalog. Models registered in Unity Catalog inherit centralized access control, lineage, and cross-workspace discovery and access. See Manage model lifecycle in Unity Catalog.

Model serving
Mosaic AI Model Serving provides a unified interface to deploy, govern, and query AI models. Each model you serve is available as a REST API that you can integrate into your web or client application. With Mosaic AI Model Serving, you can deploy your own models, foundation models, or third-party models hosted outside of Databricks. See Deploy models using Mosaic AI Model Serving.

Data warehousing
Data warehousing refers to collecting and storing data from multiple sources so it can be quickly accessed for business insights and reporting. Databricks SQL is the collection of services that bring data warehousing capabilities and performance to your existing data lakes. See Data warehousing architecture.

Query
A query is a valid SQL statement that allows you to interact with your data. You can author queries using the in-platform SQL editor, or connect using a SQL connector, driver, or API. See Access and manage saved queries to learn more about how to work with queries.

SQL warehouse
A computation resource on which you run SQL queries. There are three types of SQL warehouses: Classic, Pro, and Serverless. Databricks recommends using serverless warehouses where available. See SQL warehouse types to compare available features for each warehouse type.

Query history
A list of executed queries and their performance characteristics. Query history allows you to monitor query performance, helping you identify bottlenecks and optimize query runtimes. See Query history.

Visualization
A graphical presentation of the result of running a query. See Visualizations in Databricks notebooks and SQL editor.

Dashboard
A presentation of data visualizations and commentary. You can use dashboards to automatically send reports to anyone in your Databricks account. Use the Genie Code to help you build visualizations based on natural language prompts. See Dashboards. You can also create a dashboard from a notebook. See Dashboards in notebooks.

Get started tutorials on Databricks
The tutorials in this section introduce core features and guide you through the basics of working with the Databricks platform.

For information about online training resources, see Get free Databricks training.

If you do not have a Databricks account, sign up for a free trial.

Data exploration
Query and visualize data
Use a Databricks notebook to query sample data stored in Unity Catalog and then visualize the query results in the notebook.
Import and visualize CSV data from a notebook
Use a Databricks notebook to import data from a CSV file from https://health.data.ny.gov into your Unity Catalog volume.
Create a table
Create a table and grant privileges in Databricks using the Unity Catalog data governance model.
Explore dashboards and query data with Genie in Databricks One
Navigate the Databricks One interface designed for business users. View dashboards, ask natural language data questions with Genie, and discover assets shared with you.
Data engineering
Build an ETL pipeline using Lakeflow Spark Declarative Pipelines
Create and deploy an ETL (extract, transform, and load) pipeline for data orchestration using Lakeflow Spark Declarative Pipelines and Auto Loader.
Build an ETL pipeline using Apache Spark
Develop and deploy your first ETL (extract, transform, and load) pipeline for data orchestration with Apache Spark™.



