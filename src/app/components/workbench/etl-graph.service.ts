import { Injectable } from '@angular/core';

interface NodeTree {
  id: number;
  children: NodeTree[];
}

@Injectable({
  providedIn: 'root'
})
export class EtlGraphService {

  constructor() { }

  public buildUpstreamTree(editor: any, startNodeId: number): NodeTree {
    const data = editor.drawflow?.drawflow?.Home?.data;
    if (!data) {
      throw new Error('Drawflow data not found');
    }

    const visited = new Set<number>();

    const recurse = (nodeId: number): NodeTree => {
      if (visited.has(nodeId)) {
        // avoid infinite loops on cycles
        return { id: nodeId, children: [] };
      }
      visited.add(nodeId);

      const node = data[nodeId];
      if (!node) {
        // dangling or missing node
        return { id: nodeId, children: [] };
      }

      // each input port may have multiple connections
      const inputs = node.inputs || {};
      const children: NodeTree[] = [];

      Object.values(inputs).forEach((inputPort: any) => {
        (inputPort.connections || []).forEach((conn: any) => {
          // conn.node is the upstream node ID
          const exists = children.some(child => child.id === conn.node);
          if (!exists) {
            children.push(recurse(conn.node));
          }
        });
      });

      return { id: nodeId, children };
    };

    return recurse(startNodeId);
  }

  /**
   * Flatten the above tree into a deduped, topologically‐ordered array of node IDs.
   * Parents will always come before children in the list.
   */
  public flattenUpstream(tree: NodeTree): number[] {
    const result: number[] = [];
    const seen = new Set<number>();

    const walk = (n: NodeTree) => {
      if (seen.has(n.id)) { return; }
      seen.add(n.id);
      result.push(n.id);
      n.children.forEach(walk);
    };

    walk(tree);
    return result;
  }
}
