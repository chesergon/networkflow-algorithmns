class Graph {
    constructor(size) {
      this.size = size;
      this.adjMatrix = Array.from({ length: size }, () => Array(size).fill(0));
    }
  
    // Method to add an edge with capacity to the graph
    addEdge(u, v, capacity) {
      this.adjMatrix[u][v] = capacity;
    }
  
    // Method to perform BFS and find an augmenting path
    bfs(source, sink, parent) {
      let visited = Array(this.size).fill(false);
      let queue = [source];
      visited[source] = true;
  
      // Standard BFS loop
      while (queue.length > 0) {
        let u = queue.shift();
  
        for (let v = 0; v < this.size; v++) {
          // If v is not visited and there is a capacity from u to v
          if (!visited[v] && this.adjMatrix[u][v] > 0) {
            queue.push(v);
            visited[v] = true;
            parent[v] = u; // Store the path
  
            // If we reached the sink, return true
            if (v === sink) {
              return true;
            }
          }
        }
      }
  
      // If we didn't reach the sink, return false
      return false;
    }
  
    // Edmonds-Karp implementation to find maximum flow
    edmondsKarp(source, sink) {
      let parent = Array(this.size).fill(-1); // Array to store path
      let maxFlow = 0;
  
      // While there is an augmenting path
      while (this.bfs(source, sink, parent)) {
        // Find the maximum flow through the path found
        let pathFlow = Infinity;
        for (let v = sink; v !== source; v = parent[v]) {
          let u = parent[v];
          pathFlow = Math.min(pathFlow, this.adjMatrix[u][v]);
        }
  
        // Update residual capacities of the edges and reverse edges along the path
        for (let v = sink; v !== source; v = parent[v]) {
          let u = parent[v];
          this.adjMatrix[u][v] -= pathFlow;
          this.adjMatrix[v][u] += pathFlow;
        }
  
        // Add path flow to overall flow
        maxFlow += pathFlow;
      }
  
      // Return the overall flow
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
  
  console.log("The maximum possible flow is " + graph.edmondsKarp(source, sink));
  