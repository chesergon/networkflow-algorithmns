class Graph {
    constructor(size) {
      this.size = size;
      this.adjList = Array.from({ length: size }, () => []);
      this.level = Array(size).fill(-1);
    }
  
    // Method to add an edge to the graph
    addEdge(u, v, capacity) {
      this.adjList[u].push({ v, capacity, flow: 0, rev: this.adjList[v].length });
      this.adjList[v].push({ v: u, capacity: 0, flow: 0, rev: this.adjList[u].length - 1 });
    }
  
    // Method to perform BFS and create level graph
    bfs(source, sink) {
      this.level.fill(-1);
      this.level[source] = 0;
      let queue = [source];
  
      while (queue.length > 0) {
        let u = queue.shift();
        for (let edge of this.adjList[u]) {
          if (this.level[edge.v] < 0 && edge.flow < edge.capacity) {
            this.level[edge.v] = this.level[u] + 1;
            queue.push(edge.v);
          }
        }
      }
  
      return this.level[sink] >= 0;
    }
  
    // DFS to send flow along the path
    dfs(u, sink, flow, start) {
      if (u === sink) return flow;
  
      for (; start[u] < this.adjList[u].length; start[u]++) {
        let edge = this.adjList[u][start[u]];
  
        if (this.level[edge.v] === this.level[u] + 1 && edge.flow < edge.capacity) {
          let currentFlow = Math.min(flow, edge.capacity - edge.flow);
          let tempFlow = this.dfs(edge.v, sink, currentFlow, start);
  
          if (tempFlow > 0) {
            edge.flow += tempFlow;
            this.adjList[edge.v][edge.rev].flow -= tempFlow;
            return tempFlow;
          }
        }
      }
  
      return 0;
    }
  
    // Dinic's algorithm to find maximum flow
    dinic(source, sink) {
      if (source === sink) return -1;
      let maxFlow = 0;
  
      while (this.bfs(source, sink)) {
        let start = Array(this.size).fill(0);
        while (true) {
          let flow = this.dfs(source, sink, Infinity, start);
          if (flow <= 0) break;
          maxFlow += flow;
        }
      }
  
      return maxFlow;
    }
  }
  
  // Example usage:
  let graph = new Graph(6);
  graph.addEdge(0, 1, 16);
  graph.addEdge(0, 2, 13);
  graph.addEdge(1, 2, 10);
  graph.addEdge(1, 3, 12);
  graph.addEdge(2, 1, 4);
  graph.addEdge(2, 4, 14);
  graph.addEdge(3, 2, 9);
  graph.addEdge(3, 5, 20);
  graph.addEdge(4, 3, 7);
  graph.addEdge(4, 5, 4);
  
  let source = 0;
  let sink = 5;
  
  console.log("The maximum possible flow is " + graph.dinic(source, sink));
  