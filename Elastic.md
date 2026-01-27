## Elastic

<details>
<summary>What is the Elastic Stack?</summary><br><b>

The Elastic Stack consists of:

  * Elasticsearch
  * Kibana
  * Logstash
  * Beats
  * Elastic Hadoop
  * APM Server

Elasticsearch, Logstash and Kibana are also known as the ELK stack.
</b></details>

<details>
<summary>Explain what is Elasticsearch</summary><br><b>

From the official [docs](https://www.elastic.co/guide/en/elasticsearch/reference/current/documents-indices.html):

"Elasticsearch is a distributed document store. Instead of storing information as rows of columnar data, Elasticsearch stores complex data structures that have been serialized as JSON documents"
</b></details>

<details>
<summary>What is Logstash?</summary><br><b>
	
From the [blog](https://logit.io/blog/post/the-top-50-elk-stack-and-elasticsearch-interview-questions):

"Logstash is a powerful, flexible pipeline that collects, enriches and transports data. It works as an extract, transform & load (ETL) tool for collecting log messages."
</b></details>

<details>
<summary>Explain what beats are</summary><br><b>

Beats are lightweight data shippers. These data shippers installed on the client where the data resides.
Examples of beats: Filebeat, Metricbeat, Auditbeat. There are much more.<br>
</b></details>

<details>
<summary>What is Kibana?</summary><br><b>

From the official docs:

"Kibana is an open source analytics and visualization platform designed to work with Elasticsearch. You use Kibana to search, view, and interact with data stored in Elasticsearch indices. You can easily perform advanced data analysis and visualize your data in a variety of charts, tables, and maps."
</b></details>

<details>
<summary>Describe what happens from the moment an app logged some information until it's displayed to the user in a dashboard when the Elastic stack is used</summary><br><b>

The process may vary based on the chosen architecture and the processing you may want to apply to the logs. One possible workflow is:

1. The data logged by the application is picked by filebeat and sent to logstash
2. Logstash process the log based on the defined filters. Once done, the output is sent to Elasticsearch
2. Elasticsearch stores the document it got and the document is indexed for quick future access
4. The user creates visualizations in Kibana which based on the indexed data
5. The user creates a dashboard which composed out of the visualization created in the previous step
</b></details>

##### Elasticsearch

<details>
<summary>What is a data node?</summary><br><b>

This is where data is stored and also where different processing takes place (e.g. when you search for a data).
</b></details>

<details>
<summary>What is a master node?</summary><br><b>

Part of a master node responsibilities:
  * Track the status of all the nodes in the cluster
  * Verify replicas are working and the data is available from every data node.
  * No hot nodes (no data node that works much harder than other nodes)

While there can be multiple master nodes in reality only of them is the elected master node.
</b></details>

<details>
<summary>What is an ingest node?</summary><br><b>

A node which responsible for processing the data according to ingest pipeline. In case you don't need to use 
logstash then this node can receive data from beats and process it, similarly to how it can be processed 
in Logstash.
</b></details>

<details>
<summary>What is Coordinating only node?</summary><br><b>

From the official docs:

Coordinating only nodes can benefit large clusters by offloading the coordinating node role from data and master-eligible nodes. They join the cluster and receive the full cluster state, like every other node, and they use the cluster state to route requests directly to the appropriate place(s).

</b></details>

<details>
<summary>How data is stored in Elasticsearch?</summary><br><b>

* Data is stored in an index
* The index is spread across the cluster using shards
</b></details>

<details>
<summary>What is an Index?</summary><br><b>

Index in Elasticsearch is in most cases compared to a whole database from the SQL/NoSQL world.<br>
You can choose to have one index to hold all the data of your app or have multiple indices where each index holds different type of your app (e.g. index for each service your app is running).

The official docs also offer a great explanation (in general, it's really good documentation, as every project should have):

"An index can be thought of as an optimized collection of documents and each document is a collection of fields, which are the key-value pairs that contain your data"
</b></details>

<details>
<summary>Explain Shards</summary><br><b>

An index is split into shards and documents are hashed to a particular shard. Each shard may be on a different node in a cluster and each one of the shards is a self contained index.<br>
This allows Elasticsearch to scale to an entire cluster of servers.
</b></details>

<details>
<summary>What is an Inverted Index?</summary><br><b>

From the official docs:

"An inverted index lists every unique word that appears in any document and identifies all of the documents each word occurs in."
</b></details>

<details>
<summary>What is a Document?</summary><br><b>

Continuing with the comparison to SQL/NoSQL a Document in Elasticsearch is a row in table in the case of SQL or a document in a collection in the case of NoSQL.
As in NoSQL a document is a JSON object which holds data on a unit in your app. What is this unit depends on the your app. If your app related to book then each document describes a book. If you are app is about shirts then each document is a shirt.
</b></details>

<details>
<summary>You check the health of your elasticsearch cluster and it's red. What does it mean? What can cause the status to be yellow instead of green?</summary><br><b>

Red means some data is unavailable in your cluster. Some shards of your indices are unassigned. 
There are some other states for the cluster.
Yellow means that you have unassigned shards in the cluster. You can be in this state if you have single node and your indices have replicas.
Green means that all shards in the cluster are assigned to nodes and your cluster is healthy. 
</b></details>

<details>
<summary>True or False? Elasticsearch indexes all data in every field and each indexed field has the same data structure for unified and quick query ability</summary><br><b>

False.
From the official docs:

"Each indexed field has a dedicated, optimized data structure. For example, text fields are stored in inverted indices, and numeric and geo fields are stored in BKD trees."
</b></details>

<details>
<summary>What reserved fields a document has?</summary><br><b>

  * _index
  * _id
  * _type
</b></details>

<details>
<summary>Explain Mapping</summary><br><b>
</b></details>

<details>
<summary>What are the advantages of defining your own mapping? (or: when would you use your own mapping?)</summary><br><b>

* You can optimize fields for partial matching
* You can define custom formats of known fields (e.g. date)
* You can perform language-specific analysis
</b></details>

<details>
<summary>Explain Replicas</summary><br><b>

In a network/cloud environment where failures can be expected any time, it is very useful and highly recommended to have a failover mechanism in case a shard/node somehow goes offline or disappears for whatever reason.
To this end, Elasticsearch allows you to make one or more copies of your index’s shards into what are called replica shards, or replicas for short.
</b></details>

<details>
<summary>Can you explain Term Frequency & Document Frequency?</summary><br><b>

Term Frequency is how often a term appears in a given document and Document Frequency is how often a term appears in all documents. They both are used for determining the relevance of a term by calculating Term Frequency / Document Frequency.
</b></details>

<details>
<summary>You check "Current Phase" under "Index lifecycle management" and you see it's set to "hot". What does it mean?</summary><br><b>

"The index is actively being written to".
More about the phases [here](https://www.elastic.co/guide/en/elasticsearch/reference/7.6/ilm-policy-definition.html)
</b></details>

<details>
<summary>What this command does? <code>curl -X PUT "localhost:9200/customer/_doc/1?pretty" -H 'Content-Type: application/json' -d'{ "name": "John Doe" }'</code></summary><br><b>

It creates customer index if it doesn't exists and adds a new document with the field name which is set to "John Dow". Also, if it's the first document it will get the ID 1.
</b></details>

<details>
<summary>What will happen if you run the previous command twice? What about running it 100 times?</code></summary><br><b>

1. If name value was different then it would update "name" to the new value
2. In any case, it bumps version field by one
</b></details>

<details>
<summary>What is the Bulk API? What would you use it for?</code></summary><br><b>

Bulk API is used when you need to index multiple documents. For high number of documents it would be significantly faster to use rather than individual requests since there are less network roundtrips.
</b></details>

##### Query DSL

<details>
<summary>Explain Elasticsearch query syntax (Booleans, Fields, Ranges)</summary><br><b>
</b></details>

<details>
<summary>Explain what is Relevance Score</summary><br><b>
</b></details>

<details>
<summary>Explain Query Context and Filter Context</summary><br><b>

From the official docs:

"In the query context, a query clause answers the question “How well does this document match this query clause?” Besides deciding whether or not the document matches, the query clause also calculates a relevance score in the _score meta-field."

"In a filter context, a query clause answers the question “Does this document match this query clause?” The answer is a simple Yes or No — no scores are calculated. Filter context is mostly used for filtering structured data"
</b></details>

<details>
<summary>Describe how would an architecture of production environment with large amounts of data would be different from a small-scale environment</summary><br><b>

There are several possible answers for this question. One of them is as follows:

A small-scale architecture of elastic will consist of the elastic stack as it is. This means we will have beats, logstash, elastcsearch and kibana.<br>
A production environment with large amounts of data can include some kind of buffering component (e.g. Reddis or RabbitMQ) and also security component such as Nginx.
</b></details>

##### Logstash

<details>
<summary>What are Logstash plugins? What plugins types are there?</summary><br><b>

  * Input Plugins - how to collect data from different sources
  * Filter Plugins - processing data
  * Output Plugins - push data to different outputs/services/platforms
</b></details>

<details>
<summary>What is grok?</summary><br><b>

A logstash plugin which modifies information in one format and immerse it in another.
</b></details>

<details>
<summary>How grok works?</summary><br><b>
</b></details>

<details>
<summary>What grok patterns are you familiar with?</summary><br><b>
</b></details>

<details>
<summary>What is `_grokparsefailure?`</summary><br><b>
</b></details>

<details>
<summary>How do you test or debug grok patterns?</summary><br><b>
</b></details>

<details>
<summary>What are Logstash Codecs? What codecs are there?</summary><br><b>
</b></details>

##### Kibana

<details>
<summary>What can you find under "Discover" in Kibana?</summary><br><b>

The raw data as it is stored in the index. You can search and filter it.
</b></details>

<details>
<summary>You see in Kibana, after clicking on Discover, "561 hits". What does it mean?</summary><br><b>

Total number of documents matching the search results. If not query used then simply the total number of documents.
</b></details>

<details>
<summary>What can you find under "Visualize"?</summary><br><b>

"Visualize" is where you can create visual representations for your data (pie charts, graphs, ...)
</b></details>

<details>
<summary>What visualization types are supported/included in Kibana?</summary><br><b>
</b></details>

<details>
<summary>What visualization type would you use for statistical outliers</summary><br><b>
</b></details>

<details>
<summary>Describe in detail how do you create a dashboard in Kibana</summary><br><b>
</b></details>

#### Filebeat

<details>
<summary>What is Filebeat?</summary><br><b>

Filebeat is used to monitor the logging directories inside of VMs or mounted as a sidecar if exporting logs from containers, and then forward these logs onward for further processing, usually to logstash.
</b></details>

<details>
<summary>If one is using ELK, is it a must to also use filebeat? In what scenarios it's useful to use filebeat?</summary><br><b>

Filebeat is a typical component of the ELK stack, since it was developed by Elastic to work with the other products (Logstash and Kibana). It's possible to send logs directly to logstash, though this often requires coding changes for the application. Particularly for legacy applications with little test coverage, it might be a better option to use filebeat, since you don't need to make any changes to the application code.
</b></details>

<details>
<summary>What is a harvester?</summary><br><b>

Read [here](https://www.elastic.co/guide/en/beats/filebeat/current/how-filebeat-works.html#harvester)
</b></details>

<details>
<summary>True or False? a single harvester harvest multiple files, according to the limits set in filebeat.yml</summary><br><b>

False. One harvester harvests one file.
</b></details>

<details>
<summary>What are filebeat modules?</summary><br><b>

These are pre-configured modules for specific types of logging locations (eg, Traefik, Fargate, HAProxy) to make it easy to configure forwarding logs using filebeat. They have different configurations based on where you're collecting logs from.
</b></details>

#### Elastic Stack

<details>
<summary>How do you secure an Elastic Stack?</summary><br><b>

You can generate certificates with the provided elastic utils and change configuration to enable security using certificates model.
</b></details>
