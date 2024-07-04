class Graph {
    constructor(size) {
      this.size = size;
      this.adjMatrix = Array.from({ length: size }, () => Array(size).fill(0));
    }
  
    // Method to add an edge with capacity to the graph
    addEdge(u, v, capacity) {
      this.adjMatrix[u][v] = capacity;
    }
  
    // Method to perform DFS and find if there is a path from source to sink
    dfs(source, sink, visited) {
      if (source === sink) return true;
      visited[source] = true;
  
      for (let v = 0; v < this.size; v++) {
        if (!visited[v] && this.adjMatrix[source][v] > 0) {
          if (this.dfs(v, sink, visited)) {
            return true;
          }
        }
      }
      return false;
    }
  
    // Helper method to find an augmenting path and return its flow
    findPathFlow(source, sink, path) {
      let flow = Infinity;
      for (let v = sink; v !== source; v = path[v]) {
        let u = path[v];
        flow = Math.min(flow, this.adjMatrix[u][v]);
      }
      return flow;
    }
  
    // Method to augment the flow along the path found by DFS
    augmentFlow(source, sink, path, flow) {
      for (let v = sink; v !== source; v = path[v]) {
        let u = path[v];
        this.adjMatrix[u][v] -= flow;
        this.adjMatrix[v][u] += flow;
      }
    }
  
    // Ford-Fulkerson algorithm to find maximum flow
    fordFulkerson(source, sink) {
      let maxFlow = 0;
      let path = Array(this.size).fill(-1);
  
      while (true) {
        let visited = Array(this.size).fill(false);
        let stack = [source];
        visited[source] = true;
        let foundPath = false;
  
        // Perform DFS to find an augmenting path
        while (stack.length > 0) {
          let u = stack.pop();
  
          for (let v = 0; v < this.size; v++) {
            if (!visited[v] && this.adjMatrix[u][v] > 0) {
              stack.push(v);
              visited[v] = true;
              path[v] = u;
  
              if (v === sink) {
                foundPath = true;
                break;
              }
            }
          }
  
          if (foundPath) break;
        }
  
        if (!foundPath) break;
  
        // Find the maximum flow through the found path
        let flow = this.findPathFlow(source, sink, path);
  
        // Augment the flow along the path
        this.augmentFlow(source, sink, path, flow);
  
        // Add the flow to the overall flow
        maxFlow += flow;
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
  
  console.log("The maximum possible flow is " + graph.fordFulkerson(source, sink));
  