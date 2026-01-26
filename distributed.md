## Distributed

<details>
<summary>Explain Distributed Computing (or Distributed System)</summary><br><b>

According to Martin Kleppmann:

"Many processes running on many machines...only message-passing via an unreliable network with variable delays, and the system may suffer from partial failures, unreliable clocks, and process pauses."

Another definition: "Systems that are physically separated, but logically connected"
</b></details>

<details>
<summary>What can cause a system to fail?</summary><br><b>

* Network
* CPU
* Memory
* Disk
</b></details>

<details>
<summary>Do you know what is "CAP theorem"? (aka as Brewer's theorem)</summary><br><b>

According to the CAP theorem, it's not possible for a distributed data store to provide more than two of the following at the same time:

* Availability: Every request receives a response (it doesn't has to be the most recent data)
* Consistency: Every request receives a response with the latest/most recent data
* Partition tolerance: Even if some the data is lost/dropped, the system keeps running
</b></details>

<details>
<summary>What are the problems with the following design? How to improve it?<br>
<img src="images/distributed/distributed_design_standby.png" width="500x;" height="350px;"/>
</summary><br><b>
1. The transition can take time. In other words, noticeable downtime.
2. Standby server is a waste of resources - if first application server is running then the standby does nothing
</b></details>

<details>
<summary>What are the problems with the following design? How to improve it?<br>
<img src="images/distributed/distributed_design_lb.png" width="700x;" height="350px;"/>
</summary><br><b>
Issues:
If load balancer dies , we lose the ability to communicate with the application.

Ways to improve:
* Add another load balancer
* Use DNS A record for both load balancers
* Use message queue
</b></details>

<details>
<summary>What is "Shared-Nothing" architecture?</summary><br><b>

It's an architecture in which data is and retrieved from a single, non-shared, source usually exclusively connected to one node as opposed to architectures where the request can get to one of many nodes and the data will be retrieved from one shared location (storage, memory, ...).
</b></details>

<details>
<summary>Explain the Sidecar Pattern (Or sidecar proxy)</summary><br><b>
</b></details>

